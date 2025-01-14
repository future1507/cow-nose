import { useContext } from "react";
import { DataContext } from "../data/DataContext";
import { Accordion, AccordionTab } from "primereact/accordion";
import "./ProcessingResult.css";

const ProcessingResult = () => {
  const { algo_result } = useContext(DataContext);
  const [algorithm] = algo_result;

  const algorithmKeys = ["AKAZE", "ORB", "SIFT"];

  return (
    <>
      {algorithm?.length === undefined && <h1>ผลลัพธ์การประมวลผล</h1>}
      <div className="card">
        <Accordion multiple activeIndex={[0, 1, 2]}>
          {algorithmKeys.map((key, index) => {
            const algoData = algorithm?.[key];
            return (
              algoData && (
                <AccordionTab header={key} key={index}>
                  <p className="m-0">
                    ภาพทั้ง 2 มีความคล้ายคลึงกัน {algoData.goodMatches} จุด จาก{" "}
                    {algoData.matches} จุด คิดเป็น <ins>{algoData.score} %</ins>
                  </p>
                  <div style={{ backgroundColor: "#fff3f0" }}>
                    <img
                      className="image"
                      src={"data:imge/jpeg;base64, " + algoData.result}
                      alt="ลิงค์รูปภาพไม่ถูกต้อง"
                      style={{
                        width: "80%",
                        height: "80%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </AccordionTab>
              )
            );
          })}
        </Accordion>
      </div>
    </>
  );
};

export default ProcessingResult;
