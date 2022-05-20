let apiKey = "2da3b808285a97f89d4570afa4ceaaf7";

function search(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#searchInput").value;
  search(city);
}

let searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", handleSubmit);

function displayWeather(response) {
  tempC = response.data.main.temp;
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document.querySelector("#cityName").innerHTML = response.data.name;
  document.querySelector("#temp").innerHTML = Math.round(tempC);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
}

function getPostion(postion) {
  let latitude = postion.coords.latitude;
  let longitude = postion.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function handlePosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPostion);
}

let currentLocationButton = document.querySelector("#current");
currentLocationButton.addEventListener("click", handlePosition);

let now = new Date();
let hour = now.getHours();
let minutes = String(now.getMinutes()).padStart(2, "0");
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];

let today = document.querySelector("#today");
today.innerHTML = `${day}  `;

let time = document.querySelector("#time");
time.innerHTML = `${hour}:${minutes}`;

function showFahrenheintTemperature(event) {
  event.preventDefault();
  let temp = document.querySelector("#temp");
  celsiuslink.classList.remove("active");
  fahrenheintLink.classList.add("active");
  let tempF = (tempC * 9) / 5 + 32;
  temp.innerHTML = Math.round(tempF);
}

function showCelsiuslinkTemperature(event) {
  event.preventDefault();
  let temp = document.querySelector("#temp");
  celsiuslink.classList.add("active");
  fahrenheintLink.classList.remove("active");
  temp.innerHTML = Math.round(tempC);
}

let tempC = null;

let fahrenheintLink = document.querySelector("#fahrenheit-link");
fahrenheintLink.addEventListener("click", showFahrenheintTemperature);

let celsiuslink = document.querySelector("#celsius-link");
celsiuslink.addEventListener("click", showCelsiuslinkTemperature);

search("Seattle");
