// src/components/Weather.js
import React, { useState } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const openCageApiKey = 'f55173c5db574c4487eb6fa2249c48e8';
  const openWeatherMapApiKey = 'e3163470f511e623341aa05c8c4c8c83';

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const getCoordinates = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${openCageApiKey}`
      );
      const coordinates = response.data.results[0].geometry;
      getWeatherData(coordinates);
    } catch (error) {
      setError('Error fetching coordinates');
      console.error('Error fetching coordinates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherData = async (coordinates) => {
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=${openWeatherMapApiKey}`
      );
      setWeatherData(weatherResponse.data);
    } catch (error) {
      setError('Error fetching weather data');
      console.error('Error fetching weather data:', error);
    }
  };

  const handleGetWeather = () => {
    getCoordinates();
  };

  return (
    <div className="weather-container">
      <h1>Hava Durumu</h1>
      <div>
        <input
          type="text"
          placeholder="Sehri giriniz"
          value={city}
          onChange={handleInputChange}
        />
        <button onClick={handleGetWeather}>Hava Durumunu Goster</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
