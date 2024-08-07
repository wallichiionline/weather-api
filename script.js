const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const geoApiUrl = 'http://api.openweathermap.org/geo/1.0/direct';
const iconUrl = 'https://openweathermap.org/img/wn/';
const apiKey = 'ce6dab24fd77f68b102310811bd3a6b5';

const history = JSON.parse(localStorage.getItem("history")) || [];

$(document).ready(function () {
    $("#searchCity").submit(getCity);
    displayHistory();
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
                const city = {
                    cityname: cityState,
                    lat: result[0].lat,
                    lon: result[0].lon,
                };
                
                saveToHistory(city);
            },
            error: function (error) {
                console.log(error);
            }
        });
}

function saveToHistory(city){
    const hi = history.find(x=> x.lat == city.lat && x.lon == city.lon)
    if (hi == undefined){
        history.push(city);
        localStorage.setItem("history", JSON.stringify(history));
        displayHistory();
    }
};

function displayHistory(){
    const ul = $('<ul>', {
        class: 'list-group'
    })
    $.each(history, function (h){
        let a =$('<a>')

        a.click(function(){getWeather(history[h].lat, history[h].lon)});
        a.html(history[h].cityname);
        a.attr('lat', history[h].lat);
        a.attr('lon', history[h].lon);
        $('<li>',{
            class: 'list-group-item',
            lat: history[h].lat,
            lon: history[h].lon,
            html: a,
        }).appendTo(ul);
    })
    $("#history").empty();
    ul.appendTo("#history");
};

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
    $("#loc").html(result.city.name);
    $("#date").html(new Date(result.list[0].dt * 1000).toLocaleDateString());
    $("#humidity").html(result.list[0].main.humidity + "% humidity");
    $("#wind").html('Wind:' + result.list[0].wind.speed + ' ' + convertWindDirection(result.list[0].wind.deg));
    $("#icon").attr('src', iconUrl + result.list[0].weather[0].icon + "@2x.png");


    let histInd = 7;
    for(let i=2; i<=6; i++) {
    const card = $("#"+i);
    card.empty();
            let h = $('<h3>');
            let span = $('<span>', {
                html: new Date(result.list[histInd].dt * 1000).toLocaleDateString()
            }).appendTo(h);
    h.appendTo(card);
    
    span = $('<img>');
    span.attr('src', iconUrl + result.list[histInd].weather[0].icon + "@2x.png")
    span.appendTo(card);
    
    span = $('<p>', {
                html: result.list[histInd].main.temp + "\u00B0 F"
            }).appendTo(card);
    
            span = $('<p>', {
                html: result.list[histInd].main.humidity + "% humidity"
            }).appendTo(card);
    
            span = $('<p>', {
                html: 'Wind:' + result.list[histInd].wind.speed + ' ' + convertWindDirection(result.list[0].wind.deg)
            }).appendTo(card);
            
            histInd = histInd + 8;
}
}
function convertWindDirection(deg) {
    let direction = [ "N", "NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N" ];
    const simpleDeg = deg % 360;
    const index = Math.round(simpleDeg / 22.5, 0)+1;
    return direction[index];
}
