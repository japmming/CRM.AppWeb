var $$popover = function (controlName) {
    var ctrl = document.getElementById(controlName);
    var $create = function (_data) {
        var o = _data || {};
        var c = [], content = '', nReg, root, cf = document.createDocumentFragment(), d, i;
        ctrl.style.display = 'none';
        ctrl.classList.add('jtse-popover');
        ctrl.classList.add('popover-bottom');
        c.push('<div class="popover-arrow"></div>');
        c.push('<h3 class="popover-title" style="display: none;"></h3>');
        c.push('<div class="popover-content"></div></div>');
        content = ctrl.innerHTML;
        ctrl.innerHTML = c.join('');
        ctrl.classList.add('show');
        ctrl.children[2].innerHTML = content;
        document.getElementById(o.Toggle).onclick = function () {
            if (ctrl.style.display == 'none') ctrl.style.display = 'block';
            else ctrl.style.display = 'none';
        };
        ctrl.onmouseleave = document.getElementById(o.Toggle).parentElement.parentElement.onmouseleave = function () { ctrl.style.display = 'none'; };
    };
    var $show = function () {
        ctrl.style.display = 'block';
    };
    var $hide = function () {
        ctrl.style.display = 'none';
    };
    return {
        create: function (o) {
            $create(o);
        },
        show: function () {
            $show();
        },
        hide: function (o) {
            $hide(o);
        }
    };
};

