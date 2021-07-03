var searchBtn = document.querySelector('.searchBtn');
// var unlock = "./assets/key";
var url404 =  "./404.html";
// weatherInfo holds the JSON info from the waether API
var weatherInfo, cityName;
var toggle = false;

function init (){
    // try to autopopulate screen when user arrives if they allow location
    // for a better ux
    getCurrentLocation();
}
init();

function handleSearch (){
    // get the city input
    var searchInput = document.querySelector('#search-input').value.toLowerCase().trim();
    getCoordinates(searchInput)

};

function getCoordinates(searchInput){
    var lat, lon;
    var coordinateUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + unlock;
//get lat and long coordinates of city from this api call
    fetch(coordinateUrl)
  .then(function (response) {
    if (response.status == 404){
        document.location.assign(url404);
        // redirect
    }
    else{
        return response.json();
    }

  })
  // go into returned object and pull the lat and long, set them to variables
  .then(function (data) {
    lat = data.coord.lat;
    lon = data.coord.lon;
    cityName = data.name;
    // pass lat and lon for next api call
    console.log(lat, lon);
    getWeather(lat, lon);
  });
  
};

function getWeather (lat, lon){
    console.log("getting weather data for coords");
    console.log(lat, lon);
    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&exclude=alerts" + "&appid=" + unlock;
    fetch(weatherUrl)
    .then(function (response) {
      if (response.status == 404){
          document.location.assign(url404);
          // redirect
      }
      else{
          return response.json();
      }
  
    })
    // go into returned object with all the weather data
    .then(function (data) {
      weatherInfo = data;
      console.log(weatherUrl);
      fillCurrentData();
    });
};

function fillCurrentData (){
    // ****** CURRENT WEATHER ****** //
    var temp = document.querySelector("#temp");
    var wind = document.querySelector("#wind");
    var humidity = document.querySelector("#humidity");
    var uvIndex = document.querySelector("#uv-index");
    var cityNameEl = document.querySelector(".city");
    var currentIconEl = document.querySelector("#current-icon");
    var currentIconCode = weatherInfo.current.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/" + currentIconCode + "@2x.png";
    // TODO ADD MAP
    var mapEl = document.querySelector("#map");
    var mapUrl = "https://tile.openweathermap.org/map/precipitation_new/1/1/1.png?appid=" + unlock;
    // TODO make its own function > get current date using js
    let currentDate = new Date();
    let cDay = currentDate.getDate();
    let cMonth = currentDate.getMonth() + 1;
    let cYear = currentDate.getFullYear();
    // append city name to page
    cityNameEl.textContent = cityName;
    // create span to fill with current date
    var todayEl = document.createElement("span");
    // use the date function in JS to set current date and append to page
    todayEl.innerHTML = " " + cMonth + "/" + cDay + "/" + cYear;
    cityNameEl.appendChild(todayEl);
    currentIconEl.setAttribute("src", iconUrl)
    mapEl.setAttribute("src", iconUrl)
    // append current weather info to the page
    var tempData = weatherInfo.current.temp;
    console.log(tempData);
    // round temperature
    simpleTemp = Math.round(tempData);
    temp.textContent = simpleTemp + "\xB0 F";
    wind.textContent = Math.round(weatherInfo.current.wind_speed) + " MPH";
    humidity.textContent = weatherInfo.current.humidity + " %";
    uvIndex.textContent = weatherInfo.current.uvi;
    if (weatherInfo.current.uvi < 2){
        uvIndex.setAttribute("class", "btn-success btn-gradient text-white")
    }
    else if (weatherInfo.current.uvi > 2){
        uvIndex.setAttribute("class", "bg-warning bg-gradient text-white")
    }
    else {
        uvIndex.setAttribute("class", "bg-danger bg-gradient text-white")
    }
    fillForecastData();
}

function fillForecastData (){
    console.log(weatherInfo);
    var forecastEL = document.querySelector(".forecast-wrapper");
    // if we have already completed the for loop once and flipped the toggle switch
    if (toggle == true){
        // reset 5-day forecast so they don't append over prev query
        for (let i = 0; i < forecastEL.children.length; i++) {
            var dateEl = document.querySelector(".date");
            var iconEl = document.querySelector(".icon");
            var tempEl = document.querySelector(".temp");
            var windEl = document.querySelector(".wind");
            var humidityEl = document.querySelector(".humidity");
            dateEl.remove();
            iconEl.remove();
            tempEl.remove();
            windEl.remove();
            humidityEl.remove();
        }
    }
    for (let i = 0; i < forecastEL.children.length; i++) {
        // create the elements
        var tempEl = document.createElement("div");
        var windEl = document.createElement("div");
        var humidityEl = document.createElement("div");
        var iconEl = document.createElement("div");
        var dateEl = document.createElement("div");
        var iconCode = weatherInfo.daily[i+1].weather[0].icon;
        var unixDate = weatherInfo.daily[i+1].dt;
        var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
        // assign classes
        dateEl.setAttribute("class", "date");
        iconEl.setAttribute("class", "icon");
        tempEl.setAttribute("class", "temp");
        windEl.setAttribute("class", "wind");
        humidityEl.setAttribute("class", "humidity");
        // assign values
        dateEl.innerHTML = timeConverter(unixDate);
        iconEl.innerHTML = '<img src=' + iconUrl + ">";
        tempEl.innerHTML = "Temp: " + Math.round(weatherInfo.daily[i+1].temp.day) + "\xB0 F";
        windEl.innerHTML = "Wind: " + Math.round(weatherInfo.daily[i+1].wind_speed) + " MPH";
        humidityEl.innerHTML = "Humidity: " + Math.round(weatherInfo.daily[i+1].humidity) + " %";
        
        // append to page
        forecastEL.children[i].appendChild(dateEl);
        forecastEL.children[i].appendChild(iconEl);
        forecastEL.children[i].appendChild(tempEl);
        forecastEL.children[i].appendChild(windEl);
        forecastEL.children[i].appendChild(humidityEl);
        // toggle true to signal that the loop has been run before
        toggle = true;
    }
};


function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    var month = a.getMonth()+1;
    var date = a.getDate();
    var formattedDate = month + '/' + date + '/' + year;
    return formattedDate;
  }
//TODO Get current location
function getCurrentLocation (){
    console.log("requesting device location");
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}
function successCallback (position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    // format lat and lon to 4 decimals
    lat.toLocaleString(undefined, { minimumFractionDigits: 4 })
    lon.toLocaleString(undefined, { minimumFractionDigits: 4 })
    getWeather(lat, lon)
    console.log(lat, lon);
}

function errorCallback (error) {
    console.log(error.message);
}


//testing current location
// searchBtn.addEventListener("click", getCurrentLocation)
searchBtn.addEventListener("click", handleSearch)