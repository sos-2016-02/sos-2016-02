//var vServer     = "http://192.168.1.200:3000";
//var vServer     = "http://localhost:3000";
var vServer     = "https://sos-2016-02.herokuapp.com";

var vAPIversion = "v1";
var vAPIname    = "olders";
var vApiKeyRead = "multiPlan_C4_sos-2016-02-mac_ag";

var vDataGraph;

$(document).ready(function() {
  getAllData("loadInitialData");
  getAllData("2015");
});

function getAllData(pQuery) {
  var vApiKey = "?apikey=" + vApiKeyRead;
  var vURL    = obtenerURLBase() + pQuery + vApiKey;

  var request = $.ajax({
     url        : vURL
    ,type       : "GET"
    ,data       : ""
    ,contentType: "application/json; charset=utf-8"
    ,cache      : false
  });

  request.done(function(data, status, jqXHR){
    getData(data, "province", "men");
    showGraph();
  });
}

function getData(data, pFieldHead, pFieldData) {
  //getGoogleArrayFromJSONData
  var array = [[pFieldHead, pFieldData]];
  $.each(data, function(){
      var ProvinceItem = [this[pFieldHead], this[pFieldData]]
      array.push(ProvinceItem);
  });
  vDataGraph = array;
}

function showGraph(){
  google.charts.load('current', {'packages':['geochart']});
  google.charts.setOnLoadCallback(drawRegionsMap);
}

function drawRegionsMap() {
  var data = google.visualization.arrayToDataTable(vDataGraph);
  var options = {
    region: 'ES',
    displayMode: 'markers',
    colorAxis: {colors: ['yellow', 'blue']}
  };
  var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
  chart.draw(data, options);
}