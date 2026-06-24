import React from "react";
import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/Hero/HeroSection";

const App = () => {
  return (
    <div>
      <div className="container" style={{ padding: "10px" }}>
        <Navbar />
        <main>
          <Hero />
        </main>
      </div>
    </div>
  );
};

export default App;
