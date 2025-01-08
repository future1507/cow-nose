import "./App.css";
import CompareAlgorithm from "./components/CompareAlgorithm";
import ImageSearchBox from "./components/ImageSearchBox";
import ImageSelectBox from "./components/ImageSelectBox";
import Navbar from "./components/Navbar";
import ProcessingResult from "./components/ProcessingResult";
import Searchbar from "./components/Searchbar";
import { DataProvider } from "./data/DataContext";

function App() {
  return (
    <DataProvider>
      <>
        <Navbar />
        <Searchbar />
        <div className="container">
          <ImageSelectBox />
          <CompareAlgorithm />
          <ImageSearchBox />
        </div>
        <ProcessingResult />
      </>
    </DataProvider>
  );
}

export default App;
