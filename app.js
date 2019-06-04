let URL = `https://api.darksky.net/forecast/e2022fecdf5a40b65981825532c796c0/${location.lat},
            ${location.long},${date}T12:00:00?exclude=currently,flags,hourly&units=si`;

let dataset = { 
                xAxis:[],
                yAxis:[],
                threshold: x
              };
              
let location = {lat: 32.0879122, long: 34.7272058};

function apiRequest() {
    return fetch(URL).then(response => response.json())
    .then(data => handle(data));
};

function handle() {

}
    


