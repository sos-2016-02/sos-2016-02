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
    for (var prop in mapProperties) {
        console.log("trabajando: ", prop, mapProperties[prop]);
    }

    return objectsArray.filter((obj) => {
        return ( existe(obj, mapProperties)
            
            
            //obj[property1] == value1 && obj[property2] == value2
            
            );
    });

};
function existe(obj, mapProperties){
    var ret = true;
    for (var prop in mapProperties) {
        if (obj[prop]!=mapProperties[prop])
            ret=false;
    }
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
}

exports.getInterval = function(objectsArray, offset, limit) {
    var vFrom = (offset == undefined) ? 0: Math.abs(Number(offset));
    var vMany = (limit  == undefined) ? objectsArray.length - vFrom: Math.abs(Number(limit));
    var vTo   = vFrom + vMany;
    return objectsArray.slice(vFrom,vTo);
}