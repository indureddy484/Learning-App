import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function  Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  function handletestClick() {
    if (location.pathname.includes("compare")) {
      navigate("/compare-test");
    } else if (location.pathname.includes("ascending")) {
      navigate("/ascending-test");
    } else {
      alert("No test available for this section.");
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-title" onClick={() => navigate("/")}>
        🧠  Game
      </div>
      <div className="nav-buttons">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={handletestClick}>Test</button>
      </div>
    </nav>
  );
};