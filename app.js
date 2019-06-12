/****************************************************
 *               Variable Declarations              *
 ****************************************************/

let myLocation = {city:'Tel Aviv', lat: 32.0879122, long: 34.7272058};

let dateRange = {startDate: "", endDate: ""};

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

/****************************************************
 *               Function Declarations              *
 ****************************************************/

function urlString(date) {
    return "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/e2022fecdf5a40b65981825532c796c0/" + myLocation.lat + ","
             + myLocation.long + "," + date + "T12:00:00?exclude=currently,flags,hourly&units=si";
}

// Function to check timeout errors of a promise
function checkTimeout(ms, promise) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("timeout"))
      }, ms)
      promise.then(resolve, reject)
    })
}

function getWeatherData(url) {
    return new Promise((resolve, reject) => {
        checkTimeout(5000, fetch(url)
      .then(response => response.json())
      .then(data => {
          handleWeatherData(data);
          resolve(data);
      })
      .catch(error => console.error('Error:', error))
    )});
}

  // Recives the data from the api requests and fills the dataset accordingly
function handleWeatherData(weather) {
    let avgTemp = (weather.daily.data[0].temperatureHigh + weather.daily.data[0].temperatureLow)/2;
    avgTemp = Number(avgTemp.toFixed(2));
    dataset.temperatures.push(avgTemp);

    dataset.threshold.push(dataset.thresholdValue);
    markPoints(avgTemp);
    chart.update(); 
}

/* Makes multiple api calls for dates within the date range entered.
 * Each api calls waits for the previous one to finish so to keep data 
 * recieved in the correct order.
 */
async function fillChartData() {
    for (let i = 0; i < dataset.dates.length; ++i) {
      let value = await getWeatherData(urlString(dataset.dates[i]));
    }
}

/* Takes the range entered by user and spreads it out into an array,
 * so that the data can be used for obtaining each url individualy
 */
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

// Marks the points above the threshhold line
function markPoints(point) {
    if (point >= dataset.thresholdValue) {
        dataset.pointsColor.push('rgb(255, 0, 0)');
    } else {
        dataset.pointsColor.push('rgb(26, 83, 255)');
    };   
}

function updateThreshold(value) {
    dataset.thresholdValue = value;
    dataset.threshold = Array(dataset.temperatures.length).fill(value);
    chart.data.datasets[1].data = dataset.threshold;
    //update marked points
    dataset.pointsColor.length = 0;
    for (let i = 0; i < dataset.temperatures.length; ++i) {
        markPoints(dataset.temperatures[i]);
    }
    chart.data.datasets[0].pointBackgroundColor = dataset.pointsColor;
    chart.data.datasets[0].pointBorderColor = dataset.pointsColor;

    chart.update();
}

function reset() {
    chart.reset();
    dataset.dates.length = 0;
    dataset.temperatures.length = 0;
    dataset.pointsColor.length = 0;
    dataset.threshold.length = 0;
}

// Process data entered by user
function processData() {
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    let thresholdValue = document.getElementById("thresholdVal").value;
    
    // Validate dates
    if ((startDate > endDate) || startDate === "" || endDate === "") {
        alert("Please enter valid dates");
        return;
    }

    // check threshold value not too high or too low
    if (thresholdValue > 50 || thresholdValue < -40) {
        alert("Please enter threshold value within range (-40 - 50)");
        return;
    }

    /* Check if dates have changed - run all
     * if only threshold is changed - do not recall all apis per date,
     * just update threshold line if dates and threshold do not change - do nothing
     */
    if (startDate != dateRange.startDate || endDate != dateRange.endDate) {
        reset();
        dataset.thresholdValue = thresholdValue;
        dateRange.startDate = startDate;
        dateRange.endDate = endDate;

        fillDates(startDate, endDate);
        fillChartData(); 
    } else if (thresholdValue != dataset.thresholdValue) {
        updateThreshold(thresholdValue);
    }
}

/****************************************************
 *                  Event Listeners                 *
 ****************************************************/

document.getElementById("process").addEventListener('click', processData);

document.addEventListener("keydown", (event) => {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("process").click();
    }
});
