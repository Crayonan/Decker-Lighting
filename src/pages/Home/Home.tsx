import React, { lazy, Suspense } from "react";
import "./home.css";

import { FaLightbulb } from "react-icons/fa";

import LiveClockUpdate from "../../components/LiveClockUpdate/LiveClockUpdate";

// Lazy load the Spline component
const LazySpline = lazy(() => import("@splinetool/react-spline"));

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
        <Suspense fallback={<div>Loading Spline scene...</div>}>
          <LazySpline scene="https://prod.spline.design/BNaurVSeS57NeyWI/scene.splinecode" />
        </Suspense>
      </div>

      <div className="hero-header">
        <h1 className="unselectable">Light Works</h1>
        <h1 className="unselectable">By Niklas Decker</h1>
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