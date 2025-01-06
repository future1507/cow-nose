import { createContext, useState } from "react";

const DataContext = createContext();

function DataProvider(props) {
  const [zyan_id, setZyan_id] = useState("");
  const [cowImage, setCowImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [compareValid, setCompareValid] = useState(false);

  return (
    <DataContext.Provider
      value={{
        id: [zyan_id, setZyan_id],
        cow_img: [cowImage, setCowImage],
        show_popup: [showPopup, setShowPopup],
        valid: [compareValid, setCompareValid],
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
}

export { DataContext, DataProvider };
