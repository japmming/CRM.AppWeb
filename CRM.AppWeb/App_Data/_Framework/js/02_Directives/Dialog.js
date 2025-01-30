var $$dialog = function () {
    var idDialog = "dialog_";
    var countId = 0,
        controlId = "";
    this.create = function () {
        var c = [];
        var iddiv = idDialog + countId;
        countId += 1;
        var div = document.createElement('DIV');
        div.id = iddiv;
        div.className = "dialog fade";
        c.push('<div class="dialog-content">');
        c.push('<div class="dialog-header">');
        c.push('<span></span>');
        c.push('</div>');
        c.push('<div class="dialog-body">');
        c.push('</div>');
        c.push('<div class="dialog-footer">');
        c.push('</div>');
        c.push('</div>');
        div.innerHTML = c.join('');
        document.body.appendChild(div);
        controlId = iddiv;
    }


    this.confirm = function (message, title, type, funct) {

        var ctrl = document.getElementById(controlId);
        var button = "",
            i = "";
        if (type == undefined) type = 'S';
        switch (type) {
            case 'S':
                i += '<div class="icons-success">';
                i += '<div class="type-success-x"></div>';
                i += '<div class="type-success-y"></div>';
                i += '</div>';

                break;
            case 'E':
                i += '<div class="icon-error">';
                i += '<div class="type-error-x"></div>';
                i += '<div class="type-error-y"></div>';
                i += '</div>';
                break;
            case 'I':
                i += '<div class="icon-info">';
                i += '<div class="type-info">i</div>';
                i += '</div>';
                break;
            case 'W':
                i += '<div class="icon-warning">';
                i += '<div class="type-warning">!</div>';
                i += '</div>';
                break;
            case 'Q':
                i += '<div class="icon-question">';
                i += '<div class="type-question">?</div>';
                i += '</div>';
                break;
        }
        button += '<button id="acept_' + countId + '" class="btn btn-ok-dialog">Aceptar</button>';
        button += '<button id="cancel_' + countId + '" class="btn btn-cancel-dialog">Cancelar</button>';

        ctrl.children[0].children[0].innerHTML = title;
        if (type == "")
            ctrl.children[0].children[1].innerHTML = i + '<div class="dialog-message" style="margin-left: 3px;"><span>' + message + '</span></div>';
        else
            ctrl.children[0].children[1].innerHTML = i + '<div class="dialog-message"><span>' + message + '</span></div>';

        ctrl.children[0].children[2].innerHTML = button;
        $show();
        document.getElementById('acept_' + countId).onclick = function () {
            $hide();
            funct(true);
        };

        document.getElementById('cancel_' + countId).onclick = function () {
            $hide();
            funct(false);
        };
    }

    this.alert = function (message, title, type, funct = null) {
        var ctrl = document.getElementById(controlId);
        var button = "",
            i = "";
        if (type == undefined) type = 'S';
        switch (type) {
            case 'S':
                i += '<div class="icons-success">';
                i += '<div class="type-success-x"></div>';
                i += '<div class="type-success-y"></div>';
                i += '</div>';

                break;
            case 'E':
                i += '<div class="icon-error">';
                i += '<div class="type-error-x"></div>';
                i += '<div class="type-error-y"></div>';
                i += '</div>';
                break;
            case 'I':
                i += '<div class="icon-info">';
                i += '<div class="type-info">i</div>';
                i += '</div>';
                break;
            case 'W':
                i += '<div class="icon-warning">';
                i += '<div class="type-warning">!</div>';
                i += '</div>';
                break;
            case 'Q':
                i += '<div class="icon-question">';
                i += '<div class="type-question">?</div>';
                i += '</div>';
                break;
        }
        button = '<button id="acept_' + countId + '" class="btn btn-ok-dialog">Aceptar</button>';

        ctrl.children[0].children[0].innerHTML = title;
        ctrl.children[0].children[1].innerHTML = i + '<div class="dialog-message"><span>' + message + '</span></div>';
        ctrl.children[0].children[2].innerHTML = button;
        $show();

        document.getElementById('acept_' + countId).onclick = function () {
            $hide();
            if (funct) {
                funct(true);
            }            
        };
    }

    var $show = function () {
        document.getElementById(controlId).className = "dialog show";
    };

    var $hide = function () {
        document.getElementById(controlId).className = "dialog fade";
    };
}

var $dialog = new $$dialog();