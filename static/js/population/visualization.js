// d is the common name of a datum
// g is and SVG element it's a container used to group other SVG elements
var width = 960,
    height = 500;

var projection = d3.geo.mercator()
        .scale(2300)
        .center([0, 40])
        .translate([width / 2, height / 2]);

var path = d3.geo.path()
        .projection(projection);

var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
queue()
    .defer(d3.json, "/data/population/spain_with_provinces.topojson.json")
    .defer(d3.json, "/data/population/population.json")
    .await(ready);

var provinceNameToPopulationMap;
function ready(error, es, population) {
    if (error) throw error;

    provinceNameToPopulationMap = {};
    population.forEach((d) => { provinceNameToPopulationMap[d.province] = d.number; });

    console.log(provinceNameToPopulationMap);
    svg.append("g")
        .attr("class", "provinces")  // g node will have this class
        .selectAll("path")
          .data(topojson.feature(es, es.objects.provincias).features)
        .enter().append("path")
          .attr("d", path)
        .style("fill", function(d) {
            return colorFromPopulation(d, provinceNameToPopulationMap);
        });

}

function colorFromPopulation(province, populationData) {
    population = provinceNameToPopulationMap[province.properties.nombre];
    if (population == undefined) return '#989898'; // no data
    return colorQuantizer(population);
}

// maps arbitrary slices of a continuous domain to discrete values in the range
var colorQuantizer = d3.scale.threshold()
// data range is from 1000 to 2000
        .domain([1000, 1250, 1500, 1750, 2000])
        .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);
