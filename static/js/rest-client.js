$(document).ready(function() {
	  $("#btnSend").click(function() {
		    $("#responseRaw").html( "" );
		    $("#responsePrettyPrinted").html( "" );
		    var request = $.ajax({
			      url        : $("#requestUrl").val()
			      ,type       : $("input[type=radio]:checked").attr("id")
			      ,data       : $("#requestPayload").val()
			      ,contentType: "application/json"
		    });
		    request.done(function(data, status, jqXHR) {
			      $("#resonseStatus").text("");
            $("#responseRaw").text( JSON.stringify(data) );
			      $("#responsePrettyPrinted").html( prettyPrint(data) );
		    });;

		    request.always(function(jqXHR, status) {
			      if (status == "success")
				        $("#responseStatus").text(status);
			      else
				        $("#responseStatus").text(jqXHR.status + " " + jqXHR.statusText);
		    });;

	  });
});
