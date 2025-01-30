var $$accordion = function (controlName) {
    var ctrl = document.getElementById(controlName);
    var parent;
    var $create = function (o) {
        if (ctrl != undefined) {
            parent = o.Parent;
            var show = false;
            if (o != undefined && o.Show != undefined) show = o.Show;
            var c = [], h = 0;
            c.push('<div class="accordion-btn">');
            if (o.Paths != undefined)
                c.push('<span><i class="fa fa-chevron-left"></i></span>')
            c.push('</div><div class="accordion-header" data-show="');
            if (show) c.push('1');
            else c.push('0');
            c.push('"><span');
            if (o.WithId) {
                c.push(' id="');
                c.push(o.Title);
                c.push('">');
            }
            else {
                c.push('>');
                c.push(o.Title);
            }
            c.push('</span><i class="fa fa-minus pull-right"></i></div><div class="accordion-body"><div class="accordion-content">');
            c.push(ctrl.innerHTML);
            c.push('</div></div>');
            ctrl.classList.add('jtse-accordion');
            ctrl.innerHTML = c.join('');
            ctrl.classList.add('show');
            if (o.Color != undefined) {
                if (o.Paths != undefined)
                    ctrl.children[0].children[0].children[0].style.backgroundColor = 'rgba(227,1,77,1)';/*o.Color*/
                ctrl.children[1].style.backgroundColor = 'rgba(227,1,77,1)';
            }
            ctrl.children[1].onclick = function (event) { collapse(this); };
            collapseInit(ctrl.children[1], ctrl.children[2]);
            ctrl.children[2].addEventListener("transitionend", function (event) { endCollapse(this); }, false);
            if (o.Paths != undefined) {
                ctrl.children[1].style.borderTopRightRadius = '0px';
                ctrl.children[0].setAttribute('data-paths', o.Paths.join(','));
                ctrl.children[0].style.display = 'block';
                ctrl.children[0].id = controlName + '_btn';
                ctrl.children[0].onclick = function () {
                    var paths = this.getAttribute('data-paths').split(','), i, c, show;
                    i = this.children[0].children[0];
                    if (i.classList.contains('fa-chevron-left')) {
                        i.classList.remove('fa-chevron-left');
                        i.classList.add('fa-chevron-down');
                        this.setAttribute('data-show', '1');
                        show = '1';
                    }
                    else {
                        i.classList.remove('fa-chevron-down');
                        i.classList.add('fa-chevron-left');
                        this.setAttribute('data-show', '0');
                        show = '0';
                    }
                    for (var i = 0; i < paths.length; i++) {
                        c = document.getElementById(paths[i]);
                        if (c != undefined) {
                            if (c.children[1].getAttribute('data-show') == show) {
                                c.children[1].click();
                            }
                        }
                    }
                };
            }
        }
    };
    var collapseInit = function (header, body) {
        header.setAttribute('data-active', '0');
        if (header.getAttribute('data-show') == '1') {
            body.style.display = 'block';
            header.children[1].classList.remove('fa-plus');
            header.children[1].classList.add('fa-minus');
        } else {
            body.style.height = '0px';
            body.style.display = 'none';
            header.children[1].classList.remove('fa-minus');
            header.children[1].classList.add('fa-plus');
        }
    };
    var collapse = function (obj) {
        obj.setAttribute('data-active', '1');
        obj.nextElementSibling.style.display = 'block';
        if (obj.getAttribute('data-show') == '1') {
            //obj.nextElementSibling.className = 'accordion-body collapsing';
            var valor = obj.nextElementSibling.scrollHeight;
            //obj.nextElementSibling.className = 'accordion-body';
            obj.nextElementSibling.style.height = valor + 'px';
            obj.nextElementSibling.className = 'accordion-body collapsing';
            setTimeout(function () {
                obj.nextElementSibling.style.height = '0px';
            }, 150);
        }
        else {
            obj.nextElementSibling.className = 'accordion-body collapsing';
            obj.nextElementSibling.style.height = obj.nextElementSibling.scrollHeight + 'px';
        }
    };
    var endCollapse = function (obj) {
        obj.className = 'accordion-body';
        if (obj.previousElementSibling.getAttribute('data-active') == '1') {
            if (obj.previousElementSibling.getAttribute('data-show') == '0') {
                obj.previousElementSibling.setAttribute('data-show', '1');
                obj.style.height = null;
                obj.previousElementSibling.children[1].classList.remove('fa-plus');
                obj.previousElementSibling.children[1].classList.add('fa-minus');
            }
            else {
                obj.style.display = 'none';
                obj.previousElementSibling.setAttribute('data-show', '0');
                obj.previousElementSibling.children[1].classList.remove('fa-minus');
                obj.previousElementSibling.children[1].classList.add('fa-plus');
            }
        }
        obj.previousElementSibling.setAttribute('data-active', '0');
        var paths = document.getElementById(parent + '_btn');
        if (paths) {
            var isCollapse = paths.getAttribute('data-show');
            var currentCollapse, minus = 0, plus = 0;
            paths = paths.getAttribute('data-paths').split(',');
            for (var i = 0; i < paths.length; i++) {
                if (i == 0) {
                    currentCollapse = document.getElementById(paths[i]).children[0].children[0].classList.contains('fa-plus') ? true : false;
                }
                if (document.getElementById(paths[i]).getElementsByClassName('accordion-header')[0].children[1].classList.contains('fa-plus')) {
                    plus++;
                }
                else {
                    minus++;
                }
            }
            var i = document.getElementById(parent + '_btn').children[0].children[0];
            if (plus == paths.length) {
                i.classList.remove('fa-chevron-left');
                i.classList.add('fa-chevron-down');
                document.getElementById(parent + '_btn').setAttribute('data-show', '1');

            }
            if (minus == paths.length) {
                i.classList.remove('fa-chevron-down');
                i.classList.add('fa-chevron-left');
                document.getElementById(parent + '_btn').setAttribute('data-show', '0');
            }
        }
    };
    var $setColor = function (color) {
        if (color) {
            if (ctrl.getElementsByClassName('accordion-header')) {
                var c = ctrl.getElementsByClassName('accordion-header')[0];
                c.style.backgroundColor = color;
            }
        }
    };
    return {
        create: function (o) {
            $create(o);
        },
        setColor: function (o) {
            $setColor(o);
        }
    };
};