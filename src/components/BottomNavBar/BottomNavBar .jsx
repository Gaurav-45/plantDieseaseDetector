// BottomNavBar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./BottomNavBar.css";

const BottomNavBar = () => {
  return (
    <div className="bottom-nav">
      <NavLink
        to="/"
        exact
        className="bottom-nav-link"
        activeClassName="active"
      >
        <div className="bottom-nav-item">
          <img
            src="/home.png"
            alt="Yield Predictor"
            className="bottom-nav-icon"
          />
          <p className="bottom-nav-text">Home</p>
        </div>
      </NavLink>
      <NavLink
        to="/yieldpredictor"
        className="bottom-nav-link"
        activeClassName="active"
      >
        <div className="bottom-nav-item">
          <img
            src="/leave.png"
            alt="Yield Predictor"
            className="bottom-nav-icon"
          />
          <p className="bottom-nav-text">Yield Predictor</p>
        </div>
      </NavLink>
      <NavLink
        to="/detect"
        className="bottom-nav-link"
        activeClassName="active"
      >
        <div className="bottom-nav-item">
          <img
            src="/disease.png"
            alt="Disease Detector"
            className="bottom-nav-icon"
          />
          <p className="bottom-nav-text">Disease Detector</p>
        </div>
      </NavLink>
      <NavLink
        to="/pricepredictor"
        className="bottom-nav-link"
        activeClassName="active"
      >
        <div className="bottom-nav-item">
          <img
            src="/plant_pirce.png"
            alt="Price Predictor"
            className="bottom-nav-icon"
          />
          <p className="bottom-nav-text">Price Predictor</p>
        </div>
      </NavLink>
    </div>
  );
};

export default BottomNavBar;
