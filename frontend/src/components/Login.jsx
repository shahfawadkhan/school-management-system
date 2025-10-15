import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success, token, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    const localUser = user;
    const currentUser = user || localUser;

    if (token && currentUser) {
      if (currentUser?.user?.role === "admin") {
        navigate("/dashboard");
      } else if (currentUser?.user?.role === "student") {
        navigate("/studentdashboard");
      } else if(currentUser?.user?.role === "teacher"){
        navigate("/teacherdashboard")
      }else{
        navigate("/");
      }
    }
  }, [token, user, navigate]);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl p-8 flex flex-col gap-4 w-[400px] rounded-2xl"
      >
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-2">
          Login
        </h2>
        <p className="text-center text-gray-500 mb-4 text-sm">
          Enter your credentials to access your account
        </p>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full focus:ring focus:ring-blue-300 border border-gray-300 p-3 rounded-lg"
          placeholder="Enter your email"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full focus:ring focus:ring-blue-300 border border-gray-300 p-3 rounded-lg"
          placeholder="Enter your password"
          required
        />

        {loading && <p className="text-blue-500 text-sm text-center">Logging in...</p>}
        {error && (
          <p className="text-red-600 text-sm text-center">{error.message || error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 w-full py-3 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
};

export default Login;
