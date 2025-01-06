import "./CompareAlgorithm.css";

const CompareAlgorithm = () => {
  return (
    <div>
      <div className="center-content">
        <p>เลือกวิธีเปรียบเทียบ</p>
        <label>
          <input type="checkbox" /> Algorithm 1
          <br/>
        </label>
        <label>
          <input type="checkbox" /> Algorithm 2
          <br/>
        </label>
        <label>
          <input type="checkbox" /> Algorithm 3
          <br/>
        </label>
      </div>
    </div>
  );
};

export default CompareAlgorithm;
