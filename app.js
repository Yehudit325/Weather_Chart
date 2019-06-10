
let myLocation = {city:'Tel Aviv', lat: 32.0879122, long: 34.7272058};

let dates = [];

let temperatures = [];

let pointsColor = [];

let thresholdValue = 20;
let threshold = [];

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
            pointBackgroundColor: pointsColor,
            pointBorderColor: pointsColor,
            borderColor: 'rgb(26, 83, 255)',
            data: temperatures
        },
        {
            label: 'Threshold Line', // CHECK: add as annotation (chart.js plugin)
            fill: false,
            pointRadius: 0,
            borderColor: 'rgb(128, 128, 128)',
            borderDash: [10,5],
            data: threshold
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
    .then(data => handleWeather(data))
    .catch(error => console.error('Error:', error));
};

function handleWeather(weather) {
    let avgTemp = (weather.daily.data[0].temperatureHigh + weather.daily.data[0].temperatureLow)/2;
    avgTemp = Number(avgTemp.toFixed(2));
    temperatures.push(avgTemp);

     // CHECK: if possible to add after all requests have been made and not per request (Promise.all() ???)
    markPoints(avgTemp);
    threshold.push(thresholdValue);
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

function fillChartData() {
    for (let i = 0; i < dates.length; ++i) {
        getWeatherData(dates[i]);
    }
}

function markPoints(point) {
        if (point >= thresholdValue) {
            pointsColor.push('rgb(255, 0, 0)');
        } else {
            pointsColor.push('rgb(26, 83, 255)');
        }
};

function processData() {
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    thresholdValue = document.getElementById("thresholdVal").value;
    fillDates(startDate, endDate);
    fillChartData();

    console.log(startDate,endDate);
    console.log("threshold value: " + thresholdValue);
}

document.getElementById("process").addEventListener('click', processData);

document.addEventListener("keydown", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("process").click();
    }
  });

// fillDates("2016-03-03", "2016-03-10");

// fillChartData();
