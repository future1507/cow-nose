import { useContext, useState } from "react";
import "./ImageBox.css";
import { DataContext } from "../data/DataContext";

const ImageSearchBox = () => {
  const { cow_img } = useContext(DataContext);
  const [cowImage, setCowImage] = cow_img;

  const handleClearImage = () => {
    setCowImage(null);
  };

  return (
    <>
      <div className="background-box">
        <div className="box box-right">
          <div className="box-content">
            {!cowImage ? (
              <>
                <p>
                  รูปภาพ
                  <br />
                  ที่ค้นหา
                </p>
              </>
            ) : (
              <>
                <img
                  src={cowImage}
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
    </>
  );
};

export default ImageSearchBox;
