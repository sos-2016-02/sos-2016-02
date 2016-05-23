var vURL        = "";
var vApiKeyLSA  = "multiPlan_C4_sos-2016-02-mac_ag";
var vApiKeyOUT  = "5e056c500a1c4b6a7110b50d807bade5";

var vDataSerie  = [];

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
  var vElto = [];
  vElto.push('PEOPLE');
  $.each(data, function(){
      vElto.push(Math.abs(this.men-this.women));
  });
  vDataSerie.push(vElto);
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
    setData();
  });
}

function getData_serie2(data){
  if (data == "OK") return;

  var vElto = [];
  vElto.push('RURAL-HOUSES');
  vElto.push( parseInt( data.getElementsByTagName('count')[0].firstChild.nodeValue ) );
  vDataSerie.push(vElto);
}

function setData(){
  asignarPorcentajes();
  vDataSerie.push ({
                    name: 'Proprietary or Undetectable',
                    y: 0.2,
                    dataLabels: {
                        enabled: false
                    }});
  showGraph();
}

function asignarPorcentajes(){
  var valor1 = vDataSerie[0][1];
  var valor2 = vDataSerie[1][1];
  vDataSerie[0][1] = (valor1+valor2) / valor1 * 10;
  vDataSerie[1][1] = (valor1+valor2) / valor2 * 10;
}

function showGraph() {
  Highcharts.setOptions({
    colors: ['#0000FF', '#FF0000']
  });

    $('#container').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: 'People vs<br/>Rural-Houses',
            align: 'center',
            verticalAlign: 'middle',
            y: 40
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%']
            }
        },
        series: [{
            type: 'pie',
            name: 'People vs Rural-Houses',
            innerSize: '50%',
            data: vDataSerie
        }]
    });

}