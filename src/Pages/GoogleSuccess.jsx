import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { loginSuccess } from "../Features/authSlice";

const GoogleSuccess = () => {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = params.get("accessToken");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    // 1️⃣ store token first
    localStorage.setItem("accessToken", accessToken);

    // 2️⃣ fetch user profile
    api
      .get("/me")
      .then((res) => {
        dispatch(
          loginSuccess({
            user: res.data,
            accessToken,
          })
        );

        navigate("/");
      })
      .catch(() => {
        navigate("/login");
      });
  }, []);

  return null;
};

export default GoogleSuccess;
