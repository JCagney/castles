const axios = require("axios");
const apiKey = process.env.weatherkey;

const Weather = {
  readWeather: async function (location) {
    let weather = null;
    const coordinates = location.split(", ");
    const lat = coordinates[0];
    const long = coordinates[1];
    const weatherRequest = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`; 
    
    try {
      const response = await axios.get(weatherRequest);
      if (response.status == 200) {
        weather = response.data
      }
    } catch (error) {
      console.log(error);
    }
    return weather;
  },

  fetchWeather: async function (castleLocation) {
    let result = "Success"
    let weather = await Weather.readWeather(castleLocation);
    result = {
        feelsLike : Math.round(weather.main.feels_like -273.15),
        clouds : weather.weather[0].description,
        windSpeed: weather.wind.speed,
        windDirection: weather.wind.deg,
        visibility: weather.visibility/1000,
        humidity : weather.main.humidity
      };
  
    return result;
  }
};

module.exports = Weather;
