var $$datepicker = function (controlName, formato) {
    var ctrl = document.getElementById(controlName);
    Object.defineProperty(ctrl, 'dateValue', {
        get: function () {
            let returnValue = '';
            //this.value;
            if (this.value.indexOf('/') > 0) {
                let arrValor = this.value.split('/');
                returnValue = arrValor[2] + '-' + arrValor[1] + '-' + arrValor[0];
            } else {
                returnValue = this.value;
            }
            return returnValue;
        },
        set: function (valor) {
            if (valor.indexOf('-') > 0) {
                let arrValor = valor.split('-');
                this.value = arrValor[2] + '/' + arrValor[1] + '/' + arrValor[0];
            } else if (valor.indexOf('/') > 0) {
                this.value = valor;
            }
        }
    });

    ctrl.onchange = function () {
        let arr = [];
        if (this.value.indexOf('-') > 0) {
            arr = this.value.split('-');
            if (arr.length == 3) {
                this.value = arr[2] + '/' + arr[1] + '/' + arr[0]
            }
        }
        /*if (this.value.indexOf('/') > 0) {
            arr = this.value.split('/')
            if (arr.length == 3) {
                this.value = 
            }
        }*/
    }

    var $create = function () {
        if (!ctrl.classList.contains('date-picker-x-input')) {
            ctrl.DatePickerX.init({
                mondayFirst: true,
                format: $controls.datepicker.format
            });
            ctrl.readOnly = false;
        }
    };
    return {
        create: function () {
            $create();
        }
    };
};

var loadDatePicker = function (formato) {
    'use strict';
    var optionsDefault = {
        mondayFirst: false,
        format: formato,
        minDate: new Date(0, 0),
        maxDate: new Date(9999, 11, 31),
        weekDayLabels: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
        shortMonthLabels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'],
        singleMonthLabels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        todayButton: true,
        todayButtonLabel: 'Hoy',
        clearButton: true,
        clearButtonLabel: 'Borrar'
    },
        openedDPX = null;
    if ($controls.datepicker.datePickerDefault != undefined) {
        optionsDefault.weekDayLabels = $controls.datepicker.datePickerDefault.WeekDayLabels.slice(),
            optionsDefault.shortMonthLabels = $controls.datepicker.datePickerDefault.ShortMonthLabels.slice(),
            optionsDefault.singleMonthLabels = $controls.datepicker.datePickerDefault.SingleMonthLabels.slice();
    }
    function createElement(tag, classes, parent, html, title) {
        classes = classes || [];
        !Array.isArray(classes) && (classes = [classes]);

        var el = document.createElement(tag);
        for (var i = classes.length; i--; el.classList.add(classes[i]));

        title && (el.title = title);
        el.innerHTML = html || '';

        parent instanceof Element && parent.appendChild(el);

        return el;
    }
    function clearDate(dt) {
        dt = dt || new Date;
        return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    }
    function DPX(input) {
        var options = {},
            elements = {},
            inited = false,
            value = null,
            mode = 2;
        function getMinDate() {
            var value = options.minDate;

            if (value instanceof HTMLInputElement) {
                value = value.DatePickerX.getValue(true);
                value = value === null ? options.minDate.DatePickerX.getMinDate() : new Date(value);
                value.setDate(value.getDate() + 1);
            }
            return clearDate(value);
        }
        function getMaxDate() {
            var value = options.maxDate;

            if (value instanceof HTMLInputElement) {
                value = value.DatePickerX.getValue(true);
                value = value === null ? options.maxDate.DatePickerX.getMaxDate() : new Date(value);
                value.setDate(value.getDate() - 1);
            }

            return clearDate(value);
        }
        function createElements() {
            elements.container = createElement('div', 'date-picker-x');

            var titleBox = createElement('div', 'dpx-title-box', elements.container);
            elements.prevTitle = createElement('span', 'dpx-prev', titleBox, '&#x276e;');
            elements.title = createElement('span', 'dpx-title', titleBox);
            elements.nextTitle = createElement('span', 'dpx-next', titleBox, '&#x276f;');

            elements.content = createElement('div', 'dpx-content-box', elements.container);

            input.nextElementSibling
                ? input.parentNode.insertBefore(elements.container, input.nextElementSibling)
                : input.parentNode.appendChild(elements.container);

            if (options.todayButton || options.clearButton) {
                var btns = createElement('div', 'dpx-btns', elements.container);
                options.todayButton && (elements.today = createElement('span', ['dpx-item', 'dpx-today'], btns, options.todayButtonLabel, options.todayButtonLabel));
                options.clearButton && (elements.clear = createElement('span', ['dpx-item', 'dpx-clear'], btns, options.clearButtonLabel, options.clearButtonLabel));
            }
        }
        function getFormatedDate(dt, format) {
            var items = {
                d: dt.getDate(),
                dd: dt.getDate(),
                D: dt.getDay(),
                m: dt.getMonth() + 1,
                mm: dt.getMonth() + 1,
                M: dt.getMonth(),
                MM: dt.getMonth(),
                yy: dt.getFullYear().toString().substr(-2),
                yyyy: dt.getFullYear()
            };
            items.dd < 10 && (items.dd = '0' + items.dd);
            items.mm < 10 && (items.mm = '0' + items.mm);
            items.D = options.weekDayLabels[items.D ? items.D - 1 : 6];
            items.M = options.shortMonthLabels[items.M];
            items.MM = options.singleMonthLabels[items.MM];
            return format.replace(/(?:[dmM]{1,2}|D|yyyy|yy)/g, function (m) {
                return typeof items[m] !== 'undefined' ? items[m] : m;
            });
        }
        function isActive() {
            return elements.container.classList.contains('active');
        }
        function addEvents(dpx) {
            var btndtp = input.nextElementSibling.nextElementSibling;
            btndtp.onclick = function () {
                input.click();
            }
            var Numerico = function (e) {
                var key;
                if (window.event) // IE
                {
                    key = e.keyCode;
                }
                else if (e.which) // Netscape/Firefox/Opera
                {
                    key = e.which;
                }
                return (key <= 13 || (key >= 48 && key <= 57) || key == 44);
            };
            var Fecha = function (obj, e) {
                var v = obj.value;
                if (Numerico(e) == true) {
                    if (v.match(/^\d{2}$/) !== null) {
                        obj.value = v + '/';
                    } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
                        obj.value = v + '/';
                    }
                }
                else {
                    if (event.preventDefault) {
                        event.preventDefault();
                    }
                    else {
                        event.returnValue = false;
                    }

                }
            }


            input.addEventListener("keypress", function (e) {
                Fecha(this, e);
                this.maxLength = 10;
            });
            input.addEventListener("change", function (e) {
                //Fecha(this, e);
                //this.maxLength = 10;
                //if (this.value.length == 10 && this.value.indexOf('-')>0) {
                //    //Fecha(this, e);
                //    let fch = this.value.split('-');
                //    this.value = fch[2] + '/' + fch[1] + '/' + fch[0];

                //}
            });
            input.addEventListener('keyup', function (e) {
                openedDPX && openedDPX.classList.remove('active');


            });
            input.addEventListener('click', function (e) {
                if (this.value == "") {
                    value = null;
                }

                if (!isActive()) {
                    e.stopPropagation();
                    mode = 2;
                    //if (this.value == "") {
                    draw();
                    //} else { draw(value)}
                    elements.container.classList.add('active');
                    var control = elements.container;

                    var input = control.previousElementSibling;
                    if (input.nodeName == "INPUT") {
                        var datepicker = input.getBoundingClientRect();

                        //var datepicker = pickerField.getBoundingClientRect();
                        //var left = datepicker.left;
                        //var top = datepicker.bottom - 7;
                        //if (control) {
                        //    var body = document.getElementsByTagName("body")[0];
                        //    var alto = body.clientHeight;
                        //    var ancho = body.clientWidth;
                        //    var diferencia = (alto - top) < 236 ? (top = top - (236 + datepicker.height - input.clientHeight)) : "";
                        //    var diferencia = (ancho - left) < 245 ? (left = left - (245)) : "";
                        //    //pickerDiv.style.position = 'absolute';
                        //    //pickerDiv.style.top = top + 'px';
                        //    //pickerDiv.style.left = left + 'px';
                        //    if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/))) {
                        //    } else {
                        //        control.style.position = 'fixed';
                        //        control.style.top = top + 'px';
                        //        control.style.left = left + 'px';
                        //        control.style.zIndex = '999999999';
                        //    }
                        //}
                        var estado = false;

                        if (datepicker) {
                            var c = document.getElementsByTagName('view-root')[0].children[0];
                            if (c.tagName == 'STYLE') {
                                c = c.nextElementSibling.getBoundingClientRect();
                            }
                            var cHeight = c.height.toFixed(0) * 1;
                            var cWidth = c.width.toFixed(0) * 1;
                            var t = control.getBoundingClientRect();
                            var tHeight = t.height.toFixed(0) * 1;
                            var tWidth = t.width.toFixed(0) * 1;
                            var p = datepicker;
                            var pTop = p.top.toFixed(0) * 1;
                            var pLeft = p.left.toFixed(0) * 1;
                            var dif = (cWidth - pLeft) < tWidth ? pLeft = pLeft - tWidth : '';
                            var dif = (cHeight - pTop) < tHeight ? pTop = pTop - tHeight - input.clientHeight : '';

                            if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/))) {
                                //control.style.top = control.offsetTop - 13 + 'px';
                                control.style.top = pTop + 7 + 'px';
                                control.style.left = pLeft + 'px';
                            } else {
                                control.style.top = "";
                                var pp = null;
                                var pop = document.getElementsByTagName("jtse-modal");
                                for (var bu = 0; bu < pop.length; bu++) {
                                    //if (pop[bu].firstElementChild.classList.contains('show')) {
                                    if (pop[bu].classList.contains('show')) {
                                        //pTop = e.offsetY + input.clientHeight;
                                        //pLeft = e.layerX;
                                        estado = true;
                                        pp = pop[bu].firstElementChild;
                                        break;
                                    }
                                }
                                control.style.top = 23 + 'px';
                                //control.style.top = 123 + 'px';
                                //if (estado == false) {
                                //    if (pTop > 0) {
                                //        control.style.top = pTop + 7 + 'px';
                                //        control.style.left = pLeft + 'px';
                                //    } else {
                                //        control.style.top = ((input.getBoundingClientRect().y.toFixed(0) * 1) + 9) + 'px';//control.offsetTop - 13 + 'px';
                                //        //control.style.top = pTop + 7 + 'px';
                                //        //control.style.left = pLeft + 'px';
                                //    }
                                //}
                                //else {
                                //    control.style.top = ((input.getBoundingClientRect().y.toFixed(0) * 1) - input.getBoundingClientRect().height - pp.offsetTop) + 'px';//control.offsetTop + 7 + 'px';
                                //    control.style.left = pLeft + 'px';
                                //}

                            }
                            //control.style.top = pTop + 7 + 'px';
                            //control.style.left = pLeft + 'px';


                        }
                    }
                    openedDPX && openedDPX !== elements.container && openedDPX.classList.remove('active');
                    openedDPX = elements.container;
                }
            });
            document.addEventListener('click', function (e) {
                e = e || window.event;
                var target = e.target || e.srcElement;
                var cont = 3;
                var existeCalendar = false;
                for (var i = 0; i < cont; i++) {
                    if (target == undefined) break;
                    if (target.getAttribute("role") == "calendar") {
                        existeCalendar = true;
                    }
                    else {
                        target = target.parentElement;
                    }
                }
                if (!existeCalendar) {
                    openedDPX && openedDPX.classList.remove('active');
                }
            }, false);
            window.addEventListener('scroll', function () {
                openedDPX && openedDPX.classList.remove('active');
            }, true);
            elements.container.addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
            elements.content.addEventListener('click', function (e) {
                if (mode === 2) {
                    //console.log('e.target ');
                    //console.log(e);
                    //console.log(e.target);
                    dpx.setValue(e.target.dpxValue) && elements.container.classList.remove('active');
                } else {
                    var min = getMinDate(),
                        max = getMaxDate();
                    min.setDate(1);
                    max.setDate(1);
                    if (!mode) {
                        min.setMonth(0);
                        max.setMonth(0);
                    }
                    e.target.dpxValue >= min.getTime() && e.target.dpxValue <= max.getTime() && ++mode && draw(e.target.dpxValue);
                }
                if (typeof input.onchange == "function") {
                    input.onchange();
                    //	// someNode has an event handler already set for the onclick event...
                }
                input.focus();

            });
            elements.prevTitle.addEventListener('click', function () {
                draw(this.dpxValue);
            });
            elements.nextTitle.addEventListener('click', function () {
                draw(this.dpxValue);
            });
            elements.title.addEventListener('click', function () {
                mode && mode-- && draw(this.dpxValue);
            });
            elements.today && elements.today.addEventListener('click', function () {
                !this.classList.contains('dpx-disabled') && dpx.setValue(clearDate()) && elements.container.classList.remove('active');
            });
            elements.clear && elements.clear.addEventListener('click', function () {
                dpx.setValue(null) && elements.container.classList.remove('active');
            });
        }
        function draw(dt) {

            elements.content.innerHTML = '';
            var dtMin = getMinDate(),
                dtMax = getMaxDate(),
                current = clearDate();
            options.todayButton && elements.today.classList[current >= dtMin && current <= dtMax ? 'remove' : 'add']('dpx-disabled');
            if (mode < 2) {
                dtMin.setDate(1);
                dtMax.setDate(1);
                if (!mode) {
                    dtMin.setMonth(0);
                    dtMax.setMonth(0);
                }
            }
            dtMin = dtMin.getTime();
            dtMax = dtMax.getTime();

            if (input.value != "") {
                var part = input.value.split("-");
                //var part = input.getAttribute('value').split("/");
                var fec;
                if (options.format == "dd/mm/yyyy") {
                    //fec = new Date(part[2] * 1, (part[1] * 1) - 1, part[0] * 1);
                    fec = new Date(part[2] * 1, (part[1] * 1) - 1, part[0] * 1);
                }
                else {
                    //fec = new Date(part[2] * 1, (part[0] * 1) - 1, part[1] * 1);
                    fec = new Date(part[0] * 1, (part[1] * 1) - 1, part[2] * 1);
                }
                value = fec.getTime();
            }
            dt = clearDate(new Date(dt || value || Date.now()));
            if (dt.getTime() < dtMin) {
                dt = new Date(dtMin);
            } else if (dt.getTime() > dtMax) {
                dt = new Date(dtMax);
            }
            var setMonth = dt.getMonth(),
                setYear = dt.getFullYear(),
                zeroYear = Math.floor(setYear / 10) * 10;
            dt = new Date(mode ? setYear : zeroYear, mode < 2 ? 0 : setMonth);
            elements.title.innerHTML = mode
                ? (mode === 2 ? options.singleMonthLabels[setMonth] + ' ' : '') + setYear
                : (zeroYear + ' - ' + (zeroYear + 9));
            elements.title.dpxValue = dt.getTime();
            elements.title.title = mode === 2 ? setYear : (zeroYear + ' - ' + (zeroYear + 9));
            elements.prevTitle.classList[dt.getTime() <= dtMin ? 'add' : 'remove']('dpx-disabled');
            mode === 2 ? dt.setMonth(setMonth - 1) : dt.setFullYear(mode ? setYear - 1 : zeroYear - 10);
            elements.prevTitle.title = mode
                ? (mode === 2 ? options.singleMonthLabels[dt.getMonth()] + ' ' : '') + dt.getFullYear()
                : ((zeroYear - 10) + ' - ' + (zeroYear - 1));
            elements.prevTitle.dpxValue = dt.getTime();
            mode === 2 ? dt.setMonth(dt.getMonth() + 2) : dt.setFullYear(mode ? setYear + 1 : zeroYear + 20);
            elements.nextTitle.classList[dt.getTime() > dtMax ? 'add' : 'remove']('dpx-disabled');
            elements.nextTitle.title = mode
                ? (mode === 2 ? options.singleMonthLabels[dt.getMonth()] + ' ' : '') + dt.getFullYear()
                : ((zeroYear + 10) + ' - ' + (zeroYear + 19));
            elements.nextTitle.dpxValue = dt.getTime();
            mode === 2 ? dt.setMonth(dt.getMonth() - 1) : dt.setFullYear(mode ? setYear : zeroYear);
            if (mode === 2) {
                var maxDay = options.weekDayLabels.length;
                !options.mondayFirst && --maxDay && createElement('span', ['dpx-item', 'dpx-weekday', 'dpx-weekend'], elements.content, options.weekDayLabels[6]);
                for (var day = 0; day < maxDay; ++day) {
                    var classes = ['dpx-item', 'dpx-weekday'];
                    day > 4 && classes.push('dpx-weekend');
                    createElement('span', classes, elements.content, options.weekDayLabels[day])
                }
            }
            if (mode === 2) {
                var dayWeek = dt.getDay();
                dt.setDate(options.mondayFirst ? -(dayWeek ? dayWeek - 2 : 5) : -dayWeek + 1);
            } else {
                mode ? dt.setMonth(dt.getMonth() - 2) : dt.setFullYear(zeroYear - 3);
            }
            var selected = value;
            if (mode < 2) {
                if (selected !== null) {
                    selected = new Date(selected);
                    selected.setDate(1);
                    !mode && selected.setMonth(0);
                    selected = selected.getTime();
                }
                current.setDate(1);
                !mode && current.setMonth(0);
            }
            current = current.getTime();
            elements.container.dataset.dpxType = ['year', 'month', 'day'][mode];
            var getter = ['getFullYear', 'getMonth', 'getDate'][mode],
                setter = ['setFullYear', 'setMonth', 'setDate'][mode],
                i = mode === 2 ? 42 : 16;
            for (; i--; dt[setter](dt[getter]() + 1)) {
                var classes = ['dpx-item'],
                    title = mode ? options.singleMonthLabels[dt.getMonth()] + ' ' : '';
                mode === 2 && (title += dt.getDate() + ', ');
                title += dt.getFullYear();
                (mode ? (mode === 2 ? dt.getMonth() !== setMonth : dt.getFullYear() !== setYear) : (dt.getFullYear() < zeroYear || dt.getFullYear() > zeroYear + 9)) && classes.push('dpx-out');
                mode === 2 && (dt.getDay() === 6 || dt.getDay() === 0) && classes.push('dpx-weekend');
                dt.getTime() === current && classes.push('dpx-current');
                dt.getTime() === value && classes.push('dpx-selected');
                (dt.getTime() < dtMin || dt.getTime() > dtMax) && classes.push('dpx-disabled');
                var content = mode ? (mode === 2 ? dt.getDate() : options.shortMonthLabels[dt.getMonth()]) : dt.getFullYear(),
                    el = createElement('span', classes, elements.content, content, title);
                el.dpxValue = dt.getTime();
            }
        }
        function setOption(option, value) {
            if (typeof options[option] === 'undefined') {
                return console.error('DatePickerX, setOption: Option doesn\'t exist.') && false;
            }
            if (option === 'minDate' || option === 'maxDate') {
                if (!(value instanceof HTMLInputElement)) {
                    !(value instanceof Date) && (value = new Date(value));

                    if (isNaN(value)) {
                        return console.error('DatePickerX, setOption: Invalid date value.') && false;
                    }
                }
            } else if (typeof options[option] !== typeof value) {
                return console.error('DatePickerX, setOption: Option has invalid type.') && false;
            } else if (Array.isArray(options[option])) {
                if (value.length < options[option].length) {
                    return console.warn('DatePickerX, setOption: Invalid option length.') && false;
                }
                value = value.slice(0, options[option].length);
            }
            options[option] = value;
        }
        return {
            init: function (initOptions) {
                initOptions = initOptions || {};
                if (inited) {
                    return console.error('DatePickerX, init: Date picker have already inited.') && false;
                }
                inited = true;
                options = {};
                for (var i in optionsDefault) {
                    options[i] = optionsDefault[i];
                }
                if (typeof initOptions !== 'object') {
                    console.error('DatePickerX, init: Initial options must be an object.');
                } else {
                    for (var i in initOptions) {
                        setOption(i, initOptions[i]);
                    }
                }
                input.classList.add('date-picker-x-input');
                input.readOnly = true;
                createElements();
                addEvents(this);
                return true;
            },
            remove: function () {
                if (!inited) {
                    return console.error('DatePickerX, remove: Date picker doesn\'t init yet.') && false;
                }
                input.parentNode.removeChild(elements.container);
                input.classList.remove('date-picker-x-input');
                input.readOnly = inited = false;
                return true;
            },
            setValue: function (dt) {
                if (!inited) {
                    return console.error('DatePickerX, remove: Date picker doesn\'t init yet.') && false;
                }
                if (dt === null) {
                    value = null;
                    input.value = '';
                } else {
                    //console.log(dt);
                    !(dt instanceof Date) && (dt = new Date(dt));
                    if (isNaN(dt)) {
                        return console.error('DatePickerX, setValue: Can\'t convert argument to date.') && false;
                    }
                    if (dt.getTime() < getMinDate().getTime() || dt.getTime() > getMaxDate().getTime()) {
                        return console.error('DatePickerX, setValue: Date out of acceptable range.') && false;
                    }
                    value = dt.getTime();
                    input.value = getFormatedDate(dt, options.format);
                }
                isActive() && draw();
                return true;
            },
            getValue: function (timestamp) {
                !inited && console.error('DatePickerX, getValue: Date picker doesn\'t init yet.');
                return timestamp ? value : (value === null ? '' : getFormatedDate(new Date(value), options.format));
            },
            getMinDate: function () {
                var value = options.minDate;
                value instanceof HTMLInputElement && (value = value.DatePickerX.getMinDate());
                return clearDate(value);
            },
            getMaxDate: function () {
                var value = options.maxDate;
                value instanceof HTMLInputElement && (value = value.DatePickerX.getMaxDate());
                return clearDate(value);
            }
        };
    }
    var dpxElements = [], dpxObjects = [];

    Object.defineProperty(HTMLInputElement.prototype, 'DatePickerX', {
        get: function () {
            var index = dpxElements.indexOf(this);
            if (index === -1) {
                index = dpxElements.push(this) - 1;
                dpxObjects.push(new DPX(this));
            }
            return dpxObjects[index];
        },
        set: function () {
        }
    });
    window.DatePickerX = {
        setDefaults: function (options) {
            if (typeof options !== 'object') {
                return console.error('DatePickerX, setDefaults: Invalid option type.') && false;
            }
            for (var i in options) {
                if (typeof options[i] === typeof optionsDefault[i]) {
                    if (!Array.isArray(optionsDefault[i])) {
                        optionsDefault[i] = options[i];
                    } else if (options[i].length >= optionsDefault[i].length) {
                        optionsDefault[i] = options[i].slice(0, optionsDefault[i].length);
                    }
                }
            }
            return true;
        }
    };
};