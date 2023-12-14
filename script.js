import API_KEY from "./apikey.js";
import weatherConditions from "./assets/weather_conditions.json" assert { type: "json" };

const search = document.getElementById("search");
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
      elem.addEventListener("click", async () => {
        let data = await getWeatherDataByLocationID(item.id);
        suggestions.innerHTML = "";
        displayCurrentForecast(data);
        displayWeeklyForecast(data);
      });
      suggestions.appendChild(elem);
      console.log(item);
    });
  }
});

function displayCurrentForecast(data) {
  const forecast_today = data.forecast.forecastday[0];

  document.querySelector(".cityName").textContent = data.location.name;
  document.querySelector(".countryName").textContent = data.location.country;
  const date = new Date(data.location.localtime);
  document.querySelector(".time").textContent = `${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    }`;
  document.querySelector(".date").textContent = `${date.getDayOfWeek()}, ${date.getDate()} ${date.getFullMonth()}`
  document.querySelector(".conditionText").textContent = data.current.condition.text
  document.querySelector(".temp").textContent = data.current.temp_c + " °C"
  document.querySelector(".feelslike").textContent = "Feels like " + data.current.feelslike_c + " °C"
  document.querySelector(".wind").textContent = data.current.wind_kph + " km/h"
  document.querySelector(".humidity").textContent = data.current.humidity + "%"
  document.querySelector(".rainChance").textContent = forecast_today.day.daily_chance_of_rain + "%"
  document.querySelector(".conditionIcon").src = getIconSrc(data.current.condition.code, data.current.is_day)
}

function displayWeeklyForecast(data) {
  data.forecast.forecastday.forEach((day) => {
    const el = createElement("p");
    const img = createElement("img");
    img.src = getIconSrc(day.day.condition.code, 1);
    el.innerHTML = `
${new Date(day.date).getDayOfWeek()} ${day.day.maxtemp_c}C ${day.day.mintemp_c
      }C ${day.day.condition.text}
`;
    content.appendChild(el);
    content.appendChild(img);
  });
}

Date.prototype.getDayOfWeek = function() {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][this.getDay()];
};

Date.prototype.getFullMonth = function() {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][this.getMonth()];
};

function getIconSrc(iconcode, is_day) {
  const icon = weatherConditions.find((icon) => icon.code === iconcode).icon;
  const time = is_day ? "day" : "night";
  return `./assets/weather/64x64/${time}/${icon}.png`;
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
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=id:${id}&days=3`,
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

let data = await getWeatherDataByIp();
console.log(data)
displayCurrentForecast(data);
// displayWeeklyForecast(data);
