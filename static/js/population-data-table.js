$(document).ready(function() {
		var request = $.ajax({
			  url        : "/api/v1/population?apikey=correct-key-1"
			  ,type       : "GET"
			  ,contentType: "application/json"
		});

		request.done(function(jsonData, textStatus, jqXHR) {
        console.log(JSON.stringify(jsonData));
        table = makeTable(jsonData);
        console.log(table[0].outerHTML);
        $("#population-data").html(table);
		});;

		request.always(function(jqXHR, textStatus) {
        console.log("request status: " + textStatus);
		});;

});

function makeTable(dataJson) {
		var table = $('<table border="1">');
		var tblHeader = "<tr>";
		for (var h in dataJson[0]) {
        tblHeader += "<th>" + h + "</th>";
    }
		tblHeader += "</tr>";
		$(tblHeader).appendTo(table);
		$.each(dataJson, (index, value) => {
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
