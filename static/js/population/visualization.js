// d is the common name of a datum
// g is an SVG element it's a container used to group other SVG elements

var provinceToPopulationMap;

var WIDTH = 960,
    HEIGHT = 500;

var projection = d3.geo.mercator()
        .scale(2300)
        .center([0, 40])
        .translate([WIDTH / 2, HEIGHT / 2]);

var path = d3.geo.path()
        .projection(projection);

var svg = d3.select("body").append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);
queue()
    .defer(d3.json, "/data/population/spain_with_provinces.topojson.json")
    .defer(d3.json, "/api/v1/population/2015?apikey=multiPlan_C4_sos-2016-02-vg_ag")
    .await(ready);

function ready(error, es, population) {
    if (error) throw error;

    provinceToPopulationMap = {};
    population.forEach((d) => { provinceToPopulationMap[d.province] = d.number; });

    console.log(provinceToPopulationMap);
    svg.append("g")
        .attr("class", "provinces")  // g node will have this class
        .selectAll("path")
          .data(topojson.feature(es, es.objects.provincias).features)
        .enter().append("path")
          .attr("d", path)
        .style("fill", (d) => {
            return colorFromPopulation(d, provinceToPopulationMap);
        })
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseout", mouseOut);
}

var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("display", "none");

function mouseMove(d) {
    var province = d.properties.nombre;
    var population = provinceToPopulationMap[province];
    if (population == undefined) population = "N/A";

    tooltip.text(province + ": " + population)
        .style("left", (d3.event.pageX - 34) + "px")
        .style("top", (d3.event.pageY - 12) + "px");
}

function mouseOver() { tooltip.style("display", "inline"); }
function mouseOut() { tooltip.style("display", "none"); }

function colorFromPopulation(province, populationData) {
    population = provinceToPopulationMap[province.properties.nombre];
    if (population == undefined) return '#989898'; // no data
    return quantize(population);
}

// maps arbitrary slices of a continuous domain to discrete values in the range
var quantize = d3.scale.threshold()
// data range is from 1000 to 2000
        .domain([1000, 1250, 1500, 1750, 2000])
        .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);
