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
import AppToaster from "./Componnets/AppToaster";
import ForgotPassword from "./Pages/ForgotPassword";
import Dashboard from "./Pages/student/Dashboard";
import StudentRoute from "./Routes/StudentRoute";
import GoogleSuccess from "./Pages/GoogleSuccess";

function App() {
  return (
    <>
      <Navbar />
      <AppToaster />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/course/:courseId" element={<CourseDetailsPage />} />
        <Route path="/english" element={<English />} />
        <Route path="/graphicdesgine" element={<GraphicDesgine />} />
        <Route path="/videoediting" element={<VideoEditing />} />
        <Route path="/uiux" element={<UiUx />} />
        <Route path="/google-success" element={<GoogleSuccess />} />

        {/* STUDENT ONLY */}
        <Route
          path="/student/dashboard"
          element={
            <StudentRoute>
              <Dashboard />
            </StudentRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
