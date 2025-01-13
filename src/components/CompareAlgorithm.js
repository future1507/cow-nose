import { useContext, useEffect, useState } from "react";
import "./CompareAlgorithm.css";
import { DataContext } from "../data/DataContext";
import { Dialog } from "primereact/dialog";

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
  const [visible, setVisible] = useState(false);
  const [errorText, setErrorText] = useState("");

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
      akaze: checkalgo1,
      orb: checkalgo2,
      sift: checkalgo3,
    };
    // console.log(testData);
    setAlgorithm1([]);
    setAlgorithm2([]);
    setAlgorithm3([]);
    if (!checkalgo1 && !checkalgo2 && !checkalgo3) {
      setVisible(true);
      setErrorText("กรุณาเลือกวิธีเปรียบเทียบ");
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
              if (checkalgo1) setAlgorithm1(data.AKAZE);
              if (checkalgo2) setAlgorithm2(data.ORB);
              if (checkalgo3) setAlgorithm3(data.SIFT);
            });
          } else {
            response.json().then((data) => {
              setVisible(true);
              setErrorText(
                "Error " +
                  response.status +
                  " : ไม่สามารถเปรียบเทียบรูปภาพได้ เนื่องจาก " +
                  data.message
              );
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setVisible(true);
          setErrorText("เกิดข้อผิดพลาดขณะเปรียบเทียบรูปภาพ");
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
    <>
      <div className="center-content">
        <p>เลือกวิธีเปรียบเทียบ</p>
        <label>
          <input
            type="checkbox"
            onChange={handleCheckBox(1)}
            value={checkalgo1}
          />{" "}
          AKAZE
          <br />
        </label>
        <label>
          <input
            type="checkbox"
            onChange={handleCheckBox(2)}
            value={checkalgo2}
          />{" "}
          ORB
          <br />
        </label>
        <label>
          <input
            type="checkbox"
            onChange={handleCheckBox(3)}
            value={checkalgo3}
          />{" "}
          SIFT (มีลิขสิทธิ์)
          <br />
        </label>
        {isLoading && <div className="spinner"></div>}
        {showCompare && (
          <button onClick={ImageMatching} disabled={isLoading}>
            {isLoading ? "กำลังเปรียบเทียบ..." : "เปรียบเทียบ"}
          </button>
        )}
      </div>
      <Dialog
        style={{
          width: "50vw",
          height: "100px",
          textAlign: "center",
        }}
        header="ผิดพลาด !!!"
        visible={visible}
        draggable={false}
        dismissableMask
        onHide={() => setVisible(false)}
      >
        <p>
          <br />
          {errorText}
        </p>
      </Dialog>
    </>
  );
};

export default CompareAlgorithm;
