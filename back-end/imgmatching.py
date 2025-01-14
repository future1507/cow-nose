import base64
import pathlib
from io import BytesIO
from urllib.request import Request, urlopen

import cv2
import matplotlib.pyplot as plt
import numpy as np
import PIL.Image
import torch
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image

# Flask application setup
app = Flask(__name__)
CORS(app)

# Override pathlib for compatibility
pathlib.PosixPath = pathlib.WindowsPath

# Load YOLOv5 model
torch.hub.set_dir("./torch_cache")
model = torch.hub.load(
    "ultralytics/yolov5", "custom", path="cownose.pt", force_reload=False
).eval()


def detect_cow_nose(img1, img2):
    crop1, crop2 = [], []

    with torch.no_grad():
        results1 = model(img1)
        results2 = model(img2)

    def crop_image(img, detections):
        if detections.any():
            x1, y1, x2, y2, *_ = map(int, detections[0][:4])
            return img[y1:y2, x1:x2], True
        return img, True

    crop1 = crop_image(img1, results1.xyxy[0].numpy())
    crop2 = crop_image(img2, results2.xyxy[0].numpy())

    return crop1, crop2


def feature_matching(img1, img2, model_type):

    def create_model(type):
        if type == "AKAZE":
            model = cv2.AKAZE_create()
        if type == "ORB":
            model = cv2.ORB_create()
        if type == "SIFT":
            model = cv2.SIFT_create(contrastThreshold=0.015, edgeThreshold=0.2)

        return model

    model = create_model(model_type)

    def find_keypoints(img):
        keypoints, descriptor = model.detectAndCompute(img, None)
        if descriptor is None:
            img = cv2.resize(img, (img.shape[0] * 2, img.shape[1] * 2))
            return find_keypoints(img)
        return keypoints, descriptor

    keypoints1, descriptor1 = find_keypoints(img1)
    keypoints2, descriptor2 = find_keypoints(img2)

    good_matches = []

    if model_type == "SIFT":
        descriptor1 = np.asarray(descriptor1, dtype=np.float32)
        descriptor2 = np.asarray(descriptor2, dtype=np.float32)

        index_params = dict(algorithm=1, trees=5)
        search_params = dict(checks=50)
        flann = cv2.FlannBasedMatcher(index_params, search_params)
        matches = flann.knnMatch(descriptor1, descriptor2, k=2)

    else:
        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=False)
        matches = bf.knnMatch(descriptor1, descriptor2, k=2)

    for m, n in matches:
        if m.distance < 0.75 * n.distance:
            good_matches.append(m)

    if (
        len(good_matches) > 0.05 * min([len(keypoints1), len(keypoints2)])
        and len(good_matches) >= 4
    ):
        src_pts = np.float32([keypoints1[m.queryIdx].pt for m in good_matches]).reshape(
            -1, 1, 2
        )
        dst_pts = np.float32([keypoints2[m.trainIdx].pt for m in good_matches]).reshape(
            -1, 1, 2
        )

        H, mask = cv2.findHomography(
            src_pts,
            dst_pts,
            method=cv2.RANSAC,
            ransacReprojThreshold=5.0,
            confidence=0.99,
            maxIters=10000,
        )
        matches_mask = mask.ravel().tolist()
        correct = matches_mask.count(1)
        total = len(good_matches)
    else:
        matches_mask = [1] * len(good_matches)
        correct = len(good_matches)
        total = max(len(keypoints1), len(keypoints2))

    img_match = cv2.drawMatches(
        img1,
        keypoints1,
        img2,
        keypoints2,
        good_matches,
        None,
        matchColor=(0, 255, 0),
        singlePointColor=(0, 0, 255),
        matchesMask=matches_mask,
        flags=cv2.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS,
    )

    score = correct / total if total > 0 else 0

    return correct, total, score, img_match


def image_to_base64(img):
    _, buffer = cv2.imencode(".jpg", img)
    return base64.b64encode(buffer.tobytes()).decode("utf-8")


def load_image(img):
    if len(img) > 1000 and img.startswith("/"):
        image_data = base64.b64decode(img)
        return np.frombuffer(image_data, dtype=np.uint8)
    else:
        req = Request(url=img, headers={"User-Agent": "Mozilla/5.0"})
        with urlopen(req) as response:
            return np.asarray(bytearray(response.read()), dtype=np.uint8)


def resize_image(image, size, interp):
    if interp.startswith("cv2_"):
        interp = getattr(cv2, "INTER_" + interp[len("cv2_") :].upper())
        h, w = image.shape[:2]
        if interp == cv2.INTER_AREA and (w < size[0] or h < size[1]):
            interp = cv2.INTER_LINEAR
        resized = cv2.resize(image, size, interpolation=interp)
    elif interp.startswith("pil_"):
        interp = getattr(PIL.Image, interp[len("pil_") :].upper())
        resized = PIL.Image.fromarray(image.astype(np.uint8))
        resized = resized.resize(size, resample=interp)
        resized = np.asarray(resized, dtype=image.dtype)
    else:
        raise ValueError(f"Unknown interpolation {interp}.")
    return resized


def preprocessing(image):
    image = image.astype(np.float32, copy=False)
    size = image.shape[:2][::-1]
    scale = np.array([1.0, 1.0])
    scale = 1600 / max(size)

    if scale < 1.0:
        size_new = tuple(int(round(x * scale)) for x in size)
        image = resize_image(image, size_new, "cv2_area")
        scale = np.array(size) / np.array(size_new)

    image = cv2.convertScaleAbs(image)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    equ = cv2.equalizeHist(gray)
    binary = cv2.adaptiveThreshold(
        equ, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 19, 2
    )

    return binary


@app.route("/api/matching", methods=["POST"])
def matching():
    if not request.is_json:
        return jsonify({"status": "error", "message": "Request must be JSON"}), 400

    try:
        data = request.get_json()
        img_main = data.get("img_main")
        img_compare = data.get("img_compare")

        if not img_main or not img_compare:
            return jsonify({"status": "error", "message": "Images are required"}), 400

        img1 = cv2.imdecode(load_image(img_main), cv2.IMREAD_COLOR)
        img2 = cv2.imdecode(load_image(img_compare), cv2.IMREAD_COLOR)

        crop1, crop2 = detect_cow_nose(img1, img2)

        if not crop1[1] or not crop2[1]:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "ตรวจไม่พบส่วนที่เป็นจมูกวัวของภาพทั้งสอง หรือ ภาพใดภาพหนึ่ง",
                    }
                ),
                400,
            )

        image1 = preprocessing(crop1[0])
        image2 = preprocessing(crop2[0])

        response = {}

        algorithms = ["AKAZE", "ORB", "SIFT"]

        for algo in algorithms:
            if data.get(algo.lower()) == True:
                matches = feature_matching(image2, image1, algo)
                response[algo] = {
                    "goodMatches": matches[0],
                    "matches": matches[1],
                    "score": round(matches[2] * 100, 2),
                    "result": image_to_base64(matches[3]),
                }

        return jsonify(response), 200

    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
