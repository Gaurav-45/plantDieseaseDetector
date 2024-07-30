import React from "react";
import "./Home.css";
import WeatherComponent from "../components/WeatherComponent/WeatherComponent";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className={navigator.onLine == false ? "centered_div" : ""}>
      {navigator.onLine ? (
        <WeatherComponent />
      ) : (
        <div className="offline_component">
          <p>This function requires network connectivity.</p>
          <p>Please connect to network</p>
          <Link to="/detect">
            <button className="offline_component top_nav_button">
              <p className="topnav_menu_item">
                Use plant disease detector offline
              </p>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
