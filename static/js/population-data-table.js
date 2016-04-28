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

    $("#datum-form").submit((event) => {
        event.preventDefault();

        var $form = $("#datum-form");
        formJson = JSON.stringify($form.serializeObject());

        // Disable the inputs for the duration of the Ajax request.
        // Note: we disable elements AFTER the form data has been serialized.
        // Disabled form elements will not be serialized.
        var $inputs = $form.find("input, button");
        $inputs.prop("disabled", true);

        var request = $.ajax({
            url: "/api/v1/population?apikey=correct-key-1",
            type: "post",
            data: formJson,
					  contentType: "application/json"
        });

        request.done(function (response, textStatus, jqXHR){
            table.ajax.reload();
        });

        request.fail(function (jqXHR, textStatus, errorThrown){
            console.error(
                "The following error occurred: "+
                    textStatus, errorThrown
            );
        });

        request.always(function () {
            // Reenable the inputs
            $inputs.prop("disabled", false);
        });


    });
});

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
