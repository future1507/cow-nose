import "./App.css";
import CompareAlgorithm from "./components/CompareAlgorithm";
import ImageSearchBox from "./components/ImageSearchBox";
import ImageUploadBox from "./components/ImageUploadBox";
import Navbar from "./components/Navbar";
import Searchbar from "./components/Searchbar";

function App() {
  return (
    <div>
      <Navbar />
      <Searchbar />
      <div className="container">
        <ImageUploadBox />
        <CompareAlgorithm />
        <ImageSearchBox />
      </div>
    </div>
  );
}

export default App;
