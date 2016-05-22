//var vServer     = "http://192.168.1.200:3000";
//var vServer     = "http://localhost:3000";
var vServer     = "https://sos-2016-02.herokuapp.com";
var vURL        = "";
var vApiKeyLSA  = "multiPlan_C4_sos-2016-02-mac_ag";
var vApiKeyOUT  = "5e056c500a1c4b6a7110b50d807bade5";

var vDataCategories_serie1 = [];
var vDataCategories_serie2 = [];
var vDataSeries            = [];

$(document).ready(function() {
  getAllData_serie1("Sevilla/2015");
});

function getAllData_serie1(pQuery) {
  var vURL    = vServer + "/api/v1/olders/" + pQuery + "?apikey=" + vApiKeyLSA;

  var request = $.ajax({
     url        : vURL
    ,type       : "GET"
    ,data       : ""
    ,contentType: "application/json; charset=utf-8"
    ,cache      : false
  });

  request.done(function(data, status, jqXHR){
    getData_serie1(data);
    getAllData_serie2("Brazil");
  });
}

function getData_serie1(data){
  var vPeople   = [];
  vPeople.push(Math.abs(this.men-this.women));
  vDataCategories_serie1.push(2015);
  var vDataPeople  = {};
  vDataPeople.name = 'PEOPLE';
  vDataPeople.data = vPeople;
  vDataSeries.push(vDataPeople);
}

function getAllData_serie2(pQuery) {
  var vURL    = "http://api.clubrural.com/api.php?claveapi=" + vApiKeyOUT + "&type=provincias&idprov=41";

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

  vDataCategories_serie2.push(2015);

  var vAlojamiento   = [];
  //var vAlojamiento[0]=data.length;

  var vDataDiesel    = {};
  vDataDiesel.name   = 'ALOJAMIENTOS';
  vDataDiesel.data   = vAlojamientos;
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