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

  const handleSearchValue = (event) => {
    event.preventDefault();
    setZyan_id(searchText);
    fetchData();
  };

  // const url = "/springboot/api/nosetests/";
  const url = "192.168.10.2/cow/getCowByZyancode/";
  async function fetchData() {
    const checkData = searchText.trim().length > 0;
    if (checkData) {
      try {
        const response = await fetch(url + searchText);
        if (!response.ok) {
          setVisible(true);
          setErrorText("ไม่พบข้อมูลไอดีโคที่ค้นหา");
          return;
        }
        const data = await response.json();
        if (
          data.img !== null &&
          data.img !== undefined &&
          data.img !== "" &&
          data.img !== "null"
        ) {
          setImageSearch(data.img);
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
              onChange={inputSearchValue}
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
