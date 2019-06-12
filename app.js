
let myLocation = {city:'Tel Aviv', lat: 32.0879122, long: 34.7272058};

let dataset = { 
                dates: [],
                temperatures: [],
                pointsColor: [],
                thresholdValue: 0,
                threshold: []
              };


    let ctx = document.getElementById('lineChart').getContext('2d');
    let chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: dataset.dates,
        datasets: [{
            label: myLocation.city,
            fill: false,
            lineTension: 0.1,
            pointBackgroundColor: dataset.pointsColor,
            pointBorderColor: dataset.pointsColor,
            borderColor: 'rgb(26, 83, 255)',
            data: dataset.temperatures
        },
        {
            label: 'Threshold Line', // CHECK: add as annotation (chart.js plugin)
            fill: false,
            pointRadius: 0,
            borderColor: 'rgb(128, 128, 128)',
            borderDash: [10,5],
            data: dataset.threshold
        }]
    },

    // Configuration options go here
    options: {}
    });


function urlString(date) {
    return "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/e2022fecdf5a40b65981825532c796c0/" + myLocation.lat + ","
             + myLocation.long + "," + date + "T12:00:00?exclude=currently,flags,hourly&units=si";
}

function checkTimeout(ms, promise) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error("timeout"))
      }, ms)
      promise.then(resolve, reject)
    })
  }

function getWeatherData(url) {
    return new Promise((resolve, reject) => {
        checkTimeout(2000, fetch(url)
      .then(response => response.json())
      .then(data => {
          handleWeather(data);
          resolve(data);
      })
      .catch(error => console.error('Error:', error))
    )});
  }

function handleWeather(weather) {
    let avgTemp = (weather.daily.data[0].temperatureHigh + weather.daily.data[0].temperatureLow)/2;
    avgTemp = Number(avgTemp.toFixed(2));
    dataset.temperatures.push(avgTemp);

    dataset.threshold.push(dataset.thresholdValue);
    markPoints(avgTemp);
    chart.update(); 
}

async function fillChartData() {
    for (let i = 0; i < dataset.dates.length; ++i) {
      let value = await getWeatherData(urlString(dataset.dates[i]));
    }
    // chart.update();
  }


function fillDates(startDate, endDate) {
    const from = new Date(startDate);
    const to = new Date(endDate);
    
    // loop for every day
    for (let day = from; day <= to; day.setDate(day.getDate() + 1)) {   
        dataset.dates.push(day.getFullYear() + "-" 
                    + ("0"+(day.getMonth()+1)).slice(-2) + "-"
                    + ("0" + day.getDate()).slice(-2));
    }
}

function markPoints(point) {
    if (point >= dataset.thresholdValue) {
        dataset.pointsColor.push('rgb(255, 0, 0)');
    } else {
        dataset.pointsColor.push('rgb(26, 83, 255)');
    };   
}

// ADD: functionality - reset only if dates have changed
function reset() {
    chart.reset();
    dataset.dates.length = 0;
    dataset.temperatures.length = 0;
    dataset.pointsColor.length = 0;
    dataset.threshold.length = 0;
}

function processData() {
    reset();
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    // Validate dates
    if (startDate > endDate) {
        alert("Dates are not valid, please enter end date greater than start date");
        return;
    }

    dataset.thresholdValue = document.getElementById("thresholdVal").value;
    // check threshold value not too high or too low
    if (dataset.thresholdValue > 50 || dataset.thresholdValue < -40) {
        alert("Please enter threshold value within range (-40 - 50)");
        return;
    }

    fillDates(startDate, endDate);
    fillChartData();  
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
