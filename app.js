
let location = {lat: 32.0879122, long: 34.7272058};

let dates = [];

let temperatures = [];

let threshold;

// let dataset = { 
//                 xAxis: dates,
//                 yAxis:[],
//                 threshold: x
//               };
              

let URL = `https://api.darksky.net/forecast/e2022fecdf5a40b65981825532c796c0/${location.lat},
            ${location.long},${date}T12:00:00?exclude=currently,flags,hourly&units=si`;

function apiRequest() {
    return fetch(URL).then(response => response.json())
    .then(data => handle(data))
    .catch(error=>console.log(error));
};

function handle() {

}

// make sure startDate < endDate
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

// fillDates("2016-02-03", "2016-06-30");
// console.log(dates);


var ctx = document.getElementById('lineChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'My First dataset',
            fill: false,
            lineTension: 0.1,
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45]
        }]
    },

    // Configuration options go here
    options: {}
});