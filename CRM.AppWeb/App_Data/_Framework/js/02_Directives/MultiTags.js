var $$multitag = function (controlName) {
    var ctrl = document.getElementById(controlName);
    var $create = function (_data) {
        var o = _data || {};
        var height;
        var content = '<div style="min-width:3em !important"><input id="MultiTag' + controlName + '" placeholder="+" /></div><div style="display:none"><ul></ul></div>';
        if (!ctrl.classList.contains('jtse-tags')) ctrl.classList.add('jtse-tags');
        ctrl.innerHTML = content;
        ctrl.classList.add('show');
        ctrl.setAttribute('role-tags', 'multitag');
        var ctrlChild = document.getElementById('MultiTag' + controlName);
        height = o.Height != undefined ? o.Height : 55;
        ctrl.children[0].style.height = height + 'px';
        ctrl.children[0].children[0].oninput = function () {
            var list = this.parentElement.nextElementSibling;
            if (listEqualItems(ctrl, this)) list.style.display = 'block';
            else list.style.display = 'none';
            ctrl.children[1].style.display = "";
            ctrl.children[1].style.marginTop = "";
            var d = document.getElementsByTagName('view-root')[0].children[0].getBoundingClientRect();
            var d2 = ctrl.children[0].getBoundingClientRect();
            var c = ctrl.children[1].getBoundingClientRect();
            var h = (c.top.toFixed(0) * 1) + (c.height.toFixed(0) * 1);
            if (d.height < h) ctrl.children[1].style.marginTop = '-' + ((c.height.toFixed(0) * 1) + (d2.height.toFixed(0) * 1) + 5) + 'px';
        };
        ctrl.children[0].children[0].onkeyup = function (e) {
            enter(e);
            ctrl.children[1].style.display = "";
            ctrl.children[1].style.marginTop = "";
            var d = document.getElementsByTagName('view-root')[0].children[0].getBoundingClientRect();
            var d2 = ctrl.children[0].getBoundingClientRect();
            var c = ctrl.children[1].getBoundingClientRect();
            var h = (c.top.toFixed(0) * 1) + (c.height.toFixed(0) * 1);
            if (d.height < h) ctrl.children[1].style.marginTop = '-' + ((c.height.toFixed(0) * 1) + (d2.height.toFixed(0) * 1) + 5) + 'px';
        };
        ctrl.children[0].children[0].onblur = function (e) {
            //var target = e.explicitOriginalTarget || document.activeElement;
            //if (target.tagName != "<li>") {
            //    addItem2(e.target);
            //}
            //if (document.getElementById("fsm")) {
            //    document.getElementById("fsm").value = this.id;
            //}
            setTimeout(function () {
                if (this.value != "") {
                    addItem2(e.target);
                };
            }, 250);

        }
        //document.addEventListener('click', function (e) {
        //    e = e || window.event;
        //    var target = e.target || e.srcElement;
        //    //addItem2(ctrl.children[0].children[0]);
        //    if (target.tagName.toUpperCase() != "LI") {
        //        if (target.id == ctrl.children[0].children[0].id ) {
        //        } else {
        //            if (ctrl.children[0].children[0].value != "") {
        //                //if (document.getElementById("fsm")) {
        //                addItem2(ctrl.children[0].children[0]);
        //                    //document.getElementById("fsm").value = "";
        //                //}
        //            }
        //        }
        //    }
        //    //if ((target.className.indexOf("calendar") > -1)) {
        //    //} else {
        //    //    openedDPX && openedDPX.classList.remove('active');
        //    //}
        //}, false);
        ctrl.onmouseleave = function () { this.children[1].style.display = 'none'; };
        o.ListItems = o.ListItems || [];
        o.SeparatorRegOutput = o.SeparatorRegOutput || '¬';
        o.SeparatorOutput = o.SeparatorOutput || '¦';
        o.Separator = o.Separator || '¦';
        $jt['jtse-multitag-' + controlName] = o;
        if (o.ListItems.length > 0) listItems();
    };
    var listItems = function () {
        var o = $jt['jtse-multitag-' + controlName];
        if (o.ListItems.length > 0) {
            var separator = o.Separator;
            var list = o.ListItems.slice();
            var cf = document.createDocumentFragment(), d, li;
            for (var i = 0; i < list.length; i++) {
                d = list[i].split(separator);
                li = document.createElement('LI');
                li.setAttribute('data-order', i);
                li.setAttribute('data-value', d[0]);
                li.setAttribute('data-desc', d[1]);
                li.setAttribute('data-new', d[0] == '0' ? '1' : '0');
                li.innerHTML = d[1];
                li.onclick = function () { addItem(this); };
                cf.appendChild(li);
            }
            ctrl.children[1].children[0].appendChild(cf);
        }
    };
    var addItem = function (obj) {
        ctrl.children[1].style.display = 'none';
        var lis = ctrl.children[1].children[0].children;
        var nReg = lis.length;
        for (var i = 0; i < nReg; i++) {
            if (lis[i].getAttribute('data-value') == obj.getAttribute('data-value') && lis[i].getAttribute('data-desc') == obj.getAttribute('data-desc')) {
                lis[i].style.display = 'none';
                var spn1 = document.createElement("SPAN");
                spn1.className = "tag label label-info";
                spn1.setAttribute("data-value", obj.getAttribute('data-value'));
                spn1.setAttribute("data-desc", obj.getAttribute('data-desc'));
                spn1.textContent = lis[i].getAttribute('data-desc');
                var spn2 = document.createElement("SPAN");
                spn2.setAttribute("data-order", lis[i].getAttribute('data-order'));
                spn2.setAttribute("data-role", "remove");
                spn2.onclick = function () { deleteItem(this); };
                spn1.appendChild(spn2);
                ctrl.firstElementChild.insertBefore(spn1, ctrl.children[0].lastElementChild);
                ctrl.firstElementChild.scrollTop = ctrl.firstElementChild.scrollHeight;
                if ($jt['jtse-multitag-' + ctrl.id].AddEvent != undefined) {
                    var o = $jt['jtse-multitag-' + ctrl.id];
                    $jt[o.Namespace][o.AddEvent](obj, obj.getAttribute('data-value'), obj.getAttribute('data-desc'));
                }
                break;
            }
        }
        ctrl.children[0].lastElementChild.value = '';
        ctrl.children[0].lastElementChild.focus();
    };
    var addItem2 = function (obj) {
        var ctrl = obj.parentElement.parentElement;
        if (obj.value.trim() != '') {
            ctrl.children[1].style.display = 'none';
            var exist = false;
            var lis = ctrl.children[1].children[0].children;
            var nReg = lis.length, cont = 0;
            for (var i = 0; i < nReg; i++) {
                if (lis[i].getAttribute('data-desc').toLowerCase() == obj.value.toLowerCase()) {
                    lis[i].click();
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                $jt['jtse-multitag-' + ctrl.id].ListItems.push('0' + $jt['jtse-multitag-' + ctrl.id].Separator + obj.value);
                ctrl.children[1].children[0].innerHTML = '';
                listItems();
                ctrl.children[1].children[0].lastElementChild.click();
            }
            ctrl.children[0].lastElementChild.value = '';
            ctrl.children[0].lastElementChild.focus();
        }
    };
    var deleteItem = function (obj) {
        var val = obj.parentElement.getAttribute('data-value');
        var desc = obj.parentElement.getAttribute('data-desc');
        ctrl.children[1].style.display = 'none';
        var lis = ctrl.children[1].children[0].children;
        var nReg = lis.length;
        for (var i = 0; i < lis.length; i++) {
            if (lis[i].getAttribute('data-order') == obj.getAttribute('data-order')) {
                lis[i].style.display = 'block';
                ctrl.firstElementChild.removeChild(obj.parentElement);
                break;
            }
        }
        if ($jt['jtse-multitag-' + ctrl.id].DeleteEvent != undefined) {
            var o = $jt['jtse-multitag-' + ctrl.id];
            $jt[o.Namespace][o.DeleteEvent](val, desc);
        }
    };
    var $getValues = function (s) {
        var spns = ctrl.firstElementChild.children;
        var c = [], separatorOutput = $jt['jtse-multitag-' + controlName].SeparatorOutput;
        for (var i = 0; i < spns.length - 1; i++) {
            //c = spns[i].getAttribute('data-value');
            c.push(spns[i].getAttribute('data-value'));
        }
        return c.join(s || separatorOutput);
    };
    var $getListItems = function () {
        var spns = ctrl.firstElementChild.children;
        var c = [], c2 = '', separatorRegOutput = $jt['jtse-multitag-' + controlName].SeparatorRegOutput, separatorOutput = $jt['jtse-multitag-' + controlName].SeparatorOutput;
        for (var i = 0; i < spns.length - 1; i++) {
            c2 = spns[i].getAttribute('data-value');
            c2 += separatorOutput;
            c2 += spns[i].childNodes[0].textContent;
            c.push(c2);
        }
        return c.join(separatorRegOutput);
    };
    var $setListItems = function (list) {
        if (list != undefined) {
            ctrl.children[1].children[0].innerHTML = '';
            $jt['jtse-multitag-' + controlName].ListItems = list.slice();
            listItems();
        }
    };
    var $setValues = function (list) {
        var lis = ctrl.children[1].children[0].children;
        var nReg = list.length, nReg2 = lis.length;
        var i = ctrl.children[0].lastElementChild;
        ctrl.children[0].innerHTML = '';
        ctrl.children[0].appendChild(i);
        for (var j = 0; j < nReg2; j++) lis[j].style.display = 'block';
        for (var i = 0; i < nReg; i++) {
            for (var j = 0; j < nReg2; j++) {
                if (list[i] == lis[j].getAttribute('data-value')) {
                    lis[j].style.display = 'none';
                    var spn1 = document.createElement("SPAN");
                    spn1.className = "tag label label-info";
                    spn1.setAttribute("data-value", lis[j].getAttribute('data-value'));
                    spn1.setAttribute("data-desc", lis[j].getAttribute('data-desc'));
                    spn1.textContent = lis[j].getAttribute('data-desc');
                    var spn2 = document.createElement("SPAN");
                    spn2.setAttribute("data-order", lis[j].getAttribute('data-order'));
                    spn2.setAttribute("data-role", "remove");
                    spn2.onclick = function () { deleteItem(this); };
                    spn1.appendChild(spn2);
                    ctrl.firstElementChild.insertBefore(spn1, ctrl.children[0].lastElementChild);
                    ctrl.firstElementChild.scrollTop = ctrl.firstElementChild.scrollHeight;
                }
            }
        }
    };
    var listEqualItems = function (ctrl, obj) {
        if (obj.value != '') {
            var lis = ctrl.children[1].children[0].children;
            var spns = [].slice.call(ctrl.children[0].children);
            if (spns.length == 1) spns = [];
            else spns = spns.slice(0, spns.length - 1);
            var nReg = lis.length, nReg2 = spns.length, cont = 0, show = false;
            for (var i = 0; i < nReg; i++) lis[i].style.display = 'block';
            for (var i = 0; i < nReg; i++) {
                for (var j = 0; j < nReg2; j++) {
                    if (lis[i].getAttribute('data-value') == spns[j].getAttribute('data-value') && lis[i].getAttribute('data-desc') == spns[j].getAttribute('data-desc')) {
                        lis[i].style.display = 'none';
                        //spns.splice(j, 1);
                        nReg2 = spns.length;
                        break;
                    }
                }
                if (lis[i].style.display == 'block' && lis[i].getAttribute('data-desc').toLowerCase().indexOf(obj.value.toLowerCase()) == -1) lis[i].style.display = 'none';
                else cont++;
            }
            if (cont > 0) show = true;
            return show;
        }
        else return false;
    };
    var enter = function (e) {
        if (e.which == 13 || e.keyCode == 13) {
            addItem2(e.target);
            e.preventDefault();
        }
    };
    var $setHistory = function (list) {
        ctrl.setAttribute('data-history', list);
    };
    var $reset = function () {
        var i = ctrl.children[0].lastElementChild;
        i.value = '';
        ctrl.children[0].innerHTML = '';
        ctrl.children[0].appendChild(i);
    };
    return {
        create: function (o) {
            $create(o);
        },
        getValues: function (s) {
            return $getValues(s);
        },
        getListItems: function () {
            return $getListItems();
        },
        setListItems: function (o) {
            $setListItems(o);
        },
        setValues: function (o) {
            $setValues(o);
        },
        setHistory: function (o) {
            $setHistory(o);
        },
        reset: function () {
            $reset();
        }
    };
};