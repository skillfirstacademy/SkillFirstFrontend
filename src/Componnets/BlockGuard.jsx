import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const BlockGuard = () => {
  const auth = useSelector((state) => state.auth);

  // fallback from localStorage
  const token = auth.accessToken || localStorage.getItem("accessToken");

  const user =
    auth.user || JSON.parse(localStorage.getItem("user"));

//   // If NOT logged in
//   if (!token) return <Navigate to="/login" replace />;

  // If blocked all
  if (user?.isBlockedAll) return <Navigate to="/out-of-service" replace />;

  // If blocked
  if (user?.isBlocked) return <Navigate to="/blocked" replace />;

  return <Outlet />;
};

export default BlockGuard;
