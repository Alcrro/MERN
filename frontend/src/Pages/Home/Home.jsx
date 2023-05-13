import React from "react";
import Exercises from "./50CodingChallanges/Exercise";

const Home = () => {
  return (
    <div>
      <h2>Home</h2>
      <div className="filters">
        <div className="brand"></div>
        <Exercises />
      </div>
    </div>
  );
};

export default Home;
