// 🔹 I. GLOBAL CONSTANTS – DOM Elements
const cityInput = document.querySelector(".city-input");
const city = document.querySelector(".city");
const temperature = document.querySelector(".temp");
const icon = document.querySelector(".weather-icon");
const date = document.querySelector(".date");
const time = document.querySelector(".time");
const tempFeel = document.querySelector(".temp-feel");
const wind = document.querySelector(".wind-speed");
const humidity = document.querySelector(".humidity");
const errormessage = document.querySelector(".error-message");
const loader = document.querySelector(".loader");

// 🔹 II. GENERAL UTILITIES

// 🔸 Get local time for a city
function getLocalTime(cityName) {
  const zones = {
    "Tenerife": "Atlantic/Canary",
    "Palma de Mallorca": "Europe/Madrid",
    "Königsleiten": "Europe/Vienna",
    "Bucharest": "Europe/Bucharest",
    "Madrid": "Europe/Madrid",
    "Sibiu": "Europe/Bucharest",
    "Punta Arenas": "America/Santiago",
  };
  const timeZone = zones[cityName] || "UTC";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

// 🔸 Determine time of day (sunrise/sunset/night)
function getBackgroundCondition(city) {
  const zones = {
    "Tenerife": "Atlantic/Canary",
    "Palma de Mallorca": "Europe/Madrid",
    "Königsleiten": "Europe/Vienna",
    "Bucharest": "Europe/Bucharest",
    "Madrid": "Europe/Madrid",
    "Sibiu": "Europe/Bucharest",
    "Punta Arenas": "America/Santiago",
  };
  const timeZone = zones[city] || "UTC";
  const localTime = new Date().toLocaleString("en-US", { timeZone });
  const hour = new Date(localTime).getHours();

  if (hour >= 6 && hour < 12) return "sunrise";
  if (hour >= 12 && hour < 19) return "sunset";
  return "night";
}

// 🔸 Determine current season by city and hemisphere
function getSeason(city) {
  const month = new Date().getMonth();
  const tropicalCities = ["Tenerife"];
  const southernCities = ["Punta Arenas", "Buenos Aires", "Sydney", "Cape Town"];

  if (tropicalCities.includes(city)) return "summer";

  const isSouthern = southernCities.includes(city);
  if (isSouthern) {
    if ([12, 1, 2].includes(month)) return "summer";
    if ([3, 4, 5].includes(month)) return "autumn";
    if ([6, 7, 8].includes(month)) return "winter";
    return "spring";
  } else {
    if ([12, 1, 2].includes(month)) return "winter";
    if ([3, 4, 5].includes(month)) return "spring";
    if ([6, 7, 8].includes(month)) return "summer";
    return "autumn";
  }
}

// 🔹 III. BACKGROUND IMAGE DATABASE (city to condition mapping)
const cityBackgrounds = {
  "Tenerife": {
    "default": "Tenerife.webp",
    "sunrise": "Tenerife_sunrise.webp",
    "sunset": "Tenerife_sunset.webp",
    "night": "Tenerife_nighttime.webp",
    "rain": "Tenerife_rainy_scene.webp",
    "storm": "Tenerife_dramatic_storm.webp",
    "cloudy": "Tenerife_cloudy_scene.webp",
  },
  "Palma de Mallorca": {
    "default": "Palma_de_Mallorca.webp",
    "sunrise": "Palma_de_Mallorca_sunrise.webp",
    "sunset": "Palma_de_Mallorca_sunset.webp",
    "night": "Palma_de_Mallorca_nighttime.webp",
    "storm": "Palma_de_Mallorca_stormy_scene.webp",
    "fog": "Palma_de_Mallorca_foggy_scene.webp",
    "rain": "Palma_de_Mallorca_rainy_scene.webp",
  },
  "Königsleiten": {
    "spring": "Königsleiten_spring_default.webp",
    "default": "Königsleiten.webp",
    "sunrise": "Königsleiten_sunrise.webp",
    "sunset": "Königsleiten_sunset.webp",
    "night": "Königsleiten_night.webp",
    "rain": "Königsleiten_rainy_evening.webp",
    "summer": "Königsleiten_summer_sunset.webp",
    "winter": "Königsleiten_winter_morning.webp",
    "fog": "Königsleiten_foggy.webp",
    "snow": "Königsleiten_snowy_night.webp",
  },
  "Bucharest": {
    "default": "Bucharest.webp",
    "sunrise": "Bucharest_sunrise.webp",
    "sunset": "Bucharest_sunset.webp",
    "night": "Bucharest_nighttime.webp",
    "rain": "Bucharest_rainy_evening.webp",
    "summer": "Bucharest_summer_sunset.webp",
    "winter": "Bucharest_snowy_winter_morning.webp",
    "fog": "Bucharest_foggy_morning.webp",
    "snow": "Bucharest_snowy_night.webp",
  },
  "Madrid": {
    "default": "Madrid.webp",
    "sunrise": "Madrid_sunrise.webp",
    "sunset": "Madrid_sunset.webp",
    "night": "Madrid_nighttime_scene.webp",
    "rain": "Madrid_rainy.webp",
    "summer": "Madrid.webp",
    "winter": "Madrid_stormy.webp",
    "fog": "Madrid_foggy.webp",
    "snow": "Madrid_snowy.webp",
  },
  "Sibiu": {
    "spring": "Sibiu.webp",
    "default": "Sibiu.webp",
    "sunrise": "Sibiu_sunrise.webp",
    "sunset": "Sibiu_sunset.webp",
    "night": "Sibiu_winter_night.webp",
    "rain": "Sibiu_rainy_scene.webp",
    "summer": "Sibiu_summer_sunset.webp",
    "winter": "Sibiu_winter_sunrise.webp",
    "fog": "Sibiu_foggy_morning.webp",
    "snow": "Sibiu_winter_night.webp",
  },
  "Punta Arenas": {
    "default": "Punta_Arenas.webp",
    "sunrise": "Punta_Arenas_sunrise.webp",
    "sunset": "Punta_Arenas_sunset.webp",
    "night": "Punta_Arenas_nighttime.webp",
    "rain": "Punta_Arenas_rainy.webp",
    "summer": "Punta_Arenas_summer_sunset.webp",
    "winter": "Punta_Arenas_winter_morning.webp",
    "fog": "Punta_Arenas_foggy_morning.webp",
    "snow": "Punta_Arenas_snowy.webp",
  },
};

// 🔹 IV. UI & STYLE – Background and Weather Animations

// 🔸 Apply background image
function updateBackground(city, condition) {
  if (!cityBackgrounds[city]) return;
  const path = cityBackgrounds[city][condition] || cityBackgrounds[city]["default"];
  if (!path) return;
  const imagePath = `image/${path}`;
  document.body.style.transition = "background-image 1s ease-in-out, opacity 0.5s ease-in-out";
  document.body.style.opacity = "0.5";
  setTimeout(() => {
    document.body.style.backgroundImage = `url("${imagePath}")`;
    document.body.style.opacity = "1";
  }, 900);
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
}

// 🔸 Weather-based animation logic
function updateWeatherAnimation(info) {
  hideAllAnimations();
  const animations = [
    { condition: info.wind_speed > 20, animation: "cloud-animation" },
    { condition: info.wind_speed > 25 && info.humidity < 80, animation: "windy-animation" },
    { condition: info.humidity > 90, animation: "rain-animation" },
    { condition: info.temp < 0, animation: "snow-animation" },
    { condition: info.temp > 30, animation: "sun-animation" },
  ];
  const animation = animations.find(({ condition }) => condition);
  showAnimation(animation ? animation.animation : "light-cloud-animation");
}

// 🔸 Threshold fallback for basic animation
function handleThresholdAnimation(info) {
  if (info.wind_speed > 20) {
    showAnimation('cloud-animation');
  } else if (info.humidity > 90) {
    showAnimation('rain-animation');
  } else if (info.temp < 0) {
    showAnimation('snow-animation');
  } else {
    hideAllAnimations();
  }
}

// 🔸 Hide all animations
function hideAllAnimations() {
  const container = document.querySelector(".animation-container");
  if (!container) return;
  container.querySelectorAll("div").forEach(div => div.style.display = "none");
}

// 🔸 Show selected animation
function showAnimation(animationClass) {
  const container = document.querySelector(".animation-container");
  if (!container) return;
  container.querySelectorAll("div").forEach(div => {
    div.style.display = div.classList.contains(animationClass) ? "block" : "none";
  });
}

// 🔹 V. MAP – Leaflet.js Integration
let map = L.map('map', { zoomControl: false }).setView([28.2916, -16.6291], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marker = L.marker([28.2916, -16.6291]).addTo(map).bindPopup('Tenerife').openPopup();

function updateMap(cityName) {
  const coords = {
    "Tenerife": [28.2916, -16.6291],
    "Palma de Mallorca": [39.5696, 2.6502],
    "Königsleiten": [47.2565, 12.1325],
    "Bucharest": [44.4268, 26.1025],
    "Madrid": [40.4168, -3.7038],
    "Sibiu": [45.7983, 24.1256],
    "Punta Arenas": [-53.1638, -70.9171],
  };
  if (coords[cityName]) {
    map.setView(coords[cityName], 10);
    marker.setLatLng(coords[cityName]).bindPopup(cityName).openPopup();
  }
}

// 🔹 VI. API CALL – Weather Data
async function getWeatherDataForCity(cityName) {
  loader.style.display = "block";
  errormessage.textContent = "";
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/weather?city=${cityName}`, {
      method: "GET",
      headers: { "X-Api-Key": "nVH0j5pHmmZSdOrMF8DTAeKWKfyi8kR2P363FRWg" },
    });
    if (!response.ok) throw new Error("The request failed");
    const result = await response.json();
    if (!result || !("temp" in result)) throw new Error("Weather data not available.");
    updateUiInfo(result);
  } catch (error) {
    console.error("❌ Error:", error);
    errormessage.textContent = error.message || "Failed to fetch weather data.";
  } finally {
    loader.style.display = "none";
  }
}

// 🔹 VII. MAIN UI UPDATE FUNCTION
function updateUiInfo(info) {
  const cityName = cityInput.value;
  city.innerHTML = cityName || "Unknown";
  temperature.innerHTML = `${info.temp ?? 'N/A'}°C`;
  date.innerHTML = new Date().toDateString();
  time.innerHTML = ` ${getLocalTime(cityName)}`;
  tempFeel.innerHTML = `${info.feels_like ?? 'N/A'}°C`;
  wind.innerHTML = `${info.wind_speed ?? 'N/A'} m/s`;
  humidity.innerHTML = `${info.humidity ?? 'N/A'}%`;

  updateMap(cityName);
  updateWeatherAnimation(info);
  handleThresholdAnimation(info);

  const season = getSeason(cityName);
  const timeOfDay = getBackgroundCondition(cityName);

  let weatherCondition = "default";
  if (cityBackgrounds[cityName]?.[season]) {
    weatherCondition = season;
  } else if (cityBackgrounds[cityName]?.[timeOfDay]) {
    weatherCondition = timeOfDay;
  }

  console.log("City:", cityName);
  console.log("Season:", season);
  console.log("Time of day:", timeOfDay);
  console.log("Selected background:", weatherCondition);

  updateBackground(cityName, weatherCondition);
}

// 🔹 VIII. EVENT HANDLERS

document.addEventListener("DOMContentLoaded", () => {
  getWeatherDataForCity(cityInput.value);
});

cityInput.addEventListener("change", (e) => {
  getWeatherDataForCity(e.target.value);
});
