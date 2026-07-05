import React from "react";
import Navbar from "./Components/Navbar/Navbar";

const App = () => {
  return (
    <div>
      <div className="container" style={{ padding: "10px" }}>
        <Navbar />
        <main></main>
      </div>
    </div>
  );
};

export default App;
