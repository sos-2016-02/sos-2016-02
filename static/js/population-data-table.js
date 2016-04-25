$(document).ready(function() {
    $("#population-data-table").DataTable( {
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
    } );

});
