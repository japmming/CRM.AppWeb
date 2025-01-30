var $fnAutoComplete = function (controlId) {

    var ctrl = document.getElementById(controlId);
    var sfx = "jtse-AutoComplete_" + controlId;
    var _ = {};
    if ($jt[sfx]) _ = $jt[sfx];

    var $createOption = function (o) {

        var ctrlContent = document.getElementById(o.controlContent);
        var NamePage = o.namespace;
        o.descriptionPosition = (o.descriptionPosition != undefined) ? o.descriptionPosition : 1;
        if (ctrl) {
            if (ctrlContent) {
                if (ctrlContent.tagName == "JSTE-AUTOCOMPLETE") {
                    ctrlContent.style = 'position:relative;display:block';
                    o.invalidate = false;
                    $jt[sfx] = o;

                    ctrl.addEventListener('keyup', function (e) {
                        if (e.keyCode != 9) {
                            $create(this.value);
                        }
                        
                    });

                    ctrl.addEventListener('keydown', function (e) {
                        if (e.keyCode == 9) document.getElementById(o.controlContent).innerHTML = "";
                    })

                    if (document.getElementById(NamePage)) {
                        if (!$jt[sfx].invalidate) {
                            document.getElementById(NamePage).addEventListener('click', function (e) {
                                if (ctrl) {
                                    if (!ctrl.contains(e.target)) {
                                        if (ctrlContent.innerHTML.length > 0) {
                                            ctrlContent.innerHTML = "";
                                        }
                                    }
                                }
                            });

                            $jt[sfx].invalidate = true;
                        }
                    }
                }
            }
        }
    }

    var $create = function (value) {
        if ($jt[sfx]) {
            var ctrlContent = document.getElementById($jt[sfx].controlContent);

            if (value.length > 0) {
                console.log(ctrl.disabled, ctrl.readOnly);

                if (ctrl.disabled == false && ctrl.readOnly == false) {
                    if ($jt[sfx].listItem.length > 0) {
                        var listItem = $jt[sfx].listItem;
                        var nlist = listItem.length;
                        value = value.toUpperCase();
                        var c = [];
                        var c2 = [];
                        for (var i = 0; i < nlist; i++) {
                            if (listItem[i].toUpperCase().indexOf(value) > -1) {
                                c.push('<div class="item-marca" onclick="$fnAutoComplete(\'' + controlId + '\').rellenar(' + i + ');">');
                                c.push(listItem[i]);
                                c.push('</div>');
                            }
                        }

                        if (c.length > 0) {
                            c2.push('<div class="marca-combo">');
                            c2.push(c.join(''));
                            c2.push('</div>');
                        }
                        if (ctrlContent) ctrlContent.innerHTML = c2.join('');
                    } else {
                        if (ctrlContent) ctrlContent.innerHTML = "";
                    }



                } else {

                    if (ctrlContent) ctrlContent.innerHTML = "";
                }
            } else {
                if (ctrlContent) ctrlContent.innerHTML = "";
            }
        } else {
            console.log($msg.error.control);
        }
    };

    var $rellenarControl = function (i) {
        if ($jt[sfx]) {
            var pd = $jt[sfx].descriptionPosition;
            var texto = $jt[sfx].listItem[i];
            ctrl.value = texto;
            document.getElementById($jt[sfx].controlContent).innerHTML = "";
            ctrl.focus();
        } else {
            console.log($msg.error.control);
        }
    }

    var $setData = function (l) {
        $jt[sfx].listItem = l;
    }

    return {
        rellenar: function (i) {
            $rellenarControl(i);
        },
        create: function (o) {
            $createOption(o);
        },
        setData: function (d) {
            $setData(d);
        }
    }
};