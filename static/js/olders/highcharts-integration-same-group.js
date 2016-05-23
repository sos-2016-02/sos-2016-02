var vURL        = "";
var vApiKeyLSA  = "multiPlan_C4_sos-2016-02-mac_ag";
var vApiKeyOUT  = "multiPlan_C4_sos-2016-02-vg_ag";

var vDataCategories_serie1 = [];
var vDataCategories_serie2 = [];
var vDataSeries            = [];

$(document).ready(function() {
  getAllData_serie1("2015");
});

function getAllData_serie1(pQuery) {
  var vURL    = "/api/v1/olders/" + pQuery + "?apikey=" + vApiKeyLSA;

  var request = $.ajax({
     url        : vURL
    ,type       : "GET"
    ,data       : ""
    ,contentType: "application/json; charset=utf-8"
    ,cache      : false
  });

  request.done(function(data, status, jqXHR){
    getData_serie1(data);
    getAllData_serie2("loadInitialData");
    getAllData_serie2("2015");
  });
}

function getData_serie1(data){
  var vMen   = [];

  $.each(data, function(){
      vDataCategories_serie1.push(this.province);
      vMen.push(this.men);
  });

  var vDataMen  = {};
  vDataMen.name = 'MEN';
  vDataMen.data = vMen;
  vDataSeries.push(vDataMen);
}

function getAllData_serie2(pQuery) {
  var vURL    = "/api/v1/population/" + pQuery + "?apikey=" + vApiKeyOUT;

  var request = $.ajax({
     url        : vURL
    ,type       : "GET"
    ,data       : ""
    ,contentType: "application/json; charset=utf-8"
    ,cache      : false
  });

  request.done(function(data, status, jqXHR){
    getData_serie2(data);
    showGraph();
  });
}

function getData_serie2(data){
  var vPopulation   = [];
  // inicializamos a 0 tantos valores de la serie 2 como valores tenga la serie 1
  for (i=0 ; i<vDataSeries[0].data.length; i++ ) { vPopulation[i] = 0; }

  $.each(data, function(){
      vDataCategories_serie2.push(this.province);
      //vPopulation.push(this.number);
      //Insertamos en el array vPopulation su valor
      //pero en la misma posición que se corresponda
      //con la provincia en vDataCategories_serie1 que corresponda.
      vPopulation[vDataCategories_serie1.indexOf(this.province)] = this.number;

  });

  var vDataPopulation  = {};
  vDataPopulation.name = 'Population';
  vDataPopulation.data = vPopulation;
  vDataSeries.push(vDataPopulation);
}

function showGraph() {
  Highcharts.setOptions({
    colors: ['#0000FF', '#FF0000']
  });

  $('#container').highcharts({
      chart: {
          type: 'column'
      },
      title: {
          text: 'Men olders than 18 years old VS Number of population'
      },
      subtitle: {
          text: 'Integration data from same group of SOS'
      },
      xAxis: {
          categories: vDataCategories_serie1,
          crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Results of integration'
          }
      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
      },
      plotOptions: {
          column: {
              pointPadding: 0.2,
              borderWidth: 0
          }
      },
      series: vDataSeries
  });

}