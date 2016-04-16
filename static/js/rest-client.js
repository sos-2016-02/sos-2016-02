$(document).ready(function(){
	  $("#btnSend").click(function(){
		    $("#strResponseRaw").html( "" );
		    $("#strResponsePrettyPrinted").html( "" );
		    var request = $.ajax({
			      url        : $("#txtRequestUrl").val()
			      ,type       : $("input[type=radio]:checked").attr("id")
			      ,data       : $("#txtRequestPayload").val()
			      ,contentType: "application/json"
		    });
		    request.done(function(data, status, jqXHR){
			      $("#strResponseStatus").text("");
            $("#strResponseRaw").text( JSON.stringify(data) );
			      $("#strResponsePrettyPrinted").html( prettyPrint(data) );
		    });;

		    request.always(function(jqXHR, status){
			      if (status == "success")
				        $("#strResponseStatus").text(status);
			      else
				        $("#strResponseStatus").text(jqXHR.status + " " + jqXHR.statusText);
		    });;

	  });
});
