const apiUrl = 'https://api.openweathermap.org/data/2.5/';
const geoApiUrl = 'http://api.openweathermap.org/geo/1.0/direct'
const apiKey = '';

$(document).ready(function () {
    $("#searchCity").submit(getCity);
})

function getCity() {
    const cityState = this.city.value;
    const url = geoApiUrl + `?q=${cityState}&limit=1&appid=${apiKey}`;
    
    $.ajax({
            url: url,
            type: "GET",
            success: function (result) {
                console.log(result);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }