import React, { useState } from "react";
import "./TopNavbar.css";
import { Link } from "react-router-dom";

const TopNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="topnav_container">
      <div className="topnav_main_element">
        <div className="topnav_ele logo">
          <Link to="/">
            <h3>कृषिबंधु</h3>
          </Link>
        </div>
        <div className={`topnav_ele menu ${isOpen ? "open" : ""}`}>
          <Link to="/yieldpredictor">
            <p className="topnav_menu_item">Yeild predictor</p>
          </Link>
          <Link to="/detect">
            <p className="topnav_menu_item">Disease detector</p>
          </Link>
          <Link to="/pricepredictor">
            <p className="topnav_menu_item">Price predictor</p>
          </Link>
        </div>
        <div className={`topnav_ele buttons ${isOpen ? "open" : ""}`}>
          <button className="top_nav_button">Sign In</button>
          <button className="top_nav_button">Sign Up</button>
        </div>
        <div className="topnav_ele hamburger" onClick={toggleMenu}>
          <div className="hamburger_icon">&#9776;</div>
        </div>
      </div>
      {isOpen && (
        <div className="dropdown_menu">
          <Link to="/yieldpredictor" onClick={toggleMenu}>
            <p className="topnav_menu_item">Yeild predictor</p>
          </Link>
          <Link to="/detect" onClick={toggleMenu}>
            <p className="topnav_menu_item">Disease detector</p>
          </Link>
          <Link to="/pricepredictor" onClick={toggleMenu}>
            <p className="topnav_menu_item">Price predictor</p>
          </Link>
          <div className="topnav_collapse_button">
            <button className="top_nav_button" onClick={toggleMenu}>
              Sign In
            </button>
            <button className="top_nav_button" onClick={toggleMenu}>
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNavbar;
