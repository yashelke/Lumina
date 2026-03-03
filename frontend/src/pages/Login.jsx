import React from "react";
import { useState } from "react";
import { UserData } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../components/Loading.jsx";

const Login = () => {
  const [email, setEmail] = useState("");

  const { loginUser, btnLoading } = UserData();

  const navigate = useNavigate();
  

  const submitHandler = (e) => {
    e.preventDefault();

    // console.log(email);

    loginUser(email, navigate);

    
  };
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <form
          onSubmit={submitHandler}
          className="bg-white p-6 rounded shadow-md w-full md:w-[500px]"
        >
          <h2 className=" text-center text-2xl font-bold mb-4">Login</h2>
          <div className="mb-4">
            <label
              className="block text-gray-700  font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-full" disabled={btnLoading}
          >
            {btnLoading ? <LoadingSpinner /> : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
