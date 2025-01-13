import { useContext } from "react";
import { DataContext } from "../data/DataContext";
import { Accordion, AccordionTab } from "primereact/accordion";
import "./ProcessingResult.css";

const ProcessingResult = () => {
  const { algo1_result, algo2_result, algo3_result } = useContext(DataContext);
  const [Algorithm1] = algo1_result;
  const [Algorithm2] = algo2_result;
  const [Algorithm3] = algo3_result;
  return (
    <>
      {(Algorithm1.length !== 0) |
        (Algorithm2.length !== 0) |
        (Algorithm3.length !== 0) && <h1>ผลลัพธ์การประมวลผล</h1>}
      <div className="card">
        <Accordion multiple activeIndex={[0, 1, 2]}>
          {Algorithm1.length !== 0 && (
            <AccordionTab header="AKAZE">
              <p className="m-0">
                ภาพทั้ง 2 มีความคล้ายคลึงกัน {Algorithm1.goodMatches} จุด จาก{" "}
                {Algorithm1.matches} จุด คิดเป็น <ins>{Algorithm1.score} %</ins>
              </p>
              <div style={{ backgroundColor: "#fff3f0" }}>
                <img
                  className="image"
                  src={"data:imge/jpeg;base64, " + Algorithm1.result}
                  alt="ลิงค์รูปภาพไม่ถูกต้อง"
                  style={{
                    width: "80%",
                    height: "80%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </AccordionTab>
          )}
          {Algorithm2.length !== 0 && (
            <AccordionTab header="ORB">
              <p className="m-0">
                ภาพทั้ง 2 มีความคล้ายคลึงกัน {Algorithm2.goodMatches} จุด จาก{" "}
                {Algorithm2.matches} จุด คิดเป็น <ins>{Algorithm2.score} %</ins>
              </p>
              <div style={{ backgroundColor: "#fff3f0" }}>
                <img
                  className="image"
                  src={"data:imge/jpeg;base64, " + Algorithm2.result}
                  alt="ลิงค์รูปภาพไม่ถูกต้อง"
                  style={{
                    width: "80%",
                    height: "80%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </AccordionTab>
          )}
          {Algorithm3.length !== 0 && (
            <AccordionTab header="SIFT">
              <p className="m-0">
                ภาพทั้ง 2 มีความคล้ายคลึงกัน {Algorithm2.goodMatches} จุด จาก{" "}
                {Algorithm2.matches} จุด คิดเป็น <ins>{Algorithm2.score} %</ins>
              </p>
              <div style={{ backgroundColor: "#fff3f0" }}>
                <img
                  className="image"
                  src={"data:imge/jpeg;base64, " + Algorithm3.result}
                  alt="ลิงค์รูปภาพไม่ถูกต้อง"
                  style={{
                    width: "80%",
                    height: "80%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </AccordionTab>
          )}
        </Accordion>
      </div>
    </>
  );
};

export default ProcessingResult;
