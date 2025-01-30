var $$progressBar = function (controlName) {
    var _msgError = {
        m1: 'Control not found',
        m2: 'Header not found or should not be zero',
        m3: 'Namespace not found',
        m4: 'Function not defined'
    };
    var ctrl = document.getElementById(controlName);
    if (ctrl == undefined) {
        console.log(_msgError.m1);
        return;
    }
    var sfx = 'jtse-barprogres' + controlName;
    var _ = {};
    if ($jt[sfx]) _ = $jt[sfx];
    var $create = function (o) {
        if (o && (o.headers == undefined || o.headers.length == 0)) {
            console.log(_msgError.m2);
            return;
        }
        if (o.namespace == undefined) {
            console.log(_msgError.m3);
            return;
        }
        var c = [],
            cHeaders = 0,   //Cantidad de Datos que vienen
            totalCantidad = 0,  //Cantidad total de data o maxima para sacar el porcentaje
            VI_floatMaxData;
        if (o) {
            _.namespace = o.namespace || '';
            _.title = o.title || '';
            _.headers = [];
            _.properties = [];
            _.data = [];
            _.bgColors = [];
            _.ColorsClass = (o.ColorsClass == undefined ? false : o.ColorsClass) == true ? true : false;
            _.bgColorsClass = [];
            _.maxData = o.maxData;
            _.separatorBar = o.separatorBar || '¦';
            _.separatorHead = o.separatorHead || '¬';
            _.design = o.design == undefined ? 'normal' : o.design;
            _.Option1 = (o.Option1 == undefined ? false : o.Option1) == true ? true : false;
            _.Tooltip = (o.Tooltip == undefined ? false : o.Tooltip) == true ? true : false;
            _.id = o.id == undefined ? '' : o.id;

            cHeaders = o.headers.length;
            var separatorBar = _.separatorBar;
            var separatorHead = _.separatorHead;

            if (o.headers != undefined) {
                _.headers = o.headers.slice();
            }
            if (o.properties != undefined) {
                _.properties = o.properties.slice();
            }
            if (o.data != undefined) {
                _.data = o.data[0].split(separatorHead);
            }
            if (o.bgColors != undefined) {
                _.bgColors = o.bgColors.slice();
            }
            if (o.bgColorsClass != undefined) {
                _.bgColorsClass = o.bgColorsClass.slice();
            }
            if (o.maxData == undefined) {
                var maxProperties = 0;
                var VI_maxProperties;
                var dato_bars;
                var dato_bar;
                for (var i = 0; i < cHeaders; i++) {
                    dato_bars = _.data[0].split(separatorHead);
                    if (dato_bars[0].indexOf(separatorBar) > -1) {
                        dato_bar = dato_bars[0].split(separatorBar);
                    } else {
                        dato_bar = dato_bars[0].split(" ");
                    }
                    for (var y = 0; y < dato_bar.length; y++) {
                        VI_maxProperties = dato_bar[y]
                        if (maxProperties < VI_maxProperties) {
                            maxProperties = VI_maxProperties;
                        }
                    }
                }
                _.maxData = maxProperties;
            }
            if (_.Option1) {
                for (var i = 0; i < cHeaders; i++) {
                    var W_data = parseFloat(_.data[i]);
                    W_data = (W_data * 100) / _.maxData;
                    W_data = (parseFloat(W_data) * 100) / 100;
                    if (_.design == 'animated-alt') {
                        c.push('<div class="row">')
                        c.push('    <div class="progress-bar-animated-alt progress">');
                        c.push('        <div id="PGB_' + _.namespace + '_' + _.properties[i] + '" class="progress-bar-animated-alt progress-bar ');
                    } else if (_.design == 'animated') {
                        c.push('    <div class="progress">');
                        c.push('        <div id="PGB_' + _.namespace + '_' + _.properties[i] + '" class="progress-bar progress-bar-animated ');
                    } else {
                        c.push('    <div class="progress">');
                        c.push('        <div id="PGB_' + _.namespace + '_' + _.properties[i] + '" class= "progress-bar ');
                    }
                    if (_.ColorsClass) {
                        c.push(_.bgColorsClass[i]);
                        c.push('" style="');
                    } else {
                        c.push('" style="background-color: ');
                        c.push(_.bgColors[i] + '; ');
                    }
                    c.push('width: ' + W_data + '%;">');
                    if (_.Tooltip && _.design == 'normal') {
                        c.push('<div style="width: ' + (W_data - 1) + '%; height: ' + 20 + 'px"');
                        c.push('data-tooltip="' + _.data[i] + ' ' + _.headers[i] + ' de ' + _.maxData + '" ></div> ')
                    }
                    c.push(W_data + '%');
                    c.push('        </div>');
                    c.push('    </div>');
                    c.push('</div>');
                }
            }
            ctrl.innerHTML = c.join('');
        }
    }
    return {
        create: function (d) {
            $create(d);
        },
    }
}