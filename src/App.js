import "./App.css"; // Add styling as needed

function App() {
  // const [uploadedImage, setUploadedImage] = useState(null);
  // const [searchedImage, setSearchedImage] = useState(null);

  // const handleUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setUploadedImage(URL.createObjectURL(file));
  //   }
  // };

  // const handleSearch = () => {
  //   // Add search logic here and set the searchedImage accordingly
  //   setSearchedImage("https://via.placeholder.com/150"); // Replace with actual search result
  // };

  return (
    <div>
      <div class="header"></div>
    <div class="search-container">
        <input type="text" placeholder="ค้นหาด้วยไอดี..."/>
        <button><i class="fas fa-search"></i></button>
    </div>
    <div class="container">
        <div class="left">
            <div class="box">
                <div class="box-content">
                    <p>เพิ่ม<br/>รูปภาพ</p>
                    <button>อัพโหลด</button>
                    <button>ลิงค์</button>
                </div>
            </div>
        </div>
        <div class="algorithms">
            <p>เลือกวิธีเปรียบเทียบ</p>
            <label>Algorithm 1 <input type="checkbox"/></label>
            <label>Algorithm 2 <input type="checkbox"/></label>
            <label>Algorithm 3 <input type="checkbox"/></label>
        </div>
        <div class="right">
            <div class="box">
                <div class="box-content">
                    <p>รูปภาพ<br/>ที่ค้นหา</p>
                </div>
            </div>
        </div>
    </div>
    </div>
  );
}

export default App;
