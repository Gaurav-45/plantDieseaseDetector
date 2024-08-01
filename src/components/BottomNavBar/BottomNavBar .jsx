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
          <p className="bottom-nav-text">
            Home <br /> Page
          </p>
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
          <p className="bottom-nav-text">
            Yield <br /> Predictor
          </p>
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
          <p className="bottom-nav-text">
            Disease <br /> Detector
          </p>
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
          <p className="bottom-nav-text">
            Price <br />
            Predictor
          </p>
        </div>
      </NavLink>
      <NavLink
        to="/chatbot"
        className="bottom-nav-link"
        activeClassName="active"
      >
        <div className="bottom-nav-item">
          <img
            src="/robotic.png"
            alt="Price Predictor"
            className="bottom-nav-icon"
          />
          <p className="bottom-nav-text">
            Krishibandhu <br />
            Chatbot
          </p>
        </div>
      </NavLink>
    </div>
  );
};

export default BottomNavBar;
