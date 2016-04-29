var API_POPULATION_URL = "/api/v1/population";
// TODO find in doc how to get a DataTable object from
// an existing one
var dataTable;

$(document).ready(function() {
    dataTable = $("#population-data-table").DataTable({
        "ordering": false,
        "ajax": {
            "url": "/api/v1/population?apikey=correct-key-1",
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

    $("#button-search").click(searchButtonListener);
    $("#button-load-initial-data").click(loadInitialDataButtonListener);
    $("#datum-form").submit(datumFormListener);
    addActionsToTable();

});


function addActionsToTable() {
    var table = document.getElementById("population-data-table");
    addActionColumnToHeader(table);
    $(table).on("draw.dt", function () {
        addActionButtonsToEachRow(table);
    } );
}


function searchButtonListener(event) {
    event.preventDefault();
    var searchQuery = $("#server-side-search-input").val();
    var newDataUrl = "/api/v1/population/" + searchQuery +"?apikey=correct-key-1";
    dataTable.ajax.url(newDataUrl).load();
}


function datumFormListener(event) {
    event.preventDefault();

    var $form = $("#datum-form");
    formJson = JSON.stringify($form.serializeObject());

    // Disable the inputs for the duration of the Ajax request.
        // Note: we disable elements AFTER the form data has been serialized.
    // Disabled form elements will not be serialized.
    var $inputs = $form.find("input, button");
    $inputs.prop("disabled", true);

    performAjaxRequest({
        url: "/api/v1/population?apikey=correct-key-1",
        type: "post",
        data: formJson,
        doneCallback: () => {dataTable.ajax.reload();},
        alwaysCallback: () => {$inputs.prop("disabled", false);}
    });
}

function loadInitialDataButtonListener(event) {
    event.preventDefault();
    $(event.target).prop("disabled", true);

    url = API_POPULATION_URL + "/loadInitialData?apikey=" + getApiKey();

    performAjaxRequest({
        url: url,
        type: "get",
        doneCallback: () => {dataTable.ajax.reload();},
        alwaysCallback: () => {$(event.target).prop("disabled", false);}
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
        addDeleteButton(row, i);
    }
}

function addDeleteButton(row, rowIndex) {
    buttonId = "delete-button-row-" + rowIndex;
    var button = "<button id=" + buttonId + ">Delete</button>";
    row.innerHTML += "<td>" + button + "</td>";

    $("#" + buttonId).click(row, deleteDatumListener);
}

function deleteDatumListener(event) {
    row = event.data;
    var year = row.cells[0].innerHTML;
    var province = row.cells[1].innerHTML;
    url = API_POPULATION_URL + "/" + province + "/" + year + "?apikey=" + getApiKey();

    $(event.target).prop("disabled", true);

    performAjaxRequest({
        url: url,
        type: "delete",
        doneCallback: () => {dataTable.ajax.reload();},
        alwaysCallback: () => {}
    });
}

function getApiKey() {
    return "correct-key-1";
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
