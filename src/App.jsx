import Navbar from "./Componnets/Navbar";
import Footer from "./Componnets/Footer";
import { Routes, Route } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import CoursePage from "./Pages/CoursePage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import CourseDetailsPage from "./Pages/CourseDetailsPage";
import CourseContentPage from "./Pages/CourseContentPage";
import ForgotPassword from "./Pages/ForgotPassword";
import GoogleSuccess from "./Pages/GoogleSuccess";
import NotFound from "./Pages/NotFoundPage";

import English from "./Componnets/English/English";
import GraphicDesgine from "./Componnets/GraphicDesgine/GraphicDesgine";
import VideoEditing from "./Componnets/VideoEditing/VideoEditing";
import UiUx from "./Componnets/UIUx/UiUx";

import Dashboard from "./Pages/student/Dashboard";
import StudentRoute from "./Routes/StudentRoute";

import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminRoute from "./Routes/AdminRoute";

import AppToaster from "./Componnets/AppToaster";
import "./App.css";

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
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/google-success" element={<GoogleSuccess />} />

        <Route path="/course/:courseId" element={<CourseDetailsPage />} />
        <Route path="/coursecontent/:coursecontentId" element={<CourseContentPage />} />

        <Route path="/english" element={<English />} />
        <Route path="/graphicdesgine" element={<GraphicDesgine />} />
        <Route path="/videoediting" element={<VideoEditing />} />
        <Route path="/uiux" element={<UiUx />} />

        {/* STUDENT ONLY */}
        <Route
          path="/student/dashboard"
          element={
            <StudentRoute>
              <Dashboard />
            </StudentRoute>
          }
        />

        {/* ADMIN ONLY */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
