
// onClick function for weather search by city name 
$("#searchWeatherBtn").on("click", function(event){
    event.preventDefault();
  
// takes the city name from the textbox #searchWeather
    var cityName = $("#searchWeather").val().trim();
    var apiKey = '4354bae4bc4f80de34b0ce15453d2200';
    console.log(cityName);

    var searchParm = getCityGeoLocation (cityName, apiKey);
    //displayWeatherInfo(apiKey);

})

 function getCityGeoLocation (cityName, apiKey) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+ apiKey;
    //var lon;
    //var lat;
    var searchParm = [];

    //call the openweather api to get the city geolocation
    $.ajax({
        url: queryURL,
        method: "GET"
      }).done(function(response) {
          console.log(response);
        // get the longitute and latitude of the city
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var cityName = response.name;
        var searchParm = [cityName, lat, lon];
        var searchCity = [{'Name' : cityName, 'lat': lat, 'lon': lon, 'Exec': 1}];

        //Parse any JSON previosly stored in the variable existingEntries
        var existingEntries = JSON.parse(localStorage.getItem("searchCity"));
        console.log(existingEntries);
        //console.log(existingEntries.name);

        if(existingEntries == null) {
            //existingEntries = [];
            localStorage.setItem('searchCity', JSON.stringify(searchCity));

        } else
        {   

            localStorage.setItem('searchCity', JSON.stringify(searchCity))
            existingEntries.unshift(searchCity);
            localStorage.setItem("searchCity", JSON.stringify(existingEntries) )
        }


               displayWeatherInfo(searchParm, apiKey);
    
 })

};

function displayWeatherInfo(searchParm, apiKey){
    var cityName = searchParm[0];
    var lat = searchParm[1];
    var lon = searchParm[2];
    var units ="imperial";
    var unitWind = " MPH";
    var unitTemp = "F";
    var queryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=" + units + "&exclude=hourly,minutely,alerts" + "&appid="+apiKey;
    //var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+ apiKey;
    //call the openWeather API
    $.ajax({
        url: queryUrl,
        method: "GET"
      }).done(function(response) {
          console.log(response);

          var currentTemperature = response.current.temp;
          var currentHumidity = response.current.humidity +"%";
          var currentWindSpeed = response.current.wind_speed + unitWind;
          var currentUVI = response.current.uvi;
          var currentWeatherIconCode = response.current.weather[0].icon;
          var currentWeatherIconDesc = response.current.weather[0].description;
          var iconURLPre = "http://openweathermap.org/img/wn/";
          var iconURLSuf = "@2x.png";
          var currentWeatherIconUrl = iconURLPre + currentWeatherIconCode + iconURLSuf;
          //var weatherId = JSON.stringify(response.weather[0].id);
          //var iconGroup = weatherId.charAt(0);
          var curDate= new Date (parseInt(response.current.dt) * 1000);
          var curDateMonth = curDate.getMonth() + 1 ;
          var currentDate = curDateMonth + "/" + curDate.getDate() + "/" + curDate.getFullYear();

          //var CurrentDateUsF =  CurrentDate.toLocaleDateString("en-US");

          currentWeatherHtml = "<h1>" + cityName + " (" + currentDate + ")</h1><img src='"+ currentWeatherIconUrl + "' alt='" + currentWeatherIconDesc + "'>";
          currentWeatherHtml += "<ul><li>Temperature: " + currentTemperature + "&#176" + unitTemp +"</li>";
          currentWeatherHtml += "<li>Humidity: " + currentHumidity + "</li>";
          currentWeatherHtml += "<li>Wind Speed: " + currentWindSpeed + "</li>";
          currentWeatherHtml += "<li>UV Index: "+ currentUVI + "</li></ul>";
          $("#current-weather-display").html(currentWeatherHtml);

          var forecast = [];

          for(i=1; i<6; i++){
            var sumTemperature = parseInt(response.daily[i].temp.max) +  parseInt(response.daily[i].temp.min);
            var temperature = sumTemperature/2;
            console.log(temperature)
            var humidity =  response.daily[i].humidity;
            var weatherIconUrl = iconURLPre + response.daily[i].weather[0].icon + iconURLSuf;
            var weatherIconDesc = response.daily[i].weather[0].description;
            var dateUnix = parseInt(response.daily[i].dt);
            var datef = new Date( dateUnix * 1000);
            var datefMonth = datef.getMonth() + 1; 
            var forcastDate = datefMonth + "/" + datef.getDate() + "/" + datef.getFullYear();   
            console.log(forcastDate);    
            forecast.push({Date: forcastDate, temperature: temperature, humidity: humidity, iconUrl: weatherIconUrl, iconDesc: weatherIconDesc});

          }

          console.log(forecast);

          forecastHtml = "<h2>5-Days Forecast:</h2><ul class='Forecast'>";

          for(i=0; i<5; i++) {
            forecastHtml += "<li><h3>" + forecast[i].Date + "</h3>";
            forecastHtml += "<img src='"+ forecast[i].iconUrl + "' alt='" + forecast[i].iconDesc + "'>";
            forecastHtml +=  "<p>Temp: " + forecast[i].temperature + "&#176" + unitTemp + "</p><br/><p>Humidity: " + forecast[i].humidity + "%</p>";
            //console.log(forecastHtml)

          }

          $("#forecast").html(forecastHtml);
 


      })
    
    }