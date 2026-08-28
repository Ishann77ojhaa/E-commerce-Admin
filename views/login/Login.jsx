import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"

import {useNavigate, Link} from "react-router-dom";
import { loginUser } from "../../src/store/authSlice";
import { STATUSES } from "../../src/globals/misc/statuses";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    user_email: "",
    user_password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error as soon as user starts fixing the field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!userData.user_email.trim()) {
      newErrors.user_email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.user_email)
    ) {
      newErrors.user_email = "Enter a valid email address";
    }

    // Password validation
    if (!userData.user_password) {
      newErrors.user_password = "Password is required";
    } else if (userData.user_password.length < 3) {
      newErrors.user_password =
        "Password must be at least 3 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Don't send request if validation fails
    if (!validateForm()) {
      return;
    }

    const success = await dispatch(loginUser(userData));

    if (success) {
      navigate("/admin/dashboard")
  }
};


  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-gray-600 space-y-5">

        {/* Logo + Heading */}
        <div className="text-center pb-8">
          <Link
            to="/"
            className="text-[25px] font-bold tracking-tight text-slate-900"
          >
            Ish<span className="text-blue-700">Shop</span>
          </Link>

          <div className="mt-5">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Log in to your account
            </h3>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="font-medium">
              Email
            </label>

            <input
              type="email"
              name="user_email"
              value={userData.user_email}
              onChange={handleChange}
              className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border shadow-sm rounded-lg ${
                errors.user_email
                  ? "border-red-500"
                  : "focus:border-red-600"
              }`}
            />

            {errors.user_email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.user_email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="font-medium">
              Password
            </label>

            <input
              type="password"
              name="user_password"
              value={userData.user_password}
              onChange={handleChange}
              className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border shadow-sm rounded-lg ${
                errors.user_password
                  ? "border-red-500"
                  : "focus:border-red-600"
              }`}
            />

            {errors.user_password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.user_password}
              </p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">

            <div className="flex items-center gap-x-3">
              <input
                type="checkbox"
                id="remember-me-checkbox"
                className="checkbox-item peer hidden"
              />

              <label
                htmlFor="remember-me-checkbox"
                className="relative flex w-5 h-5 bg-white peer-checked:bg-red-600 rounded-md border ring-offset-2 ring-red-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
              ></label>

              <span>Remember me</span>
            </div>

            <Link
            to={"/forgotpassword"}
              type="button"
              className="text-center hover:underline text-red-600 hover:text-red-500"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={status === STATUSES.LOADING}
            className="w-full px-4 py-2 text-white font-medium bg-red-600 hover:bg-red-500 active:bg-red-600 rounded-lg duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === STATUSES.LOADING
              ? "Signing in..."
              : "Sign in"}
          </button>
        </form>

        {/* Google Login */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100"
        >
          <img
            src="https://raw.githubusercontent.com/sidiDev/remote-assets/7cd06bf1d8859c578c2efbfda2c68bd6bedc66d8/google-icon.svg"
            alt="Google"
            className="w-5 h-5"
          />

          Continue with Google
        </button>

      </div>
    </main>
  );
};
export default AdminLogin