var $$tabs = function (controlName) {
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
    var sfx = 'jtse-tabs_' + controlName;
    var _ = {};
    if ($jt[sfx]) _ = $jt[sfx];
    var $create = function (o) {
        if (o) {
            _.namespace = o.namespace || '';
            _.fnEvSelected = o.fnEvSelected || [];
            _.titles = o.titles || [];
            _.fontSize = o.fontSize || [];
            _.fontWeight = o.fontWeight || [];
            _.textAlign = o.textAlign || [];
            //center|left|right
            ctrl.classList.add('jtse-tabs');
            var ul = document.createElement('UL');
            if (_.textAlign.length > 0) {
                ul.className = 'tabs text-' + _.textAlign;
            } else {
                ul.className = 'tabs';
            }
            var li, containers;
            for (var i = 0; i < _.titles.length; i++) {
                li = document.createElement('LI');
                if (i == 0) {
                    li.className = 'tab-link current';
                }
                else {
                    li.className = 'tab-link';
                }
                li.innerHTML = _.titles[i];
                li.setAttribute('data-tab', controlName + '-Tabs-' + i);
                li.setAttribute('data-index', i);
                if ((_.fontSize.length > 0) || (_.fontWeight.length > 0)) {
                    var c = [];
                    if (_.fontSize.length > 0) {
                        c.push('font-size:' + _.fontSize[i] + 'px; ');
                    }
                    if (_.fontWeight.length > 0) {
                        c.push('font-weight:' + _.fontWeight[i] + ';');
                    }
                    li.setAttribute('style', c.join(''));
                }
                li.addEventListener('click', function () {
                    selectTab(this);
                });
                if (_.fnEvSelected.length > 0) {
                    li.addEventListener('click', function () {
                        if (_.fnEvSelected[this.getAttribute('data-index')] != '') {
                            $jt[_.namespace][_.fnEvSelected[this.getAttribute('data-index')]](this);
                        }
                    });
                }
                ul.appendChild(li);
            }
            containers = ctrl.children;
            for (var i = 0; i < containers.length; i++) {
                if (i == 0) {
                    containers[i].className = 'tab-content current';
                }
                else {
                    containers[i].className = 'tab-content';
                }
                containers[i].id = controlName + '-Tabs-' + i;
            }
            ctrl.insertBefore(ul, ctrl.children[0]);
            ctrl.classList.add('show');
        }
    };
    var selectTab = function (obj) {
        var ul = obj.parentElement, li;
        for (var i = 0; i < ul.children.length; i++) {
            li = ul.children[i];
            li.classList.remove('current');
            document.getElementById(li.getAttribute('data-tab')).className = 'tab-content';
        }
        obj.className = 'tab-link current';
        document.getElementById(obj.getAttribute('data-tab')).className = 'tab-content current';
    };
    return {
        create: function (titles) {
            $create(titles);
        }
    };
};