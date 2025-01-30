var $$tooltip = function (controlName) {
    var ctrl = document.getElementById(controlName);
    var $create = function (o) {
        if (ctrl != undefined && o.Tooltip != undefined) {
            var tooltip = document.getElementById(o.Tooltip);
            var divHeader = tooltip.children[0];
            if (o.ClassHeader != undefined)
                divHeader.classList.add(o.ClassHeader);
            if (o.DataHeader != undefined)
                divHeader.innerHTML = o.DataHeader;
            var divBody = tooltip.children[1];
            if (o.ClassBody != undefined)
                divBody.classList.add(o.ClassBody);
            if (o.DataBody != undefined)
                divBody.innerHTML = o.DataBody;
            ctrl.setAttribute('data-tooltip', o.Tooltip);
            ctrl.classList.add('show');
            ctrl.onmouseover = function (event) { ubicarTooltip(true); };
            ctrl.onmouseout = function (event) { ubicarTooltip(false); };
        }
    };
    var ubicarTooltip = function (show) {
        var tooltip = document.getElementById(ctrl.getAttribute('data-tooltip'));
        if (show) {
            var c = document.getElementsByTagName('view-root')[0].children[0].getBoundingClientRect();
            var cHeight = c.height.toFixed(0) * 1;
            var cWidth = c.width.toFixed(0) * 1;
            var t = tooltip.getBoundingClientRect();
            var tHeight = t.height.toFixed(0) * 1;
            var tWidth = t.width.toFixed(0) * 1;
            var p = ctrl.getBoundingClientRect();
            var pTop = p.top.toFixed(0) * 1;
            var pLeft = p.left.toFixed(0) * 1;
            var dif = (cWidth - pLeft) < tWidth ? pLeft = pLeft - tWidth : '';
            var dif = (cHeight - pTop) < tHeight ? pTop = pTop - tHeight : '';
            tooltip.style.top = pTop + 'px';
            tooltip.style.left = pLeft + 'px';
            tooltip.style.display = 'block';
        }
        else { tooltip.style.display = 'none'; }
    };
    var $createGeneral = function () {
        if (ctrl == undefined) {
            var div = document.createElement('DIV');
            div.id = controlName;
            div.className = 'jtse-tooltip';
            div.innerHTML = '<div class="tooltip-header"></div><div class="tooltip-body"></div>';
            document.body.appendChild(div);
        }
    };
    return {
        create: function (o) {
            $create(o);
        },
        createGeneral: function () {
            $createGeneral();
        }
    };
};