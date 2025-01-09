import { useContext, useEffect, useState } from "react";
import "./CompareAlgorithm.css";
import { DataContext } from "../data/DataContext";

const CompareAlgorithm = () => {
  const {
    img_src,
    img_search,
    valid,
    algo1_result,
    algo2_result,
    algo3_result,
  } = useContext(DataContext);
  const [ImageSource] = img_src;
  const [ImageSearch] = img_search;
  const [compareValid] = valid;
  const [, setAlgorithm1] = algo1_result;
  const [, setAlgorithm2] = algo2_result;
  const [, setAlgorithm3] = algo3_result;

  const [showCompare, setShowCompare] = useState(false);
  const [checkalgo1, setCheckalgo1] = useState(false);
  const [checkalgo2, setCheckalgo2] = useState(false);
  const [checkalgo3, setCheckalgo3] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (compareValid[0] && compareValid[1]) {
      setShowCompare(true);
    } else {
      setShowCompare(false);
    }
  }, [compareValid]);

  const CheckImageSourceType = (img) => {
    if (img.includes("data:image/jpeg;base64,")) {
      return img.split(",")[1];
    }
    return img;
  };

  function ImageMatching() {
    const testData = {
      img_main: ImageSearch,
      img_compare: CheckImageSourceType(ImageSource),
    };
    // console.log(testData);
    setAlgorithm1([]);
    setAlgorithm2([]);
    setAlgorithm3([]);
    if (!checkalgo1 && !checkalgo2 && !checkalgo3) {
      alert("กรุณาเลือกวิธีเปรียบเทียบ");
    } else {
      setIsLoading(true);
      fetch("/flask/api/matching", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              console.log(data);
              if (checkalgo1) setAlgorithm1(data);
              if (checkalgo2) setAlgorithm2(data);
              if (checkalgo3) setAlgorithm3(data);
            });
          } else {
            response.json().then((data) => {
              alert(
                "Error " +
                  response.status +
                  " : ไม่สามารถเปรียบเทียบรูปภาพได้ เนื่องจาก" +
                  data.message
              );
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          alert("เกิดข้อผิดพลาดขณะเปรียบเทียบรูปภาพ");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  const handleCheckBox = (algoname) => {
    if (algoname === 1) return () => setCheckalgo1(!checkalgo1);
    if (algoname === 2) return () => setCheckalgo2(!checkalgo2);
    if (algoname === 3) return () => setCheckalgo3(!checkalgo3);
  };

  return (
    <div>
      <div className="center-content">
        <p>เลือกวิธีเปรียบเทียบ</p>
        <label>
          <input
            type="checkbox"
            onChange={handleCheckBox(1)}
            value={checkalgo1}
          />{" "}
          Algorithm 1
          <br />
        </label>
        <label>
          <input
            type="checkbox"
            onChange={handleCheckBox(2)}
            value={checkalgo2}
          />{" "}
          Algorithm 2
          <br />
        </label>
        <label>
          <input
            type="checkbox"
            onChange={handleCheckBox(3)}
            value={checkalgo3}
          />{" "}
          Algorithm 3
          <br />
        </label>
        {isLoading && <div className="spinner"></div>}
        {showCompare && (
          <button onClick={ImageMatching} disabled={isLoading}>
            {isLoading ? "กำลังเปรียบเทียบ..." : "เปรียบเทียบ"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CompareAlgorithm;
