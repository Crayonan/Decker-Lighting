import React, { lazy, Suspense } from "react";
import "./home.css";

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
        <h1 className="unselectable">Veranstaltungstechnik</h1>
        <h1 className="unselectable">Niklas Decker</h1>
      </div>

      {/* <div className="home-logo">
        <FaLightbulb size="16px" style={{ color: "#fff" }} />
      </div> */}

      <div className="live-clock unselectable">
        <LiveClockUpdate />
      </div>
    </>
  );
};

export default Home;