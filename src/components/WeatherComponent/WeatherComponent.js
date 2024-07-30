// src/components/WeatherComponent.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WeatherComponent.css";
import WeatherPrediction from "./WeatherPrediction";

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const API_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
  const CITY = "Pune";

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
        );
        const resPrediction = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}`
        );
        setWeatherData(response.data);
        setPrediction(resPrediction.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const { main, weather } = weatherData;
  const temperature = main.temp;
  const weatherDescription = weather[0].description;

  return (
    <div className="weather-wrapper">
      <div className="weather-container">
        <div className="weather-info">
          <h2>{CITY}</h2>
          <div className="weather-temperature">{temperature}°</div>
          <div className="weather-description">{weatherDescription}</div>
          <div className="weather-date">{new Date().toLocaleDateString()}</div>
        </div>

        <div className="weather-icon">
          <img
            src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
            alt={weatherDescription}
          />
        </div>
      </div>
      <div className="weather_predictions">
        {prediction &&
          prediction.list.map((pred, key) => <WeatherPrediction data={pred} />)}
      </div>
    </div>
  );
};

export default WeatherComponent;
