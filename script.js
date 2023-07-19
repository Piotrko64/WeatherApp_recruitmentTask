const form = document.querySelector("form");
const selectInput = document.querySelector("select");
const weatherInfoDiv = document.querySelector(".weatherInformations");
const checkingCityDiv = document.querySelector(".checkingCity");
const lastWeatherDataDiv = document.querySelector(".lastWeatherData");

function createOneLineWeatherData(data) {
    return `<div class="oneLineData">
        <div><h4> Temperatura </h4>${data.temperatura} °C</div>
        <div><h4> Ciśnienie </h4>${data.cisnienie} hPa</div>
        <div><h4> Suma opadów </h4>${data.suma_opadu}</div>
        <div><h4> Data pomiaru </h4>${data.data_pomiaru}</div>
        </div>`;
}

function addValidData(data) {
    if (data.temperatura && data.data_pomiaru && data.suma_opadu && data.cisnienie) {
        weatherInfoDiv.innerHTML = createOneLineWeatherData(data);

        checkingCityDiv.textContent = `Sprawdzane miasto: ${data.stacja}`;
    } else {
        weatherInfoDiv.textContent = "Coś poszło nie tak z pobraniem danych";
    }
}

function addToLocalStorage(weatherData) {
    const actualData = JSON.parse(localStorage.getItem("weatherStorage")) || [];
    const newWeatherStorage = JSON.stringify([...actualData, weatherData]);

    localStorage.setItem("weatherStorage", newWeatherStorage);
}

function showActualWeatherData(event) {
    event.preventDefault(event);

    if (!selectInput.value.trim()) {
        weatherInfoDiv.textContent = "Uzupełnij najpierw poprawnie formularz!";
        return;
    }

    checkingCityDiv.textContent = "Ładuje...";
    weatherInfoDiv.textContent = "";

    fetch(`https://danepubliczne.imgw.pl/api/data/synop/station/${selectInput.value}`)
        .then((data) => data.json())
        .catch(() => (weatherInfoDiv.textContent = "UPS! Coś poszło nie tak!"))
        .then((data) => {
            addValidData(data);

            addToLocalStorage(data);
        });
}

form.addEventListener("submit", showActualWeatherData);

if (localStorage.getItem("weatherStorage")) {
    let everyResultsInLocalStorage = "";

    JSON.parse(localStorage.getItem("weatherStorage")).forEach((info) => {
        everyResultsInLocalStorage += `<h3> ${info.stacja} </h3> ${createOneLineWeatherData(info)} `;
    });

    lastWeatherDataDiv.innerHTML = everyResultsInLocalStorage;
}
