import { useContext } from "react";
import "./ImageBox.css";
import { DataContext } from "../data/DataContext";

const ImageSearchBox = () => {
  const { img_search, valid } = useContext(DataContext);
  const [ImageSearch, setImageSearch] = img_search;
  const [compareValid, setCompareValid] = valid;

  const handleClearImage = () => {
    setImageSearch(null);
    setCompareValid([compareValid[0], false]);
  };

  return (
    <>
      <div className="background-box">
        <div className="box box-right">
          <div className="box-content">
            {!ImageSearch ? (
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
                  src={ImageSearch}
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
