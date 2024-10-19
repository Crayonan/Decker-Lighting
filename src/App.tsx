import React from "react";
import "./App.css";

import { Routes, Route, useLocation } from "react-router-dom";
import Dock from "./components/Dock/Dock";
import Home from "./pages/Home/Home";
import Photos from "./pages/Photos/Photos";
import { TeamsPage } from "./pages/Teams/Teams";
import ContactForm from "./pages/Contact/Contact";
import Shop from "./pages/Shop/Shop";
import Footer from "./components/Footer/Footer";
import { ImpressumPage } from "./pages/Legal/Impressum";
import { PrivacyPolicyPage } from "./pages/Legal/Privacy";

const App: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <Dock />
      {/* <SwipeRouterWrapper> */}
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path='/legal/impressum' element={<ImpressumPage />} />
        <Route path='/legal/privacy' element={<PrivacyPolicyPage />} />
      </Routes>
      <Footer />
      {/* </SwipeRouterWrapper> */}
    </>
  );
};

export default App;
