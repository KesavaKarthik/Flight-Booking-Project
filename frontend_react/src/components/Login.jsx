import React, { useState } from "react";
import axios from './axiosInstance';
import "./LoginModal.css"; // add this line to use the CSS below 
const Login = ({ isOpen, onClose ,complete}) => {
  const [login, setLogin] = useState({
    emailId: "",
    password: "",
  });

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
  try {
    const response = await axios.post("http://localhost:8080/login", login);
    
    // If the response is OK (status 200)
    if (response.status === 200) {
      alert("Login successful!");
      localStorage.setItem('token' , response.data.token);

      complete();
      onClose(); // Optionally close the modal
    }
    } 
    catch (error) {
    // If the status is 401, check error message
    if (error.response && error.response.status === 401) {
      const message = error.response.data;
      if (message === "Invalid Email") {
        alert("Invalid Email ID");
      } else if (message === "Invalid Password") {
        alert("Incorrect Password");
      } else {
        alert("Unauthorized Access");
      }
    } else {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }
  }
  };
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="title">Login</h2>
        <div className="input-group">
          <label>Email ID</label>
          <input
            type="text"
            name="emailId"
            placeholder="Email id"
            value={login.emailId}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={login.password}
            onChange={handleChange}
          />
        </div>
        <div className="button-group">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
