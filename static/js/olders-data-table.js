$(document).ready(function(){

	var vAPIname;
	var vAPIversion;
	var vConnection;

	setDefaultValues();

	obtenerDireccion();

	$("#btnEnviar").click(function(){
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
		});;

		request.always(function(jqXHR, status){
			if (status == "success"){
				$("#txtStatus").text("Ok.");
			} else {
				$("#txtStatus").text("ERROR " + jqXHR.status + " " + jqXHR.statusText);	
			}
		});;

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
		$('#txtServer').val("https://sos-2016-02.herokuapp.com");
		$('#txtURI').val("");
		$('#txtKey').val("keyRead");
	}

	function obtenerDireccion() {
		vAPIname    = $("#selAPIname option:selected").val();
		vAPIversion = $("#selAPIversion option:selected").val();
		vConnection = $("#txtServer").val() + "/api/" + vAPIversion + "/" + vAPIname + "/" + $("#txtURI").val();
		if ($("#apikey").val() != ""){
			var vChar  = ( vConnection.indexOf("?")==-1) ? "?" : "&";
			vConnection = vConnection + vChar + "apikey=" + $("#txtKey").val()
		}
		if ($("#txtOffset").val() != ""){
			var vChar  = ( vConnection.indexOf("?")==-1) ? "?" : "&";
			vConnection = vConnection + vChar + "offset=" + $("#txtOffset").val()
		}
		if ($("#txtLimit").val() != ""){
			var vChar  = ( vConnection.indexOf("?")==-1) ? "?" : "&";
			vConnection = vConnection + vChar + "limit=" + $("#txtLimit").val()
		}
		if ($("#txtFrom").val() != ""){
			var vChar  = ( vConnection.indexOf("?")==-1) ? "?" : "&";
			vConnection = vConnection + vChar + "from=" + $("#txtFrom").val()
		}
		if ($("#txtTo").val() != ""){
			var vChar  = ( vConnection.indexOf("?")==-1) ? "?" : "&";
			vConnection = vConnection + vChar + "to=" + $("#txtTo").val()
		}
		if ($("#txtFields").val() != ""){
			var vChar  = ( vConnection.indexOf("?")==-1) ? "?" : "&";
			vConnection = vConnection + vChar + "fields=" + $("#txtFields").val()
		}
		if ($("#txtValues").val() != ""){
			var vChar  = ( vConnection.indexOf("?")==-1) ? "?" : "&";
			vConnection = vConnection + vChar + $("#txtValues").val()
		}

		$('#lnkRequest').attr('href',vConnection);
		$('#lnkRequest').text(vConnection);
	}

	$.makeTable = function (dataJSON) {
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

});