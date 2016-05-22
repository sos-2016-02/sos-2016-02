function getResourceId() {
	return $('input[name=tblId]:checked').attr('value');
}

function getResourcesCheked() {
    var vValues = new Array();
    $('input[name="tblId"]:checked').each(function() {
        vValues.push($(this).val());
    });
    return vValues;
}

function createTableData(objArray) {
 
    //var array = objArray;
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str   = '<table id="tblData" class="tablesorter">';
 
    // table <head>
    str += '<thead><tr><th>&nbsp;</th>';
    /*
    for (var index in array[0]) {
        str += '<th>' + index + '</th>';
    }
    */
    str += '<th>' + 'province' + '</th>';
    str += '<th>' + 'year' + '</th>';
    str += '<th>' + 'men' + '</th>';
    str += '<th>' + 'women' + '</th>';

    str += '</tr></thead>';
 
    // table <body>
    str += '<tbody>';
    for (var i=0; i < array.length; i++) {
        str += '<tr>';
		// Identificador de cada fila: province/year
		str += '<td width="10"><input type="checkbox" name="tblId" ';
		//if (i==0) str += 'checked="checked"';
		str += ' value="' + array[i]['province'] + "/" + array[i]['year'] + '"/></td>';
        str += '<td>' + array[i]['province'] + '</td>';
        str += '<td>' + array[i]['year'] + '</td>';
        str += '<td>' + array[i]['men'] + '</td>';
        str += '<td>' + array[i]['women'] + '</td>';
        /*
        for (var index in array[i]) {
            str += '<td>' + array[i][index] + '</td>';
        }
        */
        str += '</tr>';
    }
    str += '</tbody>'
    str += '</table>';
    return str;
}

function obtenerURLBase() {
	//vURLBase    = vServer + "/api/" + vAPIversion + "/" + vAPIname + "/";
    vURLBase = "/api/" + vAPIversion + "/" + vAPIname + "/";
	return vURLBase;		
}

function showMessage(pCode, pText) {
	var vClass;
	var vType;
	switch(pCode){
        case 0  : vClass = "msgNone";  vType = "";        break;
        case 200:
        case 201: vClass = "msgOK";    vType = "OK: ";    break;
        case 401:
        case 402:
        case 404:
        case 409: vClass = "msgERROR"; vType = "ERROR: "; break;
		case 999: vClass = "msgINFO";  vType = "INFO: ";  break;
	}
	$('#divMessage').removeClass();
	$('#divMessage').addClass(vClass);
	$("#divMessage").text(vType + pText);
}

function getFieldsJSON() {
    var obj = new Object();
        obj.province = $('#txtProvince').val();
        obj.year     = $('#txtYear').val();
        obj.men      = $('#txtMen').val();
        obj.women    = $('#txtWomen').val();
    var jsonString = JSON.stringify(obj);
    return jsonString;
}