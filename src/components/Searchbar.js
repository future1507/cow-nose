import { useContext, useState } from "react";
import "./Searchbar.css";
import { DataContext } from "../data/DataContext";

const Searchbar = () => {
  const [searchText, setSearchText] = useState("");
  const { id, cow_img, valid } = useContext(DataContext);
  const [, setZyan_id] = id;
  const [, setCowImage] = cow_img;
  const [compareValid, setCompareValid] = valid;

  const inputSearchValue = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchValue = (event) => {
    event.preventDefault();
    setZyan_id(searchText);
    fetchData();
  };

  async function fetchData() {
    try {
      const response = await fetch("/api/nosetests/" + searchText);
      if (!response.ok) {
        alert("Error " + response.status + " : ไม่พบข้อมูลไอดีที่ค้นหา");
      }
      const data = await response.json();
      if (
        data.img !== null &&
        data.img !== undefined &&
        data.img !== "" &&
        data.img !== "null"
      ) {
        setCowImage(data.img);
        setCompareValid([compareValid[0], true]);
      } else {
        alert("ไม่พบข้อมูลรูปภาพ");
      }
    } catch (error) {
      console.log(error);
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
    </>
  );
};

export default Searchbar;
