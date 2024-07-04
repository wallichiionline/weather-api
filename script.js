const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const geoApiUrl = 'http://api.openweathermap.org/geo/1.0/direct';
const iconUrl = 'https://openweathermap.org/img/wn/';
const apiKey = 'e6dab24fd77f68b102310811bd3a6b5';

const history = JSON.parse(localStorage.getItem("history")) || [];

$(document).ready(function () {
    $("#searchCity").submit(getCity);
})

function getCity(event) {
    event.preventDefault()
    const cityState = this.city.value;
    const url = geoApiUrl + `?q=${cityState}&limit=1&appid=${apiKey}`;
    
    $.ajax({
            url: url,
            type: "GET",
            success: function (result) {
                console.log(result);
                getWeather(result[0].lat, result[0].lon);
            },
            error: function (error) {
                console.log(error);
            }
        });
}

function getWeather(lat, lon){
    $.ajax({
        url: apiUrl,
        type: "GET",
        data: {
            lat: lat,
            lon: lon,
            units: 'imperial',
            appId: apiKey,
        },

        dataType: "json",

        success: function(result){
            console.log(result);
            displayWeather(result);
        },

        error: function(error){
            console.log("Error");
            console.log(error);
        },
    })
}

function displayWeather(result) {
    $("#temp").html(result.list[0].main.temp + "\u00B0 F");
    $("#city").html(result.city.name);
    $("#date").html(new Date(result.list[0].dt *1000).toLocaleDateString());
    $("#humidity").html(result.list[0].main.humidity + "% humidity");
    $("wind").html('Wind:' + result.list[0].wind.speed + ' ' + convertWindDirection(result.list[0].wind.deg));
    $("#icon").attr('src', iconUrl + result.list[0].weather[0].icon + "@2x.png");
}

function convertWindDirection(deg) {
    let direction = [ "N", "NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N" ];
    const simpleDeg = deg % 360;
    const index = Math.round(simpleDeg / 22.5, 0)+1;
    return direction[index];
}
