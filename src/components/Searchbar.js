import { useContext, useState } from "react";
import "./Searchbar.css";
import { DataContext } from "../data/DataContext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const Searchbar = () => {
  const { id, img_search, valid } = useContext(DataContext);
  const [, setZyan_id] = id;
  const [, setImageSearch] = img_search;
  const [compareValid, setCompareValid] = valid;

  const [visible, setVisible] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [searchText, setSearchText] = useState("");

  const inputSearchValue = (event) => {
    setSearchText(event.target.value);
  };

  const inputSampleID = () => {
    setSearchText("Z000FA05E2BDD733E0A0274D550E2F219594");
  };

  const handleSearchValue = (event) => {
    event.preventDefault();
    setZyan_id(searchText);
    fetchData();
  };

  // const url = "/springboot/api/nosetests/";
  const url = "https://api.zyanwoa.com/dairy/v1/cow/getCowByZyancode/";
  // เปลี่ยน token เป็นของ admin เพิ่อเข้าถึง cow ทั้งหมด
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5YmYzMmU0Zi04YTE5LTRhYmItYjgxYi02ODcxYzE5ZWZmMDIiLCJpYXQiOjE3MzY5MTY3ODAsImV4cCI6MTczOTUwODc4MH0.0Ct04PJ63NDSAQp2H9e_dXhJCq72AnV5vGHV_bP4oUM";
  const bearer = "Bearer " + token;

  async function fetchData() {
    const checkData = searchText.trim().length > 0;
    if (checkData) {
      try {
        const response = await fetch(url + searchText, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: bearer,
          },
        });
        // console.log(response);
        if (!response.ok) {
          setVisible(true);
          setErrorText("ไม่พบข้อมูลไอดีโคที่ค้นหา");
          // return;
        }
        const data = await response.json();
        if (
          data.cow_img !== null &&
          data.cow_img !== undefined &&
          data.cow_img !== "" &&
          data.cow_img !== "null"
        ) {
          // console.log(data);
          setImageSearch(data.cow_img);
          setCompareValid([compareValid[0], true]);
        } else {
          setVisible(true);
          setErrorText("ไม่พบรูปภาพโคของไอดีนี้");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <>
      <form onSubmit={handleSearchValue}>
        <div className="form-control">
          <div className="search-bar">
            <input
              type="text"
              title="ดับเบิ้ลคลิก เพื่อใส่ไอดีทดสอบ"
              onChange={inputSearchValue}
              onDoubleClick={inputSampleID}
              placeholder="ค้นหาด้วยไอดี..."
              value={searchText}
            />
            <button type="submit" onClick={handleSearchValue}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </form>
      <Dialog
        style={{
          textAlign: "center",
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

export default Searchbar;
