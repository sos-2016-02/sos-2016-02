"use strict";

var API_WORKERS_URL = "/api/v1/workers";
var ERROR_WRONG_API_KEY = "The API key that you provided has been refused, check for any typo";
var table;

// TODO find in doc how to get a DataTable object from
// an existing one
/*/*
var paginationLimit = 10;
var paginationOffset = 0;

var byId = function(id) {return document.getElementById(id);};

/*$(document).ready(function() {
    Table = $("#workers-data")({
        "ordering": false,
        "paging": false,
        "info": false,
        "ajax": {
            "url": API_WORKERS_URL + getUrlParms(),
            "dataSrc": ""
        },
        "columns": [
            { "data": "province" },
            { "data": "year" },
            { "data": "industry" },
            { "data": "value" },
            
        ]
    });*/
/*/*$(document).ready(function() {
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
	
		,contentType: "aplication/json"

		
	});


    // disable default alert box which has a cryptic message
    // when an error occurs (wrong API key for example)
    /*$.fn.Bootst.ext.errMode = function (res) {
        if(res.jqXHR.status == 401) {
            Table.clear().draw(); // don't let data when it's not possible to load it
            window.alert(ERROR_MESSAGE_WRONG_API_KEY);
        }
    };

    $("#button-search").click(searchButtonListener);
    $("#button-load-initial-data").click(loadInitialDataButtonListener);
    $("#button-reload-data").click(reloadDataButtonListener);
    $("#datum-form").submit(datumFormListener);
    addActionsToTable();
    $("#pagination-select").change(paginationSelectListener);
    $("#pagination-button-previous").click(paginationPreviousButtonListener);
    $("#pagination-button-next").click(paginationNextButtonListener);
});


function addActionsToTable() {
    var table = document.getElementById("workers-data");
    //addActionColumnToHeader(table);
    $(table).on("draw.dt", function () {
        addActionButtonsToEachRow(table);
    } );
}


// listeners ///////////////////////////////////////////////////////////////////
function searchButtonListener(event) {
    event.preventDefault();
    var searchQuery = $("#server-side-search-input").val();
    var newDataUrl = API_WORKERS_URL + "/" + searchQuery + getUrlParms();
    Table.ajax.url(newDataUrl).load();
}


function datumFormListener(event) {
    event.preventDefault();

    var $form = $("#datum-form");
    var formJson = JSON.stringify($form.serializeObject());

    // Disable the inputs for the duration of the Ajax request.
    // Note: we disable elements AFTER the form data has been serialized.
    // Disabled form elements will not be serialized.
    var $inputs = $form.find("input, button");
    $inputs.prop("disabled", true);

    var url, type;
    var editing = byId("datum-form-button").value == "Update";
    if (editing) {
        var year = byId("year-input").value;
        var industry = byId("industry-input").value;
        url = API_WORKERS_URL + "/" + year + "/" + industry + getUrlParms();
        type = "put";
    } else {
        url = API_WORKERS_URL + getUrlParms();
        type = "post";
    }
    performAjaxRequest({
        url: url,
        type: type,
        data: formJson,
        doneCallback: () => {Table.ajax.reload();},
        alwaysCallback: () => {$inputs.prop("disabled", false);}
    });
    if (editing) { byId("datum-form-button").value = "Create"; }
}

function loadInitialDataButtonListener(event) {
    event.preventDefault();
    $(event.target).prop("disabled", true);

    var url = API_WORKERS_URL + "/loadInitialData" + getUrlParms();

    performAjaxRequest({
        url: url,
        type: "get",
        doneCallback: () => {.ajax.reload();},
        alwaysCallback: () => {$(event.target).prop("disabled", false);}
    });
}

function reloadDataButtonListener(event) {
    refreshUrlAndReload();
}

function paginationSelectListener(event) {
    paginationLimit = parseInt(byId("pagination-select").value, 10);
    refreshUrlAndReload();
}

function paginationPreviousButtonListener(event) {
    paginationOffset -= paginationLimit;
    if (paginationOffset < 0) paginationOffset = 0;
    refreshUrlAndReload();
}

function paginationNextButtonListener(event) {
    paginationOffset += paginationLimit;
    refreshUrlAndReload();
}

// helpers /////////////////////////////////////////////////////////////////////

function refreshUrlAndReload() {
    var newUrl = API_WORKERS_URL + getUrlParms();
    Table.ajax.url(newUrl).load();
}

function performAjaxRequest({url, type, data, doneCallback, alwaysCallback}) {
    var request = $.ajax({
        url: url,
        type: type,
        data: data,
		contentType: "application/json"
    });

    request.done(doneCallback);

    request.fail(function (jqXHR, textStatus, errorThrown){
        if (jqXHR.status == 409) {
            window.alert("The datum that you are trying to add already exists(same province and year)");
        } else if (jqXHR.status == 401) {
            Table.clear().draw(); // don't let data when it's not possible to load it
            window.alert(ERROR_MESSAGE_WRONG_API_KEY);
        }
        console.error(
            "The following error occurred: "+
                textStatus, errorThrown
        );
    });

    request.always(alwaysCallback);
}

/*function addActionColumnToHeader(table) {
    var header = table.tHead.row[0];
    header.innerHTML += "<th>Actions</th>";
}

function addActionButtonsToEachRow(table) {
    var tableBody = table.tBodies[0];

    var noData = tableBody.rows[0].cells[0].className == "dataTables_empty";
    if (noData) return;

    for (var i = 0, row; row = tableBody.rows[i]; i++) {
        var actionButtonsAlreadyThere = row.cells[5] != undefined;
        // happens with client side search which redraws the table but don't
        // destroy the rows. In that case skip the rest of the function
        if (actionButtonsAlreadyThere) { return; }

        row.innerHTML += '<td class="action-cell"></td>';  // add action column
        addEditButton(row, i);
        addDeleteButton(row, i);
    }
}

function addEditButton(row, rowIndex) {
    var buttonId = "edit-button-row-" + rowIndex;
    $(row.cells[5]).append( "<button id=" + buttonId + ">Edit</button>");
    $("#" + buttonId).click(row, editDatumListener);
}

function editDatumListener(event) {
    var row = event.data;
    fillDatumFormWithRowData(row);
    byId("datum-form-button").value = "Update";
}

function fillDatumFormWithRowData(row) {
    byId("province-input").value = row.cells[0].innerHTML;
    byId("year-input").value = row.cells[1].innerHTML;
    byId("industry-input").value = row.cells[2].innerHTML;
    byId("value-input").value = row.cells[3].innerHTML;
    
}

function addDeleteButton(row, rowIndex) {
    var buttonId = "delete-button-row-" + rowIndex;
    $(row.cells[5]).append( "<button id=" + buttonId + ">Delete</button>");
    $("#" + buttonId).click(row, deleteDatumListener);
}

function deleteDatumListener(event) {
    var row = event.data;
    var year = row.cells[0].innerHTML;
    var industry= row.cells[1].innerHTML;
    var url = API_WORKERS_URL + "/" + year + "/" + industry + getUrlParms();

    $(event.target).prop("disabled", true);

    performAjaxRequest({
        url: url,
        type: "delete",
        doneCallback: () => {Table.ajax.reload();},
        alwaysCallback: () => {$(event.target).prop("disabled", false);}
    });
}

function getUrlParms() {
    var params = "?apikey=" + byId("api-key-input").value +
            "&limit=" + paginationLimit +
            "&offset=" + paginationOffset;

    return params;
}

// http://stackoverflow.com/a/1186309/3682839
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
*/

//=============================data table js====================


$(document).ready(function() {
	//llamadas que estoy haciendo a mi jquery or javascritp
	var request  = $.ajax({
		url  :"/api/v1/workers"
		,type :"GET"
		,contentType: "aplication/json"

		
	});

	$("#btnLoadInitialData").click(function(){
		loadInitialData();

	});  

	

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

function loadInitialData() {
    var url = API_WORKERS_URL +  "/loadInitialData" + "?apikey=sos"// + getUrlParms();
    console.log("Muestra datos iniciales" +url);

    performAjaxRequest({
        url: url,
        type: "get",
        doneCallback: () => {},
        alwaysCallback: () => {}
    });
}

function performAjaxRequest({url, type, data, doneCallback, alwaysCallback}) {
    var request = $.ajax({
        url: url,
        type: type,
        data: data,
		contentType: "application/json"
    });

    request.done(doneCallback);

    request.fail(function (jqXHR, textStatus, errorThrown){
        if (jqXHR.status == 409) {
            window.alert("The datum that you are trying to add already exists(same province and year)");
        } else if (jqXHR.status == 401) {
            //Table.clear().draw(); // don't let data when it's not possible to load it
            //es parte del entorno "palabra reservada "
            window.alert(ERROR_MESSAGE_WRONG_API_KEY);
        }
        console.error(
            "The following error occurred: "+
                textStatus, errorThrown
        );
    });

    request.always(alwaysCallback);
}




