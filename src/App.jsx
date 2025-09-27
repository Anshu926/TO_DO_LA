import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Begin from "./Begin";
import Home from "./Home";
import AddTask from "./AddTask";

import Users from "./Users";


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Show Begin component on root path */}
        <Route path="/" element={<Begin />} />

        {/* Separate Home route */}
        <Route path="/home" element={<Home />} />

        {/* Add Task route */}
        <Route path="/add" element={<AddTask />} />

        {/* Authentication routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Users route */}
        <Route path="/users" element={<Users />} />

        {/* Redirect any unknown route back to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      
      </Routes>
    </Router>
  );
};

export default App;
