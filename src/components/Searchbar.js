import { useContext, useState } from "react";
import "./Searchbar.css";
import { DataContext } from "../data/DataContext";
import { Dialog } from "primereact/dialog";
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

  async function fetchData() {
    const checkData = searchText.trim().length > 0;
    if (checkData) {
      try {
        const response = await fetch("/springboot/api/nosetests/" + searchText);
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

export default Searchbar;
