// index.js

// Fetch weather data from OpenWeather API
async function fetchWeatherData(city) {
  const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('City not found');
    }

    const data = await response.json();

    // If running in a browser, display the weather
    if (typeof document !== 'undefined') {
      displayWeather(data);
    }

    return data; // Needed for tests
  } catch (error) {
    if (typeof document !== 'undefined') {
      displayError(error.message);
    }
    throw error; // Needed for tests
  }
}

// Display weather info in the DOM
function displayWeather(data) {
  const weatherIcon = document.getElementById('weather-icon');
  const description = document.getElementById('weather-description');
  const temperature = document.getElementById('temperature');

  weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  description.textContent = data.weather[0].description;
  temperature.textContent = `Temperature: ${data.main.temp}°F`;

  document.getElementById('error').textContent = ''; // Clear errors
}

// Display error message in the DOM
function displayError(message) {
  document.getElementById('error').textContent = message;
}

// Attach DOM event listener after page loads
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fetch-button').addEventListener('click', () => {
      const city = document.getElementById('city-input').value.trim();
      if (!city) {
        displayError('Please enter a city name.');
        return;
      }
      fetchWeatherData(city);
    });
  });
}

// Export for Jest tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchWeatherData,
    displayWeather,
    displayError
  };
}
