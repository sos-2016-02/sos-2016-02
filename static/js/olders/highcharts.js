var vAPIversion = "v1";
var vAPIname    = "olders";
var vApiKeyRead = "multiPlan_C4_sos-2016-02-mac_ag";

var vDataCategories = [];
var vDataSeries     = [];

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
    getData(data);
    showGraph();
  });
}

function getData(data){
  var vMen   = [];
  var vWomen = [];

  $.each(data, function(){
      vDataCategories.push(this.province);
      vMen.push(this.men);
      vWomen.push(this.women);
  });

  var vDataMen = {};
  vDataMen.name = 'men';
  vDataMen.data = vMen;
  vDataSeries.push(vDataMen);

  var vDataWomen = {};
  vDataWomen.name = 'women';
  vDataWomen.data = vWomen;
  vDataSeries.push(vDataWomen);
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
          text: 'Population of men and women 18 years old.'
      },
      subtitle: {
          text: 'Source: ine.es'
      },
      xAxis: {
          categories: vDataCategories,
          crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Total of persons'
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