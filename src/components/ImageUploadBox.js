import "./ImageBox.css";
import React, { useEffect, useRef, useState } from "react";

const ImageUploadBox = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [formValid, setFormValid] = useState(false);

  const fileInputRef = useRef(null); // Reference for hidden input

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger input click
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result); // Store image as base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLinkClick = () => {
    setShowPopup(!showPopup);
    if(formValid==true){
        setSelectedImage(imageUrl);
        setImageUrl(""); // Clear input field
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null); // Reset the selected image
  };

  const inputUrl = (event) => {
    setImageUrl(event.target.value);
  };

  useEffect(() => {
    const checkData = imageUrl.trim().length > 0 && imageUrl !== 0;
    setFormValid(checkData);
  }, [imageUrl]);

  return (
    <>
      <div className="background-box">
        <div className="box box-left">
          <div className="box-content">
            {!selectedImage ? (
              <>
                <p>เพิ่ม</p>
                <button onClick={handleButtonClick}>
                  <i className="fas fa-upload"></i> อัพโหลด
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }} // Hide input
                  onChange={handleImageChange}
                />
                <button onClick={handleLinkClick}>
                  <i className="fas fa-paperclip"></i> ลิงค์
                </button>
                <p>รูปภาพ</p>
              </>
            ) : (
              <>
                <img
                  src={selectedImage}
                  alt="Selected preview"
                  style={{
                    width: "240px",
                    height: "240px",
                    objectFit: "cover",
                  }}
                />
                {
                  <button onClick={handleClearImage} className="close-button">
                    <i className="fas fa-times"></i>
                  </button>
                }
              </>
            )}
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <button className="popup-close-button" onClick={handleLinkClick}>
              <i className="fas fa-times"></i>
            </button>
            <h1>เพิ่มรูปภาพด้วย url</h1>
            <hr />
            <input
              type="text"
              placeholder="ป้อนลิงค์รูปภาพ..."
              onChange={inputUrl}
              value={imageUrl}
            ></input>
            <hr />
            <button className="popup-add-button" onClick={handleLinkClick}>
              เพิ่ม
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUploadBox;
