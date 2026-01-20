import React, { useState } from "react";
import api from "../api/axios";
import { showSuccess, showError } from "../Componnets/AppToaster";
import { useNavigate } from "react-router-dom";
import eye from "../assets/eye.svg";
import closeeye from "../assets/eye (2).svg";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // STEP 1 – Send OTP
  const sendOtp = async () => {
    if (!email) {
      showError("Please enter email");
      return;
    }

    try {
      setLoading(true);
      await api.post("/forgot-password", { email });
      showSuccess("OTP sent to email");
      setStep(2);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 – Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      showError("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      await api.post("/verify-otp", { email, otp });
      showSuccess("OTP verified");
      setStep(3);
    } catch (err) {
      showError("Please enter valid OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3 – Reset Password
  const resetPassword = async () => {
    if (!newPassword) {
      showError("Enter new password");
      return;
    }

    if (!confirmPassword) {
      showError("Enter confirm password");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await api.post("/reset-password", {
        email,
        otp,
        newPassword,
      });

      showSuccess("Password reset successful");
      navigate("/login");
    } catch (err) {
      showError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-lg mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-purple-700 text-white py-3 rounded-lg"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-4">Verify OTP</h2>

            <p className="text-sm text-gray-600 mb-2">
              OTP sent to <b>{email}</b>
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-3 border rounded-lg mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-purple-700 text-white py-3 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>

            <p className="text-sm text-gray-600 mb-2">
              Account: <b>{email}</b>
            </p>

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full px-4 py-3 border rounded-lg pr-12"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                />
              </button>
            </div>

            <div className="relative mb-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border rounded-lg pr-12"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                />
              </button>
            </div>

            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full bg-purple-700 text-white py-3 rounded-lg"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;