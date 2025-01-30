var $$multiselect = function (controlName) {
    var ctrl = document.getElementById(controlName);
    var $create = function (_data) {
        var o = _data || {};
        var height;
        var content = '<div style="min-width:3em !important"><i id="MultiSelect' + controlName + '" class="fa fa-plus"></i></div><div style="display:none"><input id="txbBusqueda' + controlName + '" type="text" role="search" /><ul></ul></div>';
        if (!ctrl.classList.contains('jtse-tags')) ctrl.classList.add('jtse-tags');
        ctrl.innerHTML = content;
        ctrl.classList.add('show');
        ctrl.setAttribute('role-tags', 'multiselect');
        var ctrlChild = document.getElementById('MultiSelect' + controlName);
        height = o.Height != undefined ? o.Height : 55;
        ctrl.children[0].style.height = height + 'px';
        ctrl.children[0].children[0].onclick = function () {
            document.getElementById('txbBusqueda' + controlName).value = '';
            listEqualItems(ctrl, document.getElementById('txbBusqueda' + controlName));
            this.parentElement.nextElementSibling.style.display = 'block';
            ctrl.children[1].style.display = "";
            ctrl.children[1].style.marginTop = "";
            var d = document.getElementsByTagName('view-root')[0].children[0].getBoundingClientRect();
            var d2 = ctrl.children[0].getBoundingClientRect();
            var c = ctrl.children[1].getBoundingClientRect();
            var h = (c.top.toFixed(0) * 1) + (c.height.toFixed(0) * 1);
            if (d.height < h) ctrl.children[1].style.marginTop = '-' + ((c.height.toFixed(0) * 1) + (d2.height.toFixed(0) * 1) + 5) + 'px';
            ctrl.children[1].children[0].focus();
        };
        ctrl.onmouseleave = function () {
            document.getElementById('txbBusqueda' + controlName).value = '';
            listEqualItems(ctrl, document.getElementById('txbBusqueda' + controlName));
            this.children[1].style.display = 'none';
        };
        document.getElementById('txbBusqueda' + controlName).oninput = function () {
            listEqualItems(ctrl, this);
            ctrl.children[1].style.display = "";
            ctrl.children[1].style.marginTop = "";
            var d = document.getElementsByTagName('view-root')[0].children[0].getBoundingClientRect();
            var d2 = ctrl.children[0].getBoundingClientRect();
            var c = ctrl.children[1].getBoundingClientRect();
            var h = (c.top.toFixed(0) * 1) + (c.height.toFixed(0) * 1);
            if (d.height < h) ctrl.children[1].style.marginTop = '-' + ((c.height.toFixed(0) * 1) + (d2.height.toFixed(0) * 1) + 5) + 'px';
        };
        o.ListItems = o.ListItems || [];
        o.SeparatorRegOutput = o.SeparatorRegOutput || '¬';
        o.SeparatorOutput = o.SeparatorOutput || '¦';
        o.Separator = o.Separator || '¦';
        $jt['jtse-multiselect-' + controlName] = o;
        if (o.ListItems.length > 0) listItems();
    };
    var listEqualItems = function (ctrl, obj) {
        var lis = ctrl.children[1].children[1].children;
        var spns = [].slice.call(ctrl.children[0].children);
        if (spns.length == 1) spns = [];
        else spns = spns.slice(0, spns.length - 1);
        var nReg = lis.length, nReg2 = spns.length;
        for (var i = 0; i < nReg; i++) lis[i].style.display = 'block';
        for (var i = 0; i < nReg; i++) {
            for (var j = 0; j < nReg2; j++) {
                if (lis[i].getAttribute('data-value') == spns[j].getAttribute('data-value') && lis[i].getAttribute('data-desc') == spns[j].getAttribute('data-desc')) {
                    lis[i].style.display = 'none';
                    break;
                }
            }
            if (lis[i].style.display == 'block' && lis[i].getAttribute('data-desc').toLowerCase().indexOf(obj.value.toLowerCase()) == -1)
                lis[i].style.display = 'none';
        }
    };
    var listItems = function () {
        var o = $jt['jtse-multiselect-' + controlName];
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
                li.innerHTML = d[1];
                li.onclick = function () { addItem(this); };
                cf.appendChild(li);
            }
            ctrl.children[1].children[1].appendChild(cf);
        }
    };
    var addItem = function (obj) {
        var lis = ctrl.children[1].children[1].children;
        var nReg = lis.length, cont = 0;
        var color = ctrl.getAttribute('data-color');
        for (var i = 0; i < nReg; i++) {
            if (lis[i].getAttribute('data-value') == obj.getAttribute('data-value')) {
                lis[i].style.display = 'none';
                var spn1 = document.createElement("SPAN");
                spn1.className = "tag label label-info";
                if (color != '') spn1.style.backgroundColor = color;
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
                if ($jt['jtse-multiselect-' + ctrl.id].AddEvent != undefined) {
                    var o = $jt['jtse-multiselect-' + ctrl.id];
                    $jt[o.Namespace][o.AddEvent](obj, obj.getAttribute('data-value'));
                }
            }
        }
        var spns = ctrl.firstElementChild.children;
        for (var i = 0; i < spns.length; i++) {
            if (spns[i].tagName == 'SPAN')
                cont++;
        }
        if (nReg == cont) ctrl.firstElementChild.lastElementChild.style.display = 'none';
        else ctrl.firstElementChild.lastElementChild.style.display = '';
    };
    var deleteItem = function (obj) {
        var val = obj.parentElement.getAttribute('data-value');
        var desc = obj.parentElement.getAttribute('data-desc');
        var lis = ctrl.children[1].children[1].children;
        var nReg = lis.length, cont = 0;
        for (var i = 0; i < lis.length; i++) {
            if (lis[i].getAttribute('data-order') == obj.getAttribute('data-order')) {
                lis[i].style.display = 'block';
                ctrl.firstElementChild.removeChild(obj.parentElement);
            }
            if (lis[i].style.display == 'none') cont++;
        }
        ctrl.firstElementChild.lastElementChild.style.display = '';
        if ($jt['jtse-multiselect-' + ctrl.id].DeleteEvent != undefined) {
            var o = $jt['jtse-multiselect-' + ctrl.id];
            $jt[o.Namespace][o.DeleteEvent](val, desc);
        }
    };
    var $getValues = function () {
        var spns = ctrl.firstElementChild.children;
        var c = [], separatorOutput = $jt['jtse-multiselect-' + controlName].SeparatorOutput;
        for (var i = 0; i < spns.length - 1; i++) {
            c.push(spns[i].getAttribute('data-value'));
        }
        return c.join(separatorOutput);
    };
    var $getListItems = function () {
        var spns = ctrl.firstElementChild.children;
        var c = [], c2 = '', separatorRegOutput = $jt['jtse-multiselect-' + controlName].SeparatorRegOutput, separatorOutput = $jt['jtse-multiselect-' + controlName].SeparatorOutput;
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
            ctrl.children[1].children[1].innerHTML = '';
            $jt['jtse-multiselect-' + controlName].ListItems = list.slice();
            listItems();
        }
    };
    var $setValues = function (list) {
        var lis = ctrl.children[1].children[1].children;
        var nReg = list.length, nReg2 = lis.length, cont = 0;
        var color = ctrl.getAttribute('data-color');
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
                    if (color != '') spn1.style.backgroundColor = color;
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
        for (var j = 0; j < nReg2; j++) {
            if (lis[j].style.display == 'none') cont++;
        }
        if (nReg2 == cont) ctrl.firstElementChild.lastElementChild.style.display = 'none';
        else ctrl.firstElementChild.lastElementChild.style.display = '';
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
    var $getAllListItems = function () {
        var spns = ctrl.lastElementChild;
        var ul = spns.lastElementChild.children;

        var c = [], c2 = '', separatorRegOutput = $jt['jtse-multiselect-' + controlName].SeparatorRegOutput, separatorOutput = $['jtse-multiselect-' + controlName].SeparatorOutput;
        for (var i = 0; i < ul.length; i++) {
            c2 = ul[i].getAttribute('data-value');
            c2 += separatorOutput;
            c2 += ul[i].getAttribute("data-desc");
            c.push(c2);
        }
        return c.join(separatorRegOutput);
    };
    var $setColor = function (c) {
        ctrl.setAttribute('data-color', c);
        var tags = ctrl.getElementsByClassName('tag');
        for (var i = 0; i < tags.length; i++) {
            tags[i].style.backgroundColor = c;
        }
    };
    return {
        create: function (o) {
            $create(o);
        },
        getValues: function () {
            return $getValues();
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
        },
        getAllListItems: function () {
            return $getAllListItems();
        },
        setColor: function (c) {
            $setColor(c);
        }
    };
};