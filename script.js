const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const statusEl = document.querySelector("#status");
const weatherResult = document.querySelector("#weather-results");

const API_Key = "a58a27152cc7272ec50a6bb954dd8f4c";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";


async function fetchWeather(city) {
  const url = `${API_URL}?q=${city}&appid=${API_Key}&units=metric`;
  const response = await fetch(url);
  //console.log(await response.json());    
  if (!response.ok) throw new Error("City not found");
  return response.json();
}
//fetchWeather("Kathmandu");

function renderWeather(data) {
  weatherResult.innerHTML = `
    <h2>${data.name}</h2>
    <p>Temperature: ${data.main.temp} C</p>
    <p>Condition: ${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
  `;
}

searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (!city) return;
  const data = await fetchWeather(city);
  renderWeather(data);
});
