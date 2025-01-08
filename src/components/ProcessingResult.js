import { useContext } from "react";
import { DataContext } from "../data/DataContext";

const ProcessingResult = () => {
  const { algo1_result, algo2_result, algo3_result } = useContext(DataContext);
  const [Algorithm1] = algo1_result;
  const [Algorithm2] = algo2_result;
  const [Algorithm3] = algo3_result;
  return (
    <>
      {Algorithm1.length !== 0 ||
        Algorithm2.length !== 0 ||
        (Algorithm3.length !== 0 && <h1>ผลลัพธ์การประมวลผล</h1>)}

      {Algorithm1.length !== 0 && (
        <div>
          <h3>Algorithm1</h3>
          <p>ภาพทั้ง 2 มีความคล้ายคลึงกัน {Algorithm1.score} %</p>
          <img
            src={"data:imge/jpeg;base64, " + Algorithm1.result}
            alt="ลิงค์รูปภาพไม่ถูกต้อง"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      )}

      {Algorithm2.length !== 0 && (
        <div>
          <h3>Algorithm2</h3>
          <p>ภาพทั้ง 2 มีความคล้ายคลึงกัน {Algorithm2.score} %</p>
          <img
            src={"data:imge/jpeg;base64, " + Algorithm2.result}
            alt="ลิงค์รูปภาพไม่ถูกต้อง"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      )}

      {Algorithm3.length !== 0 && (
        <div>
          <h3>Algorithm3</h3>
          <p>ภาพทั้ง 2 มีความคล้ายคลึงกัน {Algorithm3.score} %</p>
          <img
            src={"data:imge/jpeg;base64, " + Algorithm3.result}
            alt="ลิงค์รูปภาพไม่ถูกต้อง"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      )}
    </>
  );
};

export default ProcessingResult;
