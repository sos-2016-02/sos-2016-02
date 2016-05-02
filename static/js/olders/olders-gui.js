var vAPIname;
var vAPIversion;
var vConnection;
var vLimit   = 11;
var vPageNum = 1;
//var vServer  = "http://localhost:3000";
//var vServer  = "http://192.168.1.200:3000";
var vServer = "https://sos-2016-02.herokuapp.com";

$(document).ready(function() {
	
	getAllData("");

	$('#divFormulario').hide();

	$("#btnLoadInitialData").click(function(){ LoadInitialData(); });
	$("#btnDelete").click(function(){ deleteResource();	});
	$("#btnUpdate").click(function(){ updateResource();	});
	$("#btnCreate").click(function(){ createResource();	});
	$("#btnCancel").click(function(){ editCancel();     });
	$("#btnSave").click(function()  { editSave();       });
	$("#imgFisrt").click(function() { pageFisrt();      });
	$("#imgPrev").click(function()  { pagePrev();       });
	$("#imgNext").click(function()  { pageNext();       });
	$("#imgLast").click(function()  { pageLast();       });

});

function pageFisrt() {
	vPageNum = 1;
	getAllData("");	
}
function pagePrev() {
	vPageNum = (vPageNum > 1) ? vPageNum -= 1 : 1;
	getAllData("");	
}
function pageNext() {
	vPageNum = (vPageNum < 10) ? vPageNum += 1 : 10;
	getAllData("");	
}
function pageLast() {
	vPageNum = 11;
	getAllData("");	
}

function LoadInitialData() {
	getAllData("loadInitialData");
	showMessage(999, "Initial Data Loaded.");
	pageFisrt();
}

function deleteResource() {
	setData("DELETE", getResourceId(), "");
	getAllData("");
}

function updateResource() {
	getOneResource("GET", getResourceId());
	$('#divManagerCtr').css('display', "none");
	$('#divFormulario').css('display', "block");
	$('#txtProvince').prop('disabled', true);
	$('#txtYear').prop('disabled', true);
	$('#btnSave').prop('value', "UPDATE");
	$('#btnSave').html("Update");
}

function createResource() {
	$('#divManagerCtr').css('display', "none");
	$('#divFormulario').css('display', "block");
	$('#txtProvince').prop('disabled', false);
	$('#txtYear').prop('disabled', false);
	$('#txtProvince').prop('value', "");
	$('#txtYear').prop('value', "");
	$('#txtMen').prop('value', "");
	$('#txtWomen').prop('value', "");
	$('#btnSave').prop('value', "CREATE");
	$('#btnSave').html("Create");
}

function editCancel() {
	$('#divManagerCtr').css('display', "block");
	$('#divFormulario').css('display', "none");
	showMessage(0, "");
}

function editSave() {
	if ($('#btnSave').val() == "UPDATE") {
		setData("PUT", getResourceId(), getFieldsJSON());
	}
	if ($('#btnSave').val() == "CREATE") {
		setData("POST", "", getFieldsJSON());
	}
	$('#divManagerCtr').css('display', "block");
	$('#divFormulario').css('display', "none");
	getAllData("");
}

function setData(pType, pQuery, pDataJSON) {

	var vApiKey = $("#txtApiKeyWrite").val();
	if ( vApiKey == "") {
		showMessage(999, "Please, write the Api-Key.");
		return;
	} else {
		vApiKey = "?apikey=" + vApiKey;
	}
	
	var x = obtenerURLBase() + pQuery + vApiKey;

	var request = $.ajax({
		 url        : obtenerURLBase() + pQuery + vApiKey
		,type       : pType
		,data       : pDataJSON
		,contentType: "application/json; charset=utf-8"
		,cache      : false
	});

	request.done(function(data, status, jqXHR){
		showMessage(jqXHR.status, status);
	});		

	request.always(function(jqXHR, status){
		if (status != "success"){
			showMessage(jqXHR.status, jqXHR.statusText);
		}
	});
}

function getOneResource(pType, pQuery) {

	var vApiKey = "?apikey=keyRead";

	var request = $.ajax({
		 url        : obtenerURLBase() + pQuery + vApiKey
		,type       : "GET"
		,data       : ""
		,contentType: "application/json; charset=utf-8"
		,cache      : false
	});

	request.done(function(data, status, jqXHR){
	 	$("#txtProvince").val(data[0]['province']);
	 	$("#txtYear").val(data[0]['year']);
	 	$("#txtMen").val(data[0]['men']);
	 	$("#txtWomen").val(data[0]['women']);
	});

}

function getAllData(pQuery) {

	var vApiKey = "?apikey=keyRead";

	// paginación
	$("#pageNum").html("&nbsp;&nbsp;" + vPageNum + "&nbsp;&nbsp;");
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