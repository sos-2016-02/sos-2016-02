"use strict";

var ONE_PROVINCE_POPULATION_HISTORY_URL =
        "/api/v1/population/Sevilla?apikey=multiPlan_C4_sos-2016-02-vg_ag";
var SPAIN_POPULATION_IO_HISTORY_URL =
        "/api/proxy/population-io/1.0/population/Spain/20/?format=json";


var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// document ready
document.addEventListener("DOMContentLoaded", function(event) {
    // download data and display it
    queue()
        .defer(d3.json, ONE_PROVINCE_POPULATION_HISTORY_URL)
        .defer(d3.json, SPAIN_POPULATION_IO_HISTORY_URL)
        .await(ready);
});

function ready(error, oneProvincePopulationHistory, spainPopulationHistory) {
    if (error) {
        console.log(error);
        window.alert("Something went wrong when retreiving the data, see the console");
        return;
    }
    var data = extractData(oneProvincePopulationHistory, spainPopulationHistory);
    drawLineChart(data);
}

// computed by extractData() and used by extractData() and drawLineChart()
var yearInterval;

function extractData(oneProvincePopulationHistory, spainPopulationHistory) {
    var provincePopulationValues = extractProvincePopulationValues(oneProvincePopulationHistory);
    var countryPopulationValues= extractCountryPopulationValues(spainPopulationHistory);

    var populationYears = provincePopulationValues.map((value) => { return value.year; });
    yearInterval = d3.extent(populationYears);
    countryPopulationValues = removeYearsOutOfInterval(countryPopulationValues, yearInterval);

    // each object is one of the two series
    // each value is an object containing a year and a population number
    return [
        {
            name: oneProvincePopulationHistory[0].province,
            values: provincePopulationValues
        },
        {
            name: "Spain",
            values: countryPopulationValues
        }
    ];
}

function drawLineChart(data) {
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    color.domain(["Spain", "Sevilla"]);

    var maxPopulation = d3.max(data[1].values.map((value) => { return value.population; }));
    var populationInterval = [0, maxPopulation];

    x.domain(yearInterval);
    y.domain(populationInterval);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Population");

    var location = svg.selectAll(".location")
        .data(data)
      .enter().append("g")
        .attr("class", "location");

    location.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });

    location.append("text")
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) {
            return "translate(" + x(d.value.year) + "," + y(d.value.population) + ")";
        })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

}

function extractProvincePopulationValues(populationHistory) {
    return populationHistory.map(formatProvincePopulationDatum);
}

function formatProvincePopulationDatum(datum) {
    return {
        year: parseDate(datum.year.toString()),
        population: datum.number
    };
}

function extractCountryPopulationValues(populationHistory) {
    return populationHistory.map(formatCountryPopulationDatum);
}

function formatCountryPopulationDatum(datum) {
    return {
        year: parseDate(datum.year.toString()),
        population: datum.total
    };
}

function removeYearsOutOfInterval(populationValues, interval) {
    return populationValues.filter((value) => {
        return value.year >= interval[0]
            && value.year <= interval[1];
    });
}

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
        .range([0, width]);

var y = d3.scale.linear()
        .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.population); });
