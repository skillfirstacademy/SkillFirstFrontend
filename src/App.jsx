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

// Import AdminLayout instead of individual admin pages at the top level
import AdminLayout from "./Pages/admin/Adminlayout";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminRoute from "./Routes/AdminRoute";
import AddCourses from "./Pages/admin/AddCourses";
import AddStudents from "./Pages/admin/AddStudents";
import AddTest from "./Pages/admin/AddTest";
import AddVideos from "./Pages/admin/AddVideos";
import AllCourses from "./Pages/admin/AllCourses";
import AllStudents from "./Pages/admin/AllStudents";
import AllTest from "./Pages/admin/AllTest";
import AllUsers from "./Pages/admin/AllUsers";
import AllVideos from "./Pages/admin/AllVideos";
import EnrollStudents from "./Pages/admin/EnrollStudents";
import MakeAdmin from "./Pages/admin/MakeAdmin";
import AdminCourseDetail from "./Pages/admin/AdminCourseDetail";

import AppToaster from "./Componnets/AppToaster";
import "./App.css";
import ContactForm from "./Pages/ContactForm";
import StudentTestResultPage from "./Pages/student/StudentTestResultPage";
import StudentTestPage from "./Pages/student/StudentTestPage";

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
        <Route path="/contact" element={<ContactForm />} />
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
          path="/student"
          element={
            <StudentRoute>
              <Dashboard />
            </StudentRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="student/test/:videoId" element={<StudentTestPage />} />
          <Route path="student/test-result/:testId" element={<StudentTestResultPage />} />
        </Route>


        {/* ADMIN ROUTES - All nested under AdminLayout */}
        <Route path="/admin" element={<AdminRoute> <AdminLayout /> </AdminRoute>}>

          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="add-courses" element={<AddCourses />} />
          <Route path="all-courses" element={<AllCourses />} />
          <Route path="add-students" element={<AddStudents />} />
          <Route path="all-students" element={<AllStudents />} />
          <Route path="enroll-students" element={<EnrollStudents />} />
          <Route path="all-users" element={<AllUsers />} />
          <Route path="make-admin" element={<MakeAdmin />} />
          <Route path="add-test" element={<AddTest />} />
          <Route path="all-test" element={<AllTest />} />
          <Route path="add-videos" element={<AddVideos />} />
          <Route path="all-videos" element={<AllVideos />} />
          <Route path="/admin/course/:courseId" element={<AdminCourseDetail />} />


        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;