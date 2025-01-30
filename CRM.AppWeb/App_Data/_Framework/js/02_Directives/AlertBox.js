var $$alertbox = function () {
    var idBox = "alert_";
    var countId = 0,
        controlId = "";
    this.create = function (direct = "") {
        countId = 0;
        if (document.body.contains(document.getElementById("alert_0"))) {
            var existe = document.getElementById("alert_0");
            document.body.removeChild(existe);
        }
        var idaler = idBox + countId;
        countId += 1;
        var aler = document.createElement('DIV');
        aler.id = idaler;

        if (direct == "down") {
            aler.className = "alert-area right down";
        } else {
            aler.className = "alert-area right up";
        }

        document.body.appendChild(aler);
        controlId = idaler;
    }

    this.show = function (message, type, time) {
        var c = [];
        var ctrl = document.getElementById(controlId);
        var div = document.createElement('DIV');
        div.className = "alert-box";
        if (type == undefined) type = "S";
        switch (type) {
            case "S":
                div.style = "background-color: #35CF3A";
                break;
            case "W":
                div.style = "background-color: #E7A80B;";
                break;
            case "E":
                div.style = "background-color: #DC240E;";
                break;
            case "I":
                div.style = "background-color: #0F3890;";
                break;
        }
        c.push('<div class="alert-content">');
        c.push(message);
        c.push('</div>');
        c.push('<div ');
        c.push('id="close_' + countId + '" class="alert-close" href="#">×</div>');
        div.innerHTML = c.join('');
        ctrl.appendChild(div);

        document.getElementById('close_' + countId).onclick = function (event) {
            event.preventDefault();
            deletealert(div);
        }

        countId += 1;

        var Timeout = setTimeout(function () {
            deletealert(div);
            clearTimeout(Timeout);
        }, (time == undefined) ? 5000 : time * 1000);

    };

    var deletealert = function (div) {
        div.className = "alert-box hided";
        var ctrl = document.getElementById(controlId);
        var disperseTimeout = setTimeout(function () {
            if (ctrl.contains(div))
                ctrl.removeChild(div);
            clearTimeout(disperseTimeout);
        }, 100);
    }
}

var $alertbox = new $$alertbox();