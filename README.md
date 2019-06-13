# Weather Chart Project

This project presents a graph of historical temperatures for Tel Aviv,
with the ability to choose a specific temperature as a static threshold line and inspect the values that exceed it.

## Table of Contents
* [How to use the application](#how-to-use-the-application)
* [Run the application](#run-the-application)
* [Dependencies](#dependencies)
* [Code Overview](#code-overview)
* [Future Development Ideas](#future-development-ideas)
* [Contributing](#contributing)

## How to use the application
1. Enter a range of historical dates up to the current date. 
2. Set a static threshold line to your preference.
3. Press the get data button.
4. Watch the magic happen.

## Run the application
* [Online Link (deployed on Azure)](https://yehuditsapps.z6.web.core.windows.net/)
* [Clone via Github](https://github.com/Yehudit325//Weather_Chart.git)
* [Download a zip file](https://github.com/Yehudit325/Weather_Chart/archive/master.zip)

## Dependencies
* [Chart js](https://www.chartjs.org/)
* [Dark sky API](https://darksky.net/dev)

## Code Overview
* When the 'Get Data' button is pressed the dates are processed and saved in an array which becomes the x-axis on the chart.
* From there each date is sent individually as an API request and the relevant temperatures are received and saved in an array which is the y-axis of the chart.
* The chart is drawn as the responses come in.
* The threshold value as well is translated as data points in a separate dataset on the graph and presented.
* All points above the threshold line are marked accordingly.

## Future Development Ideas
* I would like to add a feature that the user can choose which city to present the data for. The feature would be implemented by receiving the city name via user input and using a geocoding API to get the matching coordinates which would then be sent to the weather API to receive the relevant temperatures.
* A feature to add multiple datasets to the chart (present weather for many cities at once). In order to achieve this, a code refactor is due. Create a class representing a city so that when you wish to add an additional dataset it will be as easy as creating a new object of the class.
* Use the threshold to represent the average temperature or the median. Here the user will not be the one to choose the threshold value, but the value will be dynamic according to the dates chosen.

## Contributing
If you are willing to contribute to this project
you are more than welcome to send a pull request
