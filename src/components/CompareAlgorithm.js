import { useContext, useEffect, useState } from "react";
import "./CompareAlgorithm.css";
import { DataContext } from "../data/DataContext";

const CompareAlgorithm = () => {
  const { valid } = useContext(DataContext);
  const [compareValid] = valid;

  const [showCompare, setShowCompare] = useState(false);
  const [checkalgo1, setCheckalgo1] = useState(false);
  const [checkalgo2, setCheckalgo2] = useState(false);
  const [checkalgo3, setCheckalgo3] = useState(false);

  useEffect(() => {
    if (compareValid[0] && compareValid[1]) {
      setShowCompare(true);
    } else {
      setShowCompare(false);
    }
  }, [compareValid]);

  const img =
    "https://res.cloudinary.com/dq0ncxrkp/image/upload/v1734317920/kxddof5vz4c47l9zjkca.jpg";

  const base64 = fetch(img)
    .then((response) => response.blob())
    .then((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((res) => {
        reader.onloadend = () => {
          res(reader.result);
        };
      });
    });

  const testData = {
    imgmain: img,
    imgcompare: base64,
  };

  function ImageMatching() {
    // console.log(checkalgo1, checkalgo2, checkalgo3);
    console.log(testData);
    if (!checkalgo1 && !checkalgo2 && !checkalgo3) {
      alert("กรุณาเลือกวิธีเปรียบเทียบ");
    }
    fetch("/api/matching", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log(data);
        });
      } else {
        alert("Error " + response.status + " : ไม่สามารถเปรียบเทียบรูปภาพ");
      }
    });
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
        {/* <p>
          {compareValid[0] + ""}:{compareValid[1] + ""}
        </p> */}
        {showCompare && <button onClick={ImageMatching}>เปรียบเทียบ</button>}
        <button onClick={ImageMatching}>เปรียบเทียบ</button>
      </div>
    </div>
  );
};

export default CompareAlgorithm;
