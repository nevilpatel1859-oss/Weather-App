const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getWeather();
  }
});

async function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    result.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }
  result.innerHTML = "<p>Loading weather...</p>";
  try {
    // Get latitude and longitude for the entered city.
    const geoURL =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geoURL);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      result.innerHTML = "<p>City not found.</p>";
      return;
    }

    const place = geoData.results[0];

    // Fetch current weather and 5-day forecast.
    const weatherURL =
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}` +
      `&longitude=${place.longitude}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m` +
      `&daily=temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto`;

    const weatherResponse = await fetch(weatherURL);
    const data = await weatherResponse.json();

    result.innerHTML = `
      <div class="current">
        <h2>${place.name}, ${place.country}</h2>
        <div class="temp">${Math.round(data.current.temperature_2m)}°C</div>
        <p>Humidity: ${data.current.relative_humidity_2m}%</p>
        <p>Wind Speed: ${data.current.wind_speed_10m} km/h</p>
      </div>
      <h3>5-Day Forecast</h3>
      <div class="forecast">
        ${data.daily.time.map((date, index) => `
          <div class="day">
            <b>${date}</b>
            <p>🌤</p>
            <p>
              ${Math.round(data.daily.temperature_2m_max[index])}° /
              ${Math.round(data.daily.temperature_2m_min[index])}°C
            </p>
          </div>
        `).join("")}
      </div>
    `;
  } catch (error) {
    result.innerHTML = "<p>Unable to fetch weather data. Try again.</p>";
    console.error(error);
  }
}
// Load weather for the default city.
getWeather();