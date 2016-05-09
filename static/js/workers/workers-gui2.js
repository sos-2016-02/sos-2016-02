"use strict";


$(document).ready(function() {
	//llamadas que estoy haciendo a mi jquery or javascritp
	var operation = "C"; //"C"=Crear
  var selected_index = -1; // Indice de el elemento seleccionado en la lista
  var workers = sessionStorage.getItem("workers-data"); //Retornar los datos almacenados
    workers = JSON.parse(workers ); //Convertir String a Object
 var dobles_comillas = String.fromCharCode(34);
  if (workers  === null) // Si no hay datos, inicializar un array vacio
      workers  = [];
      function Mostrar() {
        var request = $.ajax({
                    url: "/api/v1/workers?apikey="+$("#api-key-input").val(),
                    type: "GET",
                    data: "",
                    dataType: "JSON",
                    contentType: "application/json"
                    });

        request.done(function(data,status,jqXHR){
		console.log(JSON.stringify(data));
		var table = makeTable(data);
		//Quiero mostrar todos los elemento de DOM
		//is dumped to the console window
		console.log(table[0].outerHTML);
		$("#workers-data").html(table);

	});

	request.always(function(jqXHR, status){
		console.log("Let me know the status:" + status);
	});
        }
  

	$("#btnLoadInitialData").click(function(){
		loadInitialData();

	});  
	$('#search-year-or-industry-input').click(function(){
		Search();
		
	});

	$(".search-year-or-industry-input").bind("click", function () {
    operation = "S";
    $("#province-input").attr("readonly", "readonly");
    $("#value-input").attr("readonly", "readonly");
  });
	$("#datum-form-button").click(function(){
		Create();
	});

	$("#editdatum").click(function(){
		Edit();
	});
	$(".editdatum").bind("click", function () {
    operation = "E"; //"E" = Editar
    //Obtener el identificador del item a ser editado
    selected_index = parseInt($(this).attr("alt").replace("Edit", ""));
    // Convertir de JSON al formato adecuando para editarlos datos
    var per = workers[selected_index];
    $("#province-input").val(per.province);
    $("#year-input").val(per.year);
    $("#industry-input").val(per.industry);
    $("#value-input").val(per.value);
    $("#year-input").focus();
  });
  

	$("#deletedatum").click(function(){
		Delete();
	});
	$(".btnLoadInitialData").bind("click", function () {
    operation="L";
    $("#province-input").attr("readonly", "readonly");
    $("#year-input").attr("readonly", "readonly");
    $("#industry-input").attr("readonly", "readonly");
    $("#value-input").attr("readonly", "readonly");
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



  function Mostrar() {
        var request = $.ajax({
                    url: "/api/v1/workers?apikey="+$("#api-key-input").val(),
                    type: "GET",
                    data: "",
                    dataType: "JSON",
                    contentType: "application/json"
                    });
        request.done(function(data,status,jqXHR){
		console.log(JSON.stringify(data));
		var table = makeTable(data);
		//Quiero mostrar todos los elemento de DOM
		//is dumped to the console window
		console.log(table[0].outerHTML);
		$("#workers-data").html(table);

	});

       request.always(function(jqXHR) {
        console.log( "Status:"+jqXHR.status);
       });
        return true;
      }




  function loadInitialData() {
    var request = $.ajax({
                url: "/api/v1/workers/loadInitialData?apikey="+$("#api-key-input").val(),
                type: "GET",
                data: "",
                dataType: "JSON",
                contentType: "application/json"
                });
    request.done(function(data,status,jqXHR){
		console.log(JSON.stringify(data));
		var table = makeTable(data);
		//Quiero mostrar todos los elemento de DOM
		//is dumped to the console window
		console.log(table[0].outerHTML);
		$("#workers-data").html(table);

	});

   request.always(function(jqXHR, status){
		console.log("Let me know the status:" + status);
	});
   if($("#api-key-input").val()!="sos"){
     alert("Error contraseña");
  } else{
    alert("Datos reseteados");
  }
    Mostrar();
    return true;
  }//======================================================================

function Create() {
    var status;
    var p=$("#province-input").val();
    var y=$("#year-input").val();
    var i=$("#industry-input").val();
    var v=$("#value-input").val();
    var request = $.ajax({
                url: "/api/v1/workers?apikey="+$("#api-key-input").val(),
                type: "POST",
                data: "{"+dobles_comillas+"province"+dobles_comillas+":"+dobles_comillas+c+dobles_comillas+","+dobles_comillas+"year"+dobles_comillas+":"+y+","+dobles_comillas+"industry"+dobles_comillas+":"+i+","+dobles_comillas+"value"+dobles_comillas+":"+v+"}",
                dataType: "JSON",
                contentType: "application/json"
                });
    request.done(function(data,status,jqXHR){
		console.log(JSON.stringify(data));
		var table = makeTable(data);
		//Quiero mostrar todos los elemento de DOM
		//is dumped to the console window
		console.log(table[0].outerHTML);
		$("#workers-data").html(table);

	});

	request.always(function(jqXHR, status){
		console.log("Let me know the status:" + status);
	
	 if($("#api-key-input").val()!="sos")
     alert("Error contraseña");
     if(status == 409)
     alert("Elemento repetido");
     else
     alert("Los datos han sido almacenados");
    console.log( "Status:"+jqXHR.status);
   });
    Mostrar();
    return true;
  }

  function Edit() {
    var p=$("#province-input").val();
    var y=$("#year-input").val();
    var i=$("#industry-input").val();
    var v=$("#value-input").val();
    var request = $.ajax({
                url: "/api/v1/workers/"+y+"/"+i+"?apikey="+$("#api-key-input").val(),
                type: "PUT",
                data: "{"+dobles_comillas+"province"+dobles_comillas+":"+dobles_comillas+p+dobles_comillas+","+dobles_comillas+"year"+dobles_comillas+":"+y+","+dobles_comillas+"industry"+dobles_comillas+":"+i+","+dobles_comillas+"value"+dobles_comillas+":"+v+"}",
                dataType: "JSON",
                contentType: "application/json"
                });
    request.done(function(data,status,jqXHR){
    console.log(JSON.stringify(data));
    var table = makeTable(data);
    //Quiero mostrar todos los elemento de DOM
    //is dumped to the console window
    console.log(table[0].outerHTML);
    $("#workers-data").html(table);

  });
   request.always(function(jqXHR, status){
		console.log("Let me know the status:" + status);
	});
   if($("#api-key-input").val()!="sos"){
     alert("Error contraseña");
   }else{
    alert("Los datos han sido editados");
  }//Mensaje de alerta
    Mostrar();
    return true;
  }


    function Delete() {
    var p=$("#province-input").val();
    var y=$("#year-input").val();
    var i=$("#industry-input").val();
    var v=$("#value-input").val();
    var request = $.ajax({
                url: "/api/v1/workers/"+y+"/"+i+"?apikey="+$("#api-key-input").val(),
                type: "DELETE",
                data: "{"+dobles_comillas+"province"+dobles_comillas+":"+dobles_comillas+p+dobles_comillas+","+dobles_comillas+"year"+dobles_comillas+":"+y+","+dobles_comillas+"industry"+dobles_comillas+":"+i+","+dobles_comillas+"value"+dobles_comillas+":"+v+"}",
                dataType: "JSON",
                contentType: "application/json"
                });
     request.done(function(data,status,jqXHR){
    console.log(JSON.stringify(data));
    var table = makeTable(data);
    //Quiero mostrar todos los elemento de DOM
    //is dumped to the console window
    console.log(table[0].outerHTML);
    $("#workers-data").html(table);

  });
   request.always(function(jqXHR, status){
		console.log("Let me know the status:" + status);
	});
	   if($("#api-key-input").val()!="sos"){
     alert("Error contraseña");
   }else{
    alert("El dato ha sido eliminado");
  } //Mensaje de alerta
    Mostrar();
    return true;
  }

    function Search() {
    var y=$("#year-input").val();
    var i=$("#industry-input").val();
    var request = $.ajax({
                url: "/api/v1/workers/"+y+"/"+i+"?apikey="+$("#api-key-input").val(),
                type: "GET",
                data: "",
                dataType: "JSON",
                contentType: "application/json"
                });
     request.done(function(data,status,jqXHR){
    console.log(JSON.stringify(data));
    var table = makeTable(data);
    //Quiero mostrar todos los elemento de DOM
    //is dumped to the console window
    console.log(table[0].outerHTML);
    $("#workers-data").html(table);

  });
   request.always(function(jqXHR, status){
		console.log("Let me know the status:" + status);
	});
   if($("#api-key-input").val()!="sos"){
     alert("Error contraseña");
  } else{
    alert("Busqueda realizada");
  }
    return true;
  }


  