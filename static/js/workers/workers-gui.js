"use strict";

var API_WORKERS_URL = "/api/v1/workers";
var ERROR_WRONG_API_KEY = "The API key that you provided has been refused, check for any typo";
var table;
var vLimit   = 11;
var vPageNum = 1;

var byId = function(id) {return document.getElementById(id);};

$(document).ready(function() {
    var request  = $.ajax({
        url  :"/api/v1/workers"
        ,type :"GET"
         
        ,contentType: "aplication/json"

        
    });

    $("#btnLoadInitialData").click(function(){
        loadInitialData();

    });  

    $("#btnDelete").click(function(){ 
        deleteRecurso(); 
    });
    $("#btnUpdate").click(function(){ 
        updateRecurso(); 
    });
    $("#btnCreate").click(function(){ 
        createRecurso(); 
    });
    $("#btnSearch").click(function(){ 
        searchRecurso(); 
    });
    //$("#btnCancel").click(function(){ editCancel();     });
    $("#btnSave").click(function()  { 
        editSave();       
    });
    $("#imgFisrt").click(function() { 
        fisrtPage();      
    });
    $("#imgPrev").click(function()  {
     PreviousPage();   
    });
    $("#imgNext").click(function()  { NextPage();       });
    $("#imgLast").click(function()  { LastPage();       });

    

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


//==========================FUNCTION======================

function fisrtPage() {
    vPageNum = 1;
    getAllData(""); 
}
function pagePrev() {
    vPageNum = (vPageNum > 1) ? vPageNum -= 1 : 1;
    getAllData(""); 
}
function pageNext() {
    vPageNum = (vPageNum < 10) ? vPageNum += 1 : 10;
    getAllData(""); 
}
function pageLast() {
    vPageNum = 11;
    getAllData(""); 
}

function LoadInitialData() {
    getAllData("loadInitialData");
    showMessage(999, "Initial Data Loaded.");
    pageFisrt();
}

function searchResource() {
    showMessage(0, "");
    getAllData($("#txtSearch").val());
}

function deleteResource() {
    setData("DELETE", getResourceId(), "");
    getAllData("");
}

function updateResource() {
    getOneResource("GET", getResourceId());
    $('#divManagerCtr').css('display', "none");
    $('#divFormulario').css('display', "block");
    $('#txtProvince').prop('disabled', true);
    $('#txtYear').prop('disabled', true);
    $('#btnSave').prop('value', "UPDATE");
    $('#btnSave').html("Update");
}

function createResource() {
    $('#divManagerCtr').css('display', "none");
    $('#divFormulario').css('display', "block");
    $('#txtProvince').prop('disabled', false);
    $('#txtYear').prop('disabled', false);
    $('#txtProvince').prop('value', "");
    $('#txtYear').prop('value', "");
    $('#txtMen').prop('value', "");
    $('#txtWomen').prop('value', "");
    $('#btnSave').prop('value', "CREATE");
    $('#btnSave').html("Create");
}

function editCancel() {
    $('#divManagerCtr').css('display', "block");
    $('#divFormulario').css('display', "none");
    showMessage(0, "");
}

function editSave() {
    if ($('#btnSave').val() == "UPDATE") {
        setData("PUT", getResourceId(), getFieldsJSON());
    }
    if ($('#btnSave').val() == "CREATE") {
        setData("POST", "", getFieldsJSON());
    }
    $('#divManagerCtr').css('display', "block");
    $('#divFormulario').css('display', "none");
    getAllData("");
}

function setData(pType, pQuery, pDataJSON) {

    var vApiKey = $("#txtApiKeyWrite").val();
    if ( vApiKey == "") {
        showMessage(999, "Please, write the Api-Key.");
        return;
    } else {
        vApiKey = "?apikey=" + vApiKey;
    }
    
    var x = obtenerURLBase() + pQuery + vApiKey;

    var request = $.ajax({
         url        : obtenerURLBase() + pQuery + vApiKey
        ,type       : pType
        ,data       : pDataJSON
        ,contentType: "application/json; charset=utf-8"
        ,cache      : false
    });

    request.done(function(data, status, jqXHR){
        showMessage(jqXHR.status, status);
    });     

    request.always(function(jqXHR, status){
        if (status != "success"){
            showMessage(jqXHR.status, jqXHR.statusText);
        }
    });
}

function getOneResource(pType, pQuery) {

    var vApiKey = "?apikey=keyRead";

    var request = $.ajax({
         url        : obtenerURLBase() + pQuery + vApiKey
        ,type       : "GET"
        ,data       : ""
        ,contentType: "application/json; charset=utf-8"
        ,cache      : false
    });

    request.done(function(data, status, jqXHR){
        $("#txtProvince").val(data[0]['province']);
        $("#txtYear").val(data[0]['year']);
        $("#txtMen").val(data[0]['men']);
        $("#txtWomen").val(data[0]['women']);
    });

}

function getAllData(pQuery) {

    var vApiKey = "?apikey=keyRead";

    // paginación
    $("#pageNum").html("&nbsp;&nbsp;" + vPageNum + "&nbsp;&nbsp;");
    vOffset = vPageNum * 10 - 10;
    vPages  = "&offset=" + vOffset + "&limit=" + vLimit;

    var request = $.ajax({
         url        : obtenerURLBase() + pQuery + vApiKey + vPages
        ,type       : "GET"
        ,data       : ""
        ,contentType: "application/json; charset=utf-8"
        ,cache      : false
    });

    request.done(function(data, status, jqXHR){
        $("#divTable").html(createTableData(data));
        $("#tblData").tablesorter({widthFixed: true, widgets: ['zebra']});
    });

    request.always(function(jqXHR, status){
        if (status != "success"){
            showMessage(jqXHR.status, jqXHR.statusText);
        }

    });

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
    
    var url = API_WORKERS_URL +  "/loadInitialData" + "?apikey=sos";
    
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
            window.alert(ERROR_MESSAGE_WRONG_API_KEY);
        }
        console.error(
            "The following error occurred: "+
                textStatus, errorThrown
        );
    });

    request.always(alwaysCallback);
}
