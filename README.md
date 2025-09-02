# WeatherApp
A comprehensive weather app that fetches live weather data using the OpenWeather API. Features include current weather, 5-day forecast, location detection, favorites, unit conversion, multiple languages, and dynamic backgrounds.

## Features
- **Current Weather**: Displays temperature, description, humidity, wind speed, sunrise, and sunset.
- **5-Day Forecast**: Shows weather forecast for the next 5 days.
- **Location Detection**: Get weather for your current location using geolocation.
- **Favorites**: Save and quickly access favorite cities.
- **Unit Conversion**: Switch between Celsius and Fahrenheit.
- **Multiple Languages**: Support for English, Spanish, French, German, and Chinese.
- **Dynamic Backgrounds**: Background changes based on weather conditions.
- **Loading Indicators**: Shows loading state during API calls.
- **Error Handling**: Handles network errors and invalid cities gracefully.

## Setup
1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api).
2. Replace `'YOUR_API_KEY_HERE'` in `script.js` with your actual API key.
3. Open `index.html` in a web browser to run the app.

## Usage
- Enter a city name and click "Get Weather" or press Enter.
- Click the location icon (📍) to get weather for your current location.
- Use the unit selector to switch between °C and °F.
- Select your preferred language from the dropdown.
- Click on favorite cities to quickly load their weather.
- Cities are automatically added to favorites when you search for them.

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6+)
- OpenWeatherMap API
