var vAPIname;
var vAPIversion;
var vConnection;

var vServer = "http://192.168.1.200:3000";
//var vServer = "https://sos-2016-02.herokuapp.com";

$(document).ready(function(){




	/*
	setDefaultValues();
	obtenerDireccion();
	sendQuery();
*/
	$("#tblOlders").tablesorter({widthFixed: true, widgets: ['zebra']});


	$("#btnLoadInitialData").click(function(){
		LoadInitialData();
	});

	$("#btnEnviar").click(function(){
		sendQuery();
	});

	$("input[name=txtURL]").keyup(function(){
		obtenerDireccion();
	});

	$("input[name=txtParam]").keyup(function(){
		$("#txtURI").val("");
		obtenerDireccion();
	});

	$("#txtURI").keyup(function(){
		$('input[name=txtParam]').val("");
		obtenerDireccion();
	});

	$("#selAPIname").change(function(){
		obtenerDireccion();
	});

	$("#selAPIversion").change(function(){
		obtenerDireccion();
	});
	


	function setDefaultValues() {
		$('input[name=txtURL]').val("");
		// https://sos-2016-02.herokuapp.com
		// http://localhost:3000
		// http://192.168.1.200:3000
		$('#txtServer').val("http://localhost:3000");
		$('#txtURI').val("");
		$('#txtKey').val("keyRead");
	}

	function obtenerDireccion() {
		vConnection = obtenerURLBase() + obtenerParametros();
		$('#lnkRequest').attr('href',vConnection);
		$('#lnkRequest').text(vConnection);
	}



	function obtenerParametros(){
		var vParam = "";
		if ($("#apikey").val() != ""){
			var vChar  = ( vParam.indexOf("?")==-1) ? "?" : "&";
			vParam = vParam + vChar + "apikey=" + $("#txtKey").val()
		}
		if ($("#txtOffset").val() != ""){
			var vChar  = ( vParam.indexOf("?")==-1) ? "?" : "&";
			vParam = vParam + vChar + "offset=" + $("#txtOffset").val()
		}
		if ($("#txtLimit").val() != ""){
			var vChar  = ( vParam.indexOf("?")==-1) ? "?" : "&";
			vParam = vParam + vChar + "limit=" + $("#txtLimit").val()
		}
		if ($("#txtFrom").val() != ""){
			var vChar  = ( vParam.indexOf("?")==-1) ? "?" : "&";
			vParam = vParam + vChar + "from=" + $("#txtFrom").val()
		}
		if ($("#txtTo").val() != ""){
			var vChar  = ( vParam.indexOf("?")==-1) ? "?" : "&";
			vParam = vParam + vChar + "to=" + $("#txtTo").val()
		}
		if ($("#txtFields").val() != ""){
			var vChar  = ( vParam.indexOf("?")==-1) ? "?" : "&";
			vParam = vParam + vChar + "fields=" + $("#txtFields").val()
		}
		if ($("#txtValues").val() != ""){
			var vChar  = ( vParam.indexOf("?")==-1) ? "?" : "&";
			vParam = vParam + vChar + $("#txtValues").val()
		}
		return vParam;
	}

	function sendQuery(){
		$("#txtReceived").html( "" );
		var vType     = $("input[type=radio]:checked").attr("id");
		var vDataJSON = $("#txtData").val();

		var request = $.ajax({
			 url        : vConnection
			,type       : vType
			,data       : vDataJSON
			,contentType: "application/json; charset=utf-8"
			,cache      : false
		});

		request.done(function(data, status, jqXHR){
			$("#txtStatus").text("");
			//$("#txtReceived").text( JSON.stringify(data) );
			var table = $.makeTable(data);
			$(table).appendTo("#txtReceived");
			$("#myTable")
			.tablesorter({widthFixed: true, widgets: ['zebra']})
			.tablesorterPager({container: $("#pager")});
		});;

		request.always(function(jqXHR, status){
			if (status == "success"){
				$("#txtStatus").text("Ok.");
			} else {
				$("#txtStatus").text("ERROR " + jqXHR.status + " " + jqXHR.statusText);	
			}
		});;
	}



	$.makeTableORIGINAL = function (dataJSON) {
		var table = $('<table border="1">');
		var tblHeader = "<tr>";
		for (var h in dataJSON[0]) tblHeader += "<th>" + h + "</th>";
		tblHeader += "</tr>";
		$(tblHeader).appendTo(table);
		$.each(dataJSON, function (index, value) {
			var tblRow = "<tr>";
			$.each(value, function (key, val) {
				tblRow += "<td>" + val + "</td>";
			});
			tblRow += "</tr>";
			$(table).append(tblRow);
		});
		return ($(table));
	};

	$.makeTable = function (dataJSON) {
		var table = $('<table id="myTable" class="tablesorter">');
		var tblHead = '';
		for (var h in dataJSON[0]) tblHead += "<th>" + h + "</th>";
		var tblHeader = '<thead><tr>' + tblHead + "</tr></thead>";
		$(tblHeader).appendTo(table);
		$.each(dataJSON, function (index, value) {
			var tblRow = "<tr>";
			$.each(value, function (key, val) {
				tblRow += "<td>" + val + "</td>";
			});
			tblRow += "</tr>";
			$(table).append(tblRow);
		});
		return ($(table));
	};



});

function obtenerURLBase() {
	vAPIversion = "v1";
	vAPIname    = "olders";
	vURLBase    = vServer + "/api/" + vAPIversion + "/" + vAPIname + "/";
	return vURLBase;		
}

function LoadInitialData(){
	if ( $("#txtApiKey").val() == "") {
		showMessage(1, "Debes indicar la Api-key.");
		return;
	}

	var request = $.ajax({
		 url        : obtenerURLBase() + "loadInitialData?apikey=" + $("#txtApiKey").val()
		,type       : "GET"
		,data       : ""
		,contentType: "application/json; charset=utf-8"
		,cache      : false
	});

	request.always(function(jqXHR, status){
		if (status == "success"){
			showMessage(0, "Initial Data loaded.");
		} else {
			showMessage(jqXHR.status, jqXHR.statusText);
		}
	});;
}

function showMessage(code, text){
	var vClass;
	var vType;
	switch(code){
		case 0:   vClass = "msgOK";    vType = "OK";    break;
		case 1:
		case 401: vClass = "msgERROR"; vType = "ERROR"; break;
		case 2:   vClass = "msgINFO";  vType = "INFO";  break;
	}
	$('#divMessage').removeClass();
	$('#divMessage').addClass(vClass);
	$("#divMessage").text(vType + ": " + text);
}