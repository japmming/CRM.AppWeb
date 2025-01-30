var $fnSelectList = function (controlId) {

    var sfx = 'jtse-select_save_' + controlId;
    var _ = {};
    if ($jt[sfx]) _ = $jt[sfx];

    var create = function (obj) {
        if (obj) {
            if (document.getElementById(controlId)) {
                var ctrl = document.getElementById(controlId);

                if (ctrl.tagName == "JTSE-SELECT-LIST") {
                    createelementList(obj);
                    optionEventos(obj);

                } else
                    console.log($msg.error.control);
            } else {
                console.log($msg.error.control);
                console.log(controlId);
            }
        } else
            console.log($msg.error.control);
    }

    var createelementList = function (obj) {

        var data = obj.data.slice(), temp, s = obj.separator || '¦', pr = obj.rankPosition || 2;
        for (var i = 0; i < data.length; i++) {
            for (var j = 1; j < (data.length - i); j++) {
                if ((data[j - 1].split(s)[pr] * 1) < (data[j].split(s)[pr] * 1)) {
                    temp = data[j - 1];
                    data[j - 1] = data[j];
                    data[j] = temp;
                }
            }
        }
        showelementList(data, obj);
    };

    var showelementList = function (data, obj) {
        var nlist = data.length;
        var column, c = [], n = 5, v, d, tipo,
            valorInicial = obj.valorInicial,
            descripcionIncial = obj.descripcionIncial,
            tipo = obj.type,
            s = obj.separator || '¦',
            ctrl = document.getElementById(controlId),
            pv = obj.valuePosition || 0,
            pd = obj.descriptionPosition || 1;

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

        obj.valorInicial = v;
        obj.descripcionIncial = d;
        obj.invalidate = false;
        obj.valuePosition = pv;
        obj.descriptionPosition = pd;
        obj.required = true;
        $jt[sfx] = obj;
        


        c.push('<div class="combo-content"  id="jtse-select_' + controlId + '">');
        c.push('<span id="jtse-span-select_' + controlId + '" class="item-combo">' + d + '</span>');
        c.push('<i class="fa fa-chevron-down item-combo" aria-hidden="true"></i>');
        c.push('</div>');
        c.push('<div class="combo-content-option hide" id="jtse-select-content_' + controlId + '">');
        c.push('<span class="options-title">SUGERENCIAS</span>');
        c.push('<ul class="options">');

        for (var i = 0; i < nlist; i++) {
            column = data[i].split(s);
            if (n > 0) {
                c.push('<li id="jtse-select-item-' + controlId + '_' + column[pv] + '" onclick="$fnselectedItem(\'' + controlId + '\',\'' + column[pv] + '\',\'' + column[pd] + '\');">' + column[pd] + '</li>');
                n--;
            } else
                break
        }
        c.push('</ul>');
        nlist = obj.data.length;
        c.push('<span class="options-title">LISTADO</span>');
        c.push('<ul class="options">');

        for (var i = 0; i < nlist; i++) {
            column = obj.data[i].split(s);
            c.push('<li id="jtse-select-item-' + controlId + '_' + column[pv] + '" onclick="$fnselectedItem(\'' + controlId + '\',\'' + column[pv] + '\',\'' + column[pd] + '\');">' + column[pd] + '</li>');
        }

        c.push('</ul>');
        c.push('</div>');

        ctrl.innerHTML = c.join('');
        ctrl.dataset.value = "";
    };

    var optionEventos = function (obj) {
        if (obj.namespace) {
            if (document.getElementById(obj.namespace)) {
                document.getElementById(obj.namespace).addEventListener('click', function (e) {
                    var ctrl = document.getElementById(controlId);
                    if (ctrl) {
                        if (!ctrl.contains(e.target)) {
                            document.getElementById('jtse-select-content_' + controlId).classList.add('hide');
                        }
                    }
                });
            }
        }

        document.getElementById('jtse-select_' + controlId).onclick = function () {
            if (!$jt[sfx].invalidate) {
                if (document.getElementById('jtse-select-content_' + controlId).classList.contains('hide')) {
                    document.getElementById('jtse-select-content_' + controlId).classList.remove('hide');
                } else {
                    document.getElementById('jtse-select-content_' + controlId).classList.add('hide');
                }
            }
        }
    };

    var clearSelect = function () {
        $fnselectedItem(controlId, $jt[sfx].valorInicial, $jt[sfx].descripcionIncial);
    }

    var validationempty = function () {
        var ctrl = document.getElementById(controlId), bool = false;
        if ($jt[sfx].required) {
            if (ctrl.dataset.value != "") {
                document.getElementById('jtse-select_' + controlId).classList.remove('mult-error');
                bool = true;
            } else {
                document.getElementById('jtse-select_' + controlId).classList.add('mult-error');
                bool = false;
            }
        } else {
            document.getElementById('jtse-select_' + controlId).classList.remove('mult-error');
            bool = true;
        }        
        return bool;
    }

    var invalidateControl = function (b) {
        if ($jt[sfx]) {
            $jt[sfx].invalidate = b;
        }
    }
    var setItem = function (c) {
        if ($jt[sfx].data) {
            var ndata = $jt[sfx].data.length, col = [],
                pv = $jt[sfx].valuePosition,
                pd = $jt[sfx].descriptionPosition,
                s = $jt[sfx].separator;
            for (var i = 0; i < ndata; i++) {
                col = $jt[sfx].data[i].split(s);
                if (col[pv] == c) {
                    $fnselectedItem(controlId, col[pv], col[pd]);
                    
                    break;
                }
            }
        } else {
            console.log($msg.error.control);
            console.log(controlId);
        }
    }
    var require = function (b) {
        if ($jt[sfx]) {
            $jt[sfx].required = b;
        }
    }

    return {
        create: function (d) {
            create(d);
        },
        clear: function () {
            clearSelect();
        },
        validateEmpty: function () {
            return validationempty();
        },
        invalidate: function (b) {
            invalidateControl(b);
        },
        setItem: function (c) {
            setItem(c);
        },
        require: function (b) {
            require(b);
        }
    }
};
var $fnselectedItem = function (ctrl, cod, text) {
    if (document.getElementById(ctrl)) {
        var ctrlValue = document.getElementById(ctrl);
        var codigo = ctrlValue.dataset.value;
        if (codigo != "") {
            document.getElementById('jtse-select-item-' + ctrl + '_' + codigo).classList.remove('active-item');
        }
        document.getElementById('jtse-span-select_' + ctrl).innerHTML = text;
        ctrlValue.dataset.value = cod;
        if (cod != "") {
            document.getElementById('jtse-select-item-' + ctrl + '_' + cod).classList.add('active-item');
        }       
        document.getElementById('jtse-select-content_' + ctrl).classList.add('hide');
        document.getElementById('jtse-select_' + ctrl).classList.remove('mult-error');
    } else {
        console.log($msg.error.control);
    }
};