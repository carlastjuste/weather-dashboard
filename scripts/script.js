// Display last searched cities
var apiKey = '4354bae4bc4f80de34b0ce15453d2200';
var previousCitySearch = JSON.parse(localStorage.getItem("searchCity"))

if (previousCitySearch == null){
  displayWeatherInfo("Charlotte",35.2271, -80.8431,apiKey);
}

if (previousCitySearch !== null){
      displaySearchHistory(previousCitySearch);
      displayWeatherInfo(previousCitySearch[0].Name,previousCitySearch[0].lat, previousCitySearch[0].lon,apiKey);

    }


// fuction to display the city search history 
function displaySearchHistory (previousCitySearch) {
      previousSearchHtml = "<ul id='searchHistory'>"
      for (i=0; i<previousCitySearch.length; i++){
        previousSearchHtml +="<li><a href='#' onclick='onClickHandler(this)'>"+previousCitySearch[i].Name + "</a></li>";
      }
      previousSearchHtml+= "</ul>";
      $("#previousSearch").html(previousSearchHtml);                     
  };

// Onclick for cities on the search history
function onClickHandler(elem){
  var apiKey = '4354bae4bc4f80de34b0ce15453d2200';
  var cityName = elem.innerHTML;
  getCityGeoLocation (cityName, apiKey);
}


// onClick function for weather search by city name 
$("#searchWeatherBtn").on("click", function(event){
    event.preventDefault();
  
// takes the city name from the textbox #searchWeather
    var cityName = $("#searchWeather").val().trim();
    var apiKey = '4354bae4bc4f80de34b0ce15453d2200';
    console.log(cityName);
    getCityGeoLocation (cityName, apiKey);
    
})

//function to get the geolocation for a city and call the displayWeatherInfo function
 function getCityGeoLocation (cityName, apiKey) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+ apiKey;

    //call the openweather api to get the city geolocation
    $.ajax({
        url: queryURL,
        method: "GET"
      }).done(function(response) {
    // get the longitute and latitude of the city
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var cityName = response.name;
        var searchElement = {'Name' : cityName, 'lat': lat, 'lon': lon, 'Exec': 1};
        var searchCity = [searchElement];

    //Parse any JSON previosly stored in the variable searchCity
        var SearchHistory = JSON.parse(localStorage.getItem("searchCity"));

        if(SearchHistory == null) {
            localStorage.setItem('searchCity', JSON.stringify(searchCity));

        } else
        {   

            localStorage.setItem('searchCity', JSON.stringify(searchCity))
            SearchHistory.unshift(searchElement);
            localStorage.setItem("searchCity", JSON.stringify(SearchHistory) )
        }
  
        displayWeatherInfo(cityName, lat, lon, apiKey); 
 })
};


// function to display the current weather info and the forecast
function displayWeatherInfo(cityName, lat, lon, apiKey){
    var units ="imperial";
    var unitWind = " MPH";
    var unitTemp = "F";
    var queryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=" + units + "&exclude=hourly,minutely,alerts" + "&appid="+apiKey;
    $.ajax({
        url: queryUrl,
        method: "GET"
      }).done(function(response) {
          var currentTemperature = response.current.temp;
          var currentHumidity = response.current.humidity +"%";
          var currentWindSpeed = response.current.wind_speed + unitWind;
          var currentUVI = response.current.uvi;
          var currentWeatherIconCode = response.current.weather[0].icon;
          var currentWeatherIconDesc = response.current.weather[0].description;
          var iconURLPre = "http://openweathermap.org/img/wn/";
          var iconURLSuf = "@2x.png";
          var currentWeatherIconUrl = iconURLPre + currentWeatherIconCode + iconURLSuf;
          var curDate= new Date (parseInt(response.current.dt) * 1000);
          var curDateMonth = curDate.getMonth() + 1 ;
          var currentDate = curDateMonth + "/" + curDate.getDate() + "/" + curDate.getFullYear();

        //to Color the Uv index value
          var uvIndexcolor = "";
          if (currentUVI<5) {
            uvIndexcolor = "green";
          }else if (currentUVI>=7) {
            uvIndexcolor = "red";
          }else {
            uvIndexcolor = "yellow";
          }
  
         //Contruct HTML for the current weather 
          currentWeatherHtml = "<h1>" + cityName + " (" + currentDate + ")</h1><img src='"+ currentWeatherIconUrl + "' alt='" + currentWeatherIconDesc + "'>";
          currentWeatherHtml += "<ul><li>Temperature: " + currentTemperature + " &#176" + unitTemp +"</li>";
          currentWeatherHtml += "<li>Humidity: " + currentHumidity + "</li>";
          currentWeatherHtml += "<li>Wind Speed: " + currentWindSpeed + "</li>";
          currentWeatherHtml += "<li class='"+uvIndexcolor+"'>UV Index: <span> "+ currentUVI + "</span></li></ul>";
          $("#current-weather-display").html(currentWeatherHtml);

          //Get forecast data
          var forecast = [];

          for(i=1; i<6; i++){
            var sumTemperature = parseInt(response.daily[i].temp.max) +  parseInt(response.daily[i].temp.min);
            var temperature = sumTemperature/2;
            var humidity =  response.daily[i].humidity;
            var weatherIconUrl = iconURLPre + response.daily[i].weather[0].icon + iconURLSuf;
            var weatherIconDesc = response.daily[i].weather[0].description;
            var dateUnix = parseInt(response.daily[i].dt);
            var datef = new Date( dateUnix * 1000);
            var datefMonth = datef.getMonth() + 1; 
            var forcastDate = datefMonth + "/" + datef.getDate() + "/" + datef.getFullYear();      
            forecast.push({Date: forcastDate, temperature: temperature, humidity: humidity, iconUrl: weatherIconUrl, iconDesc: weatherIconDesc});

          }

          //construct html for forecast
          forecastHtml = "<h2>5-Days Forecast:</h2><ul class='Forecast'>";
          for(i=0; i<5; i++) {
            forecastHtml += "<li><h3>" + forecast[i].Date + "</h3>";
            forecastHtml += "<img src='"+ forecast[i].iconUrl + "' alt='" + forecast[i].iconDesc + "'>";
            forecastHtml +=  "<p>Temp: " + forecast[i].temperature + " &#176" + unitTemp + "</p><br/><p>Humidity: " + forecast[i].humidity + "%</p>";

          }
          $("#forecast").html(forecastHtml);

      })
    
    };


