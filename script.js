import API_KEY from "./apikey.js";
import weatherConditions from "./assets/weather_conditions.json" assert {type: 'json'};

async function displayCurrentForecast() {
  const data = await getWeatherDataByIp();

function displayCurrentForecast(data) {
  const el = createElement("p", "data");
  const forecast_today = data.forecast.forecastday[0];
  el.setAttribute('style', 'white-space: pre-line;');
  const iconcode = data.current.condition.code;
  const iconsrc = getIconSrc(iconcode, data.current.is_day)
  const img = document.createElement("img")
  img.src = iconsrc;

  el.innerHTML = `
LOCATION:
${data.location.name}, ${data.location.country}, ${data.location.localtime},
CURRENT:
${data.current.temp_c}C, ${data.current.condition.text}, Feelslike ${data.current.feelslike_c}C,
FORECAST_TODAY:
${data.current.humidity}% humidity, ${data.current.wind_kph}km/h wind, ${forecast_today.day.daily_chance_of_rain}% chance of rain
`;
  document.body.appendChild(el);
  document.body.appendChild(img)
}


function getIconSrc(iconcode, is_day) {
  const icon = weatherConditions.find(icon => icon.code === iconcode).icon
  const time = is_day ? "day" : "night";
  return `./assets/weather/64x64/${time}/${icon}.png`

}

function createElement(element, classname, textContent) {
  const el = document.createElement(element);
  el.classname = classname;
  el.textContent = textContent;
  return el;
}

async function getWeatherDataByIp() {
  const ip = await getIp();
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${ip}&days=3`,
    { mode: "cors" },
  );
  const data = await response.json();
  return data;
}

async function getIp() {
  const ip_response = await fetch("https://api.ipify.org/?format=json", {
    mode: "cors",
  });
  const ip = await ip_response.json();
  return ip.ip;
}

const data = await getWeatherDataByIp();
displayCurrentForecast(data);
