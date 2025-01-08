import { createContext, useState } from "react";

const DataContext = createContext();

function DataProvider(props) {
  const [zyan_id, setZyan_id] = useState("");
  const [ImageSource, setImageSource] = useState(null);
  const [ImageSearch, setImageSearch] = useState(null);
  const [compareValid, setCompareValid] = useState([false, false]);
  const [Algorithm1, setAlgorithm1] = useState([]);
  const [Algorithm2, setAlgorithm2] = useState([]);
  const [Algorithm3, setAlgorithm3] = useState([]);

  return (
    <DataContext.Provider
      value={{
        id: [zyan_id, setZyan_id],
        img_src: [ImageSource, setImageSource],
        img_search: [ImageSearch, setImageSearch],
        valid: [compareValid, setCompareValid],
        algo1_result: [Algorithm1, setAlgorithm1],
        algo2_result: [Algorithm2, setAlgorithm2],
        algo3_result: [Algorithm3, setAlgorithm3],
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
}

export { DataContext, DataProvider };
