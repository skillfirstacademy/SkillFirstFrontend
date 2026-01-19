import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Componnets/Navbar";
import Footer from "./Componnets/Footer";

import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage"
import AccountPage from "./Pages/AccountPage";
import CoursePage from "./Pages/CoursePage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";

import CourseDetailsPage from "./Pages/CourseDetailsPage";
import English from "./Componnets/English";
import GraphicDesgine from "./Componnets/GraphicDesgine";
import VideoEditing from "./Componnets/VideoEditing";
import UiUx from "./Componnets/UiUx";

import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
       <Route path="/course/:courseId" element={<CourseDetailsPage  />} />
        <Route path="/english" element={<English />} />
         <Route path="/graphicdesgine" element={<GraphicDesgine />} />
          <Route path="/videoediting" element={<VideoEditing />} />
           <Route path="/uiux" element={<UiUx />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
