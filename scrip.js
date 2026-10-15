const DEFAULT_LINKS = [
    { title: 'GitHub', img: './github-icon.svg', url: 'https://github.com/' },
    { title: 'Google', img: './google-icon.svg', url: 'https://www.google.com/' },
    { title: 'Bing', img: './bing-icon.svg', url: 'https://www.bing.com/' }
];

let formDis = false;
let searchEngine = 'google';
let timeFormat = 'railway';

function getSavedLinks() {
    try {
        const saved = JSON.parse(localStorage.getItem('data') || '[]');
        return Array.isArray(saved) && saved.length ? saved : DEFAULT_LINKS;
    } catch {
        return DEFAULT_LINKS;
    }
}

function persistLinks(links) {
    localStorage.setItem('data', JSON.stringify(links));
}

async function fetchData() {
    const links = getSavedLinks();
    const list = document.getElementById('quick-links');

    list.innerHTML = links
        .map((element) => `
            <li>
                <a href="${element.url}" target="_blank" rel="noreferrer" aria-label="${element.title}">
                    <div class="qlink" style="background-image: url('${element.img}')" title="${element.title}"></div>
                </a>
            </li>
        `)
        .join('') + '<li><div class="qlink-add" onclick="toggleAddForm()" aria-label="Add quick link">+</div></li>';

    patchDateTime();
    setGreeting();
}

function setGreeting() {
    const hour = new Date().getHours();
    const greetingNode = document.getElementById('greeting');

    if (hour < 12) {
        greetingNode.textContent = 'Good morning';
    } else if (hour < 18) {
        greetingNode.textContent = 'Good afternoon';
    } else {
        greetingNode.textContent = 'Good evening';
    }
}

function toggleAddForm() {
    formDis = !formDis;
    const addForm = document.getElementById('addform');
    const addButton = document.querySelector('.qlink-add');

    if (addButton) {
        addButton.style.transform = formDis ? 'rotate(45deg)' : 'rotate(0deg)';
    }

    if (addForm) {
        addForm.style.display = formDis ? 'block' : 'none';
    }
}

function performSearch(query) {
    const value = query.trim();
    if (!value) {
        return;
    }

    const url = searchEngine === 'google'
        ? `https://www.google.com/search?q=${encodeURIComponent(value)}`
        : `https://www.bing.com/search?q=${encodeURIComponent(value)}`;

    window.location.href = url;
}

function patchDateTime() {
    const everyMinute = 1000 * 60;
    performPatchDateTime();
    setInterval(() => {
        performPatchDateTime();
        setGreeting();
    }, everyMinute);
}

function performPatchDateTime() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date();
    const timeElement = document.getElementById('systemTime');
    const dateElement = document.getElementById('systemDate');

    if (!timeElement || !dateElement) {
        return;
    }

    if (timeFormat === 'standard') {
        let hours = date.getHours();
        const meridiem = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        timeElement.textContent = `${('0' + hours).slice(-2)}:${('0' + date.getMinutes()).slice(-2)} ${meridiem}`;
    } else {
        timeElement.textContent = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
    }

    dateElement.textContent = `${('0' + date.getDate()).slice(-2)}, ${monthNames[date.getMonth()]} ${days[date.getDay()]}`;
}

function swapTimeFormat() {
    timeFormat = timeFormat === 'standard' ? 'railway' : 'standard';
    performPatchDateTime();
}

function swapSearchEngine() {
    searchEngine = searchEngine === 'google' ? 'bing' : 'google';
    const icon = document.getElementById('search-engine-icon');
    icon.src = searchEngine === 'google' ? './google-icon.svg' : './bing-icon.svg';
}

window.addEventListener('DOMContentLoaded', () => {
    fetchData();

    document.getElementById('form').addEventListener('submit', (event) => {
        event.preventDefault();
        performSearch(document.getElementById('input').value);
    });

    document.getElementById('form1').addEventListener('submit', (event) => {
        event.preventDefault();
        const form = new FormData(document.getElementById('form1'));
        const title = (form.get('title') || '').toString().trim();
        const img = (form.get('img') || '').toString().trim();
        const url = (form.get('link') || '').toString().trim();

        if (!title || !url) {
            return;
        }

        const links = getSavedLinks();
        links.push({ title, img: img || './google-icon.svg', url });
        persistLinks(links);
        toggleAddForm();
        fetchData();
        document.getElementById('form1').reset();
    });

    document.getElementById('swap-button').addEventListener('click', swapTimeFormat);
    document.getElementById('swap-search-engine').addEventListener('click', swapSearchEngine);
});

function getWeatherCodeIcon(code, isDay) {
    const weatherMap = {
        0: isDay ? '☀️' : '🌙',
        1: isDay ? '🌤️' : '🌙',
        2: isDay ? '⛅' : '🌤️',
        3: '☁️',
        45: '🌫️',
        48: '🌫️',
        51: '🌦️',
        53: '🌦️',
        55: '🌧️',
        56: '🌧️',
        57: '🌧️',
        61: '🌦️',
        63: '🌧️',
        65: '🌧️',
        66: '🌧️',
        67: '🌧️',
        71: '🌨️',
        73: '🌨️',
        75: '🌨️',
        77: '❄️',
        80: '🌦️',
        81: '🌧️',
        82: '⛈️',
        85: '🌨️',
        86: '🌨️',
        95: '⛈️',
        96: '⛈️',
        99: '⛈️'
    };

    return weatherMap[code] || '🌤️';
}

function getWeatherCodeLabel(code) {
    const labels = {
        0: 'Clear sky',
        1: 'Mostly clear',
        2: 'Partly cloudy',
        3: 'Cloudy',
        45: 'Foggy',
        48: 'Foggy',
        51: 'Light drizzle',
        53: 'Drizzle',
        55: 'Heavy drizzle',
        56: 'Freezing drizzle',
        57: 'Freezing drizzle',
        61: 'Light rain',
        63: 'Rain',
        65: 'Heavy rain',
        66: 'Freezing rain',
        67: 'Freezing rain',
        71: 'Light snow',
        73: 'Snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Rain showers',
        81: 'Rain showers',
        82: 'Heavy showers',
        85: 'Snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm',
        99: 'Thunderstorm'
    };

    return labels[code] || 'Weather';
}

function updateWeatherWidget(data) {
    const weatherIcon = document.getElementById('weather-icon');
    const weatherTemp = document.getElementById('weather-temp');
    const weatherCondition = document.getElementById('weather-condition');
    const weatherWind = document.getElementById('weather-wind');
    const weatherHumidity = document.getElementById('weather-humidity');
    const weatherLocation = document.getElementById('weather-location');

    if (!weatherIcon || !weatherTemp || !weatherCondition || !weatherWind || !weatherHumidity || !weatherLocation) {
        return;
    }

    const current = data.current;
    const location = data.location || 'Current location';
    const code = Number(current.weather_code);
    const isDay = Number(current.is_day) === 1;

    weatherIcon.textContent = getWeatherCodeIcon(code, isDay);
    weatherTemp.textContent = `${Math.round(current.temperature_2m)}°`;
    weatherCondition.textContent = getWeatherCodeLabel(code);
    weatherWind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    weatherHumidity.textContent = `${Math.round(current.relative_humidity_2m)}%`;
    weatherLocation.textContent = location;
}

function setWeatherFallback() {
    const weatherTempt = document.getElementById('weather-temp');
    if (weatherTempt) weatherTempt.textContent = '--°';
    const weatherCondition = document.getElementById('weather-condition');
    if (weatherCondition) weatherCondition.textContent = 'Weather unavailable';
    const weatherLocation = document.getElementById('weather-location');
    if (weatherLocation) weatherLocation.textContent = 'Try again';
    const weatherIcon = document.getElementById('weather-icon');
    if (weatherIcon) weatherIcon.textContent = '⛅';
}

async function loadWeatherByCoords(latitude, longitude, locationName) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,is_day&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Weather request failed');
    }

    const data = await response.json();
    updateWeatherWidget({ current: data.current, location: locationName || 'Current location' });
}

function getFallbackWeather() {
    loadWeatherByCoords(40.7128, -74.0060, 'New York').catch(() => setWeatherFallback());
}

function handleGeolocationSuccess(position) {
    const { latitude, longitude } = position.coords;
    loadWeatherByCoords(latitude, longitude, 'Current location').catch(() => getFallbackWeather());
}

function handleGeolocationError() {
    getFallbackWeather();
}

function loadWeather() {
    const locationText = document.getElementById('weather-location');
    let fallbackTimer = null;

    if (navigator.geolocation) {
        fallbackTimer = setTimeout(() => {
            if (locationText && locationText.textContent === 'Locating…') {
                getFallbackWeather();
            }
        }, 2500);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearTimeout(fallbackTimer);
                handleGeolocationSuccess(position);
            },
            () => {
                clearTimeout(fallbackTimer);
                handleGeolocationError();
            },
            {
                enableHighAccuracy: false,
                timeout: 8000,
                maximumAge: 600000
            }
        );
        return;
    }

    getFallbackWeather();
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && formDis) {
        toggleAddForm();
    }
});

window.addEventListener('load', () => {
    loadWeather();
});
