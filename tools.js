exports.removeByAttr = function(objectsArray, property, value) {
	var i = objectsArray.length;
	var cont = 0;
	while (i--) {
		if  (  objectsArray[i]
			&& objectsArray[i].hasOwnProperty(property)
			&& (arguments.length > 2 && objectsArray[i][property] === value)
			) {
			objectsArray.splice(i,1);
		cont++;
		}
	}
	return cont;
};

// return true if the object was found and deleted
exports.removeByProperty = function(objectsArray, property, value) {
    var newArray = objectsArray.filter((obj) => {
        // keep all except those with the value
        return obj[property] != value;
    });
    if (newArray.length == objectsArray.length) {
        return false; // not found
    }
    // replace the old array by the new array
    objectsArray.length = 0;
    Array.prototype.push.apply(objectsArray, newArray);
    return true;
};

// return true if the object was found and deleted
exports.removeByTwoProperties = function(objectsArray,
                                         property1, value1,
                                         property2, value2) {
    var newArray = objectsArray.filter((obj) => {
        // keep all except those with the right values
        return (obj[property1] != value1 || obj[property2] != value2);
    });
    if (newArray.length == objectsArray.length) {
        return false; // not found
    }
    // replace the old array by the new array
    objectsArray.length = 0;
    Array.prototype.push.apply(objectsArray, newArray);

    return true;
};

exports.findByAttr = function(objectsArray, property, value) {
	var ret = null;
	for (var i=0; i<arr.length; i++)
		if (arr[i][property] == value)
			ret = arr[i];
	return ret;
};

exports.findByProperty = function(objectsArray, property, value) {
    return objectsArray.find((obj) => {
        return obj[property] == value;
    });
};

exports.findAllByProperty = function(objectsArray, property, value) {
    return objectsArray.filter((obj) => {
        return obj[property] == value;
    });
};

exports.findAllByTwoProperties = function(objectsArray,
                                          property1, value1,
                                          property2, value2) {
    return objectsArray.filter((obj) => {
        return (obj[property1] == value1 && obj[property2] == value2);
    });
};

exports.findAllByMapProperties = function(objectsArray, mapProperties) {
    return objectsArray.filter((obj) => {
        return (searchingProperty(obj, mapProperties));
    });
};
function searchingProperty(obj, mapProperties){
    var ret = true;
    for (var propName in mapProperties)
        if (obj.hasOwnProperty(propName))
            if (obj[propName] != mapProperties[propName])
                ret = false;
    return ret;
}

exports.getFecha = function() {
	var meses      = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
	var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
	var fecha      = new Date();
	var m          = fecha.getMinutes();
	var s          = fecha.getSeconds();
	var minutos    = (m < 10) ? '0' + m : m;
	var segundos   = (s < 10) ? '0' + s : s;
	var ret        = diasSemana[fecha.getDay()] + ", " + fecha.getDate() + " de " + meses[fecha.getMonth()] + " de " + fecha.getFullYear() + " [" + fecha.getHours() + ":" + minutos + ":" + segundos + "]";
	return ret;
};

exports.readJSONfromFile = function(fileName) {
    var fs = require('fs');
    return JSON.parse(fs.readFileSync(fileName, 'utf8'));
};

exports.getInterval = function(objectsArray, offset, limit) {
    var vFrom = (offset == undefined) ? 0: Math.abs(Number(offset));
    var vMany = (limit  == undefined) ? objectsArray.length - vFrom: Math.abs(Number(limit));
    var vTo   = vFrom + vMany;
    return objectsArray.slice(vFrom, vTo);
};

exports.selectFields = function(objectsArray, fieldsArray) {
    if (fieldsArray == undefined)
        return objectsArray;
    else
        return JSON.parse(JSON.stringify(objectsArray, fieldsArray.split(',')));
};

exports.findAllByRange = function(objectsArray, propertyName, minValue, maxValue) {
    return objectsArray.filter((obj) => {
        return (isBetween(obj, propertyName, minValue, maxValue));
    });
};
function isBetween(obj, propertyName, minValue, maxValue) {
    if ( minValue && !maxValue) { return obj[propertyName] >= minValue; }
    if (!minValue &&  maxValue) { return obj[propertyName] <= maxValue; }
    if ( minValue &&  maxValue) { return obj[propertyName] >= minValue && obj[propertyName] <= maxValue; }
    return true;
}

exports.checkApiKey = function(request, keyValue) {
    return (request.query.apikey && request.query.apikey == keyValue);
};

//Ordenar un array de datos JSON
exports.sortJsonArrayByProperty = function(objArray, prop, direction){
    /*
    sortJsonArrayByProperty(results, 'attributes.OBJECTID');
    sortJsonArrayByProperty(results, 'attributes.OBJECTID', -1);
    */
    if (arguments.length<2) throw new Error("sortJsonArrayByProp requiere 2 argumentos");
    var direct = arguments.length>2 ? arguments[2] : 1; //Por defecto, ascendentemente

    if (objArray && objArray.constructor === Array){
        var propPath = (prop.constructor === Array) ? prop : prop.split(".");
        objArray.sort(function(a,b){
            for (var p in propPath){
                if (a[propPath[p]] && b[propPath[p]]){
                    a = a[propPath[p]];
                    b = b[propPath[p]];
                }
            }
            // convierte cadenas numérica en enteros (integers)
            a = a.match(/^\d+$/) ? +a : a;
            b = b.match(/^\d+$/) ? +b : b;
            return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
        });
    }
};

exports.missing = function (attribute) {
    return attribute == undefined || attribute == '';
};
