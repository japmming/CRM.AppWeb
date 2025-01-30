var $$wizards = function (controlName) {
    var _msgError = {
        m1: 'Control not found',
        m2: 'Namespace not found',
        m3: 'Function not defined'
    };
    var ctrl = document.getElementById(controlName);
    if (ctrl == undefined) {
        console.log(_msgError.m1);
        return;
    }
    var sfx = 'jtse-wizard_' + controlName;
    var _ = {};
    if ($jt[sfx]) _ = $jt[sfx];
    var $create = function (o) {
        _.namespace = o.namespace || '';
        _.titles = o.titles || [];
        _.icons = o.icons || [];
        _.fontSize = o.fontSize || '';
        _.fontWeight = o.fontWeight || '';
        var ul = document.createElement('UL');
        ul.className = 'wizard-circle';
        var li, containers;
        for (var i = 0; i < _.titles.length; i++) {
            li = document.createElement('LI');
            if (i == 0) {
                li.className = 'current';
            }
            else {
                li.className = '';
            }
            li.id = 'LI_' + controlName + '_' + i;
            if (_.icons.length > 0) {
                li.innerHTML = '<i class="fa ' + _.icons[i] + '"></i > ' + _.titles[i];
            } else{
                li.innerHTML = _.titles[i];
            }
            li.setAttribute('data-tab', controlName + '-Wizard-' + i);
            li.setAttribute('data-index', i);

            if ((_.fontSize.length > 0) || (_.fontWeight.length > 0)) {
                var c = [];
                if (_.fontSize.length > 0) {
                    c.push('font-size:' + _.fontSize + 'px; ');
                }
                if (_.fontWeight.length > 0) {
                    c.push('font-weight:' + _.fontWeight + ';');
                }
                li.setAttribute('style', c.join(''));
            }
            li.addEventListener('click', function () {
                //selectWiz(this);
            });
            ul.appendChild(li);
        }
        containers = ctrl.children;
        for (var i = 1; i < containers.length; i++) {
            //NO OLVIDAR CAMBIAR EL LENGHT UNA VEZ EL BOTON HAYA SIDO COLOCADO EN EL JS
            if (i == 1) {
                containers[i].className = 'wiz-content current';
            }
            else {
                containers[i].className = 'wiz-content';
            }
            containers[i].id = controlName + '-Wizard-' + (i - 1);
            //NO OLVIDAR CAMBIAR EL LENGHT UNA VEZ EL BOTON HAYA SIDO COLOCADO EN EL JS
        }
        ctrl.insertBefore(ul, ctrl.children[0]);
        ctrl.classList.add('show');
    }
    var selectWiz = function (obj) {
        var ul = obj.parentElement, li;
        for (var i = 0; i < ul.children.length; i++) {
            li = ul.children[i];
            li.classList.remove('current');
            document.getElementById(li.getAttribute('data-tab')).className = 'wiz-content';
        }
        obj.className = 'current';
        document.getElementById(obj.getAttribute('data-tab')).className = 'wiz-content current';
    };
    return {
        create: function (titles) {
            $create(titles);
        }
    };
};