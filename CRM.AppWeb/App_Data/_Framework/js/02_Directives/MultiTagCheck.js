var $createMultiTag = function (controlid) {

    var ctrl = document.getElementById(controlid);
    var sfx = 'jtse-mult-tag-save_' + controlid;
    var _ = {};
    if ($jt[sfx]) _ = $jt[sfx];

    var $create = function (o) {
        if (ctrl) {
            var c = [];

            o.listItemFrecu = o.listItemFrecu || [];
            o.listItems = o.listItems || [];
            o.positionValue = o.positionValue || 0;
            o.positionDescription = o.positionDescription || 1;
            o.positionType = o.positionType;
            o.dataResult = [];
            o.separator = o.separator || '¦';
            o.oneList = o.oneList || false;
            o.invalidate = false;
            o.type = o.type || 'S';
            _.typeFilter = (o.typeFilter == undefined ? 'I' : o.typeFilter) == 'I' ? 'I' : 'A';
            _.btnNew = (o.btnNew == undefined ? false : o.btnNew) == true ? true : false;
            _.fnBtnNew = o.fnBtnNew || '';
            _.namespaces = o.namespaces || '';
            $jt[sfx] = o;

            c.push('<div id="jste-mul-tag-box_' + controlid + '" class="body-mul-tag">');
            c.push('<div id="jste-mul-tag-box-content_' + controlid + '" class="mul-tag-content-item">');
            c.push($MostrarTextoseleccione());
            c.push('</div>');
            c.push('<div class="mul-tag-content-item-ico">');
            c.push('<i class="fa fa-angle-down content-ico" aria-hidden="true"></i>');
            c.push('</div>');
            if (_.btnNew && _.fnBtnNew != '' && _.namespaces != '') {
                c.push('<div class="mul-tag-content-item-ico" style="padding: 0px;">');
                c.push('<span class="input-group-btn" onclick="$jt[\'' + _.namespaces + '\'][\'' + _.fnBtnNew + '\'](this);"> <button class="btn" type="button" style="padding: 3px 6px;"><i class="fa fa-plus"></i>');
                c.push('</button></span > ');
                c.push('</div>');
            }
            c.push('</div>');
            c.push('<div id="jste-mul-tag-list_' + controlid + '" class="mult-tag-option-content hide" style="overflow:none !important;max-height: none!important;">');

            if (_.typeFilter == 'I') {
                c.push('<div id="jste-mul-tag-input-search' + controlid + '" style="padding:5px">');
                c.push('<input type="text" autocomplete="off" id="txt-jste-mul-tag-input_' + controlid + '" class="form-control" style="text-transform: none !important;"  placeholder="Busqueda...">');
                c.push('</div>');
            }


            c.push('<div id="jste-mul-tag-list-listado_' + controlid + '" style="overflow:auto !important;max-height: 169px !important;">');
            c.push('</div>');

            c.push('</div>');
            ctrl.innerHTML = c.join('');
            $filtarMostrarData('');
            $eventOption(o.namespace);
        } else {
            console.log($msg.error.control);
            console.log(controlid);
        }
    };

    var $listarFecuentes = function (value) {

        var c = [];

        if ($jt[sfx]) {
            var o = $jt[sfx];

            var column = [],
                pv = o.positionValue,
                pd = o.positionDescription,
                s = o.separator,
                listItemFrecu = o.listItemFrecu,
                nlistItemFrecu = listItemFrecu.length,
                dataResultado = o.dataResult,
                contador = 0;

            value = value.toUpperCase().trim();

            for (var i = 0; i < nlistItemFrecu; i++) {
                column = listItemFrecu[i].split(s);
                if (value == "" || column[pd].toUpperCase().indexOf(value) > -1) {
                    if (contador == 0) {
                        c.push('<span class="mult-tag-option-content-span">Frecuentes</span>');
                        c.push('<ul class="mult-tag-option-ul">');
                    }

                    c.push('<li><input id="jste-item-frecuentes_' + controlid + '_' + column[pv] + '"  onclick="$createMultiTag(\'' + controlid + '\').setItemsFrecuentes(\'' + column[pv] + '\');" type="checkbox"');
                    if (dataResultado.indexOf(column[pv]) > -1) {
                        c.push(' checked');
                    }

                    c.push('/> <label for="jste-item_' + controlid + '_' + column[pv] + '">' + column[pd] + '</label></li>');
                    contador++;
                }
            }

            if (c.length > 0) {
                c.push('</ul>');
            }


        } else {
            console.log($msg.error.control);
        }

        return c.join('');
    };

    var $filtarMostrarData = function (value) {

        if (document.getElementById('jste-mul-tag-list-listado_' + controlid)) {

            var o = $jt[sfx];
            var list = o.listItems,
                nlist = list.length,
                column = [],
                c = [],
                pv = o.positionValue || 0,
                pd = o.positionDescription || 1,
                pt = o.positionType || 2,
                s = o.separator || '¦',
                type = "",
                n = 0,
                dataResultado = o.dataResult,
                oneList = o.oneList;

            value = value.toUpperCase().trim();
            var contador1 = 0;
            var contador2 = 0;


            if (oneList) {
                for (var i = 0; i < nlist; i++) {
                    column = list[i].split(s);
                    if (value == "" || column[pd].toUpperCase().indexOf(value) > -1) {
                        if (contador1 == 0) {
                            c.push('<ul class="mult-tag-option-ul">');
                        }
                        c.push('<li><input id="jste-item_' + controlid + '_' + column[pv] + '"  onclick="$createMultiTag(\'' + controlid + '\').setItemsMulti(' + i + ');" type="checkbox"');

                        if (dataResultado.indexOf(column[pv]) > -1) {
                            c.push(' checked');
                        }

                        c.push('/><label for="jste-item_' + controlid + '_' + column[pv] + '">' + column[pd] + '</label></li>');
                        contador1++;

                        if (contador1 == nlist) {
                            c.push('</ul>');
                        }
                    }
                }
            } else {

                var listarFrecuentes = $listarFecuentes(value);
                if (listarFrecuentes.length > 0) {
                    c.push(listarFrecuentes);
                }

                for (var i = 0; i < nlist; i++) {
                    column = list[i].split(s);

                    if (column[pt] == "R") {
                        if (value == "" || column[pd].toUpperCase().indexOf(value) > -1) {

                            if (contador1 == 0) {
                                c.push('<span class="mult-tag-option-content-span">Regiones</span>');
                                c.push('<ul class="mult-tag-option-ul">');
                            }
                            c.push('<li><input id="jste-item_' + controlid + '_' + column[pv] + '"  onclick="$createMultiTag(\'' + controlid + '\').setItemsMulti(' + i + ');" type="checkbox"');

                            if (dataResultado.indexOf(column[pv]) > -1) {
                                c.push(' checked');
                            }
                            c.push('/> <label for="jste-item_' + controlid + '_' + column[pv] + '">' + column[pd] + '</label></li>');
                            contador1++;
                        }
                    } else {
                        n = i;
                        if (c.length > 0) {
                            c.push('</ul>');
                        }

                        break;
                    }
                }

                for (var i = n; i < nlist; i++) {
                    column = list[i].split(s);
                    if (value == "" || column[pd].toUpperCase().indexOf(value) > -1) {
                        if (contador2 == 0) {
                            c.push('<span class="mult-tag-option-content-span">Paises</span>');
                            c.push('<ul class="mult-tag-option-ul">');
                        }
                        c.push('<li><input id="jste-item_' + controlid + '_' + column[pv] + '"  onclick="$createMultiTag(\'' + controlid + '\').setItemsMulti(' + i + ');" type="checkbox"');

                        if (dataResultado.indexOf(column[pv]) > -1) {
                            c.push(' checked');
                        }

                        c.push('/><label for="jste-item_' + controlid + '_' + column[pv] + '">' + column[pd] + '</label></li>');

                        contador2++;

                        if (contador2 == (nlist - 1)) {
                            c.push('</ul>');
                        }
                    }
                }
            }

            if (c.length == 0) {
                c.push('<ul class="mult-tag-option-ul">');
                c.push('<li><label>No hay items...</label></li>');
                c.push('</ul>');
            }

            document.getElementById('jste-mul-tag-list-listado_' + controlid).innerHTML = c.join('');
        } else {
            console.log($msg.error.control);
        }

    };

    var $eventOption = function (namespace) {
        if (document.getElementById(namespace)) {
            document.getElementById(namespace).addEventListener('click', function (e) {
                if (ctrl) {
                    if (!ctrl.contains(e.target)) {
                        document.getElementById('jste-mul-tag-list_' + controlid).classList.add('hide');
                        $filtarMostrarData('');
                    }
                }
            });
        }

        document.getElementById('jste-mul-tag-box_' + controlid).onclick = function () {
            if (!$jt[sfx].invalidate) {
                if (document.getElementById('jste-mul-tag-list_' + controlid).classList.contains('hide')) {
                    document.getElementById('jste-mul-tag-list_' + controlid).classList.remove('hide');
                    if (document.getElementById('txt-jste-mul-tag-input_' + controlid)) {
                        document.getElementById('txt-jste-mul-tag-input_' + controlid).value = "";
                        document.getElementById('txt-jste-mul-tag-input_' + controlid).focus();
                    }
                    $filtarMostrarData('');
                } else {
                    document.getElementById('jste-mul-tag-list_' + controlid).classList.add('hide');
                    $filtarMostrarData('');
                }
            }
        }

        if (document.getElementById('txt-jste-mul-tag-input_' + controlid)) {
            document.getElementById('txt-jste-mul-tag-input_' + controlid).onkeyup = function () {
                $filtarMostrarData(this.value);
            };
            document.getElementById('txt-jste-mul-tag-input_' + controlid).onkeydown = function (e) {
                if (e.keyCode == 9) {
                    document.getElementById('jste-mul-tag-list_' + controlid).classList.add('hide');
                    $filtarMostrarData('');
                }
            };
        }


    };

    var $itemContentFrecuen = function (c) {

        if ($jt[sfx]) {
            var list = $jt[sfx].listItems,
                s = $jt[sfx].separator,
                column = [],
                pv = $jt[sfx].positionValue,
                pd = $jt[sfx].positionDescription,
                nlist = list.length,
                valor = document.getElementById('jste-item-frecuentes_' + controlid + '_' + c).checked;

            for (var i = 0; i < nlist; i++) {
                column = list[i].split(s);
                if (column[pv] == c) {
                    if (valor) {
                        $addItem(column[pv], column[pd]);
                    } else {
                        $removeItem(column[pv]);
                    }
                    break;
                }
            }
        }

        //if (document.getElementById('jste-item-frecuentes_' + controlid + '_' + c)) {


        //}

        //console.log(c);
    }

    var $itemContent = function (index) {
        if ($jt[sfx]) {
            var list = $jt[sfx].listItems,
                s = $jt[sfx].separator,
                column = [],
                ctrl,
                pv = $jt[sfx].positionValue,
                pd = $jt[sfx].positionDescription,
                pt = $jt[sfx].positionType;

            if (list[index]) {
                column = list[index].split(s);
                ctrl = document.getElementById('jste-item_' + controlid + '_' + column[pv]);
                if (ctrl.checked) {
                    $addItem(column[pv], column[pd]);
                    if (document.getElementById('jste-item-frecuentes_' + controlid + '_' + column[pv]))
                        document.getElementById('jste-item-frecuentes_' + controlid + '_' + column[pv]).checked = true;

                } else {

                    $removeItem(column[pv]);
                    if (document.getElementById('jste-item-frecuentes_' + controlid + '_' + column[pv]))
                        document.getElementById('jste-item-frecuentes_' + controlid + '_' + column[pv]).checked = false;
                }
            } else {
                console.log($msg.error.framework);
            }
        }
    };

    var $addItem = function (cod, des) {
        var c = [], item = document.createElement('DIV');

        var datos = $jt[sfx].dataResult;
        if (datos.length == 0) document.getElementById('jste-mul-tag-box-content_' + controlid).innerHTML = "";
        item.id = 'jste-content-item_' + cod;
        item.className = "mul-tag-item";
        c.push('<span class="mul-tag-item-text">' + des + '</span>');
        c.push('<i class="fa fa-times mul-tag-item-ico" style="color:red !important; background-color:white" aria-hidden="true"  onclick="$createMultiTag(\'' + controlid + '\').removeItemsMulti(\'' + cod + '\',true);"></i>');
        item.innerHTML = c.join('');
        document.getElementById('jste-mul-tag-box-content_' + controlid).appendChild(item);
        $jt[sfx].dataResult.push(cod);
    };

    var $removeItem = function (c, b = false) {
        if ($jt[sfx]) {
            if (!$jt[sfx].invalidate) {
                var item = document.getElementById('jste-content-item_' + c);
                document.getElementById('jste-mul-tag-box-content_' + controlid).removeChild(item);
                if (b) {
                    document.getElementById('jste-mul-tag-list_' + controlid).classList.remove('hide');
                    if (document.getElementById('jste-item_' + controlid + '_' + c)) {
                        document.getElementById('jste-item_' + controlid + '_' + c).checked = false;
                    }
                    if (document.getElementById('jste-item-frecuentes_' + controlid + '_' + c)) {
                        document.getElementById('jste-item-frecuentes_' + controlid + '_' + c).checked = false;
                    }
                }
                var data = $jt[sfx].dataResult.slice();
                if (data.indexOf(c) > -1) {
                    var i = data.indexOf(c);
                    data.splice(i, 1);
                    $jt[sfx].dataResult = data;
                }
                var datos = $jt[sfx].dataResult;
                if (datos.length == 0) document.getElementById('jste-mul-tag-box-content_' + controlid).innerHTML = $MostrarTextoseleccione();

            }
        }
    };

    var $returnData = function () {
        var dataText = "";
        dataText = $jt[sfx].dataResult.join(',');
        return dataText;
    };

    var $ListarItemGSave = function (d) {
        if ($jt[sfx]) {
            var data = d.split(','),
                nlist = data.length,
                column = [],
                dataAlmace = [],
                list = $jt[sfx].listItems,
                pv = $jt[sfx].positionValue,
                pd = $jt[sfx].positionDescription,
                s = $jt[sfx].separator;

            $clearListCheck();

            for (var i = 0; i < nlist; i++) {
                dataAlmace[data[i]] = data[i];
            }
            nlist = list.length;

            for (var i = 0; i < nlist; i++) {
                column = list[i].split(s);
                if (dataAlmace[column[pv]]) {
                    if (dataAlmace[column[pv]] == column[pv]) {
                        $addItem(column[pv], column[pd]);
                        $activeCheck(column[pv], true);
                    }
                }
            }
        } else {
            console.log($msg.error.control);
            console.log(controlid);
        }
    };

    var $activeCheck = function (c, b) {
        if (document.getElementById('jste-item_' + controlid + '_' + c)) {
            document.getElementById('jste-item_' + controlid + '_' + c).checked = b;
        }

        if (document.getElementById('jste-item-frecuentes_' + controlid + '_' + c)) {
            document.getElementById('jste-item-frecuentes_' + controlid + '_' + c).checked = b;
        }

    };

    var $ValidarVacios = function () {
        var data = $returnData(), bool = false;
        if (data != "") {
            bool = true;
            document.getElementById('jste-mul-tag-box_' + controlid).classList.remove('mult-error');
        } else {
            document.getElementById('jste-mul-tag-box_' + controlid).classList.add('mult-error');
            bool = false;
        }
        return bool;
    };

    var $clearListCheck = function () {
        if ($jt[sfx]) {
            var data = $jt[sfx].dataResult.slice();
            var ndata = data.length;
            for (var i = 0; i < ndata; i++) {
                if (data[i]) {
                    $activeCheck(data[i], false);
                    $clearItem(data[i]);
                }

            }
        }
    };

    var $clearItem = function (c) {
        if ($jt[sfx]) {
            var item = document.getElementById('jste-content-item_' + c);
            if (document.getElementById('jste-mul-tag-box-content_' + controlid)) {
                document.getElementById('jste-mul-tag-box-content_' + controlid).removeChild(item);
                var data = $jt[sfx].dataResult.slice();
                if (data.indexOf(c) > -1) {
                    var i = data.indexOf(c);
                    data.splice(i, 1);
                    $jt[sfx].dataResult = data;
                }
            }
        }
    };

    var $invalidate = function (b) {
        if ($jt[sfx]) {
            $jt[sfx].invalidate = b;
            if (b) {
                if (document.getElementById('jste-mul-tag-box_' + controlid)) {
                    document.getElementById('jste-mul-tag-box_' + controlid).classList.add('disabled');

                }
            } else {
                if (document.getElementById('jste-mul-tag-box_' + controlid)) {
                    document.getElementById('jste-mul-tag-box_' + controlid).classList.remove('disabled');
                }
            }
        }
    };

    var $MostrarTextoseleccione = function () {
        var c = [];
        if ($jt[sfx]) {
            var tipo = $jt[sfx].type;
            var texto = "";

            if (tipo == "S") {
                texto = "Seleccione";
            } else if (tipo == "T") {
                texto = "Todos";
            }

            c.push('<div style="display: flex;align-items: center;">');
            c.push('<label style="padding-left: 10px;padding-right: 10px;color:#555">' + texto + '</label>');
            c.push('</div>');
        }




        return c.join('');
    };

    var $InsertDataFrecuentes = function (d) {
        if ($jt[sfx]) {
            $jt[sfx].listItemFrecu = d;
        }
    };

    return {
        create: function (d) {
            $create(d)
        },
        setItemsMulti: function (index) {
            $itemContent(index);
        },
        removeItemsMulti: function (c, b) {
            $removeItem(c, b)
        },
        getData: function () {
            return $returnData()
        },
        setItemSave: function (d) {
            $ListarItemGSave(d)
        },
        validationMulti: function () {
            return $ValidarVacios()
        },
        clearControlcheck: function () {
            $clearListCheck()
        },
        invalidateControl: function (b) {
            $invalidate(b)
        },
        setItemsFrecuentes: function (c) {
            $itemContentFrecuen(c);
        },
        setDataFrecuentes: function (d) {
            $InsertDataFrecuentes(d);
        }
    }
}