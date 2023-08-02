// Get the current date and display it on the page
var d = new Date();
document.getElementById("current-date").innerHTML = d.toDateString();

// Your OpenWeatherMap API key. Replace "YOUR_API_KEY" with your actual API key.
var APIkey = "bfd905788b00b37cb98468fce4582388";

// Selecting HTML elements from the DOM
var citySearchFormEl = document.querySelector("#city-search-form");
var citySearchEl = document.querySelector("#city-search-term");
var forecastContainerEl = document.querySelector("#forecast");

// Function to search for weather data for a given city
var searchCity = function (city) {
    // Construct the API URL for the current weather data
    var currentApiUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&appid=" +
        APIkey;

    // Fetch the current weather data for the city from the API
    fetch(currentApiUrl)
        .then(function (response) {
            if (response.ok) {
                // Parse the response JSON data
                response.json().then(function (data) {
                    console.log(data);
                    // Update the page with the current weather data
                    document.getElementById("city").textContent = data.name;
                    document.getElementById("temp").textContent =
                        data.main.temp;
                    document.getElementById("humidity").textContent =
                        data.main.humidity;
                    document.getElementById("wind-speed").textContent =
                        data.wind.speed;
                    document.getElementById("uv-index").textContent =
                        data.weather[0].description;
                    // You can use data.weather[0].icon to construct the icon URL
                });
            } else {
                // Display an alert if there's an error with the API response
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            // Display an alert if there's an error with the API request
            alert("Unable to connect to OpenWeatherMap API");
        });
};

// Function to create a forecast card with forecast data
var createForecastCard = function (forecastData) {
    // Create elements to display forecast data
    var card = document.createElement("div");
    card.classList.add("card");

    var dateElement = document.createElement("h3");
    dateElement.textContent = forecastData.dt_txt; // Use the date and time of the forecast

    var tempElement = document.createElement("h3");
    tempElement.textContent = "Temp: " + forecastData.main.temp + "° F";

    var humidityElement = document.createElement("h3");
    humidityElement.textContent = "Humidity: " + forecastData.main.humidity + "%";

    var weatherIconElement = document.createElement("img");
    weatherIconElement.setAttribute(
        "src",
        "https://openweathermap.org/img/w/" + forecastData.weather[0].icon + ".png"
    );

    // Append elements to the forecast card
    card.appendChild(dateElement);
    card.appendChild(weatherIconElement);
    card.appendChild(tempElement);
    card.appendChild(humidityElement);

    // Append the forecast card to the forecast container
    forecastContainerEl.appendChild(card);
};

// Function to display the 5-day forecast
var fiveDayForecast = function (data) {
    // Clear previous forecast cards
    forecastContainerEl.innerHTML = "";

    // Display the 5-day forecast
    for (var i = 0; i < data.list.length; i++) {
        // Filter the data to get only the forecasts at noon (12:00 PM)
        if (data.list[i].dt_txt.includes("12:00:00")) {
            // Call createForecastCard for each noon forecast
            createForecastCard(data.list[i]);
        }
    }
};

// Function to handle form submission
var formSubmitHandler = function (event) {
    event.preventDefault();

    var citySearched = citySearchEl.value.trim();
    if (citySearched) {
        // Search for current weather data
        searchCity(citySearched);
        citySearchEl.value = "";

        // Fetch 5-day forecast data
        var forecastApiUrl =
            "https://api.openweathermap.org/data/2.5/forecast?q=" +
            citySearched +
            "&appid=" +
            APIkey;

        fetch(forecastApiUrl)
            .then(function (response) {
                if (response.ok) {
                    // Parse the response JSON data
                    response.json().then(function (data) {
                        console.log(data);
                        // Display the 5-day forecast
                        fiveDayForecast(data);
                    });
                } else {
                    // Display an alert if there's an error with the API response
                    alert("Error: " + response.statusText);
                }
            })
            .catch(function (error) {
                // Display an alert if there's an error with the API request
                alert("Unable to connect to OpenWeatherMap API");
            });
    } else {
        // Display an alert if the user didn't input a city
        alert("Please search for a city");
    }
};

// Add event listener for form submission
citySearchFormEl.addEventListener("submit", formSubmitHandler);
