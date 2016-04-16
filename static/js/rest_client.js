$(document).ready(function(){
	  $("#btnEnviar").click(function(){
		    $("#txtReceived").html( "" );
		    console.log("HOLA");
		    var request = $.ajax({
			      url        : $("#txtURL").val()
			      ,type       : $("input[type=radio]:checked").attr("id")
			      ,data       : $("#txtData").val()
			      ,contentType: "application/json"
		    });
		    request.done(function(data, status, jqXHR){
			      $("#txtStatus").text("");
			      $("#txtReceived").text( JSON.stringify(data) );
		    });;

		    request.always(function(jqXHR, status){
			      if (status == "success")
				        $("#txtStatus").text(status);
			      else
				        $("#txtStatus").text(jqXHR.status + " " + jqXHR.statusText);
		    });;

	  });
});
