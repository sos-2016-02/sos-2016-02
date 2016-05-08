"use strict";

var API_WORKERS_URL = "/api/v1/workers";
var ERROR_MESSAGE = "The API key that you wrie is incorrect ";
var table;
var paginationLimit = 10;
var paginationOffset = 0;

var byId = function(id) {return document.getElementById(id);};

$(document).ready(function() {
    var request  = $.ajax({
        url  :"/api/v1/workers"
        ,type :"GET"
         
        ,contentType: "aplication/json"

        
    });

    $("#button-search").click(searchButtonListener);
    $("#btnload-initial-data").click(function(){loadInitialData();});
    $("#btnreload-data").click(reloadDataButtonListener);
    $("#datum-form").submit(datumFormListener);
    addActionsToTable();
    $("#select-page").change(SelectPageListener);
    $("#btnprevious").click(PreviousPageButtonListener);
    $("#btnnext").click(NextPageButtonListener);

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

});


function addActionsToTable() {
    var table = document.getElementById("workers-data");
    addActionColumnToHeader(table);
    $(table).on("draw.dt", function () {
        addActionButtonsToEachRow(table);
    } );
}


// listeners ///////////////////////////////////////////////////////////////////
/*function searchButtonListener(event) {
    event.preventDefault();
    var YearOrIndustryQuery = $("#search-year-or-industry-input").val();
    var newDataUrl =
            API_WORKERS_URL + "/" +
            YearOrIndustryQuery +
            makeUrlParams();
}*/


function datumFormListener(event) {

    var $form = $("#datum-form");
    var formJson = JSON.stringify($form.serializeObject());
    var $inputs = $form.find("input, button");
    $inputs.prop("disabled", true);

    var url, type;
    var editing = byId("datum-form-button").value == "Update";
    if (editing) {
        var year = byId("year-input").value;
        var industry = byId("industry-input").value;
        url = API_WORKERS_URL + "/" + year + "/" + industry + makeUrlParams();
        type = "put";
    } else {
        url = API_WORKERS_URL + makeUrlParams();
        type = "post";
    }
    performAjaxRequest({
        url: url,
        type: type,
        data: formJson,
        doneCallback: () => {table.ajax.reload();},
        alwaysCallback: () => {}
    });
    if (editing) { byId("datum-form-button").value = "Create"; }
}
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
    
    getAllData("loadInitialData");
    
    
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
            window.alert("The datum already exists(same yea and industry)");
        } else if (jqXHR.status == 401) {
            window.alert(ERROR_MESSAGE);
        }
        console.error(
            "The following error occurred: "+
                textStatus, errorThrown
        );
    });

    request.always(alwaysCallback);
}

function reloadDataButtonListener(event) {
    refreshUrlAndReload();
}

function SelectPageListener() {
    paginationLimit = parseInt(byId("select-page").value, 10);
    refreshUrlAndReload();
}

function PreviousPageButtonListener() {
    paginationOffset -= paginationLimit;
    if (paginationOffset < 0) paginationOffset = 0;
    getAllData(""); 
}

/*function PreviousPageButtonListener() {
    paginationOffset -= paginationLimit;
    if (paginationOffset < 0) paginationOffset = 0;
    refreshUrlAndReload();
}*/

function NextPageButtonListener() {
    paginationOffset += paginationLimit;
    refreshUrlAndReload();
}

function searchButtonListener() {

    getAllData($("#button-search").val());
}

// helpers /////////////////////////////////////////////////////////////////////

function refreshUrlAndReload() {
    getOneResource("GET", getResourceId());
    
    $('#province-input').prop('disabled', true);
    $('#year-input').prop('disabled', true);
    $('#button-search').prop('value', "UPDATE");
    $('#button-search').html("Update");
    
}
function getResourceId() {
    return $('input[name=tblId]:checked').attr('value');
}

function getOneResource(pType, pQuery) {

    var apikey = "/?apikey=sos";

    var request = $.ajax({
         url        : API_WORKERS_URL + pQuery + apikey
        ,type       : "GET"
        ,data       : ""
        ,contentType: "application/json; charset=utf-8"
        ,cache      : false
    });

    request.done(function(data, status, jqXHR){
        $("province-input").val(data[0]['province']);
        $("#year-input").val(data[0]['year']);
        $("#industry-input").val(data[0]['industry']);
        $("#value-input").val(data[0]['value']);
    });

}

function getAllData() {

    var apikey = "/?apikey=sos";
    var request = $.ajax({
         url        : API_WORKERS_URL + "/loadInitialData" + apikey
        ,type       : "GET"
        ,data       : ""
        ,contentType: "application/json; charset=utf-8"
        ,cache      : false
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
}



function addActionColumnToHeader(table) {
    var header = table.tHead.rows[0];
    header.innerHTML += "<th>Actions</th>";
}

function addActionButtonsToEachRow(table) {
    var tableBody = table.tBodies[0];

    var noData = tableBody.rows[0].cells[0].className == "table_empty";
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
    var industry = row.cells[1].innerHTML;
    var url = API_WORKERS_URL + "/" + year + "/" + industry + makeUrlParams();

    performAjaxRequest({
        url: url,
        type: "delete",
        doneCallback: () => {table.ajax.reload();},
        alwaysCallback: () => {}
    });
}

function makeUrlParams(additionalParams = "") {
    var params = "?apikey=sos" + byId("api-key-input").value +
            "&limit=" + paginationLimit +
            "&offset=" + paginationOffset+
            additionalParams;

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
