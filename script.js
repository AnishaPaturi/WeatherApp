const apiKey = 'd2e7297980fa746417016e33f44f323d'; // Replace with your OpenWeather API key
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const oneCallApiUrl = 'https://api.openweathermap.org/data/3.0/onecall';

const cityInput = document.getElementById('city-input');
const getWeatherBtn = document.getElementById('get-weather-btn');
const currentLocationBtn = document.getElementById('current-location-btn');
const unitSelect = document.getElementById('unit-select');
const languageSelect = document.getElementById('language-select');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const weatherDisplay = document.getElementById('weather-display');
const forecastDisplay = document.getElementById('forecast-display');
const weatherAlerts = document.getElementById('weather-alerts');
const weatherMap = document.getElementById('weather-map');
const loadingIndicator = document.getElementById('loading-indicator');
const favoritesList = document.getElementById('favorites-list');
const generateWidgetBtn = document.getElementById('generate-widget-btn');
const widgetCode = document.getElementById('widget-code');

let currentUnit = 'metric';
let currentLanguage = 'en';

const languages = {
    en: {
        enterCity: 'Enter city name',
        getWeather: 'Get Weather',
        temperature: 'Temperature',
        description: 'Description',
        humidity: 'Humidity',
        windSpeed: 'Wind Speed',
        sunrise: 'Sunrise',
        sunset: 'Sunset',
        loading: 'Loading...',
        error: 'Error',
        cityNotFound: 'City not found or API error.',
        networkError: 'Network error. Please check your connection.',
        favoriteCities: 'Favorite Cities',
        forecast: '5-Day Forecast'
    },
    es: {
        enterCity: 'Ingrese el nombre de la ciudad',
        getWeather: 'Obtener Clima',
        temperature: 'Temperatura',
        description: 'Descripción',
        humidity: 'Humedad',
        windSpeed: 'Velocidad del Viento',
        sunrise: 'Amanecer',
        sunset: 'Atardecer',
        loading: 'Cargando...',
        error: 'Error',
        cityNotFound: 'Ciudad no encontrada o error de API.',
        networkError: 'Error de red. Verifique su conexión.',
        favoriteCities: 'Ciudades Favoritas',
        forecast: 'Pronóstico de 5 Días'
    },
    fr: {
        enterCity: 'Entrez le nom de la ville',
        getWeather: 'Obtenir la Météo',
        temperature: 'Température',
        description: 'Description',
        humidity: 'Humidité',
        windSpeed: 'Vitesse du Vent',
        sunrise: 'Lever du Soleil',
        sunset: 'Coucher du Soleil',
        loading: 'Chargement...',
        error: 'Erreur',
        cityNotFound: 'Ville introuvable ou erreur API.',
        networkError: 'Erreur réseau. Vérifiez votre connexion.',
        favoriteCities: 'Villes Favorites',
        forecast: 'Prévisions sur 5 Jours'
    },
    de: {
        enterCity: 'Stadtname eingeben',
        getWeather: 'Wetter abrufen',
        temperature: 'Temperatur',
        description: 'Beschreibung',
        humidity: 'Luftfeuchtigkeit',
        windSpeed: 'Windgeschwindigkeit',
        sunrise: 'Sonnenaufgang',
        sunset: 'Sonnenuntergang',
        loading: 'Laden...',
        error: 'Fehler',
        cityNotFound: 'Stadt nicht gefunden oder API-Fehler.',
        networkError: 'Netzwerkfehler. Überprüfen Sie Ihre Verbindung.',
        favoriteCities: 'Lieblingsstädte',
        forecast: '5-Tage-Vorhersage'
    },
    zh: {
        enterCity: '输入城市名称',
        getWeather: '获取天气',
        temperature: '温度',
        description: '描述',
        humidity: '湿度',
        windSpeed: '风速',
        sunrise: '日出',
        sunset: '日落',
        loading: '加载中...',
        error: '错误',
        cityNotFound: '未找到城市或API错误。',
        networkError: '网络错误。请检查您的连接。',
        favoriteCities: '收藏城市',
        forecast: '5天预报'
    }
};

function updateLanguage() {
    const lang = languages[currentLanguage];
    cityInput.placeholder = lang.enterCity;
    getWeatherBtn.textContent = lang.getWeather;
    document.querySelector('#favorites-container h3').textContent = lang.favoriteCities;
    loadingIndicator.textContent = lang.loading;
}

function showLoading() {
    loadingIndicator.style.display = 'block';
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
}

function setBackground(weatherMain) {
    document.body.className = '';
    if (weatherMain.includes('Clear')) {
        document.body.classList.add('weather-clear');
    } else if (weatherMain.includes('Clouds')) {
        document.body.classList.add('weather-cloudy');
    } else if (weatherMain.includes('Rain') || weatherMain.includes('Drizzle')) {
        document.body.classList.add('weather-rainy');
    } else if (weatherMain.includes('Snow')) {
        document.body.classList.add('weather-snowy');
    } else {
        document.body.classList.add('weather-sunny');
    }
}

getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        addToFavorites(city);
    } else {
        displayError(languages[currentLanguage].error + ': ' + languages[currentLanguage].enterCity);
    }
});

currentLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        }, () => {
            displayError(languages[currentLanguage].error + ': ' + languages[currentLanguage].networkError);
        });
    } else {
        displayError(languages[currentLanguage].error + ': ' + languages[currentLanguage].networkError);
    }
});

unitSelect.addEventListener('change', () => {
    currentUnit = unitSelect.value;
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

languageSelect.addEventListener('change', () => {
    currentLanguage = languageSelect.value;
    updateLanguage();
});



async function fetchForecast(city) {
    try {
        const response = await fetch(`${forecastApiUrl}?q=${city}&appid=${apiKey}&units=${currentUnit}`);
        if (!response.ok) {
            return;
        }
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        // Silently fail for forecast
    }
}

async function fetchForecastByCoords(lat, lon) {
    try {
        const response = await fetch(`${forecastApiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`);
        if (!response.ok) {
            return;
        }
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        // Silently fail for forecast
    }
}

function displayWeather(data) {
    const { name, main, weather, wind, sys } = data;
    const temperature = main.temp;
    const description = weather[0].description;
    const icon = weather[0].icon;
    const humidity = main.humidity;
    const windSpeed = wind.speed;
    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();
    const unitSymbol = currentUnit === 'metric' ? '°C' : '°F';
    const windUnit = currentUnit === 'metric' ? 'm/s' : 'mph';

    const lang = languages[currentLanguage];

    weatherDisplay.innerHTML = `
        <div class="weather-info">
            <h2>${name}</h2>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
            <p>${lang.temperature}: ${temperature}${unitSymbol}</p>
            <p>${lang.description}: ${description}</p>
            <p>${lang.humidity}: ${humidity}%</p>
            <p>${lang.windSpeed}: ${windSpeed} ${windUnit}</p>
            <p>${lang.sunrise}: ${sunrise}</p>
            <p>${lang.sunset}: ${sunset}</p>
        </div>
    `;
}

function displayForecast(data) {
    const lang = languages[currentLanguage];
    const forecastItems = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
    forecastDisplay.innerHTML = `<h3>${lang.forecast}</h3>`;
    forecastItems.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString(currentLanguage, { weekday: 'short' });
        const temp = item.main.temp;
        const icon = item.weather[0].icon;
        const unitSymbol = currentUnit === 'metric' ? '°C' : '°F';
        forecastDisplay.innerHTML += `
            <div class="forecast-item">
                <p>${day}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="">
                <p>${temp}${unitSymbol}</p>
            </div>
        `;
    });
}

function displayError(message) {
    weatherDisplay.innerHTML = `<p class="error">${message}</p>`;
    forecastDisplay.innerHTML = '';
}

function addToFavorites(city) {
    let favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
        loadFavorites();
    }
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
    favoritesList.innerHTML = '';
    favorites.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', () => {
            cityInput.value = city;
            fetchWeather(city);
        });
        favoritesList.appendChild(li);
    });
}

loadFavorites();
updateLanguage();

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    darkModeToggle.textContent = isDark ? '☀️' : '🌓';
});

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
}

// Weather Alerts
async function fetchAlerts(lat, lon) {
    try {
        const response = await fetch(`${oneCallApiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=minutely,hourly,daily&units=${currentUnit}`);
        if (!response.ok) {
            return;
        }
        const data = await response.json();
        displayAlerts(data.alerts);
    } catch (error) {
        // Silently fail for alerts
    }
}

function displayAlerts(alerts) {
    if (alerts && alerts.length > 0) {
        weatherAlerts.innerHTML = '<h3>Weather Alerts</h3>';
        alerts.forEach(alert => {
            weatherAlerts.innerHTML += `<p><strong>${alert.event}</strong>: ${alert.description}</p>`;
        });
        weatherAlerts.style.display = 'block';
    } else {
        weatherAlerts.style.display = 'none';
    }
}

// Weather Map
function displayWeatherMap(lat, lon) {
    const mapUrl = `https://openweathermap.org/weathermap?basemap=map&cities=true&layer=precipitation&lat=${lat}&lon=${lon}&zoom=10`;
    weatherMap.innerHTML = `<iframe src="${mapUrl}" width="100%" height="400" frameborder="0"></iframe>`;
}

// Widget Generation
generateWidgetBtn.addEventListener('click', () => {
    const city = cityInput.value.trim() || 'New York';
    const widgetHtml = `
<div style="font-family: Arial, sans-serif; border: 1px solid #ccc; padding: 10px; width: 200px; text-align: center;">
    <h3>Weather Widget</h3>
    <p>City: ${city}</p>
    <p>Temperature: <span id="widget-temp">--</span>°C</p>
    <p>Description: <span id="widget-desc">--</span></p>
    <script>
        fetch('https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric')
            .then(response => response.json())
            .then(data => {
                document.getElementById('widget-temp').textContent = data.main.temp;
                document.getElementById('widget-desc').textContent = data.weather[0].description;
            });
    </script>
</div>`;
    widgetCode.value = widgetHtml;
});

// Offline Mode
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}

// Check online status
window.addEventListener('online', () => {
    document.querySelector('.offline-indicator')?.remove();
});

window.addEventListener('offline', () => {
    const offlineDiv = document.createElement('div');
    offlineDiv.className = 'offline-indicator';
    offlineDiv.textContent = 'You are offline. Some features may not work.';
    document.body.appendChild(offlineDiv);
});

// Update fetchWeather to include alerts and map
async function fetchWeather(city) {
    showLoading();
    try {
        const response = await fetch(`${weatherApiUrl}?q=${city}&appid=${apiKey}&units=${currentUnit}`);
        if (!response.ok) {
            throw new Error(languages[currentLanguage].cityNotFound);
        }
        const data = await response.json();
        displayWeather(data);
        fetchForecast(city);
        fetchAlerts(data.coord.lat, data.coord.lon);
        displayWeatherMap(data.coord.lat, data.coord.lon);
        setBackground(data.weather[0].main);
    } catch (error) {
        if (error.name === 'TypeError') {
            displayError(languages[currentLanguage].networkError);
        } else {
            displayError(error.message);
        }
    } finally {
        hideLoading();
    }
}

// Update fetchWeatherByCoords to include alerts and map
async function fetchWeatherByCoords(lat, lon) {
    showLoading();
    try {
        const response = await fetch(`${weatherApiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`);
        if (!response.ok) {
            throw new Error(languages[currentLanguage].cityNotFound);
        }
        const data = await response.json();
        displayWeather(data);
        fetchForecastByCoords(lat, lon);
        fetchAlerts(lat, lon);
        displayWeatherMap(lat, lon);
        setBackground(data.weather[0].main);
    } catch (error) {
        if (error.name === 'TypeError') {
            displayError(languages[currentLanguage].networkError);
        } else {
            displayError(error.message);
        }
    } finally {
        hideLoading();
    }
}
