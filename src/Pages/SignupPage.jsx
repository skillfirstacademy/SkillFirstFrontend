// SignupPage.jsx
import React, { useState } from "react";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../Features/authSlice";
import { showSuccess, showError } from "../Componnets/AppToaster";
import eye from "../assets/eye.svg";
import closeeye from "../assets/eye (2).svg";

function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Google signup (same as login)
  const handleGoogleSignUp = () => {
    window.location.href = "https://skillfirstbackend.onrender.com/api/users/google";
  };

  // ✅ Signup submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const deviceId =
        localStorage.getItem("deviceId") || crypto.randomUUID();
      localStorage.setItem("deviceId", deviceId);

      const res = await api.post("/register", {
        name,
        email,
        mobile,
        dob,
        password,
        deviceId,
      });

      /**
       * IMPORTANT:
       * If backend returns user + token → auto-login
       * If backend returns only message → redirect to login
       */

      if (res.data.user && res.data.accessToken) {
        dispatch(
          loginSuccess({
            user: res.data.user,
            accessToken: res.data.accessToken,
          })
        );
      }

      showSuccess("Account created successfully");
      navigate("/login");
    } catch (err) {
      showError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-10 mb-10">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-purple-800">
              Join SkillFirst Today
            </h2>
            <p className="text-lg text-purple-600 mt-3">
              Start your journey with expert courses & AI-powered learning
            </p>
          </div>
          <div className="w-full max-w-md rounded-2xl overflow-hidden">
            <img
              src="https://thumbs.dreamstime.com/b/remote-learning-kid-studying-computer-student-online-home-education-personal-distance-teacher-virtual-school-utter-vector-201406968.jpg"
              alt="Student learning online"
              className="w-full h-auto object-cover"
            />
          </div>
          <p className="mt-8 text-purple-500 text-sm">
            Already Registered?{" "}
            <a href="/login" className="text-purple-700 font-medium hover:underline">
              Log in
            </a>
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-purple-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-900">
              Create Account
            </h1>
            <p className="text-purple-600 mt-2">
              Sign up or use Google to get started
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Two Column Layout for Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Two Column Layout for Mobile & DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-800 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-purple-700"
                  aria-label="Toggle password visibility"
                >
                  <img
                    src={showPassword ? closeeye : eye}
                    alt="toggle password"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-800 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg pr-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-purple-700"
                  aria-label="Toggle confirm password visibility"
                >
                  <img
                    src={showConfirmPassword ? closeeye : eye}
                    alt="toggle password"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 text-white font-semibold py-3.5 rounded-lg hover:bg-purple-800 transition shadow-md disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-purple-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignUp}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3.5 rounded-lg hover:bg-gray-50 transition"
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
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
