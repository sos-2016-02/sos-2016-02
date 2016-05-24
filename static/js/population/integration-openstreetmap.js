"use strict";
var PROVINCE_POPULATION_URL =
        "/api/v1/population/Sevilla/2015?apikey=multiPlan_C4_sos-2016-02-vg_ag";
// It's an overpass query, which is an API to access OpenStreetMap data
var PROVINCE_CAPITAL_OSM_URL =
`https://overpass-api.de/api/interpreter?data=
[out:json];
node++
[%22name%22=%22Sevilla%22]++
[%22is_in:province%22=%22Sevilla%22]++
[%22place%22=%22city%22]++
%2835.871246850027966,-9.909667968749998,43.96119063892024,5.11962890625%29;
out+body;`;

var WIDTH = 960,
    HEIGHT = 500,
    radius = Math.min(WIDTH, HEIGHT) / 2;

queue()
    .defer(d3.json, PROVINCE_POPULATION_URL)
    .defer(d3.json, PROVINCE_CAPITAL_OSM_URL)
    .await(ready);

function ready(error, provincePopulationData, provinceCapitalOsmObject) {
    if (error) throw error;
    var data = extractData(provincePopulationData, provinceCapitalOsmObject);
    drawPieChart(data);
}

function extractData(provincePopulationData, provinceCapitalOsmObject) {
    var provincePopulation = provincePopulationData.number;
    var provinceCapitalPopulation = provinceCapitalOsmObject.elements[0].tags.population;
    var data = [
        {"name": "Sevilla(province)", "population": provincePopulation},
        {"name": "Sevilla(city)", "population": provinceCapitalPopulation},
    ];
    return data;
}

function drawPieChart(data) {
    var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.population); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.name; });
}


var color = d3.scale.ordinal()
        .range(["#98abc5", "#ff8c00"]);

var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

var labelArc = d3.svg.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.population; });

var svg = d3.select("body").append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT)
        .append("g")
        .attr("transform", "translate(" + WIDTH / 2 + "," + HEIGHT / 2 + ")");
