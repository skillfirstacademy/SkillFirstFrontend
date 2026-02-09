import { useDispatch } from "react-redux";
// import { logout } from "../redux/slices/authSlice"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import { logout } from "../Features/authSlice";

const OutOfServicePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center w-full px-4">
      <div className="text-center max-w-2xl space-y-6">

        <h1 className="text-xl md:text-2xl font-semibold text-red-500">
          Our services are temporarily unavailable. We apologize for the
          inconvenience. Please try again later.
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition duration-200"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default OutOfServicePage;
