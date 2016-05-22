$(document).ready(function(){

	var vAPIname;
	var vAPIversion;
	var vConnection;

	setDefaultValues();
	obtenerDireccion();
	sendQuery();

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
		$('#txtServer').val("http://192.168.1.200:3000");
		$('#txtURI').val("");
		$('#txtKey').val("multiPlan_C4_sos-2016-02-mac_ag");
	}

	function obtenerDireccion() {
		vConnection = obtenerURLBase() + obtenerParametros();
		$('#lnkRequest').attr('href',vConnection);
		$('#lnkRequest').text(vConnection);
	}

	function obtenerURLBase() {
		vAPIname    = $("#selAPIname option:selected").val();
		vAPIversion = $("#selAPIversion option:selected").val();
		vURLBase    = $("#txtServer").val() + "/api/" + vAPIversion + "/" + vAPIname + "/" + $("#txtURI").val();
		return vURLBase;		
	}

	function obtenerParametros(){
		var vParam = "";
		if ($("#apikey").val() != ""){
			var vChar  = ( vParam.indexOf("?")==-1) ? "?" : "&";
			vParam = vParam + vChar + "apiKey=" + $("#txtKey").val()
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

	function LoadInitialData(){
		$("#txtReceived").html( "" );
		var vType     = $("input[type=radio]:checked").attr("id");
		var vDataJSON = $("#txtData").val();
		var vURL      = obtenerURLBase() + "loadInitialData?apiKey=" + $("#txtKey").val();

		var request = $.ajax({
			 url        : vURL
			,type       : "GET"
			,data       : ""
			,contentType: "application/json; charset=utf-8"
			,cache      : false
		});

		request.done(function(data, status, jqXHR){
			$("#txtStatus").text("TO PERFE");
		});;

		request.always(function(jqXHR, status){
			if (status == "success"){
				$("#txtStatus").text("Ok.");
				$("#txtReceived").text("Loading Initial Data...   Ok!");
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