// ── Config ────────────────────────────────────────
const API_KEY = "ae7b376a3ebcd3e5c18443fd4f4d4f38"; // Replace with your OpenWeatherMap API key
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// ── DOM ───────────────────────────────────────────
const cityInput    = document.getElementById("city-input");
const searchBtn    = document.getElementById("search-btn");
const retryBtn     = document.getElementById("retry-btn");

const loadingState = document.getElementById("loading-state");
const errorState   = document.getElementById("error-state");
const promptState  = document.getElementById("prompt-state");
const weatherCard  = document.getElementById("weather-card");
const errorMsg     = document.getElementById("error-msg");

// ── State helpers ─────────────────────────────────
function showOnly(el) {
  [loadingState, errorState, promptState, weatherCard].forEach(e =>
    e.classList.add("hidden")
  );
  el.classList.remove("hidden");
}

function showError(msg) {
  errorMsg.textContent = msg;
  showOnly(errorState);
}

// ── Sky background color by weather ───────────────
function skyColor(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return "#1a1a2e"; // thunderstorm
  if (weatherId >= 300 && weatherId < 600) return "#2c3e50"; // rain/drizzle
  if (weatherId >= 600 && weatherId < 700) return "#34495e"; // snow
  if (weatherId >= 700 && weatherId < 800) return "#4a5568"; // fog/haze
  if (weatherId === 800)                    return "#1a2a4a"; // clear
  return "#243060";                                            // cloudy
}

// ── Format time from Unix timestamp ───────────────
function fmtTime(unix, offset) {
  const d = new Date((unix + offset) * 1000);
  const h = d.getUTCHours().toString().padStart(2, "0");
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

// ── Fetch & render ────────────────────────────────
async function fetchWeather(city) {
  if (!city.trim()) { showError("Please enter a city name."); return; }

  showOnly(loadingState);

  try {
    const res = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );

    if (!res.ok) {
      if (res.status === 404)
        throw new Error(`City "${city}" not found. Check the spelling and try again.`);
      if (res.status === 401)
        throw new Error("Invalid API key. Please update your configuration.");
      throw new Error(`Server error (${res.status}). Please try again later.`);
    }

    const d = await res.json();
    render(d);

  } catch (err) {
    if (err instanceof TypeError)
      showError("Network error. Please check your internet connection.");
    else
      showError(err.message || "An unexpected error occurred.");
  }
}

function render(d) {
  const { name, sys, weather, main, wind, visibility, timezone } = d;

  // Sky colour
  document.getElementById("sky-bg").style.background = skyColor(weather[0].id);

  // Header
  document.getElementById("city-name").textContent   = name;
  document.getElementById("country-name").textContent = `${sys.country} · ${new Date().toLocaleDateString("en-US", { weekday: "long" })}`;

  // Icon from API
  const icon = document.getElementById("weather-icon");
  icon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  icon.alt = weather[0].description;

  // Temp & condition
  document.getElementById("temp").textContent       = Math.round(main.temp);
  document.getElementById("condition").textContent  = weather[0].description;
  document.getElementById("feels-like").textContent = `Feels like ${Math.round(main.feels_like)}°C`;

  // Pills
  document.getElementById("humidity").textContent   = `${main.humidity}%`;
  document.getElementById("wind").textContent       = `${Math.round(wind.speed)} m/s`;
  document.getElementById("visibility").textContent = visibility
    ? `${(visibility / 1000).toFixed(1)} km`
    : "N/A";

  // Info strip
  document.getElementById("temp-max").textContent = `${Math.round(main.temp_max)}°C`;
  document.getElementById("temp-min").textContent = `${Math.round(main.temp_min)}°C`;
  document.getElementById("pressure").textContent = `${main.pressure} hPa`;
  document.getElementById("sunrise").textContent  = fmtTime(sys.sunrise, timezone);

  showOnly(weatherCard);
}

// ── Events ────────────────────────────────────────
searchBtn.addEventListener("click", () => fetchWeather(cityInput.value));
cityInput.addEventListener("keydown", e => {
  if (e.key === "Enter") fetchWeather(cityInput.value);
});
retryBtn.addEventListener("click", () => {
  cityInput.value.trim() ? fetchWeather(cityInput.value) : showOnly(promptState);
});