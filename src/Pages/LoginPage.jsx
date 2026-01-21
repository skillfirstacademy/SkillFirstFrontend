import React, { useState } from 'react';
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../Features/authSlice";
import AppToaster from "../Componnets/AppToaster";
import { showSuccess, showError } from "../Componnets/AppToaster";
import eye from "../assets/eye.svg"
import closeeye from "../assets/eye (2).svg"

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5000/users/api/google";
  };

  const getDeviceId = () => {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
  };

  const performLogin = async (forceLogin = false) => {
    const deviceId = getDeviceId();

    console.log("🔵 FRONTEND - Attempting login with:", { 
      email, 
      deviceId, 
      forceLogin 
    });

    try {
      const res = await api.post("/login", {
        email,
        password,
        deviceId,
        forceLogin,
      });

      console.log("✅ FRONTEND - Login successful:", res.data);

      // ✅ Store both access token AND refresh token
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken); // ✅ Added this
      localStorage.setItem("user", JSON.stringify(res.data.user));

      dispatch(
        loginSuccess({
          user: res.data.user,
          accessToken: res.data.accessToken,
        })
      );

      showSuccess("Login successful");

      const role = res.data.user.role;

      if (role === "student") {
        navigate("/student/dashboard");
      } else if (role === "admin" || role === "superadmin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log("❌ FRONTEND - Login error:", {
        status: err.response?.status,
        code: err.response?.data?.code,
        message: err.response?.data?.message
      });

      // Check if it's a device conflict error
      if (err.response?.status === 403 && err.response?.data?.code === "DEVICE_CONFLICT") {
        console.log("⚠️ FRONTEND - Device conflict detected, showing modal");
        setShowConflictModal(true);
      } else {
        const message = err.response?.data?.message || "Login failed";
        showError(message);
      }
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await performLogin(false); // ✅ First attempt without force
    } catch (err) {
      // Error already handled in performLogin
    } finally {
      setLoading(false);
    }
  };

  const handleForceLogin = async () => {
    console.log("🔴 FRONTEND - User confirmed force login");
    setShowConflictModal(false);
    setLoading(true);

    try {
      await performLogin(true); // ✅ Retry with forceLogin=true
    } catch (err) {
      // Error already handled in performLogin
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForceLogin = () => {
    console.log("⚪ FRONTEND - User cancelled force login");
    setShowConflictModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Side - Decorative */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-purple-800">Welcome Back to SkillFirst</h2>
            <p className="text-lg text-purple-600 mt-3">
              Log in to continue your learning journey
            </p>
          </div>
          <div className="w-full max-w-md rounded-2xl overflow-hidden ">
            <img
              src="https://media.istockphoto.com/id/1392001982/vector/man-and-woman-studying-together.jpg?s=612x612&w=0&k=20&c=IhP7Yc_71W4hYArcyT5Bdy3rzOLNVRHAtcfc_N2a0zs="
              alt="Students learning together"
              className="w-full h-auto object-cover"
            />
          </div>
          <p className="mt-8 text-purple-500 text-sm">
            New here? <a href="/signup" className="text-purple-700 font-medium hover:underline">Create an account</a>
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-purple-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-900">Sign In</h1>
            <p className="text-purple-600 mt-2">Enter your credentials or use Google</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-800 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="skill1academy@gamil.com"
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-800 mb-1">
                Password
              </label>
              <div className='relative'>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute inset-y-0 right-3
                    flex items-center
                    text-gray-500 hover:text-purple-700
                  "
                  aria-label="Toggle password visibility"
                >
                  <img
                    src={showPassword ? closeeye : eye}
                    alt="toggle password"
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <a href="/forgot-password" className="text-purple-700 hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 text-white font-semibold py-3.5 rounded-lg hover:bg-purple-800 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-purple-500">Or continue with</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium py-3.5 rounded-lg transition duration-300 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.31-.98 2.42-2.07 3.16v2.63h3.35c1.96-1.81 3.09-4.47 3.09-7.25z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.35-2.63c-1.01.68-2.29 1.08-3.93 1.08-3.02 0-5.58-2.04-6.49-4.79H.96v2.67C2.78 20.39 6.74 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.51 14.21c-.23-.68-.36-1.41-.36-2.21s.13-1.53.36-2.21V7.34H.96C.35 8.85 0 10.39 0 12s.35 3.15.96 4.66l4.55-2.45z"
                fill="#FBBC05"
              />
              <path
                d="M12 4.98c1.64 0 3.11.56 4.27 1.66l3.19-3.19C17.46 1.01 14.97 0 12 0 6.74 0 2.78 2.61.96 6.34l4.55 2.45C6.42 6.02 8.98 4.98 12 4.98z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center text-sm text-purple-600 lg:hidden">
            Don't have an account?{' '}
            <a href="/signup" className="text-purple-700 font-medium hover:underline">
              Sign up here
            </a>
          </div>
        </div>
      </div>

      {/* Device Conflict Modal */}
      {showConflictModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-purple-900 mb-2">
                Already Logged In
              </h3>
              <p className="text-purple-600">
                You are already logged in on another device. Do you want to logout from that device and login here?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelForceLogin}
                className="flex-1 px-6 py-3 border-2 border-purple-200 text-purple-700 font-semibold rounded-lg hover:bg-purple-50 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleForceLogin}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Yes, Login Here"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;