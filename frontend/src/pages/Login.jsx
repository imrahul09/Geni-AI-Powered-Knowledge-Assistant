import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        },
      );
      const { token, user } = response.data;

      //save authentication information
      login(user, token);

      //go to chatGpt page
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="min-h-screen bg-[#212121] text-white flex items-center justify-center">
      <div className="w-full max-w-md bg-[#2f2f2f] p-8 rounded-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          Login to your account
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#212121] border border-[#555] focus:outline-none focus:border-teal-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#212121] border border-[#555] focus:outline-none focus:border-teal-500 "
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-700 cursor-pointer font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-centr text-[#b4b4b4] mt-6">
          {" "}
          Don't have an account?{""}{" "}
          <Link to="/Signup" className="text-teal-400 hover:text-teal-300">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
