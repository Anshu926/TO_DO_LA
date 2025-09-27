import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { auth } from "./firebase";
import "./Signup.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const db = getDatabase();
      await set(ref(db, "users/" + user.uid), {
        uid: user.uid,
        email: user.email,
      });

      toast.success("✅ Signup successful! Redirecting to login...", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        closeButton: false, // ❌ removed
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);

      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
      console.error("Signup Error:", err);

      toast.error("❌ " + err.message, {
        position: "top-center",
        autoClose: 1500,
        theme: "colored",
        closeButton: false, // ❌ removed
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          {/* Email */}
          <div className="input-container">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-container">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-pass"
              onClick={() => setShowPass(!showPass)}
              role="button"
              tabIndex={0}
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit">Sign Up</button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="login-span">
            Login
          </span>
        </p>
      </div>
      {/* Toast container updated */}
      <ToastContainer
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
    </div>
  );
};

export default Signup;
