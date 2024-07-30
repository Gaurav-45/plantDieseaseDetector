import React from "react";
import "./WeatherComponent.css";

const WeatherPrediction = ({ data }) => {
  return (
    <div className="weather_prediction">
      <p>
        <b>{data.weather[0].main}</b>
      </p>
      <p>29°</p>
      <img
        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
      />
      <p>{data.dt_txt.split(" ")[0]}</p>
      <p>{data.dt_txt.split(" ")[1]}</p>
    </div>
  );
};

export default WeatherPrediction;
