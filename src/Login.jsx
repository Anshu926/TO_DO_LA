import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("✅ User Logged In:");
      console.log("UID:", user.uid);
      console.log("Email:", user.email);
      console.log("Authenticated:", user ? true : false);

      // ✅ Toast without cross
      toast.success(" Login successful!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,  
        draggable: true,
        theme: "colored",
        closeButton: false, // 🚀 removed ❌
      });

      setTimeout(() => {
        navigate("/home");
      }, 2000);

      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
      console.error("Login Error:", err);
      console.log("Authenticated: false");

      toast.error("❌ Invalid credentials!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        closeButton: false, // 🚀 removed ❌
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="toggle-pass" onClick={() => setShowPass(!showPass)}>
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>

        <p className="signup-link" style={{ color: "white", marginTop: "1rem" }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={{
              color: "#b309f7",
              cursor: "pointer",
              fontWeight: "1rem",
            }}
          >
            Signup
          </span>
        </p>
      </div>
      {/* ✅ Toast container without cross */}
      <ToastContainer closeButton={false} />
    </div>
  );
};

export default Login;
