var apiKey = "2da3b808285a97f89d4570afa4ceaaf7";

function search(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios
    .get(apiUrl)
    .then((response) => {
      displayWeather(response);
      displayDateTime(response);
    })
    .catch((error) => {
      alert("Invalid City Name!");
    });
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#searchInput").value;
  search(city);
}

let searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", handleSubmit);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML += `
     <div class="col-2">
       <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
       
       <img src="http://openweathermap.org/img/wn/${
         forecastDay.weather[0].icon
       }@2x.png" alt="" width="42" />
       <div class="weather-forecast-temperatures">
         <span class="weather-forecast-temperature-max">${Math.round(
           convertTemp(forecastDay.temp.max)
         )}</span>°
         <span class="weather-forecast-temperature-min">${Math.round(
           convertTemp(forecastDay.temp.min)
         )}</span>°
       </div>
     </div>
   `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  tempC = response.data.main.temp;
  temp = convertTemp(tempC);
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document.querySelector("#cityName").innerHTML = response.data.name;
  document.querySelector("#temp").innerHTML = Math.round(temp);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  getForecast(response.data.coord);
}

function getPostion(postion) {
  let latitude = postion.coords.latitude;
  let longitude = postion.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then((response) => {
    displayWeather(response);
    displayDateTime(response);
  });
}

function handlePosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPostion);
}

let currentLocationButton = document.querySelector("#current");
currentLocationButton.addEventListener("click", handlePosition);

function displayDateTime(response) {
  let tz = response.data.timezone;
  let now = new Date(new Date().getTime() + tz * 1000);
  let hour = String(now.getUTCHours()).padStart(2, "0");
  let minutes = String(now.getUTCMinutes()).padStart(2, "0");
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getUTCDay()];

  let today = document.querySelector("#today");
  today.innerHTML = `${day}  `;

  let time = document.querySelector("#time");
  time.innerHTML = `${hour}:${minutes}`;
}

function showFahrenheintTemperature(event) {
  event.preventDefault();
  let temp = document.querySelector("#temp");
  if (fahrenheintLink.classList.contains("active")) {
    return;
  }
  celsiuslink.classList.remove("active");
  fahrenheintLink.classList.add("active");
  let tempF = (tempC * 9) / 5 + 32;
  temp.innerHTML = Math.round(tempF);
  let maxs = document.getElementsByClassName(
    "weather-forecast-temperature-max"
  );

  Array.from(maxs).forEach((m) => {
    m.innerHTML = Math.round((parseFloat(m.innerHTML) * 9) / 5 + 32);
  });
  let mins = document.getElementsByClassName(
    "weather-forecast-temperature-min"
  );
  Array.from(mins).forEach((m) => {
    m.innerHTML = Math.round((parseFloat(m.innerHTML) * 9) / 5 + 32);
  });
}

function showCelsiuslinkTemperature(event) {
  event.preventDefault();
  let temp = document.querySelector("#temp");
  if (celsiuslink.classList.contains("active")) {
    return;
  }
  celsiuslink.classList.add("active");
  fahrenheintLink.classList.remove("active");
  temp.innerHTML = Math.round(tempC);
  let maxs = document.getElementsByClassName(
    "weather-forecast-temperature-max"
  );
  Array.from(maxs).forEach((m) => {
    m.innerHTML = Math.round(((parseFloat(m.innerHTML) - 32) * 5) / 9);
  });
  let mins = document.getElementsByClassName(
    "weather-forecast-temperature-min"
  );
  Array.from(mins).forEach((m) => {
    m.innerHTML = Math.round(((parseFloat(m.innerHTML) - 32) * 5) / 9);
  });
}

function convertTemp(temp) {
  let isC = celsiuslink.classList.contains("active");
  if (isC) {
    return temp;
  }
  return (temp * 9) / 5 + 32;
}

let tempC = null;

let fahrenheintLink = document.querySelector("#fahrenheit-link");
fahrenheintLink.addEventListener("click", showFahrenheintTemperature);

let celsiuslink = document.querySelector("#celsius-link");
celsiuslink.addEventListener("click", showCelsiuslinkTemperature);

search("Seattle");
