const API_KEY = "6f95850f3b3fd97809e1c2f600f2cc4b"

function handleFormSubmit(event) {
  //handle submit event
  event.preventDefault(); // Prevent the default form submission
  const cityInput = document.querySelector("#cityinput").value.trim();
  if (cityInput) {
    fetchCurrentWeather(cityInput);
    fetchFiveDayForecast(cityInput);
  }
}

function fetchCurrentWeather(city) {
  //fetch current weather based on city
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Error fetching current weather.");
      return response.json();
    })
    .then((json) => {
      console.log("Current Weather Data:", json); // Log JSON for debugging
      displayCurrentWeather(json);
    })
    .catch((error) => console.error("Error:", error));
}

function displayCurrentWeather(json) {
  //render current weather data to the DOM using provided IDs and json from API
  document.querySelector("#temp").textContent = `${json.main.temp} °C`;
  document.querySelector("#low").textContent = `${json.main.temp_min} °C`;
  document.querySelector("#high").textContent = `${json.main.temp_max} °C`;
  document.querySelector("#humidity").textContent = `${json.main.humidity} %`;
  document.querySelector("#cloudCover").textContent = `${json.clouds.all} %`;
}


function fetchFiveDayForecast(city) {
  //fetch five day forecast data based on city
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Error fetching five-day forecast.");
      return response.json();
    })
    .then((json) => {
      console.log("Five-Day Forecast Data:", json); // Log JSON for debugging
      displayFiveDayForecast(json);
      createChart(json);
    })
    .catch((error) => console.error("Error:", error));
}

function displayFiveDayForecast(json) {
  //render five day forecast data to the DOM using provided IDs and json from API
  const forecastContainer = document.querySelector("aside");
  forecastContainer.innerHTML = ""; // Clear previous content
  json.list.forEach((forecast) => {
    const forecastDiv = document.createElement("div");
    forecastDiv.className = "forecast";
    forecastDiv.innerHTML = `
      <p>${forecast.dt_txt}</p>
      <p>Temp: ${forecast.main.temp} °C</p>
      <p>Humidity: ${forecast.main.humidity} %</p>
    `;
    forecastContainer.appendChild(forecastDiv);
  });
}

function createChart(json) {
  //Bonus: render temperature chart using five day forecast data and ChartJS
  const labels = json.list.map((forecast) => forecast.dt_txt);
  const temperatures = json.list.map((forecast) => forecast.main.temp);

  const ctx = document.querySelector("#temperature-chart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temperatures,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: "Date & Time" },
        },
        y: {
          title: { display: true, text: "Temperature (°C)" },
        },
      },
    },
  });
}

document.addEventListener('DOMContentLoaded', function() {
  //add event listener here for form submission
  const form = document.querySelector("#cityform");
  form.addEventListener("submit", handleFormSubmit);
})
