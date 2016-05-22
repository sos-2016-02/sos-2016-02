var vURL        = "";
var vApiKeyLSA  = "multiPlan_C4_sos-2016-02-mac_ag";
var vApiKeyOUT  = "multiPlan_C4_sos-2016-01-fjfr";

var vDataCategories_serie1 = [];
var vDataCategories_serie2 = [];
var vDataSeries            = [];

$(document).ready(function() {
  getAllData_serie1("Sevilla");
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
    getAllData_serie2("Brazil");
  });
}

function getData_serie1(data){
  var vMen   = [];

  $.each(data, function(){
      vDataCategories_serie1.push(this.year);
      vMen.push(this.men);
  });

  var vDataMen  = {};
  vDataMen.name = 'MEN';
  vDataMen.data = vMen;
  vDataSeries.push(vDataMen);
}

function getAllData_serie2(pQuery) {
  var vURL    = "/api/v1/oil/" + pQuery + "?apikey=" + vApiKeyOUT;

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
  if (data == "OK") return;

  var vDiesel   = [];
  // inicializamos a 0 tantos valores de la serie 2 como valores tenga la serie 1
  for (i=0 ; i<vDataSeries[0].data.length; i++ ) { vDiesel[i] = 0; }

  $.each(data, function(){
      vDataCategories_serie2.push(this.year);
      //vPopulation.push(this.number);
      //Insertamos en el array vDiesel su valor
      //pero en la misma posición que se corresponda
      //con el año en vDataCategories_serie1 que corresponda.
      vDiesel[vDataCategories_serie1.indexOf(this.year)] = this.diesel*10000;

  });

  var vDataDiesel  = {};
  vDataDiesel.name = 'Oil';
  vDataDiesel.data = vDiesel;
  vDataSeries.push(vDataDiesel);
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
          text: 'Men olders than 18 in Seville + Price of Diesel in Bazil (scaled 10E4)'
      },
      subtitle: {
          text: 'Integration data from diferent groups of SOS'
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