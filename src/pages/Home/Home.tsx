import React from "react";
import Spline from "@splinetool/react-spline";
import "./home.css";

import { FaLightbulb } from "react-icons/fa";

import LiveClockUpdate from "../../components/LiveClockUpdate/LiveClockUpdate";

const Home: React.FC = () => {
  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
      >
        <Spline scene="https://prod.spline.design/vEYoLRgFtLhPP18Z/scene.splinecode" />
      </div>

      <div className="hero-header">
        <h1>Light Works</h1>
        <h1>By Niklas Decker</h1>
      </div>

      <div className="home-logo">
        <FaLightbulb size="16px" style={{ color: "#fff" }} />
      </div>

      <div className="live-clock">
        <LiveClockUpdate />
      </div>
    </>
  );
};

export default Home;