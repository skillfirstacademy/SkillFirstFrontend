// SignupPage.jsx
import React from 'react';

function SignupPage() {
  const handleGoogleSignUp = () => {
    // TODO: Implement Google OAuth signup here
    // Usually same flow as login — Google returns user data
    console.log("Google Sign-Up clicked");
    alert("Google Sign-Up functionality will be implemented here");
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-10 mb-10">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Side - Decorative */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-purple-800">Join SkillFirst Today</h2>
            <p className="text-lg text-purple-600 mt-3">
              Start your journey with expert courses & AI-powered learning
            </p>
          </div>
          <div className="w-full max-w-md rounded-2xl overflow-hidden ">
            <img
              src="https://thumbs.dreamstime.com/b/remote-learning-kid-studying-computer-student-online-home-education-personal-distance-teacher-virtual-school-utter-vector-201406968.jpg"
              alt="Student learning online"
              className="w-full h-auto object-cover"
            />
          </div>
          <p className="mt-8 text-purple-500 text-sm">
            Already have an account? <a href="/login" className="text-purple-700 font-medium hover:underline">Sign in</a>
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-purple-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-900">Create Account</h1>
            <p className="text-purple-600 mt-2">Sign up or use Google to get started</p>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-purple-800 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-800 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-800 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-purple-800 mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-700 text-white font-semibold py-3.5 rounded-lg hover:bg-purple-800 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Create Account
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
            onClick={handleGoogleSignUp}
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
            Already have an account?{' '}
            <a href="/login" className="text-purple-700 font-medium hover:underline">
              Sign in here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;