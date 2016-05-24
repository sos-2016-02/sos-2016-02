"use strict";

var API_POPULATION_URL = "/api/v1/population";
var ERROR_MESSAGE_WRONG_API_KEY = "The API key that you provided has been refused, check for any typo";
var ERROR_MESSAGE_QUOTA = "The API key that you provided has been refused: Your quota is spent";

// TODO find in doc how to get a DataTable object from
// an existing one
var dataTable;
var paginationLimit = 10;
var paginationOffset = 0;

$(document).ready(function() {
    dataTable = $("#population-data-table").DataTable({
        "ordering": false,
        "paging": false,
        "info": false,
        "ajax": {
            "url": API_POPULATION_URL + makeUrlParamsWithSearch(),
            "dataSrc": ""
        },
        "columns": [
            { "data": "year" },
            { "data": "province" },
            { "data": "age" },
            { "data": "birthplace" },
            { "data": "number" },
        ]
    });
    // disable default alert box which has a cryptic message
    // when an error occurs (wrong API key for example)
    $.fn.dataTable.ext.errMode = function (e) {
        if(e.jqXHR.status == 402) {
            dataTable.clear().draw(); // don't let data when it's not possible to load it
            window.alert(ERROR_MESSAGE_WRONG_API_KEY);
        }
        if(e.jqXHR.status == 429) {
            dataTable.clear().draw(); // don't let data when it's not possible to load it
            window.alert(ERROR_MESSAGE_QUOTA);
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
    var table = document.getElementById("population-data-table");
    addActionColumnToHeader(table);
    $(table).on("draw.dt", function () {
        addActionButtonsToEachRow(table);
    } );
}


// listeners ///////////////////////////////////////////////////////////////////
function searchButtonListener(event) {
    event.preventDefault();
    refreshUrlAndReload();
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
        var province = byId("province-input").value;
        url = API_POPULATION_URL + "/" + province + "/" + year + makeUrlParams();
        type = "put";
    } else {
        url = API_POPULATION_URL + makeUrlParams();
        type = "post";
    }
    performAjaxRequest({
        url: url,
        type: type,
        data: formJson,
        doneCallback: () => {dataTable.ajax.reload();},
        alwaysCallback: () => {$inputs.prop("disabled", false);}
    });
    if (editing) { byId("datum-form-button").value = "Create"; }
}

function loadInitialDataButtonListener(event) {
    event.preventDefault();
    $(event.target).prop("disabled", true);

    var url = API_POPULATION_URL + "/loadInitialData?apikey=" + byId("api-key-input").value;

    performAjaxRequest({
        url: url,
        type: "get",
        doneCallback: () => {dataTable.ajax.reload();},
        alwaysCallback: () => {$(event.target).prop("disabled", false);}
    });
}

var reloadDataButtonListener = refreshUrlAndReload;
var paginationSelectListener = refreshUrlAndReload;

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
    var newUrl = API_POPULATION_URL + makeUrlParamsWithSearch();
    dataTable.ajax.url(newUrl).load();
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
        } else if (jqXHR.status == 402) {
            dataTable.clear().draw(); // don't let data when it's not possible to load it
            window.alert(ERROR_MESSAGE_WRONG_API_KEY);
        } else if (jqXHR.status == 429) {
            dataTable.clear().draw(); // don't let data when it's not possible to load it
            window.alert(ERROR_MESSAGE_QUOTA);
        }
        console.error(
            "The following error occurred: "+
                textStatus, errorThrown
        );
    });

    request.always(alwaysCallback);
}

function addActionColumnToHeader(table) {
    var header = table.tHead.rows[0];
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
    byId("year-input").value = row.cells[0].innerHTML;
    byId("province-input").value = row.cells[1].innerHTML;
    byId("age-input").value = row.cells[2].innerHTML;
    byId("birthplace-input").value = row.cells[3].innerHTML;
    byId("number-input").value = row.cells[4].innerHTML;
}

function addDeleteButton(row, rowIndex) {
    var buttonId = "delete-button-row-" + rowIndex;
    $(row.cells[5]).append( "<button id=" + buttonId + ">Delete</button>");
    $("#" + buttonId).click(row, deleteDatumListener);
}

function deleteDatumListener(event) {
    var row = event.data;
    var year = row.cells[0].innerHTML;
    var province = row.cells[1].innerHTML;
    var url = API_POPULATION_URL + "/" + province + "/" + year + makeUrlParams();

    $(event.target).prop("disabled", true);

    performAjaxRequest({
        url: url,
        type: "delete",
        doneCallback: () => {dataTable.ajax.reload();},
        alwaysCallback: () => {$(event.target).prop("disabled", false);}
    });
}


// for requests that want also to use search
function makeUrlParamsWithSearch() {
    var params = makeUrlParams();
    var yearOrCityQuery = $("#search-year-or-city-input").val();
    return "/" + yearOrCityQuery + params;
}

function makeUrlParams() {
    paginationLimit = parseInt(byId("pagination-select").value, 10);
    var params =
            "?apikey=" + byId("api-key-input").value +
            "&limit=" + paginationLimit +
            "&offset=" + paginationOffset +
            makeMinPopulationUrlParams();
    return params;
}

function makeMinPopulationUrlParams() {
    var minPopulationQuery = $("#search-min-population-input").val();
    if(minPopulationQuery === "") return "";
    return "&minPopulation=" + minPopulationQuery;
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

function byId(id) {
    return document.getElementById(id);
};
