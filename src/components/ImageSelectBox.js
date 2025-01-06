import { DataContext } from "../data/DataContext";
import "./ImageBox.css";
import React, { useContext, useEffect, useRef, useState } from "react";

const ImageSelectBox = () => {
  const { show_popup } = useContext(DataContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPopup, setShowPopup] = show_popup;
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

  var handleLinkClick = () => {
    setShowPopup(!showPopup);
    if (formValid === true) {
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
                  selectedImage={selectedImage}
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
        style={{ display: "none" }} // Hide input
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
          <button
            className="popup-close-button"
            onClick={props.handleLinkClick}
          >
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
        src={props.selectedImage}
        alt="Selected preview"
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
