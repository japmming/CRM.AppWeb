var $$alert = function (controlName) {
    var ctrl = document.getElementById(controlName);
    var $create = function () {
        if (ctrl == undefined) {
            var div = document.createElement('DIV');
            div.id = controlName;
            div.className = 'jtse-alert';
            div.innerHTML = '<div class="alert move-right"><span></span></div>';
            document.body.appendChild(div);
            ctrl = document.getElementById(controlName);
        }
    };
    var $show = function (message, type, time) {
        if (ctrl != undefined && message != undefined) {
            var msgType = 'alert move-right warning';
            switch (type) {
                case 'S':
                    msgType = 'alert move-right success';
                    break;
                case 'I':
                    msgType = 'alert move-right info';
                    break;
                case 'D':
                    msgType = 'alert move-right default';
                    break;
                case 'E':
                    msgType = 'alert move-right error';
                    break;
            }
            ctrl.children[0].className = msgType;
            ctrl.children[0].innerHTML = message;
            ctrl.className = 'jtse-alert anix';
            setTimeout(function () {
                ctrl.className = 'jtse-alert';
            }, (time != undefined ? time * 1000 : 15000));
        }
    };
    return {
        create: function () {
            $create();
        },
        show: function (message, type, time) {
            $show(message, type, time);
        }
    };
};