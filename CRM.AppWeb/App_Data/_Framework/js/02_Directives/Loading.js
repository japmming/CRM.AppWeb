var $$loading = function (controlName) {
    var ctrl = document.getElementById(controlName);
    var $create = function () {
        if (ctrl == undefined) {
            var div = document.createElement('DIV');
            div.id = controlName;
            div.className = 'jtse-loading hide';
            //div.innerHTML = '<div class="circle"></div><div class="circle-small"></div><div class="circle-big"></div><div class="circle-inner-inner"></div><div class="circle-inner"></div>';
            //div.style.right = '0px';
            //div.style.opacity = '0';
            //div.style.zIndex = "-100";
            var c = [];
            c.push('<div class="circle"></div>');
            c.push('<div class="circle-small"></div>');
            c.push('<div class="circle-big"></div>');
            c.push('<div class="circle-inner-inner"></div>');
            c.push('<div class="circle-inner"></div>');
            c.push('<div id="');
            c.push(controlName);
            c.push('_Texto" class="loading-text"></div>');
            div.innerHTML = c.join('');
            document.body.appendChild(div);
            ctrl = document.getElementById(controlName);
        }
    };
    var $active = function (message) {
        if (ctrl != undefined) {
            ctrl.classList.remove('hide');
            document.body.style.cursor = 'none';
            document.body.style.pointerEvents = 'none';
            document.getElementById(controlName + '_Texto').innerHTML = message || '';
        }
    };
    var $inactive = function () {
        if (ctrl != undefined) {
            ctrl.classList.add('hide');
            document.body.setAttribute('style', '');
            document.getElementById(controlName + '_Texto').innerHTML = '';
        }
    };
    return {
        create: function () {
            $create();
        },
        active: function (m) {
            $active(m);
        },
        inactive: function () {
            $inactive();
        }
    };
};