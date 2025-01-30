var $$modal = function (controlName) {
    var ctrl = document.getElementById(controlName);
    var $create = function (o) {
        if (ctrl != undefined) {
            var withId = o.WithId || false;
            var content = o.Content || '';
            var fullScreen = o.FullScreen == true ? true : false;
            var noFnClose = (o.noFnClose == undefined ? true : o.noFnClose) == true ? true : false;
            var noPaddingBody = (o.noPaddingBody == undefined ? false : o.noPaddingBody) == true ? true : false;
            var c = [];
            c.push('<div id="');
            c.push(controlName);
            c.push('_Modal" class="modal fade" data-scroll="');
            if (o.WithScrollY) c.push('1');
            else c.push('0');
            c.push('"')
            if (fullScreen) {
                c.push('style="top: 61px;"');
            }
            c.push('><div id="');
            c.push(controlName);
            c.push('_ModalDialog" class="modal-dialog ');
            if (!fullScreen) {
                c.push('modal-');
                c.push(o.Width || 'lg');
            }
            c.push('"')
            if (o.Style != undefined) {
                c.push(' style="');
                if (fullScreen) {
                    c.push('height:calc(100% - 20px);transition:none; -o-transition:none; -webkit-transition:none;-webkit-transform: none; -ms-transform: none; -o-transform: none; transform: none;');
                }
                c.push(o.Style);
                c.push('"');
            }
            else if (fullScreen) {
                c.push('style="height: calc(100%); width: calc(100%); margin: 0px;transition:none; -o-transition:none; -webkit-transition:none;-webkit-transform: none; -ms-transform: none; -o-transform: none; transform: none;"');
            }
            c.push('>');
            c.push('<div id="');
            c.push(controlName);
            if (fullScreen == true) {
                c.push('_Content" class="modal-content" style="overflow-y: auto; overflow-x: hidden; background-color: #f1f4f5;">');
            } else {
                if (o.TopColor == undefined || o.TopColor == '') {
                    //c.push('_Content" class="modal-content" style="border-top: 5px solid #2461aa !important;overflow-y: auto;">');
                    //c.push('_Content" class="modal-content" style="border-top: 5px solid #004D2F !important;overflow-y: auto;">');
                    c.push('_Content" class="modal-content" style="border-top: 5px solid #c6d644 !important;overflow-y: visible;">');
                } else {
                    c.push('_Content" class="modal-content" style="border-top: 5px solid #' + o.TopColor + ' !important;overflow-y: visible;" >');
                }
            }
            if (fullScreen == false) {
                c.push('<div id="');
                c.push(controlName);
                c.push('_Header" class="modal-header" style="');
                c.push((o.StyleHeader != undefined && o.StyleHeader != '') ? o.StyleHeader : '');
                c.push('">');
                if (noFnClose) {
                    c.push('<button id="');
                    c.push(controlName);
                    c.push('_btnClose" ');
                    if (o.FnClose && o.FnClose != '') {
                        c.push('onclick="$jt[\'');
                        c.push(o.Namespace)
                        c.push('\'].');
                        c.push(o.FnClose);
                        if (content == '') {
                            c.push('()"');
                        }
                        else {
                            c.push('"');
                        }
                    }
                    else {
                        c.push('onclick="$$modal(\'');
                        c.push(controlName);
                        c.push('\').hide();"');
                    }
                    c.push(' class="close"><span>×</span></button>');
                }
                c.push('<h1 class="modal-title">');
                c.push(o.Title || '');
                c.push('</h1>');
                c.push('</div >');
            }
            c.push('<div class="modal-body"');
            if (o.StyleBody != undefined) {
                c.push(' style="');
                if (fullScreen) {
                    c.push('height:calc(100% - 20px);transition:none; -o-transition:none; -webkit-transition:none;-webkit-transform: none; -ms-transform: none; -o-transform: none; transform: none;');
                }
                c.push(o.StyleBody);
                c.push('"');
            } else if (noPaddingBody) {
                c.push(' style="padding: 0px;"')
            } else if (fullScreen) {
                c.push('style="width: 100%;/* display: table*/; content: \'\'; padding: 0px;"');
            }
            c.push('>')
            if (content == '') {
                c.push(ctrl.innerHTML);
            }
            c.push('</div>');
            if (o.ButtonNames && o.ButtonClass && o.FnActions && o.Namespace) {
                c.push('<div id="');
                c.push(controlName);
                c.push('_Footer" class="modal-footer">');
                for (var i = 0; i < o.ButtonNames.length; i++) {
                    if (withId) {
                        c.push('<button id="');
                        c.push(o.ButtonNames[i] || '');
                        c.push('" class="btn ');
                    }
                    else {
                        c.push('<button class="btn ');
                    }
                    c.push(o.ButtonClass[i]);
                    c.push('" onclick="$jt[\'');
                    c.push(o.Namespace)
                    c.push('\'].');
                    c.push(o.FnActions[i]);
                    if (content == '') {
                        c.push('()">');
                    }
                    else {
                        c.push('">');
                    }
                    if (!withId) {
                        c.push(o.ButtonNames[i]);
                    }
                    c.push('</button>');
                }
                c.push('</div>');
            }
            //if (o.ButtonClose) {
            //	c.push('<button onclick="$$Modal(\'');
            //	c.push(controlName);
            //	c.push('\').hide();" class="btn btn-default">Close</button>');
            //}
            c.push('</div></div></div>');
            //c.push('<div class="modal-backdrop fade"></div>');
            ctrl.innerHTML = c.join('');
            ctrl.classList.add('show');
            if (content == '') {
                $hide();
            }
            else {
                ctrl.children[0].children[0].children[0].children[1].innerHTML = content;
                $show();
            }
            var mh = document.getElementById(controlName + '_Header');
            //mh.draggable = true;
            //mh.ondragstart = function (event) {
            //    dragStart(event);
            //};
            //mh.ondragover = function (event) {
            //    event.preventDefault();
            //};
            //var m = document.getElementById(controlName).children[0];
            //m.ondragover = function (event) {
            //    event.preventDefault();
            //};
            //m.ondrop = function (event) {
            //    dragDrop(event);
            //};
        }
    };
    var dragStart = function (event) {
        var mc = event.target.parentElement.parentElement;
        var ancho = getComputedStyle(mc, null).getPropertyValue("left");
        var alto = getComputedStyle(mc, null).getPropertyValue("top");
        var a = Math.floor(ancho.replace("px", ""));
        var b = Math.floor(alto.replace("px", ""));
        var x = (event.clientX > a ? event.clientX - a : a - event.clientX);
        var y = (event.clientY > b ? event.clientY - b : b - event.clientY);
        var punto = x + "," + y;
        event.dataTransfer.setData("text", punto);
    };
    var dragDrop = function (event) {
        event.preventDefault();
        var x1 = event.clientX;
        var y1 = event.clientY;
        var puntoInicial = event.dataTransfer.getData("text");
        var punto = puntoInicial.split(",");
        var x2 = punto[0] * 1;
        var y2 = punto[1] * 1;
        var mc = event.target.children[0];
        mc.style.left = (x1 - x2) + "px";
        mc.style.top = (y1 - y2) + "px";
    };
    var $show = function (e) {
        if (ctrl != undefined) {
            var error = ctrl.getElementsByClassName("has-error");
            for (var i = 0; i < error.length; i++) {
                error[i].classList.remove("has-error");
                i = i - 1;
            };
            ctrl.style.display = '';
            ctrl = ctrl.children[0];
            ctrl.classList.add('show');
            //ctrl.nextElementSibling.classList.add('show');
            setTimeout(function () {
                ctrl.className = 'modal show fade in' + (ctrl.getAttribute('data-scroll') == '1' ? ' modal-scroll' : '');
            }, 300);
            //setTimeout(function () {
            //	ctrl.nextElementSibling.className = 'modal-backdrop show fade in';
            //}, 150);
        }
    };
    var $hide = function () {
        if (ctrl != undefined) {
            ctrl = ctrl.children[0];
            ctrl.className = 'modal show fade' + (ctrl.getAttribute('data-scroll') == '1' ? ' modal-scroll' : '');
            //ctrl.nextElementSibling.className = 'modal-backdrop show fade';
            setTimeout(function () {
                ctrl.classList.remove('show');
            }, 150);
            //setTimeout(function () {
            //	ctrl.nextElementSibling.classList.remove('show');
            //}, 300);
        }
    };
    var $center = function () {
        var modals = document.getElementsByClassName('modal-dialog');
        var cModals = modals.length;
        for (var i = 0; i < cModals; i++) {
            modals[i].style.top = '0px';
            modals[i].style.left = '0px';
        }
    };
    var $setTitle = function (title) {
        ctrl.getElementsByClassName('modal-title')[0].innerHTML = title;
    };
    var $setColor = function (color) {
        document.getElementById(controlName + "_Content").style.borderTop = " 5px solid " + color;
    };
    return {
        create: function (d) {
            $create(d);
        },
        show: function () {
            $show();
        },
        hide: function () {
            $hide();
        },
        setTitle: function (t) {
            $setTitle(t);
        },
        setColor: function (t) {
            $setColor(t);
        },
        center: function () {
            $center();
        },
    };
};