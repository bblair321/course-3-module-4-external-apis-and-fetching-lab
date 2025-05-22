/**
 * @jest-environment jsdom
 */

const { fetchWeatherData, displayWeather, displayError } = require('../index');

describe('fetchWeatherData', () => {
  beforeEach(() => {
    global.fetch = jest.fn();

    // Add required DOM elements used in displayError
    document.body.innerHTML = `
      <div id="error"></div>
      <img id="weather-icon" />
      <div id="weather-description"></div>
      <div id="temperature"></div>
    `;
  });

  it('should fetch weather data for a valid city', async () => {
    const mockResponse = {
      name: 'New York',
      main: { temp: 77, humidity: 50 },
      weather: [{ description: 'clear sky', icon: '01d' }],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const data = await fetchWeatherData('New York');
    expect(data.name).toBe('New York');
    expect(data.main.temp).toBe(77);
    expect(data.weather[0].description).toBe('clear sky');
  });

  it('should throw an error for an invalid city', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(fetchWeatherData('InvalidCity')).rejects.toThrow('City not found');
  });

  it('should throw an error for network issues', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchWeatherData('New York')).rejects.toThrow('Network Error');
  });
});

describe('displayWeather', () => {
  let weatherIcon, description, temperature;

  beforeEach(() => {
    document.body.innerHTML = `
      <img id="weather-icon" />
      <div id="weather-description"></div>
      <div id="temperature"></div>
      <div id="error"></div>
    `;
    weatherIcon = document.getElementById('weather-icon');
    description = document.getElementById('weather-description');
    temperature = document.getElementById('temperature');
  });

  it('should display weather data on the page', () => {
    const mockData = {
      name: 'New York',
      main: { temp: 77, humidity: 50 },
      weather: [{ description: 'clear sky', icon: '01d' }],
    };

    displayWeather(mockData);

    expect(weatherIcon.src).toContain('01d');
    expect(description.textContent).toBe('clear sky');
    expect(temperature.textContent).toContain('77');
  });
});

describe('displayError', () => {
  let error;

  beforeEach(() => {
    document.body.innerHTML = '<div id="error"></div>';
    error = document.getElementById('error');
  });

  it('should display an error message', () => {
    displayError('City not found');
    expect(error.textContent).toBe('City not found');
  });

  it('should replace any existing error message', () => {
    error.textContent = 'Old error';
    displayError('New error');
    expect(error.textContent).toBe('New error');
  });
});
