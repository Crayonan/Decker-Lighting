import React from "react";
import { useState } from "react";
import "./App.css";

import { Routes, Route, useLocation } from "react-router-dom";
import Dock from "./components/Dock/Dock";
import Home from "./pages/Home/Home";
import Work from "./pages/Work/Work";
import Projects from "./pages/Projects/Projects";
import Photos from "./pages/Photos/Photos";
import Post from "./pages/Post/Post";
import Article from "./pages/Article/Article";
import { TeamsPage } from "./pages/Teams/Teams";
import ContactForm from "./pages/Contact/Contact";
import Shop from "./pages/Shop/Shop";

const App: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <Dock />
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/post/:slug" element={<Post />} />
        <Route path="/article/:slug" element={<Article />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/contact" element={<ContactForm />} />
        
      </Routes>
    </>
  );
};

export default App;
