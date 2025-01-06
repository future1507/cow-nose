import { useContext, useState } from "react";
import "./Searchbar.css";
import { DataContext } from "../data/DataContext";

const Searchbar = () => {
  const [searchText, setSearchText] = useState("");
  const { id, cow_img } = useContext(DataContext);
  const [, setZyan_id] = id;
  const [, setCowImage] = cow_img;

  const inputSearchValue = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchValue = (event) => {
    event.preventDefault();
    setZyan_id(searchText);
    console.log(searchText);
    fetchData();
  };

  async function fetchData() {
    try {
      const response = await fetch("/api/nosetests/" + searchText);
      if (!response.ok) {
        throw new Error("Could not fetch resource");
      }
      const data = await response.json();
      console.log(data);
      setCowImage(data.img);
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
