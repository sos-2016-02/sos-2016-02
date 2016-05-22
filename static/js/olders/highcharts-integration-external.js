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
    getAllData_serie2();
  });
}

function getData_serie1(data){
  vDataCategories_serie1.push("Sevilla");

  var vPeople      = [];
  $.each(data, function(){
      vPeople.push(Math.abs(this.men-this.women));
  });

  var vDataPeople  = {};
  vDataPeople.name = 'PEOPLE';
  vDataPeople.data = vPeople;
  vDataSeries.push(vDataPeople);
}

function getAllData_serie2() {
  var vURL    = "/api/proxy/club-rural/api.php?claveapi=" + vApiKeyOUT + "&type=provincias&idprov=41";

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
  vAlojamiento[0]    = parseInt( data.getElementsByTagName('count')[0].firstChild.nodeValue );
  
  var a = this.count;

  var vDataDiesel    = {};
  vDataDiesel.name   = 'RURAL HOUSES';
  vDataDiesel.data   = vAlojamiento;
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
          text: 'Difference Men/Women olders than 18 + Number of Rural Houses'
      },
      subtitle: {
          text: 'Integration data from external data'
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