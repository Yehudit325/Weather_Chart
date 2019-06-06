
let myLocation = {city:'Tel Aviv', lat: 32.0879122, long: 34.7272058};

let dates = [];

let temperatures = [];

let threshold;

// let dataset = { 
//                 dates: [],
//                 temeratures: [],
//                 threshold: x
//               };

let ctx = document.getElementById('lineChart').getContext('2d');
let chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: dates,
        datasets: [{
            label: myLocation.city,
            fill: false,
            lineTension: 0.1,
            borderColor: 'rgb(26, 83, 255)',
            data: temperatures
        }]
    },

    // Configuration options go here
    options: {}
});


function getWeatherData(date) {
    // let URL = `https://api.darksky.net/forecast/e2022fecdf5a40b65981825532c796c0/${myLocation.lat},
    //           ${myLocation.long},${date}T12:00:00?exclude=currently,flags,hourly&units=si`;

    let URL = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/e2022fecdf5a40b65981825532c796c0/" + myLocation.lat + ","
                + myLocation.long + "," + date + "T12:00:00?exclude=currently,flags,hourly&units=si";

    return fetch(URL).then(response => response.json())
    .then(data => handle(data))
    .catch(error => console.error('Error:', error));
};

function handle(weather) {
    let avgTemp = (weather.daily.data[0].temperatureHigh + weather.daily.data[0].temperatureLow)/2;
    avgTemp = Number(avgTemp.toFixed(2));
    temperatures.push(avgTemp);
    chart.update();
}

// add feature: check to make sure startDate < endDate
function fillDates(startDate, endDate) {
    const from = new Date(startDate);
    const to = new Date(endDate);
    
    // loop for every day
    for (let day = from; day <= to; day.setDate(day.getDate() + 1)) {   
        dates.push(day.getFullYear() + "-" 
                    + ("0"+(day.getMonth()+1)).slice(-2) + "-"
                    + ("0" + day.getDate()).slice(-2));
    }
}

function fillTemperatures() {
    for (let i = 0; i < dates.length; ++i) {
        getWeatherData(dates[i]);
    }
}

fillDates("2016-03-03", "2016-07-30");
// console.log(dates);

fillTemperatures();
// console.log(temperatures);


// apiRequest("2016-02-03");


