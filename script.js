const form = document.querySelector("form");
const selectInput = document.querySelector("select");
const weatherInfoDiv = document.querySelector(".weatherInformations");
const checkingCityDiv = document.querySelector(".checkingCity");
const lastWeatherDataDiv = document.querySelector(".lastWeatherData");

function addValidData(data) {
    if (data.temperatura && data.data_pomiaru && data.suma_opadu && data.cisnienie) {
        checkingCityDiv.textContent = `Aktualna pogoda dla miasta: ${data.stacja}`;
        weatherInfoDiv.innerHTML = createOneLineWeatherData(data);

        addToLocalStorage(data);
    } else {
        checkingCityDiv.textContent = "";
        weatherInfoDiv.textContent = "Coś poszło nie tak z pobraniem danych";
    }
}

function createOneLineWeatherData(data) {
    return `<div class="oneLineData">
        <div><h4> Temperatura </h4>${data.temperatura} °C</div>
        <div><h4> Ciśnienie </h4>${data.cisnienie} hPa</div>
        <div><h4> Suma opadów </h4>${data.suma_opadu}</div>
        <div><h4> Data pomiaru </h4>${data.data_pomiaru}</div>
        </div>`;
}

function addToLocalStorage(weatherData) {
    const actualData = JSON.parse(localStorage.getItem("weatherStorage")) || [];
    const newWeatherStorage = JSON.stringify([weatherData, ...actualData]);

    localStorage.setItem("weatherStorage", newWeatherStorage);
}

function showActualWeatherData(event) {
    event.preventDefault(event);

    const valueSelect = selectInput.value;

    if (!valueSelect.trim()) {
        weatherInfoDiv.textContent = "Uzupełnij najpierw poprawnie formularz!";
        return;
    }

    checkingCityDiv.textContent = "Ładuje...";
    weatherInfoDiv.textContent = "";

    fetch(`https://danepubliczne.imgw.pl/api/data/synop/station/${valueSelect}`)
        .then((data) => data.json())
        .then((data) => {
            addValidData(data);
        })
        .catch((err) => {
            weatherInfoDiv.textContent = "UPS! Coś poszło nie tak!";
            console.error(err);
        });
}

form.addEventListener("submit", showActualWeatherData);

if (localStorage.getItem("weatherStorage")) {
    let everyResultsInLocalStorage = "";

    [...JSON.parse(localStorage.getItem("weatherStorage"))].forEach((info) => {
        everyResultsInLocalStorage += `<h3> ${info.stacja} </h3> ${createOneLineWeatherData(info)} `;
    });

    lastWeatherDataDiv.innerHTML = everyResultsInLocalStorage;
}
