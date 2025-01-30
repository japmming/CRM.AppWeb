var $fnConvertStringToHex = function (str) {
    var hex = '';
    for (var i = 0; i < str.length; i++) {
        hex += str.charCodeAt(i).toString(16);
    }
    return hex;
};

var $fnConvertHexToString = function (hex) {
    var hex = hex.toString();
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
};

var $fnMD5 = function (d) {
    return hex_md5(d);
};

var $fnSetStorage = function (name, value) {
    window.localStorage.setItem(name, value);
};

var $fnGetStorage = function (name) {
    return window.localStorage.getItem(name) || '';
};

var $fnRemoveStorage = function (name) {
    window.localStorage.removeItem(name);
};

var $fnPadLeft = function (cadena, cantidad, textoAgregar) {
    return Array(cantidad - String(cadena).length + 1).join(textoAgregar || '0') + cadena;
};

var $fnCeroDate = function (valor) {
    var num = valor;

    if ((valor * 1) < 10) {
        num = '0' + valor;
    }
    return num;
};

var $fnDateNow = function () {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    return $fnCeroDate(dd) + "/" + $fnCeroDate(mm) + "/" + yyyy;
};

var $fnSetCombo = function (obj) {
    //TODO: controlId : Identificador del Control
    //TODO: data : Data en Array
    //TODO: type : Tipo de Combo 'S' / Seleccionar |  'T' / Todos | 'E' / Específico
    //TODO: value : Valor Inicial
    //TODO: description : Descripción Inicial
    //TODO: separator : Separador de Campos
    //TODO: valuePosition : Índice del valor
    //TODO: descriptionPosition : Índice de la descripción
    if (obj) {
        var data = obj.data || [];
        var ctrl = obj.controlId || '';
        var tipo = obj.type;
        var valorInicial = obj.value || '';
        var descripcionIncial = obj.description || '';
        var s = obj.separator || '¦';
        var pv = obj.valuePosition || 0;
        var pd = obj.descriptionPosition || 1;
        var c = [], v = '', d = '';
        if (tipo) {
            switch (tipo) {
                case 'S':
                    v = $controls.combo.valorInicial1;
                    d = $controls.combo.descripcionInicial1;
                    break;
                case 'T':
                    v = $controls.combo.valorInicial2;
                    d = $controls.combo.descripcionInicial2;
                    break;
                case 'E':
                    v = valorInicial;
                    d = descripcionIncial;
                    break;
                default:
                    break;
            }
            if (d != '') {
                c.push('<option value="');
                c.push(v);
                c.push('">');
                c.push(d);
                c.push('</option>');
            }
        }

        if (data != null) {
            var n = data.length;
            var campos;
            for (var i = 0; i < n; i++) {
                campos = data[i].split(s);
                c.push('<option value="');
                c.push(campos[pv]);
                c.push('">');
                c.push(campos[pd]);
                c.push('</option>');
            }
        }
        if (document.getElementById(ctrl)) {
            document.getElementById(ctrl).innerHTML = c.join('');
        }
        else {
            console.log($msg.error.control);
            console.log(obj.controlId);
        }
    }
    else console.log($msg.error.control);
};

var $fnFindText = function (text, list, indexCompare, indexResult) {
    indexCompare = indexCompare || 0;
    indexResult = indexResult || 1;
    var field = '';
    var value = '';
    for (var i = 0; i < list.length; i++) {
        field = list[i].split('¦');
        if (field[indexCompare] === text) {
            value = field[indexResult];
            break;
        }
    }
    return value;
};

var $fnValidarCampos = function (obj) {
    var c, qs, type, e, r, ctrl, entre, containers;
    var Input;
    entre = false;
    if (obj) {
        var o = obj;
        if (o.containers) {
            qs = document.querySelectorAll('[data-container]');
            containers = o.containers;
        }
    }
    var buscarContenedor = function (name) {
        var obj = {};
        for (var i = 0; i < qs.length; i++) {
            if (qs[i].getAttribute('data-container') == name) {
                obj = qs[i];
            }
        }
        return obj;
    };
    var getCaretPosition = function (ctrl) {
        // IE < 9 Support
        if (document.selection) {
            ctrl.focus();
            var range = document.selection.createRange();
            var rangelen = range.text.length;
            range.moveStart('character', -ctrl.value.length);
            var start = range.text.length - rangelen;
            return { 'start': start, 'end': start + rangelen };
        }
        // IE >=9 and other browsers
        else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
            return { 'start': ctrl.selectionStart, 'end': ctrl.selectionEnd };
        } else {
            return { 'start': 0, 'end': 0 };
        }
    };

    var Numerico = function (e) {
        var key;
        if (window.event) // IE
        {
            key = e.keyCode;
        }
        else if (e.which) // Netscape/Firefox/Opera
        {
            key = e.which;
        }
        return (key <= 13 || (key >= 48 && key <= 57) || key == 44 || key == 8);
    };
    var FormatoNumerico = function (valor) {
        var num = valor.replace(/\,/g, '');
        if (!isNaN(num)) {
            num = num.toString().split('').reverse().join('').replace(/(?=\d*\,?)(\d{3})/g, '$1,');
            num = num.split('').reverse().join('').replace(/^[\,]/, '');
            valor = (num == "") ? "0" : num;
        }
        else {
            valor = "0";
        }
        return valor;
    };
    var Decimal = function (el, evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode;
        var number = el.value.split('.');
        if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        //just one dot (thanks ddlab)
        if (number.length > 1 && charCode == 46) {
            return false;
        }
        //get the carat position
        var caratPos = getCaretPosition(el).start;
        var dotPos = el.value.indexOf(".");
        var decimales = ((el.getAttribute("data-digitos")) ? el.getAttribute("data-digitos") : "2") * 1;

        if (caratPos > dotPos && dotPos > -1 && (number[1].length > decimales - 1)) {
            return false;
        }
        return true;
    };
    var Cadena = function (el, evt) {
        var exito = true;
        var key;
        if (window.event) // IE
        {
            key = evt.keyCode;
        }
        else if (evt.which) // Netscape/Firefox/Opera
        {
            key = evt.which;
        }    
        var CharLocked = $config.charLocked;
        var dato = el.value + String.fromCharCode(key);
        for (var p = 0; p < CharLocked.length; p++) {
            if (dato.indexOf(CharLocked.substring(p, p + 1)) > -1) {
                exito = false
                break;
            }
        }
        return exito;
    };
    var CadenaTextArea = function (el, evt) {
        var exito = true;
        var key;
        if (window.event) // IE
        {
            key = evt.keyCode;
        }
        else if (evt.which) // Netscape/Firefox/Opera
        {
            key = evt.which;
        }

        var CharLocked = $config.charLocked;

        var dato = el.value + String.fromCharCode(key);

        for (var p = 0; p < CharLocked.length; p++) {
            if (dato.indexOf(CharLocked.substring(p, p + 1)) > -1) {
                exito = false
                break;
            }
        }
        return exito;
    };
    var Paste = function (el, e, drop) {
        var dato = "";
        var _lenght;
        if (drop) {
            dato = e.dataTransfer.getData("Text");
        }
        else {
            if (e.clipboardData) {
                dato = e.clipboardData.getData("text/plain");
            }
            else if (window.clipboardData) {
                dato = window.clipboardData.getData("Text");
            }
        }
        _lenght = el.value.length + dato.length;
        setTimeout(function () {
            var CharLocked = $config.charLocked;
            var caracter = "";
            var reg = "";
            for (var q = 0; q < CharLocked.length; q++) {
                caracter = CharLocked.substring(q, q + 1);
                if (caracter == "|") el.value = el.value.replace(/\|/g, '');
                else el.value = el.value.replace(new RegExp(caracter, 'g'), '');
            }
            if (el.className.indexOf('validate-dig-number') > -1) {
                el.value = el.value.replace(/[^0-9]+/g, '');
            }
            if (el.className.indexOf('validate-number') > -1) {
                el.value = el.value.replace(/[^0-9]+/g, '');
            }
            if (el.className.indexOf('validate-decimal') > -1) {
                el.value = dato.replace(/[^0-9\.]+/g, '');
            }
            if (el.className.indexOf('validate-date') > -1) {
                //if ($frIsDate(el.value) === false) {
                if ($frIsDate(el.value /*el.getAttribute('date-value')*/) === false) {
                    $alert.show($msg.validation.ErrorInDate);
                    el.value = "";
                    el.parentElement.classList.add('has-error');
                }
                else {
                    if (dato.indexOf('-') > 0 && dato.length == 10) {
                        let arrDato = dato.split('-');
                        el.value = arrDato[2] + '/' + arrDato[1] + '/' + arrDato[0];
                        //el.setAttribute('date-value', dato);
                        el.value = dato;
                    }
                    else el.value = dato;
                    el.parentElement.classList.remove('has-error');
                }
            }
            if (el.maxLength > -1) {
                if ((_lenght) > el.maxLength) {
                    $alert.show($msg.validation.TextCut.replace("[0]", el.maxLength));
                }
            }
            if (el.tagName.toUpperCase() == "TEXTAREA") {
                el.nextSibling.innerHTML = $msg.validation.MissingCharacters.replace("[0]", ((el.maxLength > -1) ? el.maxLength - el.value.length : ""));
                if ((el.maxLength - el.value.length) < 21) {
                    el.nextSibling.style.color = "red";
                } else { el.nextSibling.style.color = ""; }
            }
            if (typeof el.onkeyup == "function") {
                el.focus();
                el.onkeyup();
            }
        }, 0);
    };
    var NumMaxMin = function (el, e) {
        var key;
        if (window.event) // IE
        {
            key = e.keyCode;
        }
        else if (e.which) // Netscape/Firefox/Opera
        {
            key = e.which;
        }
        var valor = el.value; //+ String.fromCharCode(key);
        var valorFin = "";
        var ok = false;
        var pos = getCaretPosition(el).start;
        for (var b = 0; b < valor.length + 1; b++) {
            if (pos == b && ok != true) {
                valorFin += String.fromCharCode(key);
                b = b - 1;
                ok = true;
            } else {
                valorFin += valor.substring(b, b + 1);
            }
        }

        if (b == 0) { valorFin = String.fromCharCode(key) }
        //|| isNaN(parseInt(valorFin*1))
        var min = ((el.getAttribute("data-min")) ? el.getAttribute("data-min") : "0") * 1;
        var max = ((el.getAttribute("data-max")) ? el.getAttribute("data-max") : "99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999") * 1;
        if (Numerico(e) != false) {
            if (key != 8 && key != 13 && key != 37 && key != 39) {
                if (parseInt(valorFin * 1) < min) {
                    return false;
                }
                else if (parseInt(valorFin * 1) > max) {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    };
    var DecimalMaxMin = function (el, e) {
        var key;
        var _return = true;
        if (window.event) // IE
        {
            key = e.keyCode;
        }
        else if (e.which) // Netscape/Firefox/Opera
        {
            key = e.which;
        }
        var valor = el.value;
        var valorFin = "";
        var ok = false;
        var pos = getCaretPosition(el).start;
        var posEnd = getCaretPosition(el).end;
        for (var b = 0; b < valor.length + 1; b++) {
            if (pos == b && ok != true) {
                valorFin += String.fromCharCode(key);
                b = b - 1;
                ok = true;
            } else {
                valorFin += valor.substring(b, b + 1);
            }
        }

        if (b == 0) { valorFin = String.fromCharCode(key) }
        var decimales = ((el.getAttribute("data-digitos")) ? el.getAttribute("data-digitos") : 2) * 1;
        var min = parseFloat((el.getAttribute("data-min")) ? el.getAttribute("data-min") : "0");
        var dec = (el.getAttribute("data-max")) ? el.getAttribute("data-max") : ("9999999999999999999." + "99999999".substring(0, decimales));
        var max = parseFloat(dec);

        if (Decimal(el, e) != false) {
            if (key != 46 && key != 8 && key != 13 && key != 37 && key != 39) {
                if (parseFloat($frBorrarComas(valorFin) * 1) < min || isNaN(parseFloat($frBorrarComas(valorFin) * 1))) {
                    _return = false;
                } else if (parseFloat($frBorrarComas(valorFin) * 1) > max) {
                    _return = false;
                }
            }
        } else {
            _return = false;
        }
        if (pos == 0 && posEnd == el.value.length) {
            el.value = "";
        }
        return _return
    };
    var changeTextArea = function (el) {
        if (el.tagName.toUpperCase() == "TEXTAREA") {
            el.nextSibling.innerHTML = $msg.validation.MissingCharacters.replace("[0]", ((el.maxLength > -1) ? el.maxLength - el.value.length : ""));
            if ((el.maxLength - el.value.length) < 21) {
                el.nextSibling.style.color = "red";
            } else { el.nextSibling.style.color = ""; }
        }
    };
    var formatoCampos = function () {
        for (var a = 0; a < ((obj) ? containers.length : 1); a++) {
            c = (obj) ? buscarContenedor(containers[a]) : document;
            r = c.getElementsByClassName('form-control');
            for (var b = 0; b < r.length; b++) {
                ctrl = r[b];
                type = ctrl.className;
                if (ctrl.tagName.toUpperCase() == "INPUT") {
                    if (type.indexOf('validate-') > -1) {
                        if (type.indexOf('validate-number') > -1) {
                            if (ctrl.value == "") {
                                ctrl.value = "0";
                            }
                            ctrl.onkeypress = function (evt) {
                                if (NumMaxMin(this, event) == false) {
                                    event.preventDefault();
                                }
                                if (this.value.length > -1) {
                                    if (this.parentNode.classList.contains("has-error")) {
                                        this.parentNode.classList.remove("has-error")
                                    }
                                }
                            }
                            ctrl.onblur = function (evt) {
                                if (this.value == "") {
                                    this.value = "0";
                                }
                            }
                            ctrl.onfocus = function () {
                                this.selectionStart = 0;
                                this.selectionEnd = this.value.length;
                                this.focus();
                            }
                        }
                        if (type.indexOf('validate-dig-number') > -1) {
                            ctrl.onkeypress = function (evt) {
                                if (NumMaxMin(this, event) == false) {
                                    event.preventDefault();
                                }
                                if (this.value.length > -1) {
                                    if (this.parentNode.classList.contains("has-error")) {
                                        this.parentNode.classList.remove("has-error")
                                    }
                                }
                            }
                            ctrl.onfocus = function () {
                                this.selectionStart = 0;
                                this.selectionEnd = this.value.length;
                                this.focus();
                            }
                        }
                        if (type.indexOf('validate-decimal') > -1) {
                            if (ctrl.value == "") {
                                var decimales = ((ctrl.getAttribute("data-digitos")) ? ctrl.getAttribute("data-digitos") : "2") * 1;
                                ctrl.value = "0." + "00000000".substring(0, decimales);
                            }
                            if (type.indexOf('percent') > -1) {
                                if (ctrl.value.indexOf(" %") == -1) {
                                    ctrl.value = ctrl.value + " %";
                                }
                            }
                            ctrl.onkeypress = function (evt) {
                                /*console(this.getAttribute('readonly'));
                                if (this.getAttribute('readonly')) {*/
                                if (DecimalMaxMin(this, event) == false) {
                                    event.preventDefault();
                                }
                                /*}*/
                                if (this.value.length > -1) {
                                    if (this.parentNode.classList.contains("has-error")) {
                                        this.parentNode.classList.remove("has-error")
                                    }
                                }
                            }
                            ctrl.onblur = function () {
                                var decimales = ((this.getAttribute("data-digitos")) ? this.getAttribute("data-digitos") : "2") * 1;
                                if (this.value != "") {
                                    this.value = $frDecimal(this.value, decimales);
                                }
                                else {
                                    this.value = "0." + "00000000".substring(0, decimales);
                                }
                                if (this.className.indexOf('percent') > -1) {
                                    this.value = this.value.replace(" %", "") + " %";
                                }
                            }
                            ctrl.onfocus = function () {
                                if (this.className.indexOf('percent') > -1) {
                                    this.value = this.value.replace(" %", "");
                                }
                                this.selectionStart = 0;
                                this.selectionEnd = this.value.length;
                                this.focus();

                            }
                        }
                        if (type.indexOf('validate-web') > -1) {
                            ctrl.onblur = function () {
                                $frWeb(this);
                            }
                            //if (typeof ctrl.onkeypress == "function") {
                            //    //fnCreateEvent(ctrl, "keypress", function (evt) {
                            //    //	if (Cadena(this, evt) == false) {
                            //    //		evt.preventDefault();
                            //    //	}
                            //    //});
                            //}
                            //else {
                            ctrl.onkeypress = function (evt) {
                                if (Cadena(this, evt) == false) {
                                    evt.preventDefault();
                                }
                                if (this.value.length > -1) {
                                    if (this.parentNode.classList.contains("has-error")) {
                                        this.parentNode.classList.remove("has-error")
                                    }
                                }
                            }
                            //}
                        }
                        if (ctrl.className.indexOf("validate-mail") > -1) {
                            ctrl.onblur = function () {
                                this.value = this.value.trim();
                                $frMail(this);
                            }
                            ctrl.onkeypress = function (evt) {
                                if (Cadena(this, evt) == false) {
                                    evt.preventDefault();
                                }
                                if (this.value.length > -1) {
                                    if (this.parentNode.classList.contains("has-error")) {
                                        this.parentNode.classList.remove("has-error")
                                    }
                                }
                            }
                        }
                        if (type.indexOf('validate-date') > -1) {
                            $$datepicker(ctrl.id).create();
                            ctrl.onblur = function () {
                                //if ($frIsDate(this.value) === false) {
                                if ($frIsDate(this.value) === false) {
                                    $alert.show($msg.validation.ErrorInDate);
                                    this.value = "";
                                    this.parentElement.classList.add('has-error');
                                }
                                else {
                                    if (this.value.indexOf('-') > 0) {
                                        let arrValor = this.value.split('-');
                                        this.value = arrValor[2] + '/' + arrValor[1] + '/' + arrValor[0];
                                    }
                                    this.parentElement.classList.remove('has-error');
                                };
                            }
                        }
                    }
                    else {
                        ctrl.onkeypress = function (evt) {
                            var regex = new RegExp("^[a-zA-Z0-9.,/*\\-+=_% [\\]$@&()\#:¿?¡!°ñÑÀÁÄàáäÈÉËèéëÌÍÏìíïÒÓÖòóöÙÚÜùúü'\"]+$");
                            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                            if (!regex.test(key)) {
                                event.preventDefault();
                            }
                            if (this.value.length > -1) {
                                if (this.parentNode.classList.contains("has-error")) {
                                    this.parentNode.classList.remove("has-error")
                                }
                            }
                        }
                        //if (type.indexOf('text-original') != 13) {
                        //    ctrl.onblur = function () {
                        //        this.value = this.value.trim().toUpperCase();
                        //    }
                        //}
                    }
                    ctrl.onpaste = function (evt) {
                        Paste(this, evt);
                    }
                    ctrl.ondrop = function (evt) {
                        Paste(this, evt, true);
                    }
                    ctrl.autocomplete = 'off';
                }
                if (ctrl.tagName.toUpperCase() == "TEXTAREA") {

                    if (ctrl.getAttribute('maxlength')) {
                        if (!ctrl.parentNode.getElementsByTagName("SPAN")[0]) {
                            var newItem = document.createElement("span");
                            newItem.innerHTML = $msg.validation.MissingCharacters.replace("[0]", ctrl.maxLength);
                            if ((ctrl.maxLength - ctrl.value.length) < 21) {
                                newItem.style.color = "red";
                            }
                            ctrl.parentNode.insertBefore(newItem, ctrl.nextSibling);
                        }
                        ctrl.nextSibling.innerHTML = $msg.validation.MissingCharacters.replace("[0]", ((ctrl.maxLength > -1) ? ctrl.maxLength - ctrl.value.length : ""));
                        ctrl.onchange = function (event) {
                            if (this.nextSibling) {
                                this.nextSibling.innerHTML = $msg.validation.MissingCharacters.replace("[0]", ((this.maxLength > -1) ? this.maxLength - this.value.length : ""));
                            }
                        };
                        ctrl.onkeyup = function (event) {
                            if (event) {
                                if (CadenaTextArea(this, event) == false) {
                                    event.preventDefault();
                                }
                                else {
                                    if (this.tagName.toUpperCase() == "TEXTAREA") {
                                        this.nextSibling.innerHTML = $msg.validation.MissingCharacters.replace("[0]", ((this.maxLength > -1) ? this.maxLength - this.value.length : ""));
                                      
                                        if ((this.maxLength - this.value.length) < 21) {
                                            this.nextSibling.style.color = "red";
                                        } else {
                                           this.nextSibling.style.color = "";
                                        }
                                    }
                                }
                            }
                        }
                        ctrl.onkeypress = function (evt) {
                            var regex = new RegExp("^[a-zA-Z0-9.,/*\\-+=_% [\\]$@&()\#:¿?¡!°ñÑÀÁÄàáäÈÉËèéëÌÍÏìíïÒÓÖòóöÙÚÜùúü'\"]+$");
                            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                            var EventKeyCode = (window.event) ? evt.keyCode : evt.which;

                            if (EventKeyCode != 13) {
                                if (!regex.test(key)) {
                                    event.preventDefault();
                                }
                            }
                        }

                        //if (type.indexOf('text-original') != 13) {
                        //    ctrl.onblur = function () {
                        //        this.value = this.value.trim().toUpperCase();
                        //    }
                        //}
                    }


                    if ((type.indexOf('validate-') > -1)) {
                        if (type.indexOf('validate-number') > -1) {
                            if (ctrl.value == "") {
                                ctrl.value = "";
                            }
                            ctrl.addEventListener('keypress', function (evt) {
                                if (NumMaxMin(this, event) == false) {
                                    event.preventDefault();
                                }
                                if (this.value.length > -1) {
                                    if (this.parentNode.classList.contains("has-error")) {
                                        this.parentNode.classList.remove("has-error")
                                    }
                                }

                            });
                            ctrl.addEventListener('blur', function (evt) {
                                if (this.value == "") {
                                    this.value = "";
                                }
                            });
                            ctrl.onfocus = function (evt) {
                                //this.selectionStart = 0;
                                //this.selectionEnd = this.value.length;
                                this.focus();
                            };
                        }
                        if (type.indexOf('validate-dig-number') > -1) {
                            ctrl.onkeypress = function (evt) {
                                if (NumMaxMin(this, event) == false) {
                                    event.preventDefault();
                                }
                                if (this.value.length > -1) {
                                    if (this.parentNode.classList.contains("has-error")) {
                                        this.parentNode.classList.remove("has-error")
                                    }
                                }
                            }
                            ctrl.onfocus = function () {
                                this.selectionStart = 0;
                                this.selectionEnd = this.value.length;
                                this.focus();
                            }
                        }
                    }

                    ctrl.onpaste = function (evt) {
                        //Paste(this, event);
                    }


                    ctrl.ondrop = function (evt) {
                        Paste(this, evt, true);
                    }
                }
                if (ctrl.parentElement.className == "input-box") {
                    ctrl.addEventListener('change', function () {
                        if (ctrl.value.length > 0) {
                            ctrl.parentElement.classList.add('active');
                        } else {
                            ctrl.parentElement.classList.remove('active');
                        }
                    });
                }
            }
        }
    };
    formatoCampos();
};

var $fnValidarForm = function (obj) {
    var o = obj, result = 0, percent = "";
    var ControlesErroneos = [];
    var ControlesErroneosLbl = [];
    if (o.containers != undefined) {
        var tabs = o.Tabs;
        var containers = o.containers;
        var c, qs, r, ctrl, e;
        var vm, vw, ctrlVM, ctrlVW, validations = {};
        qs = document.querySelectorAll('[data-container]');
        var buscarContenedor = function (name) {
            var obj = {};
            for (var i = 0; i < qs.length; i++) {
                if (qs[i].getAttribute('data-container') == name) {
                    obj = qs[i];
                }
            }
            return obj;
        };
        var posicionarValidacion = function (obj, contenedor) {
            var objCurrent = obj;
            while (true) {
                obj = obj.parentElement;
                if (obj.getAttribute('data-container') == contenedor) break;
                if (obj.id) {
                    if (obj.id.indexOf('-Tabs-') > -1) {
                        if (document.querySelector('[data-tab="' + obj.id + '"]')) {
                            document.querySelector('[data-tab="' + obj.id + '"]').click();
                            var viewRoot = document.getElementsByTagName('view-root')[0].children[0];
                            viewRoot.scrollTop = 0;
                            viewRoot.scrollTop = objCurrent.getBoundingClientRect().top - objCurrent.getBoundingClientRect().height - 50;
                        }
                    }
                }
            }
        };
        var validarCampos = function (reset) {
            for (var a = 0; a < containers.length; a++) {
                c = buscarContenedor(containers[a]);
                validations[containers[a]] = [];
                if (!reset) {
                    vm = c.getElementsByClassName('validate-mail');
                    for (var d = 0; d < vm.length; d++) {
                        ctrlVM = vm[d];
                        if (ctrlVM.className.indexOf("validate-mail") > -1) {
                            if (ctrlVM.value != '') {
                                var strExpReg = /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
                                if (strExpReg.test(ctrlVM.value) == false) {
                                    ctrlVM.parentElement.classList.add('has-error');
                                    result++;
                                    validations[containers[a]].push(ctrlVM);
                                }
                                else ctrlVM.parentElement.classList.remove('has-error');
                            }
                        }
                    }
                    vw = c.getElementsByClassName('validate-web');

                    for (var e = 0; e < vw.length; e++) {
                        ctrlVW = vw[e];
                        if (ctrlVW.className.indexOf("validate-web") > -1) {
                            if (ctrlVW.value != '') {
                                var strExpReg = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
                                if (!strExpReg.test(ctrlVW.value)) {
                                    ctrlVW.parentElement.classList.add('has-error');
                                    result++;
                                    //validations[containers[a]].push(ctrlVM);
                                }
                                else ctrlVW.parentElement.classList.remove('has-error');
                            }
                        }
                    }

                    vw = c.getElementsByClassName('validate-number');
                    for (var e = 0; e < vw.length; e++) {
                        ctrlVW = vw[e];
                        var dato = ctrlVW.value * 1;

                        if (ctrlVW.value != "") {
                            if (!isNaN(dato)) {
                                ctrlVW.classList.remove('has-error');
                            } else {
                                ctrlVW.classList.add('has-error');
                            }
                        } else {
                            ctrlVW.classList.add('has-error');
                        }

                        if (ctrlVW.classList.contains('has-error')) {
                            result++;
                        }
                    }

                    vw = c.getElementsByClassName('validate-decimal');
                    for (var e = 0; e < vw.length; e++) {
                        ctrlVW = vw[e];
                        var dato = ctrlVW.value.replace(/./g, "");
                        dato = ctrlVW.value.replace(/./g, "") * 1;

                        if (ctrlVW.value != "") {
                            if (!isNaN(dato)) {
                                ctrlVW.classList.remove('has-error');
                            } else {
                                ctrlVW.classList.add('has-error');
                            }
                        } else {
                            ctrlVW.classList.add('has-error');
                        }

                        if (ctrlVW.classList.contains('has-error')) {
                            result++;
                            //validations[containers[a]].push(ctrlVM);
                        }
                        else {
                            ctrlVW.classList.remove('has-error');
                            if (ctrlVW.className.indexOf("percent") > -1) {
                                percent += "¦" + ctrlVW.id;
                            }
                        }
                    }

                } else {
                    vm = c.getElementsByClassName('validate-mail');
                    for (var d = 0; d < vm.length; d++) {
                        ctrlVM = vm[d];
                        ctrlVM.parentElement.classList.remove('has-error');

                    }
                    vm = c.getElementsByClassName('validate-web');
                    for (var d = 0; d < vm.length; d++) {
                        ctrlVM = vm[d];
                        ctrlVM.parentElement.classList.remove('has-error');

                    }
                    vm = c.getElementsByClassName('validate-decimal');
                    for (var d = 0; d < vm.length; d++) {
                        ctrlVM = vm[d];
                        ctrlVM.parentElement.classList.remove('has-error');

                    }
                }
                r = c.getElementsByClassName('required');
                for (var b = 0; b < r.length; b++) {
                    ctrl = r[b];
                    if (!reset) {
                        switch (ctrl.tagName) {
                            case 'INPUT':
                                if (ctrl.type == 'text' || ctrl.type == 'password') {
                                    if (ctrl.value.trim() == '') {
                                        ctrl.parentElement.classList.add('has-error');
                                        result++;
                                        validations[containers[a]].push(ctrl.parentElement);
                                    }
                                    else if (ctrl.className.indexOf("validate-dig-number") > -1) {
                                        if (ctrl.getAttribute("minlength") != null || ctrl.getAttribute("minlength") != '') {
                                            if (ctrl.value.trim().length >= ctrl.getAttribute("minlength")) {
                                                ctrl.parentElement.classList.remove('has-error');
                                            } else {
                                                ctrl.parentElement.classList.add('has-error');
                                            }
                                        }
                                    }
                                    else {
                                        if (ctrl.className.indexOf("validate-decimal") > -1) {
                                            var dato = ctrl.value.replace(/./g, "");
                                            dato = ctrl.value.replace(/,/g, "") * 1;
                                            if (dato == 0) {
                                                ctrl.parentElement.classList.add('has-error');
                                                result++;
                                                validations[containers[a]].push(ctrl.parentElement);
                                            }
                                            else {
                                                ctrl.parentElement.classList.remove('has-error');
                                            }
                                        } else if (ctrl.className.indexOf("validate-number") > -1) {
                                            var dato = ctrl.value.replace(/./g, "");
                                            dato = ctrl.value.replace(/,/g, "") * 1;
                                            if (dato == 0) {
                                                ctrl.parentElement.classList.add('has-error');
                                                result++;
                                                validations[containers[a]].push(ctrl.parentElement);
                                            }
                                            else {
                                                ctrl.parentElement.classList.remove('has-error');
                                            }
                                        }

                                        else {
                                            if (ctrl.className.indexOf("validate-web") == -1 && ctrl.className.indexOf("validate-mail") == -1) {
                                                ctrl.parentElement.classList.remove('has-error');
                                            }
                                        }
                                    };
                                }
                                break;
                            case 'TEXTAREA':
                                if (ctrl.value == '') {
                                    ctrl.parentElement.classList.add('has-error');
                                    result++;
                                    validations[containers[a]].push(ctrl);
                                }
                                else ctrl.parentElement.classList.remove('has-error');
                                break;
                            case 'SELECT':
                                if (ctrl.value == '') {
                                    ctrl.parentElement.classList.add('has-error');
                                    result++;
                                    validations[containers[a]].push(ctrl);
                                }
                                else ctrl.parentElement.classList.remove('has-error');
                                break;

                            case 'DIV':
                                if (ctrl.classList.contains('jtse-tags')) {
                                    if (ctrl.getAttribute('role-tags') == 'multiselect') {
                                        if ($$multiselect(ctrl.id).getValues() == '') {
                                            ctrl.classList.add('has-error');
                                            result++;
                                            validations[containers[a]].push(ctrl);
                                        }
                                        else ctrl.classList.remove('has-error');
                                    }
                                    if (ctrl.getAttribute('role-tags') == 'multitag') {
                                        if ($$multitag(ctrl.id).getValues() == '') {
                                            ctrl.classList.add('has-error');
                                            result++;
                                            validations[containers[a]].push(ctrl);
                                        }
                                        else ctrl.classList.remove('has-error');
                                    }
                                }
                                break;
                        }
                    }
                    else {
                        switch (ctrl.tagName) {
                            case 'INPUT':
                                ctrl.parentElement.classList.remove('has-error');
                            case 'TEXTAREA':
                                ctrl.parentElement.classList.remove('has-error');
                            case 'SELECT':
                                ctrl.parentElement.classList.remove('has-error');
                                break;
                            case 'DIV':
                                ctrl.classList.remove('has-error');
                                break;
                        }
                    }
                }
                ControlesErroneosLbl.push(c.getElementsByClassName('control-label'))
                if (validations[containers[a]].length > 0) {
                    for (var z = 0; z < validations[containers[a]].length; z++) {
                        ControlesErroneos.push(validations[containers[a]][z]);
                        //ControlesErroneosLbl.push(validations[containers[a]][z].children[1]);
                    }
                    posicionarValidacion(validations[containers[a]][0], containers[a]);
                }
                else {
                    if (percent != "") {
                        percent = percent.substring(1, percent.length);
                        var objs = percent.split("¦");
                        for (var b = 0; b < objs.length; b++) {
                            document.getElementById(objs[b]).value = document.getElementById(objs[b]).value.replace(" %", "");
                        }
                    }
                }
            }
        };
        validarCampos(false);
    }
    return {
        resultado: result,
        resetear: function () {
            validarCampos(true);
        },
        controles: ControlesErroneos,
        controleslbl: ControlesErroneosLbl
    };
};

var $fnIsMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function () {
        return ($fnIsMobile.Android() || $fnIsMobile.BlackBerry() || $fnIsMobile.iOS() || $fnIsMobile.Opera() || $fnIsMobile.Windows());
    }
};

var $fnIsMobileDevice = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};


var $fnSetPermission = function (permission, reset) {
    if (!reset) {
        $global.permission = {
            insert: Boolean(parseInt(permission[0])),
            edit: Boolean(parseInt(permission[1])),
            delete: Boolean(parseInt(permission[2])),
            print: Boolean(parseInt(permission[3])),
            excel: Boolean(parseInt(permission[4])),
            abort: Boolean(parseInt(permission[5]))
        };
    }
    else {
        $global.permission = {
            insert: false,
            edit: false,
            delete: false,
            print: false,
            excel: false,
            abort: false
        };
    }
};

var $isNumber = function (valor) {
    var log = valor.length; var sw = "S";
    for (var x = 0; x < log; x++) {
        var v1 = valor.substr(x, 1);
        var v2 = parseInt(v1);
        if (isNaN(v2)) { sw = "N"; }
    }
    if (sw === "S") { return true; } else { return false; }
};

var $formatDate = function (fecha) {
    var primerslap = false;
    var segundoslap = false;
    var long = fecha.length;
    var dia;
    var mes;
    var ano;

    if ((long >= 2) && (primerslap === false)) {
        dia = fecha.substr(0, 2);
        if (($isNumber(dia) === true) && (dia <= 31) && (dia !== "00")) { fecha = fecha.substr(0, 2) + "/" + fecha.substr(3, 7); primerslap = true; }
        else { fecha = ""; primerslap = false; }
    }
    else {
        dia = fecha.substr(0, 1);
        if ($isNumber(dia) === false) { fecha = ""; }
        if ((long <= 2) && (primerslap = true)) { fecha = fecha.substr(0, 1); primerslap = false; }
    }
    if ((long >= 5) && (segundoslap === false)) {
        mes = fecha.substr(3, 2);
        if (($isNumber(mes) === true) && (mes <= 12) && (mes !== "00")) { fecha = fecha.substr(0, 5) + "/" + fecha.substr(6, 4); segundoslap = true; }
        else { fecha = fecha.substr(0, 3); segundoslap = false; }
    }
    else { if ((long <= 5) && (segundoslap = true)) { fecha = fecha.substr(0, 4); segundoslap = false; } }
    if (long >= 7) {
        ano = fecha.substr(6, 4);
        if ($isNumber(ano) === false) { fecha = fecha.substr(0, 6); }
        else { if (long === 10) { if ((ano === 0) || (ano < 1900) || (ano > 2100)) { fecha = fecha.substr(0, 6); } } }
    }

    if (long >= 10) {
        fecha = fecha.substr(0, 10);
        dia = fecha.substr(0, 2);
        mes = fecha.substr(3, 2);
        ano = fecha.substr(6, 4);
        if ((ano % 4 !== 0) && (mes === '02') && (dia > 28)) { fecha = fecha.substr(0, 2) + "/"; }
    }
    return (fecha);
};

var $formatDateStandar = function (fecha) {
    var rpta = '';
    if (fecha != '') {
        var anio;
        var mes;
        var dia;
        anio = fecha.substr(6, 4);
        mes = fecha.substr(3, 2);
        dia = fecha.substr(0, 2);
        rpta = anio + '-' + mes + '-' + dia;
    }
    return rpta;
};

var $formatDateLong = function (fecha) {
    //Tue Dec 08 2020 13:57:26 GMT-0500 (hora estándar de Perú)
    var cero = function (valor) {
        var num = valor;
        if ((valor * 1) < 10) {
            num = '0' + valor;
        }
        return num;
    };
    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    var dia = fecha.getDay();
    var dd = fecha.getDate();
    var mm = fecha.getMonth();
    var yyyy = fecha.getFullYear();
    return diasSemana[dia] + ' ' + cero(dd) + ' de ' + meses[mm] + ' del ' + yyyy;
};

var $fnSetChangeHistory = function (list, namespace) {
    var ctrl, fields, valueOld;
    for (var i = 0; i < list.length; i++) {
        fields = list[i].split('¦');
        ctrl = document.getElementById(fields[0]);
        if (ctrl) {
            ctrl.setAttribute("data-ch-index", i);
            ctrl.classList.add('change-history');
            valueOld = ctrl.value;
            $global.ch[namespace] = [];
            if (ctrl.id.substring(0, 3) == "txt" || ctrl.id.substring(0, 3) == "txa") {
                $global.ch[namespace].push(i + "¦" + ctrl.id + "¦" + '' + "¦" + valueOld + '¦' + namespace);
            }
            if (ctrl.id.substring(0, 3) == "cbo") {
                for (var j = 0; j < ctrl.options.length; j++) {
                    if (ctrl.options[j].value == valueOld) {
                        valueOld = ctrl.options[j].text;
                    }
                }
                $global.ch[namespace].push(i + "¦" + ctrl.id + "¦" + '' + "¦" + valueOld + '¦' + namespace);
            }
        }
    }
};

var $fnGetChangeHistory = function (o) {
    var lista = [];
    if (o.containers && o.namespace) {
        var containers = o.containers || '';
        var namespace = o.namespace || '';
        var dc, ctrl;
        dc = document.querySelectorAll('[data-container]');
        var buscarContenedor = function (name) {
            var obj = {};
            for (var i = 0; i < dcqs.length; i++) {
                if (dc[i].getAttribute('data-container') == name) {
                    obj = dc[i];
                }
            }
            return obj;
        };
        var obtenerIndice = function (el) {
            var indice = -1;
            for (var d = 0; d < _data.length; d++) {
                var campos = _data[d].split("¦");
                for (var e = 0; e < 1; e++) {
                    if (campos[e] == el.getAttribute('data-ch-index')) {
                        indice = d;
                        break;
                    }
                }
                if (indice > -1) {
                    break;
                };
            }
            return indice;
        };
        //var crearHistorial = function () {
        //	var indice = 0;
        //	var valor = "";
        //	for (var i = 0; i < containers.length; i++) {
        //		c = buscarContenedor(containers[i]);
        //		var chs = c.getElementsByClassName('change-history');
        //		for (var j = 0; j < chs.length; j++) {
        //			valor = '';
        //			indice = obtenerIndice(chs[j]);
        //			if (indice > -1) {
        //				subtipo = _data[existe].split("¦")[4] != '' ? _data[existe].split("¦")[4] : _namespace;
        //				if (chs[d].id.substring(0, 3) == "cbo") {
        //					if (chs[d].selectedIndex > -1) {
        //						valor = chs[d].options[chs[d].selectedIndex].text;
        //					}
        //					else { valor = "" }
        //					if (valor != _data[existe].split("¦")[3]) {
        //						lista.push(subtipo + "¦" + _data[existe].split("¦")[2] + "¦" + _data[existe].split("¦")[3] + "¦" + valor);
        //					}
        //				}
        //				else {
        //					_datos = chs[d].value;
        //					if (_datos != _data[existe].split("¦")[3]) {
        //						lista.push(subtipo + "¦" + _data[existe].split("¦")[2] + "¦" + _data[existe].split("¦")[3] + "¦" + his[d].value);
        //					}
        //				}

        //			}
        //		}
        //	}
        //};
    }
    //crearHistorial();
    return lista;
};

var $fnValidaRUC = function (value) {
    value = value.trim(); //$scope.fnTrim(value)
    if (!(isNaN(value))) {//(esnumero(value)) {
        if (value.length == 8) {
            var suma = 0
            for (var i = 0; i < value.length - 1; i++) {
                var digito = value.charAt(i) - '0';
                if (i == 0) suma += (digito * 2)
                else suma += (digito * (value.length - i))
            }
            var resto = suma % 11;
            if (resto == 1) resto = 11;
            if (resto + (value.charAt(value.length - 1) - '0') == 11) {
                return true
            }
        } else if (value.length == 11) {
            var suma = 0
            var x = 6
            for (var i = 0; i < value.length - 1; i++) {
                if (i == 4) x = 8
                var digito = value.charAt(i) - '0';
                x--
                if (i == 0) suma += (digito * x)
                else suma += (digito * x)
            }
            var resto = suma % 11;
            resto = 11 - resto

            if (resto >= 10) resto = resto - 10;
            if (resto == value.charAt(value.length - 1) - '0') {
                return true
            }
        }
    }
    return false
};

var $fnHoursMinute = function (date) {
    var rpta = '';
    if (date) {
        rpta = $fnPadLeft(date.getHours().toString(), 2, '0') + ':' + $fnPadLeft(date.getMinutes().toString(), 2, '0');
    }
    return rpta;
};

var $fnHoursMinuteSecond = function (date) {
    var rpta = '';
    if (date) {
        rpta = $fnPadLeft(date.getHours().toString(), 2, '0') + ':' + $fnPadLeft(date.getMinutes().toString(), 2, '0') + ':' + $fnPadLeft(date.getSeconds().toString(), 2, '0');
    }
    return rpta;
};

var $fnGetQueryStringURL = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

var $fnValidarFechaMin = function (FechaIngresada, FechaMinima) {
    var FLAG = true;
    if (FechaIngresada == null && FechaMinima == null) {
        FLAG = false;
    }
    else if (FechaIngresada != null && FechaMinima == null) {
        FLAG = true;
    }
    else {
        var FI_D = FechaIngresada.substring(8, 10);
        var FI_M = FechaIngresada.substring(5, 7);
        var FI_Y = FechaIngresada.substring(0, 4);

        var FM_D = FechaMinima.substring(8, 10);
        var FM_M = FechaMinima.substring(5, 7);
        var FM_Y = FechaMinima.substring(0, 4);

        if (FI_Y > FM_Y) {
            FLAG = true;
        }
        else {
            if (FI_Y == FM_Y) {
                if (FI_M > FM_M) {
                    FLAG = true;
                } else {
                    if (FI_M == FM_M) {
                        if (FI_D >= FM_D) {
                            FLAG = true;
                        } else {
                            FLAG = false;
                        }
                    } else {
                        FLAG = false;
                    }
                }
            } else {
                FLAG = false;
            }
        }
    }
    return FLAG;
};

var $fnValidarFechaMaxima = function (FechaIngresada, FechaMaxima) {
    var FLAG = false;
    if (FechaIngresada == null && FechaMaxima == null) {
        FLAG = false;
    }
    else if (FechaIngresada != null && FechaMaxima == null) {
        FLAG = true;
    } else {
        var FI_D = FechaIngresada.substring(8, 10);
        var FI_M = FechaIngresada.substring(5, 7);
        var FI_Y = FechaIngresada.substring(0, 4);

        var FM_D = FechaMaxima.substring(8, 10);
        var FM_M = FechaMaxima.substring(5, 7);
        var FM_Y = FechaMaxima.substring(0, 4);

        if (FI_Y > FM_Y) {
            FLAG = false;
        } else {
            if (FI_Y == FM_Y) {
                if (FI_M > FM_M) {
                    FLAG = false;
                } else {
                    if (FI_M == FM_M) {
                        if (FI_D > FM_D) {
                            FLAG = false;
                        } else {
                            FLAG = true;
                        }
                    } else {
                        FLAG = true;
                    }
                }
            } else {
                FLAG = true;
            }
        }
    }
    return FLAG;
};

var $fnValidarLimiteDias = function (Fecha1, Fecha2, Dias = 7) {
    //Función para calcular los días transcurridos entre dos fechas
    var FLG = false;
    var aFecha1 = Fecha1.split('/');
    var aFecha2 = Fecha2.split('/');
    var fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
    var fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);
    var dif = fFecha2 - fFecha1;
    var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    if (dias <= Dias) {
        FLG = true;
    }
    return FLG;
};

var $fnValidarFechaMaxActual = function (FechaIngresada) {
    var FLAG = false;
    var DATE = new Date();
    var FechaActual = $frConvertToDateString(DATE);
    if (FechaIngresada == null) {
        FLAG = false
    } else {
        var FI_D = FechaIngresada.substring(0, 2);
        var FI_M = FechaIngresada.substring(3, 5);
        var FI_Y = FechaIngresada.substring(6, 10);

        var FM_D = FechaActual.substring(0, 2);
        var FM_M = FechaActual.substring(3, 5);
        var FM_Y = FechaActual.substring(6, 10);

        if (FI_Y > FM_Y) {
            FLAG = false;
        } else {
            if (FI_Y == FM_Y) {
                if (FI_M > FM_M) {
                    FLAG = false;
                } else {
                    if (FI_M == FM_M) {
                        if (FI_D > FM_D) {
                            FLAG = false;
                        } else {
                            FLAG = true;
                        }
                    } else {
                        FLAG = true;
                    }
                }
            } else {
                FLAG = true;
            }
        }
    }
    return FLAG;
};

var $fnAddMonths = function (FechaIngresada, numberMonths) {
    var FI_D = FechaIngresada.substring(0, 2);
    var FI_M = FechaIngresada.substring(3, 5);
    var FI_Y = FechaIngresada.substring(6, 10);

    var dt = new Date(parseInt(FI_Y), parseInt(FI_M) - 1, parseInt(FI_D));

    var tmonth = dt.getMonth() + numberMonths <= 11 ? dt.getMonth() + numberMonths : 0;
    var tyear = dt.getMonth() + numberMonths <= 11 ? dt.getFullYear() : dt.getFullYear() + 1;

    var eom = new Date(tyear, tmonth + 1, 0).getDate(); /*get last day of the month*/
    var tday = dt.getDate() > eom ? eom : dt.getDate(); /*check if the from day of month > last day of month, use ldom instead if so.*/

    var till = $fnCeroDate(tday) + '/' + $fnCeroDate(tmonth + 1) + '/' + tyear.toString();

    return till;
};

var $fnGetInfoBrowser = function () {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'Explorer', version: parseInt((tem[1] || '')) };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) { let app = tem.slice(1).toString().split(','); return { name: app[0].replace('OPR', 'Opera'), version: parseInt(app[1]) }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return {
        name: M[0],
        version: parseInt(M[1])
    };
};

var $fngenerarTOKEN = function () {
    return Array.from(Array(32)).map((e, i) => {
        let someRandomValue = i === 12 ? 4 : (+new Date() + Math.random() * 16) % 16 | 0;
        return `${~[8, 12, 16, 20].indexOf(i) ? "-" : ""}${(i === 16 ? someRandomValue & 0x3 | 0x8 : someRandomValue).toString(16)}`.replace('-', '');
    }).join("");
};

var $fnExisteFecha = function (fecha, signo, standar) {

    signo = signo == "" ? '-' : signo;
    fecha = fecha.split(signo);
    standar = standar.split(signo);

    var ndia = standar.indexOf('dd');
    var nmes = standar.indexOf('mm');
    var nanio = standar.indexOf('yyyy');




    var estado = true;

    if (fecha[2] != undefined) {

        var dia = fecha[ndia];
        var mes = fecha[nmes];
        var ano = fecha[nanio];

        var dmax;
        var diaC;
        var mesC;
        var anoC;

        if ((dia.length == 2) && (mes.length == 2) && (ano.length == 4)) {
            switch (parseInt(mes)) {
                case 1: dmax = 31; break;
                case 2: if (ano % 4 == 0) dmax = 29; else dmax = 28;
                    break;
                case 3: dmax = 31; break;
                case 4: dmax = 30; break;
                case 5: dmax = 31; break;
                case 6: dmax = 30; break;
                case 7: dmax = 31; break;
                case 8: dmax = 31; break;
                case 9: dmax = 30; break;
                case 10: dmax = 31; break;
                case 11: dmax = 30; break;
                case 12: dmax = 31; break;
            }

            dmax != "" ? dmax : dmax = -1;

            if ((dia >= 1) && (dia <= dmax) && (mes >= 1) && (mes <= 12)) {



                for (var i = 0; i < dia.length; i++) {
                    diaC = dia.charAt(i).charCodeAt(0);
                    (!((diaC > 47) && (diaC < 58))) ? estado = false : '';
                    mesC = mes.charAt(i).charCodeAt(0);
                    (!((mesC > 47) && (mesC < 58))) ? estado = false : '';
                }

                console.log('entro');


                for (var i = 0; i < ano.length; i++) {
                    anoC = ano.charAt(i).charCodeAt(0);
                    (!((anoC > 47) && (anoC < 58))) ? estado = false : '';
                }

            } else estado = false;




        } else estado = false;

    } else estado = false;
    return estado;
};

var $fnValidarCaracteresEspeciales = function (cadena) {
    var regex = new RegExp("^[a-zA-Z0-9\\-_() ]+$");
    var bool = regex.test(cadena);
    return bool;
};

var $fnValidarArchivos = function (INP, EXT = 'JPG,PNG,JPEG', valExt = true) {
    var FLG_FILE = false;
    var nombre, c, type;
    if (INP.files.length != 0) {
        if (INP.files[0].name != undefined) {
            nombre = INP.files[0].name;
            c = nombre.split('.').length;
            if (c > 0) {
                c = c - 1;
                type = nombre.split('.')[c];
                var FLG_EXTS = false;
                if (valExt) { //valExt = se hará la validación de extensión
                    var Extension = EXT.split(',');
                    for (var i = 0; i < Extension.length; i++) {
                        if (type.toUpperCase() == Extension[i].toUpperCase()) {
                            FLG_EXTS = true;
                        }
                    }
                } else {
                    FLG_EXTS = true
                }

                if (FLG_EXTS) {
                    if (INP.files[0].size > 0) {
                        if (INP.files[0].size < $global.variables.MB_MAX_FILE) {
                            FLG_FILE = true;
                        } else {
                            $dialog.alert('El archivo que intenta subir supera las 20MB permitidas.', 'Información', 'E');
                        }
                    } else {
                        $dialog.alert('El archivo que intenta subir parece estar corrupto o vacío.', 'Información', 'E');
                    }
                } else {
                    $dialog.alert('El archivo que intenta subir es de extensión .' + type, 'Información', 'E');
                }
            } else {
                $dialog.alert('El archivo que intenta subir tiene nombre no permitido.', 'Información', 'E');
            }
        } else {
            $dialog.alert('El archivo que intenta subir no contiene nombre.', 'Información', 'E');
        }
    } else {
        $dialog.alert('El archivo que intenta subir parece estar corrupto o vacío.', 'Información', 'E');
    }

    return FLG_FILE;
};

var $fnNumeroALetras = (function () {

    function Unidades(num) {
        switch (num) {
            case 1: return 'UNO';
            case 2: return 'DOS';
            case 3: return 'TRES';
            case 4: return 'CUATRO';
            case 5: return 'CINCO';
            case 6: return 'SEIS';
            case 7: return 'SIETE';
            case 8: return 'OCHO';
            case 9: return 'NUEVE';
        }

        return '';
    }//Unidades()

    function Decenas(num) {
        let decena = Math.floor(num / 10);
        let unidad = num - (decena * 10);

        switch (decena) {
            case 1:
                switch (unidad) {
                    case 0: return 'DIEZ';
                    case 1: return 'ONCE';
                    case 2: return 'DOCE';
                    case 3: return 'TRECE';
                    case 4: return 'CATORCE';
                    case 5: return 'QUINCE';
                    default: return 'DIECI' + Unidades(unidad);
                }
            case 2:
                switch (unidad) {
                    case 0: return 'VEINTE';
                    default: return 'VEINTI' + Unidades(unidad);
                }
            case 3: return DecenasY('TREINTA', unidad);
            case 4: return DecenasY('CUARENTA', unidad);
            case 5: return DecenasY('CINCUENTA', unidad);
            case 6: return DecenasY('SESENTA', unidad);
            case 7: return DecenasY('SETENTA', unidad);
            case 8: return DecenasY('OCHENTA', unidad);
            case 9: return DecenasY('NOVENTA', unidad);
            case 0: return Unidades(unidad);
        }
    }//Unidades()

    function DecenasY(strSin, numUnidades) {
        if (numUnidades > 0)
            return strSin + ' Y ' + Unidades(numUnidades)

        return strSin;
    }//DecenasY()

    function Centenas(num) {
        let centenas = Math.floor(num / 100);
        let decenas = num - (centenas * 100);

        switch (centenas) {
            case 1:
                if (decenas > 0)
                    return 'CIENTO ' + Decenas(decenas);
                return 'CIEN';
            case 2: return 'DOSCIENTOS ' + Decenas(decenas);
            case 3: return 'TRESCIENTOS ' + Decenas(decenas);
            case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
            case 5: return 'QUINIENTOS ' + Decenas(decenas);
            case 6: return 'SEISCIENTOS ' + Decenas(decenas);
            case 7: return 'SETECIENTOS ' + Decenas(decenas);
            case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
            case 9: return 'NOVECIENTOS ' + Decenas(decenas);
        }

        return Decenas(decenas);
    }//Centenas()

    function Seccion(num, divisor, strSingular, strPlural) {
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let letras = '';

        if (cientos > 0)
            if (cientos > 1)
                letras = Centenas(cientos) + ' ' + strPlural;
            else
                letras = strSingular;

        if (resto > 0)
            letras += '';

        return letras;
    }//Seccion()

    function Miles(num) {
        let divisor = 1000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMiles = Seccion(num, divisor, 'MIL', 'MIL');
        let strCentenas = Centenas(resto);

        if (strMiles == '')
            return strCentenas;

        return strMiles + ' ' + strCentenas;
    }//Miles()

    function Millones(num) {
        let divisor = 1000000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMillones = Seccion(num, divisor, 'UN MILLON', 'UN MILLON');
        let strMiles = Miles(resto);

        if (strMillones == '')
            return strMiles;

        return strMillones + ' ' + strMiles;
    }//Millones()

    return function NumeroALetras(num, currency) {
        let data = {
            numero: num,
            enteros: Math.floor(num),
            centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
            letrasCentavos: '',
            letraMoneda: currency
        };

        data.letrasCentavos = 'CON ' + $fnPadLeft(data.centavos.toString(), 2, '0') + '/100';

        if (data.enteros == 0)
            return 'CERO' + ' ' + data.letrasCentavos + ' ' + data.letraMoneda;
        if (data.enteros == 1)
            return Millones(data.enteros).trim() + ' ' + data.letrasCentavos + ' ' + data.letraMoneda;
        else
            return Millones(data.enteros).trim() + ' ' + data.letrasCentavos + ' ' + data.letraMoneda;
    };

})();

var $fnObtenerCheckSumEAN = function (CodigoEAN) {
    var checksum = 0;
    CodigoEAN = CodigoEAN.split('').reverse();
    for (var pos in CodigoEAN) {
        checksum += CodigoEAN[pos] * (3 - 2 * (pos % 2));
    }
    return ((10 - (checksum % 10)) % 10);
};

var $fnValidarServicios = function (d, type = 'LST', s = '¯') {
    var bool = false;

    if (d.success) {
        if (type == 'LST') {
            bool = true;
        } else
            if (type == 'REF') {
                if (d.data != '') {
                    bool = true;
                } else {
                    $alertbox.show($msg.error.procedure, 'E', 6);
                }
            } else {
                if (d.data != '') {
                    var data = d.data.split(s);
                    if (data[0] == 'OK') {
                        $alertbox.show(data[1], 'S', 6);
                        bool = true;
                    } else {
                        $alertbox.show(data[0], 'E', 6);
                    }
                } else {
                    $alertbox.show($msg.error.procedure, 'E', 6);
                }
            }
    } else {
        $alertbox.show($msg.error.server, 'E', 6);
    }

    return bool;
};

var $fnConfigColorAsociado = function (Ctrl, Estado = '', ARR = []) {
    var column = [], flg = false;
    if (Estado != '') {
        for (var i = 0; i < ARR.length; i++) {
            column = ARR[i].split('¦');
            if (column[1].toUpperCase() == Estado.toUpperCase()) {
                document.getElementById(Ctrl).style.display = 'inline'
                document.getElementById(Ctrl).innerHTML = column[1];
                document.getElementById(Ctrl).style.backgroundColor = column[2];
                flg = true;
                break;
            }
        }
    }
    if (!flg) {
        document.getElementById(Ctrl).style.display = 'none'
        document.getElementById(Ctrl).innerHTML = 'Default';
        document.getElementById(Ctrl).style.backgroundColor = '#CECECE';
    }
};

var $fnGetDatimeToSQL = function () {
    var rpta = '';
    // rpta = $fnPadLeft(date.getHours().toString(), 2, '0') + ':' + $fnPadLeft(date.getMinutes().toString(), 2, '0');
    var FCH_GET_SQL = new Date();
    var vi_yy = FCH_GET_SQL.getFullYear().toString();
    var vi_MM = (FCH_GET_SQL.getMonth() + 1).toString();
    var vi_dd = FCH_GET_SQL.getDay().toString();
    var vi_hh = FCH_GET_SQL.getHours().toString();
    var vi_mm = FCH_GET_SQL.getMinutes().toString();
    var vi_ss = FCH_GET_SQL.getSeconds().toString();
    rpta = vi_yy + '-' + $fnPadLeft(vi_MM, 2, '0') + '-' + $fnPadLeft(vi_dd, 2, '0') + ' ' + $fnPadLeft(vi_hh, 2, '0') + ':' + $fnPadLeft(vi_mm, 2, '0') + ':' + $fnPadLeft(vi_ss, 2, '0');
    return rpta;
};


var $fnDecompress = function (byteArray) {
    const cs = new DecompressionStream("gzip");
    const writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    return new Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
        return new TextDecoder("ISO-8859-1").decode(arrayBuffer);
    });
};