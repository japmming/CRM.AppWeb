//TODO: FILTERS
var $frIsDate = function (date) {
    var dtCh = "/";
    var dtCh2 = "-";
    var minYear = 1900;
    var maxYear = 2100;
    function isInteger(s) {
        var i;
        for (i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if ((c < "0") || (c > "9")) return false;
        }
        return true;
    }
    function stripCharsInBag(s, bag) {
        var i;
        var returnString = "";
        for (i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (bag.indexOf(c) == -1) returnString += c;
        }
        return returnString;
    }
    function daysInFebruary(year) {
        return (((year % 4 == 0) && ((!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28);
    }
    function DaysArray(n) {
        var t = [];
        for (var i = 1; i <= n; i++) {
            t[i] = 31;
            if (i == 4 || i == 6 || i == 9 || i == 11) t[i] = 30;
            if (i == 2) t[i] = 29;
        }
        return t;
    }
    function isDate(dtStr) {
        if (dtStr !== "") {
            var daysInMonth = DaysArray(12);
            var pos1 = dtStr.indexOf(dtCh) > -1 ? dtStr.indexOf(dtCh) : dtStr.indexOf(dtCh2);
            var pos2 = dtStr.indexOf(dtCh) > -1 ? dtStr.indexOf(dtCh, pos1 + 1) : dtStr.indexOf(dtCh2, pos1 + 1);
            var strDay = dtStr.indexOf(dtCh) > -1 ? dtStr.substring(0, pos1) : dtStr.substring(pos2 + 1);
            var strMonth = dtStr.substring(pos1 + 1, pos2);
            var strYear = dtStr.indexOf(dtCh) > -1 ? dtStr.substring(pos2 + 1) : dtStr.substring(0, pos1);
            var strYr = strYear;
            if (strDay.charAt(0) == "0" && strDay.length > 1) strDay = strDay.substring(1);
            if (strMonth.charAt(0) == "0" && strMonth.length > 1) strMonth = strMonth.substring(1);
            for (var i = 1; i <= 3; i++) {
                if (strYr.charAt(0) == "0" && strYr.length > 1) strYr = strYr.substring(1);
            }
            var month = parseInt(strMonth);
            var day = parseInt(strDay);
            var year = parseInt(strYr);
            if (pos1 == -1 || pos2 == -1)
                return false;
            if (strMonth.length < 1 || month < 1 || month > 12)
                return false;
            if (strDay.length < 1 || day < 1 || day > 31 || (month == 2 && day > daysInFebruary(year)) || day > daysInMonth[month])
                return false;
            if (strYear.length != 4 || year == 0 || year < minYear || year > maxYear)
                return false;
            if (dtStr.indexOf(dtCh) > 0) {
                if (dtStr.indexOf(dtCh, pos2 + 1) != -1 || isInteger(stripCharsInBag(dtStr, dtCh)) == false) {
                    return false;
                }
            }
            if (dtStr.indexOf(dtCh2) > 0) {
                if (dtStr.indexOf(dtCh2, pos2 + 1) != -1 || isInteger(stripCharsInBag(dtStr, dtCh2)) == false) {
                    return false;
                }
            }
            //if (dtStr.indexOf(dtCh2, pos2 + 1) != -1 || isInteger(stripCharsInBag(dtStr, dtCh2)) == false)
            //    return false;
            return true;
        } else {
            return true;
        }
    }
    if (isDate(date)) return true;
    else return false;
};

var $frBorrarComas = function (valor) {
    if (typeof valor.replace == "function") {
        valor = valor.replace(/,/g, "");
        if (isNaN(valor))
            valor = "0.00";
        return valor;
    }
};

var $frRedondeo = function (numero, digitos) {
    if (!isNaN(numero)) {
        var flotante = parseFloat(numero);
        var resultado = Math.round(flotante * Math.pow(10, digitos)) / Math.pow(10, digitos);
        return resultado
    }
    else "0." + "0000000".substring(0, digitos);
};

var $frDecimal = function (valor, digitos) {
    if (digitos == undefined) { digitos = 2; };
    if (typeof valor.replace == "function") {
        valor = valor.replace(/,/g, "");
    }
    if (valor != "") {
        if (valor != ".") {
            if (isNaN(valor)) return ($frRedondeo(valor, digitos) * 1).toLocaleString('en-US', { minimumFractionDigits: digitos, maximumFractionDigits: digitos });
            else return ($frRedondeo(valor, digitos) * 1).toLocaleString('en-US', { minimumFractionDigits: digitos, maximumFractionDigits: digitos });
        }
        else {
            return "0." + "0000000".substring(0, digitos);
        }
    } else { return "0." + "0000000".substring(0, digitos) };
};

var $frWeb = function (obj) {
    if (obj.value != "") {
        var strExpReg = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
        if (!strExpReg.test(obj.value)) {
            obj.parentElement.classList.add('has-error');
        }
        else {
            obj.parentElement.classList.remove('has-error');
        }
    }
    else {
        obj.parentElement.classList.remove('has-error');
    }
};

var $frMail = function (obj) {
    if (obj.value != "") {
        var strExpReg = /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
        if (!strExpReg.test(obj.value)) {
            obj.parentElement.classList.add('has-error');
        }
        else {
            obj.parentElement.classList.remove('has-error');
        }
    }
    else {
        obj.parentElement.classList.remove('has-error');
    }
};

//TODO: REQUISITO DEL CONTROL 'GRID'
var $frQuitarAcentos = function (cadena) {
    var strAccents = cadena.split('');
    var strAccentsOut = new Array();
    var strAccentsLen = strAccents.length;
    var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    var accentsOut = ['A', 'A', 'A', 'A', 'A', 'A', 'a', 'a', 'a', 'a', 'a', 'a', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'o', 'o', 'o', 'o', 'o', 'o', 'E', 'E', 'E', 'E', 'e', 'e', 'e', 'e', 'e', 'C', 'c', 'D', 'I', 'I', 'I', 'I', 'i', 'i', 'i', 'i', 'U', 'U', 'U', 'U', 'u', 'u', 'u', 'u', 'N', 'n', 'S', 's', 'Y', 'y', 'y', 'Z', 'z'];
    for (var y = 0; y < strAccentsLen; y++) {
        if (accents.indexOf(strAccents[y]) != -1) {
            strAccentsOut[y] = accentsOut[accents.indexOf(strAccents[y])];
        }
        else
            strAccentsOut[y] = strAccents[y];
    }
    strAccentsOut = strAccentsOut.join('');
    return strAccentsOut;
};

var $frFormatoFecha = function (fecha) {
    var rpta = '';
    if (fecha.trim() != "") {
        if (fecha != undefined) {
            switch ($controls.datepicker.format) {
                case 'mm/dd/yyyy': {
                    var node = fecha.split('/');
                    rpta = node[1] + '/' + node[0] + '/' + node[2];
                    break;
                }
                case 'dd/mm/yyyy': {
                    rpta = fecha;
                    break;
                }
            }
        }
    }
    return rpta;
};

var $frFormatoFechaPeru = function (fecha) {
    var rpta = '';
    if (fecha.trim() != "") {
        if (fecha != undefined) {
            var node = fecha.split('/');
            rpta = node[1] + '/' + node[0] + '/' + node[2];
        }
    }
    return rpta;
};

var $frFormatFechaPeru = function (fecha) {
    var rpta = '';
    if (fecha.trim() != "") {
        if (fecha != undefined) {
            var node = fecha.split('-');
            rpta = node[2] + '/' + node[1] + '/' + node[0];
        }
    }
    return rpta;
};

var $frFormatFechaTiempoPeru = function (fecha) {
    var rpta = '';
    if (fecha.trim() != "") {
        if (fecha != undefined) {
            var fec = fecha.split(' ');
            var node = fec[0].split('-');
            rpta = node[2] + '/' + node[1] + '/' + node[0];
        }
    }
    return rpta + ' ' + fec[1];
};

var $frConvertToDateString = function (date) {
    var rpta = '';
    if (date) {
        //rpta = $fnPadLeft(date.getDate().toString(), 2, '0') + '/' + $fnPadLeft((date.getMonth() + 1).toString(), 2, '0') + '/' + date.getFullYear().toString();
        rpta = date.getFullYear().toString() + '-' + $fnPadLeft((date.getMonth() + 1).toString(), 2, '0') + '-' + $fnPadLeft(date.getDate().toString(), 2, '0')  ;
    }
    return rpta;
};

var $frCerosFill = function (number, width) {
    var retornar = '0'
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */
    var zero = "0"; /* String de cero */

    if (width <= length) {
        if (number < 0) {
            retornar = ("-" + numberOutput.toString());
        } else {
            retornar = numberOutput.toString();
        }
    } else {
        if (number < 0) {
            retornar = ("-" + (zero.repeat(width - length)) + numberOutput.toString());
        } else {
            retornar = ((zero.repeat(width - length)) + numberOutput.toString());
        }
    }
    return retornar
};

var $frValidateMail = function (obj) {

    var rpta = false;

    if (obj.value != "") {
        var strExpReg = /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
        if (!strExpReg.test(obj.value)) {
            obj.parentElement.classList.add('has-error');
            rpta = false;
        }
        else {
            obj.parentElement.classList.remove('has-error');
            rpta = true;
        }
    }
    else {
        obj.parentElement.classList.remove('has-error');
        rpta = true;
    }

    return rpta;
};


var $frSumarDiasFecha = function (nroDias, p_fechaIni) {
    var fechaIni = p_fechaIni.split('-');
    var anio = (fechaIni[0] * 1);
    var mes = (fechaIni[1] * 1) - 1;
    var dia = (fechaIni[2] * 1);
    var DateVar = new Date(anio, mes, dia);
    nroDias = (nroDias * 1);
    DateVar.setDate(DateVar.getDate() + nroDias);
    var DateStandar = $frConvertToDateString(DateVar);
    return DateStandar;

};