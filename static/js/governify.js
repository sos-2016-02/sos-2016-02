"use strict";

var GOVERNIFY_API_URL = "/api/proxy/governify/api/v6.1/sos-2016-02-vg/agreements/multiPlan_C4_sos-2016-02-vg_ag";

document.addEventListener("DOMContentLoaded", function(event) {
    displayNumberOfPerformedRequests();
});



function displayNumberOfPerformedRequests() {
    performAjaxRequest({
        url: GOVERNIFY_API_URL,
        type: "GET",
        doneCallback: updateDom
    });
}

function updateDom(response, status) {
    var numberOfRequests = extractNumberOfRequest(response);
    byId("number-of-requests").innerHTML = numberOfRequests;
    console.log(numberOfRequests);
}


// helpers /////////////////////////////////////////////////////////////////////
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


function extractNumberOfRequest(response) {
    // match anything until "\tRequests"
    // match "\tRequests: int = "
    // capture the number
    // match the ";" just after even if not necesarry
    var myRegexp = /.+?(?=\tRequests)\tRequests: int = (\d+);/g;
    var matches = myRegexp.exec(response);
    return matches[1];
}

function byId(id) {
    return document.getElementById(id);
};
