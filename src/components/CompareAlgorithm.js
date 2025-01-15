import { useContext, useEffect, useState } from "react";
import "./CompareAlgorithm.css";
import { DataContext } from "../data/DataContext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const CompareAlgorithm = () => {
  const { img_src, img_search, valid, algo_result } = useContext(DataContext);
  const [ImageSource] = img_src;
  const [ImageSearch] = img_search;
  const [compareValid] = valid;
  const [, setAlgorithm] = algo_result;

  const [showCompare, setShowCompare] = useState(false);
  const [checkalgo, setCheckalgo] = useState([false, false, false]);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errorText, setErrorText] = useState("");

  const algorithms = [
    { name: "AKAZE", value: checkalgo[0] },
    { name: "ORB", value: checkalgo[1] },
    { name: "SIFT", value: checkalgo[2], note: "(มีลิขสิทธิ์)" },
  ];
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

  const url = "/flask/api/matching";
  function ImageMatching() {
    const testData = {
      img_main: "https://dairy.zyanwoa.com/uploadFiles/" + ImageSearch,
      img_compare: CheckImageSourceType(ImageSource),
      akaze: checkalgo[0],
      orb: checkalgo[1],
      sift: checkalgo[2],
    };
    // console.log(testData);
    setAlgorithm([]);
    if (!checkalgo[0] && !checkalgo[1] && !checkalgo[2]) {
      setVisible(true);
      setErrorText("กรุณาเลือกวิธีเปรียบเทียบ");
    } else {
      setIsLoading(true);
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              // console.log(data);
              setAlgorithm(data);
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

  const handleCheckBox = (index) => {
    return () => {
      setCheckalgo((prevCheckalgo) =>
        prevCheckalgo.map((value, i) => (i === index ? !value : value))
      );
    };
  };

  return (
    <>
      <div className="center-content">
        <p>เลือกวิธีเปรียบเทียบ</p>
        {algorithms.map((algo, index) => (
          <label key={index}>
            <input
              type="checkbox"
              onChange={handleCheckBox(index)}
              checked={checkalgo[index]}
            />{" "}
            {algo.name} {algo.note && <span>{algo.note}</span>}
            <br />
          </label>
        ))}
        {isLoading && <div className="spinner"></div>}
        {showCompare && (
          <button onClick={ImageMatching} disabled={isLoading}>
            {isLoading ? "กำลังเปรียบเทียบ..." : "เปรียบเทียบ"}
          </button>
        )}
      </div>
      <Dialog
        style={{
          textAlign: "center",
          alignItems: "center",
        }}
        visible={visible}
        onHide={() => setVisible(false)}
        header="ผิดพลาด !!!"
        draggable={false}
        dismissableMask
        resizable={false}
        footer={
          <Button
            label="ตกลง"
            className="p-button-text"
            style={{
              margin: "10px",
              color: "#f4511e",
              borderColor: "#f4511e",
              width: "200px",
              minWidth: "200px",
            }}
            onClick={() => setVisible(false)}
          />
        }
      >
        <p>{errorText}</p>
      </Dialog>
    </>
  );
};

export default CompareAlgorithm;
