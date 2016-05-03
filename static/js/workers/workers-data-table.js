$(document).ready(function() {
	var request  = $.ajax({
		url  :"/api/v1/workers"
		,type :"GET"
		 /*,data : ""/*'{"province": "Alabacete","year": "2015","industry": "Agriculture","value":"17.0"}'
			   '{"province": "Asturias","year": "2014","industry": "Agriculture","value":"13.8"}'
			   '{"province": "Barcelona","year": "2015","industry": "Building","value":"132.1"}'
			   '{"province": "Bizkaia","year": "2013","industry": "Services","value":"369.4"}'
			   '{"province": "Burgos","year": "2013","industry": "Agriculture","value":"9.2"}'
			   '{"province": "Ciudad Real","year": "2012","industry": "Factories Industries","value":"29.2"}'
			   {"province": "Sevilla","year": "2015","industry": "Building","value":"50.0"}',
*/		
		,contentType: "aplication/json"

		
	});

	/*$("#btnLoadInitialData").click(function(){
		loadInitialData();

	});*/   

	
	request.done(function(data,status,jqXHR){
		console.log(JSON.stringify(data));
		table = makeTable(data);
		//Quiero mostrar todos los elemento de DOM
		//is dumped to the console window
		console.log(table[0].outerHTML);
		$("#workers-data").html(table);

	});

	request.always(function(jqXHR, status){
		console.log("Let me know the status:" + status);
	});

	//console.log("Jquery Ready");
	//$("#workers-data").click(function(){

	//});
});
function makeTable(data){
	var table = $('<table class = "table">');
		var tblHeader = "<tr>";
		for (var h in data[0]) {
        tblHeader += "<th>" + h + "</th>";
    }
		tblHeader += "</tr>";
		$(tblHeader).appendTo(table);
		$.each(data, (index, value) => {
			  var tblRow = "<tr>";
			  $.each(value, (key, val) => {
				    tblRow += "<td>" + val + "</td>";
			  });
			  tblRow += "</tr>";
			  $(table).append(tblRow);
		});
		$(table).append($("</table>"));
		return ($(table));
};



