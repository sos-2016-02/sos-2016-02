// Heavily based on https://bl.ocks.org/mbostock/1b64ec067fcfc51e7471d944f51f1611
// License: GNU GPLv3

// WARNING: I've added a lot of mess to the orignal code to adapt it
// a big refactor has yet to be done

var BIKE_STATION_DATA_URL = "/api/proxy/citybikes/v2/networks/sevici";

// lattice size
var n = Math.ceil(Math.sqrt(257));

var nodes;
var links = [];

var canvas,
    context,
    width,
    height,
    latticeStartPositionX,
    latticeStartPositionY;
var simulation;
var tooltip;

// document ready
document.addEventListener("DOMContentLoaded", function(event) {
    // download data and display it
    queue()
        .defer(d3.json, BIKE_STATION_DATA_URL)
        .await(ready);
});

function ready(error, bikeStationsData) {
    if (error) {
        console.error(error);
        window.alert("Something went wrong when retreiving the data, see the console");
        return;
    }

    tooltip = d3.select(".tooltip");
    var stations = bikeStationsData.network.stations;
    createNodesAndLinks(stations);
    drawLattice();
}

function createNodesAndLinks(stations) {
    nodes = d3.range(n * n).map(function(i) {
        if (stations[i] != undefined) {
            var nodeSize = nodeSizeScale(stations[i].free_bikes);
        }
        return {
            index: i,
            stationData: stations[i],
            nodeSize: nodeSize
        };
    });

    for (var y = 0; y < n; ++y) {
        for (var x = 0; x < n; ++x) {
            if (y > 0) links.push({source: (y - 1) * n + x, target: y * n + x});
            if (x > 0) links.push({source: y * n + (x - 1), target: y * n + x});
        }
    }
}


function drawLattice() {
    canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width,
    height = canvas.height;
    latticeStartPositionX = width / 3.2;
    latticeStartPositionY = height / 2.5;

    d3.select(canvas)
        .call(d3.drag()
            .container(canvas)
            .subject(dragsubject)
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-30))
        .force("link", d3.forceLink(links).strength(1).distance(20).iterations(10))
        .on("tick", ticked);
}

function ticked() {
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(latticeStartPositionX, latticeStartPositionY);

    context.beginPath();
    links.forEach(drawLink);
    context.strokeStyle = "#aaa";
    context.stroke();

    context.beginPath();
    nodes.forEach(drawNode);
    context.fill();
    context.strokeStyle = "#fff";
    context.stroke();

    context.restore();
}

function dragsubject() {
    return simulation.find(d3.event.x - latticeStartPositionX,
                           d3.event.y - latticeStartPositionY);
}

var TOOLTIP_OFFSET_WITH_MOUSE_X = 80;
var TOOLTIP_OFFSET_WITH_MOUSE_Y = 60;

function dragstarted() {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    simulation.fix(d3.event.subject);

    var station = d3.event.subject.stationData;
    if (station == undefined) return;

    var name = "name: " + station.name;
    var freeBikes = "free bikes: " + station.free_bikes;
    tooltip
        .style("display", "inline-block")
        .style("left", (d3.event.sourceEvent.layerX - TOOLTIP_OFFSET_WITH_MOUSE_X) + "px")
        .style("top", (d3.event.sourceEvent.layerY - TOOLTIP_OFFSET_WITH_MOUSE_Y) + "px");
    tooltip
      .select("#name")
        .text(name);
    tooltip
      .select("#free-bikes")
        .text(freeBikes);
}

function dragged() {
    simulation.fix(d3.event.subject, d3.event.x, d3.event.y);
    tooltip
        .style("left", (d3.event.sourceEvent.layerX - TOOLTIP_OFFSET_WITH_MOUSE_X) + "px")
        .style("top", (d3.event.sourceEvent.layerY - TOOLTIP_OFFSET_WITH_MOUSE_Y) + "px");
}

function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0);
    simulation.unfix(d3.event.subject);
    tooltip.style("display", "none");
}

function drawLink(d) {
    context.moveTo(d.source.x, d.source.y);
    context.lineTo(d.target.x, d.target.y);
}

function drawNode(d) {
    if (d.stationData == undefined) return;
    context.moveTo(d.x + d.nodeSize, d.y);
    context.arc(d.x, d.y, d.nodeSize, 0, 2 * Math.PI);
}

var nodeSizeScale = d3.scaleLinear()
        .domain([0, 25])
        .range([3, 7]);
