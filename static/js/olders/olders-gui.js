var vAPIversion = "v1";
var vAPIname    = "olders";
//var vServer     = "http://192.168.1.200:3000";
//var vServer     = "http://localhost:3000";
var vServer     = "https://sos-2016-02.herokuapp.com";

var vApiKeyRead = "keyRead";
var vLimit      = 10;
var vPageNum    = 1;

$(document).ready(function() {
	
	getAllData("");

	$('#divFormulario').hide();
	$('#txtYearFrom').prop('disabled', true);
	$('#txtYearTo').prop('disabled', true);

	$("#btnLoadInitialData").click(function(){ LoadInitialData(); });
	$("#btnDelete").click(function()         { deleteResource();  });
	$("#btnUpdate").click(function()         { updateResource();  });
	$("#btnCreate").click(function()         { createResource();  });
	$("#btnFilter").click(function()         { filterResource();  });
	$("#btnCancel").click(function()         { editCancel();      });
	$("#btnSave").click(function()           { editSave();        });
	$("#imgFisrt").click(function()          { pageFisrt();       });
	$("#imgPrev").click(function()           { pagePrev();        });
	$("#imgNext").click(function()           { pageNext();        });
	$("#imgLast").click(function()           { pageLast();        });
	$("#txtProvinceName").keyup(function()   { writingProvince(); });

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

function filterResource() {
	showMessage(0, "");
	vPageNum = 1;
	getAllData("");
}

function writingProvince() {
	var vTextInside = ($("#txtProvinceName").val()=="");
	$('#txtYearFrom').prop('disabled', vTextInside);
	$('#txtYearTo').prop('disabled', vTextInside);
}

function deleteResource() {
	//setData("DELETE", getResourceId(), "");
	$.each(getResourcesCheked(), function(index, value){
		setData("DELETE", value, "");
	});
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
		//setData("PUT", getResourceId(), getFieldsJSON());
		var obj = new Object();
		var vJSONdata;
		$.each(getResourcesCheked(), function(index, value){
			obj.province = value.substr(0,value.indexOf("/")); // hasta el caracter de la barra
			obj.year     = value.substr(value.indexOf("/")+1); // a partir del caracter de la barra
			obj.men      = $('#txtMen').val();
        	obj.women    = $('#txtWomen').val()
			vJSONdata    = JSON.stringify(obj);
			setData("PUT", value, vJSONdata);
		});
	}
	if ($('#btnSave').val() == "CREATE") {
		if ($("#txtProvince").val()=="" || $("#txtYear").val()==""){
			showMessage(999, "Required fields: Province, Year.");
		} else {
			setData("POST", "", getFieldsJSON());
		}
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
	var vApiKey = "?apikey=" + vApiKeyRead;
	
	var request = $.ajax({
		 url        : obtenerURLBase() + pQuery + vApiKey
		,type       : "GET"
		,data       : ""
		,contentType: "application/json; charset=utf-8"
		,cache      : false
	});

	request.done(function(data, status, jqXHR){
		if ( getResourcesCheked().length>1 ){
			$('#txtProvince').val("");
			$('#txtYear').val("");
		} else {
	 		$("#txtProvince").val(data[0]['province']);
	 		$("#txtYear").val(data[0]['year']);
	 	}
	 	$("#txtMen").val(data[0]['men']);
	 	$("#txtWomen").val(data[0]['women']);
	});

}

function getAllData(pQuery) {

	var vApiKey = "?apikey=" + vApiKeyRead;
	var vFilter = $('#txtProvinceName').val();
	var vRange  = "";

	// Rango
	if( vFilter != "" ) {
		if( $('#txtYearFrom').val() != "" ) {
			vRange += "&from=" + $('#txtYearFrom').val();
		}
		if( $('#txtYearTo').val() != "" ) {
			vRange += "&to=" + $('#txtYearTo').val();
		}
	}

	// Paginación
	$("#pageNum").html("&nbsp;&nbsp;" + vPageNum + "&nbsp;&nbsp;");
	vOffset = vPageNum * 10 - 10;
	vPages  = "&offset=" + vOffset + "&limit=" + vLimit;


	var vURL = obtenerURLBase() + pQuery + vFilter + vApiKey + vRange + vPages
;
	var request = $.ajax({
		 url        : vURL
		,type       : "GET"
		,data       : ""
		,contentType: "application/json; charset=utf-8"
		,cache      : false
	});

	request.done(function(data, status, jqXHR){
		$("#divTable").html(createTableData(data));
		$("#tblData").tablesorter({widthFixed: true, widgets: ['zebra']});
	});

	request.always(function(jqXHR, status){
		if (status != "success"){
			showMessage(jqXHR.status, jqXHR.statusText);
		}

	});

}