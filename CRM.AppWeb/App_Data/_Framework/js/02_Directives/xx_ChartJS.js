var $$ChartJsBar = function (controlName) {
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
    var sfx = 'jtse-graphChartBar' + controlName;
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
            cHeaders = 0,
            cData = 0,
            wGroupBar = 0,
            TitleYText,
            NTitleY,
            heightY,
            valorXY,
            maxData,
            separatorHead,
            separatorBar,
            ColorsClass = false;
        if (o) {
            _.namespace = o.namespace || '';
            _.title = o.title || '';        //Falta programar
            _.headers = [];
            _.data = [];
            _.maxData = o.maxData;
            _.autoMaxData = (o.autoMaxData == undefined ? false : o.autoMaxData) == true ? true : false;
            _.NTitleY = o.NTitleY || 5;
            _.heightY = o.heightY || 50;
            _.showGridY = (o.showGridY == undefined ? false : o.showGridY) == true ? true : false;
            _.separatorBar = o.separatorBar || '¦';
            _.separatorHead = o.separatorHead || '¬';
            _.legend = (o.legend == undefined ? false : o.legend) == true ? true : false;
            _.legendTitle = [];
            _.bgColors = [];
            _.horizontal = (o.horizontal == undefined ? false : o.horizontal) == true ? true : false;
            _.maxheight = o.maxheight || '';
            //_.ColorsClass = (o.ColorsClass == undefined ? false : o.ColorsClass) == true ? true : false;
            _.bgColorsClass = [];

            cHeaders = o.headers.length;
            cData = o.data.length;
            separatorHead = _.separatorHead;
            separatorBar = _.separatorBar;
            if (o.headers != undefined) {
                _.headers = o.headers.slice();
            }
            if (o.data != undefined) {
                _.data = o.data[0].split(separatorHead);
            }
            if (o.bgColors != undefined) {
                _.bgColors = o.bgColors.slice();
                ColorsClass = false;
            }
            if (o.bgColorsClass != undefined) {
                _.bgColorsClass = o.bgColorsClass.slice();
            }
            if (_.bgColorsClass.length > 0) {
                ColorsClass = true;
            }
            if (o.legendTitle != undefined) {
                _.legendTitle = o.legendTitle[0].split(separatorHead);
            }
            if (o.maxData == undefined || _.autoMaxData) {
                var maxProperties = 0;
                var VI_maxProperties;
                for (var i = 0; i < cHeaders; i++) {
                    dato_bars = _.data[i].split(separatorHead);
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

            NTitleY = _.NTitleY;
            heightY = _.heightY;
            maxData = parseFloat(_.maxData);


            wGroupBar = 99 / cHeaders;
            wGroupBar = (Math.round((wGroupBar / 6) * 100) / 100).toFixed(2);
            TitleYText = maxData / NTitleY;
            TitleYText = (Math.round(TitleYText * 100) / 100).toFixed(2);

            var dato_bars;
            var dato_bar;   //acomodar(opciomal)
            var widthBar;

            if (!_.horizontal) {
                //#region BEGIN VERTICAL
                c.push('<div class="shadow-box">');
                if (_.title != '') {
                    c.push('<div class="graph-chart-title">');
                    c.push('    <h1>' + _.title + '</h1>');
                    c.push('</div>');
                }
                if (_.legend) {
                    var maxBAR = 0;
                    for (var i = 0; i < cHeaders; i++) {
                        dato_bars = _.data[i].split(separatorHead);
                        if (dato_bars[0].indexOf(separatorBar) > -1) {
                            dato_bar = dato_bars[0].split(separatorBar);
                        } else {
                            dato_bar = dato_bars[0].split(" ");
                        }
                        if (maxBAR < dato_bar.length) {
                            maxBAR = dato_bar.length
                        }
                    }
                    c.push('<div class="graph-chart-legend">');
                    for (var i = 0; i < maxBAR; i++) {
                        c.push('<div class="legend">');
                        c.push('<div class="color-legend');
                        if (ColorsClass) {
                            c.push(' ' + _.bgColorsClass[i] + '"></div>');
                        } else {
                            c.push('" style="background-color: ' + _.bgColors[i] + '82; border: 1px solid ' + _.bgColors[i] + ';"></div>')
                        }
                        c.push('<div class="text-legend">' + _.legendTitle[i] + '</div>');
                        c.push('</div>');
                    }
                    c.push('</div>');
                }
                c.push('<div class="graph-chart-bar-vertical" style="height: ' + (NTitleY + 1) * heightY + 'px">');
                c.push('<div class="graph" style="height: ' + ((NTitleY * heightY) + 20) + 'px">');
                c.push('<ul class="graph-x">');
                for (var i = 0; i < cHeaders; i++) {
                    c.push('            <li  style="width:' + 4 * wGroupBar + '%; margin-left: ' + wGroupBar + '%; margin-right: ' + wGroupBar + '%;"><span>' + _.headers[i] + '</span></li>');
                }
                c.push('            </ul>');
                c.push('            <ul class="graph-y">');
                if (_.showGridY) {
                    for (var i = NTitleY; i >= 0; i--) {
                        c.push('            <li style="height: ' + heightY + 'px;"> <span>' + i * TitleYText + '</span></li >');
                    }
                } else {
                    for (var i = NTitleY; i >= 0; i--) {
                        c.push('            <li style="height: ' + heightY + 'px; border-top-color: transparent;"> <span>' + i * TitleYText + '</span></li >');
                    }
                }

                c.push('</ul>');
                c.push('            <div class="bars" style="height: ' + NTitleY * heightY + 'px">');
                for (var i = 0; i < cHeaders; i++) {
                    c.push('            <div class="group-bars" style="width:' + 4 * wGroupBar + '%; margin-left: ' + wGroupBar + '%; margin-right: ' + wGroupBar + '%; ">');
                    dato_bars = _.data[i].split(separatorHead);
                    if (dato_bars[0].indexOf(separatorBar) > -1) {
                        dato_bar = dato_bars[0].split(separatorBar);
                    } else {
                        dato_bar = dato_bars[0].split(" ");
                    }
                    for (var y = 0; y < dato_bar.length; y++) {
                        valorXY = parseFloat(dato_bar[y]) * 100 / maxData;
                        valorXY = (Math.round(valorXY * 100) / 100).toFixed(2);
                        widthBar = (2 * dato_bar.length) - 1;
                        widthBar = (Math.round((100 / widthBar) * 100) / 100).toFixed(2);
                        c.push('            <div  style=" height: ' + valorXY + '%; width: ' + widthBar + '%; ');
                        c.push('left:' + (2 * y) * widthBar + '%; ');
                        if (ColorsClass) {
                            c.push('" class="bar ' + _.bgColorsClass[y] + '"');
                        } else {
                            c.push('background-color: ' + _.bgColors[y] + '82; border: 1px solid ' + _.bgColors[y] + ';"')
                            c.push('class="bar"');
                        }
                        c.push('>');
                        c.push('                <span>' + dato_bar[y] + '</span>')
                        c.push('            </div>');
                    }
                    c.push('            </div>');
                }
                c.push('            </div>');
                c.push('</div>');
                c.push('</div>');
                c.push('</div>');
                //#endregion
            } else {
                //#region BEGIN HORIZONTAL
                var maxBAR = 0;
                var h_max = 0;
                for (var i = 0; i < cHeaders; i++) {
                    dato_bars = _.data[i].split(separatorHead);
                    if (dato_bars[0].indexOf(separatorBar) > -1) {
                        dato_bar = dato_bars[0].split(separatorBar);
                    } else {
                        dato_bar = dato_bars[0].split(" ");
                    }
                    if (maxBAR < dato_bar.length) {
                        maxBAR = dato_bar.length
                    }
                    h_max = ((20 * dato_bar.length) + 5) + h_max;
                }
                if (_.maxheight != '') {
                    c.push('<div class="shadow-box" style="overflow-y: auto; max-height: ' + _.maxheight + ';">');
                } else {
                    c.push('<div class="shadow-box">');
                }

                if (_.title != '') {
                    c.push('<div class="graph-chart-title">');
                    c.push('    <h1>' + _.title + '</h1>');
                    c.push('</div>');
                }
                if (_.legend) {
                    c.push('<div class="graph-chart-legend">');
                    for (var i = 0; i < maxBAR; i++) {
                        c.push('<div class="legend">');
                        c.push('<div class="color-legend');
                        if (ColorsClass) {
                            c.push(' ' + _.bgColorsClass[i] + '"></div>');
                        } else {
                            c.push('" style="background-color: ' + _.bgColors[i] + '82; border: 1px solid ' + _.bgColors[i] + ';"></div>')
                        }
                        c.push('<div class="text-legend">' + _.legendTitle[i] + '</div>');
                        c.push('</div>');
                    }
                    c.push('</div>');
                }
                for (var i = 0; i < cHeaders; i++) {
                    dato_bars = _.data[i].split(separatorHead);
                    if (dato_bars[0].indexOf(separatorBar) > -1) {
                        dato_bar = dato_bars[0].split(separatorBar);
                    } else {
                        dato_bar = dato_bars[0].split(" ");
                    }
                }
                c.push('<div class="graph-chart-bar-horizontal" style="height: ' + (h_max + 50) + 'px">');
                c.push('<div class="graph" style="height: ' + (h_max + 15) + 'px">');
                c.push('<ul class="graph-x">');
                var w_eje_x = 100 / NTitleY;
                for (var i = 1; i <= NTitleY; i++) {
                    c.push('<li  style="width:' + w_eje_x + '%;"><span>' + i * TitleYText + '%</span></li>');
                }
                c.push('</ul>');
                c.push('<ul class="graph-y">');
                for (var i = 0; i < cHeaders; i++) {
                    dato_bars = _.data[i].split(separatorHead);
                    if (dato_bars[0].indexOf(separatorBar) > -1) {
                        dato_bar = dato_bars[0].split(separatorBar);
                    } else {
                        dato_bar = dato_bars[0].split(" ");
                    }
                    c.push('<li style="height: ' + ((20 * dato_bar.length) + 5) + 'px;"><span style="padding-top:' + (((20 * dato_bar.length) - 10) / 2) + 'px;">' + _.headers[i] + '</span></li >');

                }
                c.push('<li style="height: 0px;"><span style="padding-top:0px; margin-left: -90px">0%</span></li >');
                c.push('</ul>');
                c.push('            <div class="bars" style="height: ' + h_max + 'px">');
                for (var i = 1; i <= NTitleY; i++) {
                    c.push('<div class="grid-y" style="height: ' + h_max + 'px; width: ' + i * w_eje_x + '%;"></div>')
                }
                for (var i = 0; i < cHeaders; i++) {
                    dato_bars = _.data[i].split(separatorHead);
                    if (dato_bars[0].indexOf(separatorBar) > -1) {
                        dato_bar = dato_bars[0].split(separatorBar);
                    } else {
                        dato_bar = dato_bars[0].split(" ");
                    }
                    c.push('            <div class="group-bars" style="height: ' + ((20 * dato_bar.length) + 5) + 'px;">');
                    for (var y = 0; y < dato_bar.length; y++) {
                        valorXY = parseFloat(dato_bar[y]) * 100 / maxData;
                        valorXY = (Math.round(valorXY * 100) / 100).toFixed(2);
                        c.push('            <div style="width: ' + valorXY + '%; top: ' + ((y * 20) + 5) + 'px;');
                        if (ColorsClass) {
                            c.push('" class="bar ' + _.bgColorsClass[y] + '"');
                        } else {
                            c.push('background-color: ' + _.bgColors[y] + '82; border: 1px solid ' + _.bgColors[y] + ';"')
                            c.push('class="bar"');
                        }
                        c.push('>');
                        c.push('                <span>' + dato_bar[y] + '</span>');
                        c.push('            </div>');
                    }
                    c.push('            </div>')
                }
                c.push('</div>')
                c.push('</div>')
                c.push('</div>')
                c.push('</div>')
                //#endregion
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