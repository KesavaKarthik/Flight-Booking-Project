import React, { useState } from "react";
import axios from './axiosInstance';
import "./SignupModal.css"; // import the CSS we'll define below

const Signup = ({ isOpen, onClose ,complete}) => {
  const [login, setLogin] = useState({
    emailId: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (login.password !== confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }

    try {
      console.log("Sending signup request", login);
      const response = await axios.post("http://localhost:8080/signup", login);
      alert("Signup successful!");
      localStorage.setItem("token", response.data.token);
      complete();
      onClose(); // Close modal after signup
    } catch (err) {
      console.error("Error signing up", err);
      alert("Signup failed!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="title">Signup</h2>
        <div className="input-group">
          <label>Email ID</label>
          <input
            type="text"
            name="emailId"
            placeholder="Email ID"
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

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="button-group">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSignup}>Signup</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
