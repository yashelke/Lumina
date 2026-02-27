import React, { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import axios from "axios";
import { server } from "../main";
import { useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // user login api call and set user data in state

  const [btnLoading, setBtnLoading] = useState(false);

  async function loginUser(email, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/user/login`,

        { email },
      );

      toast.success(data.message);
      localStorage.setItem("verifyToken", data.verifyToken);
      // We are also storing email in localStorage to display the user email in header section of chatbot after login and verification.
      localStorage.setItem("email",email);
      navigate("/verify");

      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Server connection failed");
      setBtnLoading(false);
    }
  }

  const [user, setUser] = useState([]);

  const [isAuth, setIsAuth] = useState(false);

  async function verifyUser(otp, navigate) {
    const verifyToken = localStorage.getItem("verifyToken");

    setBtnLoading(true);

    if (!verifyToken) {
      return toast.error("Please give token for verification.");
    }
    try {
      const { data } = await axios.post(
        `${server}/api/user/verify`,

        { otp, verifyToken },
      );

      toast.success(data.message);
      localStorage.clear();
      localStorage.setItem("token", data.token);
      localStorage.setItem("email",data.user.email);
      navigate("/");
      setIsAuth(true);
      setUser(data.user);

      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Server connection failed");
      setBtnLoading(false);
    }
  }

// Loading state of user data when page is refreshed and user is already logged in  

const [loading, setLoading] = useState(true);


  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setIsAuth(true);
      setUser(data);
      setLoading(false);

    } catch (error) {
      toast.error(error.response?.data?.message);
      setIsAuth(false);
      setLoading(false);
    }
  }

  useEffect(() =>{
    fetchUser();

  }, []);

  return (
    <UserContext.Provider
      value={{
        loginUser,
        verifyUser,
        btnLoading,
        user,
        isAuth,
        setIsAuth,
        setUser,
        loading,
      }}
    >
      <Toaster />
      {children}
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
