import React from "react";
import { useNavigate } from "react-router-dom";
import "./Begin.css";

const Init = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/home"); // Navigate to Home page
  };

  // Dynamic greeting based on time
  const hours = new Date().getHours();
  let greeting = "Good Morning";
  if (hours >= 12 && hours < 18) greeting = "Good Afternoon";
  else if (hours >= 18) greeting = "Good Evening";

  return (
    <div className="init-page">
      <div className="init-container">
        <h1>{greeting}!</h1>
        <h2>Welcome to <span>TO-DO-LA</span></h2>
        <p>Organize your tasks. Crush your goals. Stay motivated.</p>
        <div className="init-illustration">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2910/2910769.png"
            alt="To-Do Illustration"
          />
        </div>
        <br /><br />
        <button className="primary-btn" onClick={handleGetStarted}>
            Launch Your Productivity
        </button>
      </div>
    </div>
  );
};

export default Init;
