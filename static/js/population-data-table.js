$(document).ready(function() {
    var table = $("#population-data-table").DataTable({
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
    $("#button-search").click(() => {
        var searchQuery = $("#server-side-search-input").val();
        var newDataUrl = "/api/v1/population/" + searchQuery +"?apikey=correct-key-1";
        table.ajax.url(newDataUrl).load();
    });
});
