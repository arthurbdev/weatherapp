import API_KEY from "./apikey.js";
import weatherConditions from "./assets/weather_conditions.json" assert {type: 'json'};

const search = document.getElementById("search");
const button = document.querySelector("button");
const suggestions = document.querySelector(".suggestions");
const content = document.getElementById("content");

search.addEventListener("input", async (e) => {
  const value = search.value;
  suggestions.innerHTML = "";
  if (value && value.length >= 3) {
    const request = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${value}`,
      { mode: "cors" },
    );
    const data = await request.json();
    data.forEach((item) => {
      const elem = document.createElement("button");
      elem.textContent = `${item.name}, ${item.country}`;
      elem.addEventListener('click', async () => {
        let data = await getWeatherDataByLocationID(item.id);
        content.innerHTML = "";
        suggestions.innerHTML = "";
        displayCurrentForecast(data);
        displayWeeklyForecast(data);
      })
      suggestions.appendChild(elem);
      console.log(item);
    });
  }
});

button.addEventListener("click", async (e) => {
});

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
  content.appendChild(el);
  content.appendChild(img)
}

function displayWeeklyForecast(data) {
  data.forecast.forecastday.forEach(day => {
    const el = createElement("p");
    const img = createElement("img");
    img.src = getIconSrc(day.day.condition.code, 1)
    el.innerHTML = `
${new Date(day.date).getDayOfWeek()} ${day.day.maxtemp_c}C ${day.day.mintemp_c}C ${day.day.condition.text}
`
    content.appendChild(el)
    content.appendChild(img);
  })
}

Date.prototype.getDayOfWeek = function(){   
    return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][ this.getDay() ];
};

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

async function getWeatherDataByLocationID(id) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=id:${id}&days=3`, { mode: "cors" },
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

let data = await getWeatherDataByIp();
displayCurrentForecast(data);
displayWeeklyForecast(data);
