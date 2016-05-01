var vAPIname;
var vAPIversion;
var vConnection;
var vLimit   = 10;
var vPageNum = 1;

var vServer = "http://192.168.1.200:3000";
//var vServer = "https://sos-2016-02.herokuapp.com";

$(document).ready(function() {

	$("#btnLoadInitialData").click(function(){
		LoadInitialData();
	});

	$("#btnDelete").click(function(){
		deleteResource();
	});

	$("#btnUpdate").click(function(){
		updateResource();
	});
	
	LoadInitialData();
});

function getResourceId() {
	return $('input[name=tblId]:checked').attr('value');
}

function createTableData(objArray) {
 
    //var array = objArray;
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str   = '<table id="tblData" class="tablesorter">';
 
    // table <head>
    str += '<thead><tr><th>&nbsp;</th>';
    for (var index in array[0]) {
        str += '<th>' + index + '</th>';
    }
    str += '</tr></thead>';
 
    // table <body>
    str += '<tbody>';
    for (var i=0; i < array.length; i++) {
        str += '<tr>';
		// Identificador de cada fila: province/year
		str += '<td width="10"><input type="radio" name="tblId" ';
		if (i==0) str += 'checked="checked"';
		str += ' value="' + array[i]['province'] + "/" + array[i]['year'] + '"/></td>';
        
        for (var index in array[i]) {
            str += '<td>' + array[i][index] + '</td>';
        }
        str += '</tr>';
    }
    str += '</tbody>'
    str += '</table>';
    return str;
}

function obtenerURLBase() {
	vAPIversion = "v1";
	vAPIname    = "olders";
	vURLBase    = vServer + "/api/" + vAPIversion + "/" + vAPIname + "/";
	return vURLBase;		
}

function showMessage(pCode, pText) {
	var vClass;
	var vType;
	switch(pCode){
		case 0:   vClass = "msgOK";    vType = "OK";    break;
		case 1:
		case 401: vClass = "msgERROR"; vType = "ERROR"; break;
		case 2:   vClass = "msgINFO";  vType = "INFO";  break;
	}
	$('#divMessage').removeClass();
	$('#divMessage').addClass(vClass);
	$("#divMessage").text(vType + ": " + pText);
}

function LoadInitialData() {
	readTableData("");
	showMessage(0, "Initial Data Loaded.");
}

function deleteResource() {
	setData("DELETE", getResourceId(), "");
	readTableData("");
}

function updateResource() {
	getData("GET", getResourceId());
}

function setData(pType, pQuery, pDataJSON) {

	var vApiKey = getApiKey("WRITE");
	if (vApiKey == "") return;

	var request = $.ajax({
		 url        : obtenerURLBase() + pQuery + vApiKey
		,type       : pType
		,data       : pDataJSON
		,contentType: "application/json; charset=utf-8"
		,cache      : false
	});

	request.always(function(jqXHR, status){
		if (status == "success"){
			showMessage(0, "");
		}else{
			showMessage(jqXHR.status, jqXHR.statusText);
		}
	});
}

function getData(pType, pQuery) {

	var vApiKey = "?apikey=keyRead";

	var request = $.ajax({
		 url        : obtenerURLBase() + pQuery + vApiKey
		,type       : "GET"
		,data       : ""
		,contentType: "application/json; charset=utf-8"
		,cache      : false
	});

	request.done(function(data, status, jqXHR){
		showEditTable(data);
	});

}

function showEditTable(pData) {
 	$("#txtProvince").val(pData[0]['province']);
 	$("#txtYear").val(pData[0]['year']);
 	$("#txtMen").val(pData[0]['men']);
 	$("#txtWomen").val(pData[0]['women']);


}

function readTableData(pQuery) {

	var vApiKey = "?apikey=keyRead";

	// paginación
	vOffset = vPageNum * 10 - 10;
	vPages  = "&offset=" + vOffset + "&limit=" + vLimit;
	
	var request = $.ajax({
		 url        : obtenerURLBase() + pQuery + vApiKey + vPages
		,type       : "GET"
		,data       : ""
		,contentType: "application/json; charset=utf-8"
		,cache      : false
	});

	request.done(function(data, status, jqXHR){
		$("#divTable").html(createTableData(data));
		$("#tblData").tablesorter({widthFixed: true, widgets: ['zebra']});
	});

}

function getApiKey(pApiKey) {

	var vApiKey = "";

	if (pApiKey == "READ") {
		vApiKey = $("#txtApiKeyRead").val();
		if ( vApiKey == "") {
			showMessage(1, "Debes indicar la Api-Key READ.");
		}
	}
	
	if (pApiKey == "WRITE") {
		vApiKey = $("#txtApiKeyWrite").val();
		if ( vApiKey == "") {
			showMessage(1, "Debes indicar la Api-Key WRITE.");
		}
	}

	if (vApiKey != ""){
		vApiKey = "?apikey=" + vApiKey;
	}
	
	return vApiKey;
}