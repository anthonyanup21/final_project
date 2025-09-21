import React from "react";
import { useState } from "react";
import useAuthStore from "../store/authStore";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim())
      return toast.error("All fields are required");
    await login(email, password);

  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md p-8 bg-base-100 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-primary">Login</h2>
        <p className="text-center text-sm text-gray-500 mt-1">
          Welcome back 👋
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-600 text-xs p-1">
                Email
              </span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full rounded-xl  placeholder:text-gray-400 focus:placeholder:text-gray-500 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text text-gray-600 text-xs p-1">
                Password
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input input-bordered w-full rounded-xl  placeholder:text-gray-400 focus:placeholder:text-gray-500 text-white  pr-8"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div
              className="absolute right-131 top-86 cursor-pointer  text-white z-10  hover:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>

       

          <button
            type="submit"
            className="btn btn-primary w-full mt-6 rounded-xl "
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-bars loading-sm"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="link link-primary">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
