exports.removeByAttr = function(arr, attr, value) {
	var i = arr.length;
	var cont = 0;
	while (i--) {
		if  (  arr[i]
			&& arr[i].hasOwnProperty(attr)
			&& (arguments.length > 2 && arr[i][attr] === value)
			) {
			arr.splice(i,1);
		cont++;
		}
	}
	return cont;
};



// return true if the object was found and deleted
exports.removeByProperty = function(objectsArray, property, value) {
    var oldArrayLength = objectsArray.length;
    var newArray = objectsArray.filter((obj) => {
        return obj[property] != value;  // keep all except those with the value
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
    var oldArrayLength = objectsArray.length;
    var newArray = objectsArray.filter((obj) => {
        // keep all except those with the right values
        return obj[property1] != value1 &&
               obj[property2] != value2;
    });
    if (newArray.length == objectsArray.length) {
        return false; // not found
    }
    // replace the old array by the new array
    objectsArray.length = 0;
    Array.prototype.push.apply(objectsArray, newArray);
    return true;
};


exports.findByAttr = function(arr, attr, value) {
	var ret = null;
	for (var i=0; i<arr.length; i++)
		if (arr[i][attr] == value)
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
