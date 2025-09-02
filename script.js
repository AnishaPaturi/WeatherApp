const apiKey = 'd2e7297980fa746417016e33f44f323d'; // Replace with your OpenWeather API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('city-input');
const getWeatherBtn = document.getElementById('get-weather-btn');
const weatherDisplay = document.getElementById('weather-display');

getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        displayError('Please enter a city name.');
    }
});

async function fetchWeather(city) {
    try {
        const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found or API error.');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        displayError(error.message);
    }
}

function displayWeather(data) {
    const { name, main, weather } = data;
    const temperature = main.temp;
    const description = weather[0].description;
    const icon = weather[0].icon;

    weatherDisplay.innerHTML = `
        <div class="weather-info">
            <h2>${name}</h2>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
            <p>Temperature: ${temperature}°C</p>
            <p>Description: ${description}</p>
        </div>
    `;
}

function displayError(message) {
    weatherDisplay.innerHTML = `<p class="error">${message}</p>`;
}
