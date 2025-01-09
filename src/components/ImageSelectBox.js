import { DataContext } from "../data/DataContext";
import "./ImageBox.css";
import React, { useContext, useEffect, useRef, useState } from "react";

const ImageSelectBox = () => {
  const { img_src, valid } = useContext(DataContext);
  const [compareValid, setCompareValid] = valid;
  const [ImageSource, setImageSource] = img_src;

  const [showPopup, setShowPopup] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [, setIsImageValid] = useState(true);

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSource(reader.result);
        setCompareValid([true, compareValid[1]]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLinkClick = () => {
    setShowPopup(!showPopup);
    if (formValid) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setImageSource(imageUrl);
        setCompareValid([true, compareValid[1]]);
        setIsImageValid(true);
        ClosePopup();
      };
      img.onerror = () => {
        alert("ลิงก์รูปภาพไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่");
        setIsImageValid(false);
        setImageUrl("");
      };
    }
  };

  const ClosePopup = () => {
    setShowPopup(!showPopup);
    setImageUrl("");
  };

  const handleClearImage = () => {
    setImageSource(null);
    setCompareValid([false, compareValid[1]]);
  };

  const inputUrl = (event) => {
    setImageUrl(event.target.value);
  };

  useEffect(() => {
    const checkData = imageUrl.trim().length > 0;
    if (formValid !== checkData) {
      setFormValid(checkData); // อัปเดตเฉพาะเมื่อค่าต่างกัน
    }
  }, [imageUrl, formValid]);

  return (
    <>
      <div className="background-box">
        <div className="box box-left">
          <div className="box-content">
            {!ImageSource ? (
              <>
                <p>เพิ่ม</p>
                <UploadButton
                  handleButtonClick={handleButtonClick}
                  fileInputRef={fileInputRef}
                  handleImageChange={handleImageChange}
                />
                <LinkButton handleLinkClick={handleLinkClick} />
                <p>รูปภาพ</p>
              </>
            ) : (
              <>
                <ShowImage
                  ImageSource={ImageSource}
                  handleClearImage={handleClearImage}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {showPopup && (
        <Popup
          handleLinkClick={handleLinkClick}
          inputUrl={inputUrl}
          imageUrl={imageUrl}
          ClosePopup={ClosePopup}
        />
      )}
    </>
  );
};

const UploadButton = (props) => {
  return (
    <>
      <button onClick={props.handleButtonClick}>
        <i className="fas fa-upload"></i> อัพโหลด
      </button>
      <input
        type="file"
        accept="image/*"
        ref={props.fileInputRef}
        style={{ display: "none" }}
        onChange={props.handleImageChange}
      />
    </>
  );
};

const LinkButton = (props) => {
  return (
    <>
      <button onClick={props.handleLinkClick}>
        <i className="fas fa-paperclip"></i> ลิงค์
      </button>
    </>
  );
};

export const Popup = (props) => {
  return (
    <>
      <div className="popup">
        <div className="popup-inner">
          <button className="popup-close-button" onClick={props.ClosePopup}>
            <i className="fas fa-times"></i>
          </button>
          <h1>เพิ่มรูปภาพด้วย url</h1>
          <hr />
          <input
            type="text"
            placeholder="ป้อนลิงค์รูปภาพ..."
            onChange={props.inputUrl}
            value={props.imageUrl}
          ></input>
          <hr />
          <button className="popup-add-button" onClick={props.handleLinkClick}>
            เพิ่ม
          </button>
        </div>
      </div>
    </>
  );
};

const ShowImage = (props) => {
  return (
    <>
      <img
        src={props.ImageSource}
        alt="ลิงค์รูปภาพไม่ถูกต้อง"
        style={{
          width: "240px",
          height: "240px",
          objectFit: "cover",
        }}
      />
      {
        <button onClick={props.handleClearImage} className="close-button">
          <i className="fas fa-times"></i>
        </button>
      }
    </>
  );
};

export default ImageSelectBox;
