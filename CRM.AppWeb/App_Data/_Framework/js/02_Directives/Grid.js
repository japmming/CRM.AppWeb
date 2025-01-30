var $$grid = function (controlName) {
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
    var sfx = 'jtse-grid_' + controlName;
    let arrTotalByColumns = [];
    let arrTotalByRows = [];
    let totalRow = 0;
    //let totalRow = 0;
    var _ = {};
    if ($jt[sfx]) _ = $jt[sfx];
    var $create = function (o) {
        if (o.columnProperties != null) {
            let objColProperties = o.columnProperties; // Propiedades columnas de la grilla
            let objGrid = {
                headers: [],
                properties: [], typesData: [], typesFilter: [], sortHeader: [], showColumns: [], widthsPx: [],
                widths: [], columnExport: [], indexColumnExport: [], indexs: [], Extensions: [], totalByColumn: []
            };

            for (let i = 0; i < objColProperties.length; i++) {
                objGrid.headers.push(validateUndefined(objColProperties[i].header, ''));
                objGrid.properties.push(validateUndefined(objColProperties[i].propertie, ''));
                objGrid.typesData.push(validateUndefined(objColProperties[i].typeData, 'S'));
                objGrid.typesFilter.push(validateUndefined(objColProperties[i].typeFilter, ''));
                objGrid.sortHeader.push(validateUndefined(objColProperties[i].sortHeader, true));
                objGrid.showColumns.push(validateUndefined(objColProperties[i].showColumn, true));
                //objGrid.widthsPx.push(validateUndefined(objColProperties[i].widthPx, ''));
                objGrid.widths.push(validateUndefined(objColProperties[i].width, ''));
                objGrid.columnExport.push(validateUndefined(objColProperties[i].columnExport, true));
                //objGrid.indexColumnExport.push(validateUndefined(objColProperties[i].indexColumnExport, i));
                objGrid.Extensions.push(validateUndefined(objColProperties[i].fnExtension, ''));
                objGrid.totalByColumn.push(validateUndefined(objColProperties[i].totalByColumn, false));
                objGrid.indexs.push(i);
            }
            o.headers = objGrid.headers;
            o.properties = objGrid.properties;
            o.typesData = objGrid.typesData;
            o.typesFilter = objGrid.typesFilter;
            o.sortHeader = objGrid.sortHeader;
            o.showColumns = objGrid.showColumns;
            o.fnExtensions = objGrid.Extensions;
            o.indexs = objGrid.indexs;
            o.totalByColumn = objGrid.totalByColumn;
            o.showColumnsExport = objGrid.columnExport;
            //o.indexsColumnsExport = objGrid.indexColumnExport;
            if (o.widthsPx == null) o.widthsPx = false;
            o.widthsPx = o.widthsPx ? objGrid.widths : null;
            o.widths = o.widthsPx ? null : objGrid.widths;
        }

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
            cHeadersGroup = 0,
            eIndex = false,
            eWidths = false,
            eheadersGroup = false,
            /*erowSpam = false,*/
            eFilter = {
                up: false,
                down: false
            };
        _.namespace = o.namespace || '';
        _.title = o.title || '';
        _.headersGroup = [];
        _.colspan = [];
        _.rowspan = [];
        _.headers = [];
        _.eProperties = false;
        _.properties = [];
        _.typesData = [];
        _.typesFilter = [];
        _.typesFilterShow = (o.typesFilterShow == undefined ? true : o.typesFilterShow) == true ? true : false;
        _.sortHeader = [];
        _.showColumns = [];
        _.showColumnsExport = [];/*(o.showColumnsExport != undefined ? o.showColumnsExport : o.showColumns);*/
        _.indexsColumnsExport = [];
        _.widths = [];
        _.eWidthPx = false;
        _.widthsPx = [];
        _.indexs = [];
        _.scroll = (o.scroll == undefined ? false : o.scroll) == true ? true : false;
        _.scrollHeight = o.scrollHeight || 200;
        //_.scrollHeightHard = (o.scrollHeightHard == undefined ? 0 : o.scrollHeightHard);
        _.data = o.data || [];
        _.matrix = [];
        _.class = o.class || '';
        _.headerStyle = o.headerStyle || '';
        _.rowStyle = o.rowStyle || '';
        _.columnStyle = o.columnStyle || '';
        _.fnRowStyle = o.fnRowStyle || '';
        _.headerClass = o.headerClass || '';
        _.rowClass = o.rowClass || '';
        /*_.columnClass = o.columnClass || '';*/
        _.fnRowEvent = o.fnRowEvent || '';
        _.fnRowDblEvent = o.fnRowDblEvent || '';
        _.borderTop = (o.borderTop == undefined ? false : o.borderTop) == true ? true : false;
        /*Nuevo Diseño de Toolbar en los botones*/
        _.toolbarDesign = (o.toolbarDesign == undefined ? true : o.toolbarDesign) == true ? true : false;
        _.btnNew = (o.btnNew == undefined ? false : o.btnNew) == true ? true : false;
        _.btnEdit = (o.btnEdit == undefined ? false : o.btnEdit) == true ? true : false;
        _.btnEditDesign = (o.btnEditDesign == undefined ? false : o.btnEditDesign) == true ? true : false;
        _.btnDelete = (o.btnDelete == undefined ? false : o.btnDelete) == true ? true : false;
        _.btnDeleteMultiple = (o.btnDeleteMultiple == undefined ? false : o.btnDeleteMultiple) == true ? true : false;
        _.btnRefresh = (o.btnRefresh == undefined ? false : o.btnRefresh) == true ? true : false;
        _.btnExportExcel = (o.btnExportExcel == undefined ? false : o.btnExportExcel) == true ? true : false;
        _.btnExportText = (o.btnExportText == undefined ? false : o.btnExportText) == true ? true : false;
        _.btnSearch = (o.btnSearch == undefined ? false : o.btnSearch) == true ? true : false;
        _.fnBtnNew = o.fnBtnNew || '';
        _.fnBtnEdit = o.fnBtnEdit || '';
        _.fnBtnDelete = o.fnBtnDelete || '';
        _.fnBtnDeleteMultiple = o.fnBtnDeleteMultiple || '';
        _.fnBtnRefresh = o.fnBtnRefresh || '';
        _.fnBtnExportExcel = o.fnBtnExportExcel || '';
        _.fnBtnExportText = o.fnBtnExportText || '';
        _.fnBtnSearch = o.fnBtnSearch || '';
        _.colBtn = o.colBtn || '12';
        _.btnOptions = {
            btnid: [],
            names: [],
            class: [],
            icons: [],
            fnEvents: []
        };
        _.fnExtensions = o.fnExtensions;
        _.exportName = o.exportName || '';
        _.sort = (o.sort == undefined ? true : o.sort) == true ? true : false;
        _.showBottom = (o.showBottom == undefined ? true : o.showBottom) == true ? true : false;
        _.pagination = (o.pagination == undefined ? true : o.pagination) == true ? true : false;
        _.filterPosition = o.filterPosition == '' ? '' : (o.filterPosition || 'UP');
        _.generalFilter = (o.generalFilter == undefined ? true : o.generalFilter) == true ? true : false;
        _.indexCurrentPage = 0;
        _.indexCurrentRange = 0;
        _.indexOrder = 0;
        _.entriesPage = o.entriesPage || 10;
        _.rangePage = o.rangePage || 10;
        _.separator = o.separator || '¦';
        _.language = findLanguage(o.language || '');
        _.fixedColumn = o.fixedColumn == undefined ? null : o.fixedColumn;
        _.totalByColumn = o.totalByColumn || [];
        _.iFirstTotalColumn = 0;
        _.flgTotalByColum = false;
        _.totalByRow = (o.totalByRow == undefined ? false : true);
        cHeaders = o.headers.length;
        let nFixedCol = 0;
        
        if (o.headersGroup != undefined || o.colspan != undefined) {
            cHeadersGroup = o.headersGroup.length;
            _.headersGroup = o.headersGroup.slice();
            _.colspan = o.colspan.slice();
            eheadersGroup = true;
        }

        if (o.rowspan != undefined) {
            _.rowspan = o.rowspan.slice();
        }

        if (o.headers != undefined) {
            _.headers = o.headers.slice();
        }
        if (o.widths != undefined) {
            _.widths = o.widths.slice();
            eWidths = true;
        }
        if (o.widthsPx != undefined) {
            _.widthsPx = o.widthsPx.slice();
            _.eWidthsPx = true;
        }
        if (o.sortHeader != undefined) {
            _.sortHeader = o.sortHeader.slice();
        }
        else {
            for (var i = 0; i < cHeaders; i++) {
                _.sortHeader[i] = true;
            }
        }
        if (o.properties != undefined) {
            _.properties = o.properties.slice();
            _.eProperties = true;
        }
        if (o.indexs != undefined) {
            _.indexs = o.indexs.slice();
            eIndex = true;
        }
        else {
            for (var i = 0; i < cHeaders; i++) {
                _.indexs[i] = i;
            }
        }
        if (o.showColumns != undefined) {
            _.showColumns = o.showColumns.slice();
        }
        else {
            for (var i = 0; i < cHeaders; i++) {
                _.showColumns[i] = true;
            }
        }
        if (o.showColumnsExport != undefined) {
            _.showColumnsExport = o.showColumnsExport.slice();
        }
        else {
            _.showColumnsExport = o.showColumns.slice();
            /*for (var i = 0; i < cHeaders; i++) {*/
            /*    _.showColumnsExport[i] = true;*/
            /*}*/
        }
        if (o.indexsColumnsExport != undefined) {
            _.indexsColumnsExport = o.indexsColumnsExport.slice();
        }
        if (o.typesData != undefined) {
            _.typesData = o.typesData.slice();
        }
        else {
            for (var i = 0; i < cHeaders; i++) {
                _.typesData[i] = 'S';
            }
        }
        if (o.typesFilter != undefined) {
            _.typesFilter = o.typesFilter.slice();
        }
        //if (o.totalByColumn != undefined) {
        //    _.totalByColumn = o.totalByColumn.slice();
        //}
        else {
            for (var i = 0; i < cHeaders; i++) {
                _.typesFilter[i] = 'I';
            }
        }
        if (o.btnOptions != undefined) {
            _.btnOptions = o.btnOptions;
        }
        for (let i = 0; i < _.totalByColumn.length; i++) {
            if (_.totalByColumn[i]) {
                _.flgTotalByColum = true;
                _.iFirstTotalColumn = i;
                break;
            }
        }
        eFilter = setFilterPosition(_.filterPosition);
        $jt[sfx] = _;
        c.push('<div class="col-24 without-padding"');
        if (_.scroll && _.eWidthsPx) {
            c.push(' style="width:');
            c.push(countWidthsPx() + 18);
            c.push('px"');
        }
        c.push('>');
        if (_.borderTop) {
            c.push('<hr />');
        }
        if (_.title != '') {
            c.push('<div class="col-24">');
            c.push('<h3 id="title_');
            c.push(sfx);
            c.push('" class="grid-title w-100">');
            c.push(_.title);
            c.push('</h3>');
            c.push('</div>');
        }
        c.push('<div class="col-24 without-padding">');

        var fntoolbarDesign = false;
        if ((_.btnNew && _.fnBtnNew != '') || (_.btnDeleteMultiple && _.fnBtnDeleteMultiple != '') || (_.btnRefresh && _.fnBtnRefresh != '') || _.btnExportExcel || _.btnExportText || (_.btnOptions.names.length > 0 && _.btnOptions.fnEvents.length > 0) || _.generalFilter || (_.btnSearch && _.fnBtnSearch != '')) {
            if (_.toolbarDesign) {
                c.push('<div class="col-24">');
                c.push('<div class="col-24">');
                c.push('<div class="col-24 toolbar-grid">');
                fntoolbarDesign = true
            }
            else {
                c.push('<div class="col-' + _.colBtn + '">');
                c.push('<div class="grid-bottom">');
            }
        }
        if (_.btnNew || _.btnDeleteMultiple || _.btnRefresh || _.btnExportExcel || _.btnExportText || (_.btnOptions.names.length > 0 && _.btnOptions.fnEvents.length > 0) || _.btnSearch) {
            if (_.btnNew && _.fnBtnNew != '') {
                c.push('<button class="btn btn-grid-new" onclick="$jt[\'');
                c.push(_.namespace);
                c.push('\'][\'');
                c.push(_.fnBtnNew);
                c.push('\'](this);">');
                c.push('<i class="fa fa-plus"></i>&nbsp;');
                c.push('Nuevo');
                c.push('</button>&nbsp;&nbsp;');
            }
            if (_.btnDeleteMultiple && _.fnBtnDeleteMultiple != '') {
                c.push('<button class="btn btn-grid-delete-multiple" onclick="$jt[\'');
                c.push(_.namespace);
                c.push('\'][\'');
                c.push(_.fnBtnDeleteMultiple);
                c.push('\'](this);">');
                c.push('<i class="fa fa-trash-o"></i>&nbsp;');
                c.push('Eliminar');
                c.push('</button>&nbsp;&nbsp;');
            }
            if (_.btnRefresh && _.fnBtnRefresh != '') {
                c.push('<button class="btn btn-grid-refresh" onclick="$jt[\'');
                c.push(_.namespace);
                c.push('\'][\'');
                c.push(_.fnBtnRefresh);
                c.push('\'](this);">');
                c.push('<i class="fa fa-refresh"></i>&nbsp;');
                c.push('Refrescar');
                c.push('</button>&nbsp;&nbsp;');
            }
            if (_.btnExportExcel) {
                c.push('<button class="btn btn-grid-export-excel" onclick="');
                if (_.fnBtnExportExcel != '') {
                    c.push('$jt[\'');
                    c.push(_.namespace);
                    c.push('\'][\'');
                    c.push(_.fnBtnExportExcel);
                    c.push('\'](this);');
                } else {
                    c.push('$$grid(\'');
                    c.push(controlName);
                    c.push('\').exportTextExcel(1);');
                }
                c.push('">');
                c.push('<i class="fa fa-file-excel-o"></i>&nbsp;');
                c.push('Excel');
                c.push('</button>&nbsp;&nbsp;');
            }
            if (_.btnExportText) {
                c.push('<button class="btn btn-grid-export-text" onclick="');
                if (_.fnBtnExportExcel != '') {
                    c.push('$jt[\'');
                    c.push(_.namespace);
                    c.push('\'][\'');
                    c.push(_.fnBtnExportText);
                    c.push('\'](this);');
                } else {
                    c.push('$$grid(\'');
                    c.push(controlName);
                    c.push('\').exportTextExcel(0);');
                }
                c.push('">');
                c.push('<i class="fa fa-file-text-o"></i>&nbsp;');
                c.push('Texto');
                c.push('</button>&nbsp;&nbsp;');
            }
            if (_.btnSearch && _.fnBtnSearch) {
                c.push('<button class="btn btn-grid-new" onclick="$jt[\'');
                c.push(_.namespace);
                c.push('\'][\'');
                c.push(_.fnBtnSearch);
                c.push('\'](this);">');
                c.push('<i class="fa fa-search"></i>&nbsp;');
                c.push('Buscar');
                c.push('</button>&nbsp;&nbsp;');
            }
            if (_.btnOptions.names.length > 0 && _.btnOptions.fnEvents.length > 0) {
                if (_.btnOptions.btnid != undefined) {
                    for (var i = 0; i < _.btnOptions.names.length; i++) {
                        c.push('<button ');
                        if (_.btnOptions.btnid[i] != undefined || _.btnOptions.btnid[i] != '' || _.btnOptions.btnid[i] != ' ') {
                            c.push('id = "');
                            c.push(_.btnOptions.btnid[i]);
                            c.push('" ');
                        }
                        c.push('class = "btn ');
                        c.push(_.btnOptions.class[i]);
                        c.push('" onclick="$jt[\'');
                        c.push(_.namespace);
                        c.push('\'][\'');
                        c.push(_.btnOptions.fnEvents[i]);
                        c.push('\'](this);">');
                        c.push('<i class="fa ');
                        c.push(_.btnOptions.icons[i]);
                        c.push('"></i>&nbsp;');
                        c.push(_.btnOptions.names[i]);
                        c.push('</button>');
                        if (i < _.btnOptions.names.length - 1) {
                            c.push('&nbsp;&nbsp;');
                        }
                    }
                } else {
                    for (var i = 0; i < _.btnOptions.names.length; i++) {
                        c.push('<button class="btn ');
                        c.push(_.btnOptions.class[i]);
                        c.push('" onclick="$jt[\'');
                        c.push(_.namespace);
                        c.push('\'][\'');
                        c.push(_.btnOptions.fnEvents[i]);
                        c.push('\'](this);">');
                        c.push('<i class="fa ');
                        c.push(_.btnOptions.icons[i]);
                        c.push('"></i>&nbsp;');
                        c.push(_.btnOptions.names[i]);
                        c.push('</button>');
                        if (i < _.btnOptions.names.length - 1) {
                            c.push('&nbsp;&nbsp;');
                        }
                    }
                }
            }
            if (!fntoolbarDesign) {
                c.push('</div>');
                c.push('</div>');
            }
        }
        if (_.generalFilter) {
            if (_.toolbarDesign) {
                /*c.push('<div class="col-8" style="padding-right: 0px;padding-left: 0px;">');*/
            } else {
                c.push('<div class="col-12">');
                c.push('<div class="grid-bottom">');
            }
            c.push('<input id="generalFilter_');
            c.push(sfx);
            c.push('" type="text" style="width: auto;" class="form-control" placeholder="');
            c.push(_.language.search);
            c.push('">');
            /*c.push('</div>');*/
            c.push('</div>');

        } else {
            if (fntoolbarDesign) {
                c.push('</div>');
            }
        }
        c.push('</div>');
        c.push('<div class="col-24">');
        if (_.scroll) {
            c.push('<div class="grid" ');
            if (_.showBottom) {
                c.push('style = "margin-bottom: 6px;"');
            }
            c.push('> ');
            c.push('<div class="grid-scroll grid-scroll-header">');
            c.push('<div style="width:');
            if (_.eWidthsPx) {
                c.push(countWidthsPx() + 1);
                c.push('px">');
            }
            else {
                c.push('calc(100% - 17px)">');
            }
            c.push('<table class="grid grid-scrollbar" cellspacing="0" style="margin-left: 0px; width: ');
            if (_.eWidthsPx) {
                c.push(countWidthsPx() + 1);
                c.push('px">');
            }
            else {
                c.push('100%">');
            }

            c.push('<thead><tr role="row">');
            for (var i = 0; i < cHeaders; i++) {
                if (_.btnEdit && i == 0) {
                    if (eWidths) {
                        c.push('<th style="width:2.5%;');
                    } else {
                        c.push('<th style="width:10px;');
                    }

                    if (_.headerStyle != '') {
                        c.push(_.headerStyle);
                    }
                    c.push('"></th>');
                }
                if (_.showColumns[i]) {
                    c.push('<th class="');
                    if (_.headerClass != '') {
                        c.push(_.headerClass);
                    }
                    if (_.sortHeader[i] == true) {
                        c.push(' sorting');
                    }
                    c.push('" name="');
                    if (_.sortHeader[i] == true) {
                        c.push('sort_');
                        c.push(sfx);
                    }
                    c.push('"');
                    if (eIndex) {
                        c.push(' data-order="');
                        c.push(_.indexs[i]);
                        c.push('"');
                    }
                    c.push(' style="');
                    if (eWidths) {
                        c.push('width:');
                        c.push(_.widths[i]);
                        c.push('%;white-space:nowrap;');
                    }
                    else if (_.eWidthsPx) {
                        c.push('width:');
                        c.push(_.widthsPx[i]);
                        c.push('px;');
                    }
                    else {
                        c.push('width:auto;');
                    }
                    if (_.headerStyle != '') {
                        c.push(_.headerStyle);
                    }
                    if (eTypesData) {
                        switch (typesData[i]) {
                            case 'N':
                                c.push(';text-align:right');
                                break;
                            case 'D':
                                c.push(';text-align:center');
                                break;
                            case 'S_R':
                            case 'DE':
                                c.push(';text-align:right');
                                break;
                            case 'DT':
                                c.push(';text-align:center');
                                break;
                            case 'S_C':
                            case 'N_C':
                            case 'B':
                                c.push(';text-align:center');
                                break;
                            case 'A':
                                c.push(';text-align:center');
                                break;
                            case 'A_L':
                                c.push(';text-align:left');
                                break;
                            case 'A_R':
                                c.push(';text-align:right');
                                break;
                            default:
                                c.push(';text-align:left');
                                break;
                        }
                    }
                    else {
                        c.push(';text-align:left');
                    }
                    c.push('">');
                    c.push(_.headers[i]);
                    c.push('</th>');
                }
                if (_.btnDelete && i == cHeaders - 1) {
                    if (eWidths) {
                        c.push('<th style="width:2.5%;');
                    } else {
                        c.push('<th style="width:10px;');
                    }
                    if (_.headerStyle != '') {
                        c.push(_.headerStyle);
                    }
                    c.push('"></th>');
                }

            }
            c.push('</tr>');
            c.push('</thead>');
            if (!eFilter.up && !eFilter.down) {
                c.push(createFilter(cHeaders, true, true));
            }
            if (eFilter.up) {
                c.push(createFilter(cHeaders, eFilter.up));
            }
            c.push('</table>');
            c.push('</div>');
            c.push('</div>');

            c.push('<div class="grid-scroll grid-scroll-body" style="height:');
            c.push(_.scrollHeight);
            c.push('px;');
            //if (_.scrollHeightHard != 0) {
            //    c.push(' height:');
            //    c.push(_.scrollHeightHard);
            //    c.push('px;');
            //}
            c.push(' width: ');
            if (_.eWidthsPx) {
                c.push(countWidthsPx() + 18);
                c.push('px">');
            }
            else {
                c.push('100%">');
            }
            c.push('<table class="grid grid-scrollbar" cellspacing="0" style="width: 100%;">');
            c.push('<thead><tr role="row" style="height: 0px;visibility: hidden;">');
            for (var i = 0; i < cHeaders; i++) {
                if (_.btnEdit && i == 0) {
                    if (eWidths) {
                        c.push('<th style="width:2.5%;padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px;');
                    } else {
                        c.push('<th style="width:10px;padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px;');
                    }
                    if (_.headerStyle != '') {
                        c.push(_.headerStyle);
                    }
                    c.push('"></th>');
                }
                if (_.showColumns[i]) {
                    c.push('<th class="');
                    if (_.headerClass != '') {
                        c.push(_.headerClass);
                    }
                    if (_.sortHeader[i] == true) {
                        c.push(' sorting');
                    }
                    c.push('" name="');
                    if (_.sortHeader[i] == true) {
                        c.push('sort_');
                        c.push(sfx);
                    }
                    c.push('"');
                    if (eIndex) {
                        c.push(' data-order="');
                        c.push(_.indexs[i]);
                        c.push('"');
                    }
                    c.push(' style="padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px;');
                    if (eWidths) {
                        c.push('width:');
                        c.push(_.widths[i]);
                        c.push('%;white-space:nowrap;');
                    }
                    else if (_.eWidthsPx) {
                        c.push('width:');
                        c.push(_.widthsPx[i]);
                        c.push('px;');
                    }
                    else {
                        c.push('width:auto;');
                    }
                    if (_.headerStyle != '') {
                        c.push(_.headerStyle);
                    }
                    if (eTypesData) {
                        switch (typesData[i]) {
                            case 'N':
                                c.push(';text-align:right');
                                break;
                            case 'D':
                                c.push(';text-align:center');
                                break;
                            case 'S_R':
                            case 'DE':
                                c.push(';text-align:right');
                                break;
                            case 'DT':
                                c.push(';text-align:center');
                                break;
                            case 'S_C':
                            case 'N_C':
                            case 'B':
                                c.push(';text-align:center');
                                break;
                            case 'A':
                                c.push(';text-align:center');
                                break;
                            case 'A_L':
                                c.push(';text-align:left');
                                break;
                            case 'A_R':
                                c.push(';text-align:right');
                                break;
                            default:
                                c.push(';text-align:left');
                                break;
                        }
                    }
                    else {
                        c.push(';text-align:left');
                    }
                    c.push('">');
                    c.push('<div style="height: 0px; overflow: hidden;">');
                    c.push(_.headers[i]);
                    c.push('</div>');
                    c.push('</th>');
                }
                if (_.btnDelete && i == cHeaders - 1) {
                    if (eWidths) {
                        c.push('<th style="width:2.5%;padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px;');
                    } else {
                        c.push('<th style="width:10px;padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px;');
                    }
                    if (_.headerStyle != '') {
                        c.push(_.headerStyle);
                    }
                    c.push('"></th>');
                }
            }
            c.push('</tr><thead>');
            c.push('<tfoot><tr style="height: 0px;">');
            for (var i = 0; i < cHeaders; i++) {
                if (_.btnEdit && i == 0) {
                    if (eWidths) {
                        c.push('<th style="width:2.5%;padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px;');
                    } else {
                        c.push('<th style="width:10px;padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px;');
                    }
                    if (_.headerStyle != '') {
                        c.push(_.headerStyle);
                    }
                    c.push('"></th>');
                }
                if (_.showColumns[i]) {
                    c.push('<th class="');
                    if (_.headerClass != '') {
                        c.push(_.headerClass);
                    }
                    if (_.sortHeader[i] == true) {
                        c.push(' sorting');
                    }
                    c.push('" name="');
                    if (_.sortHeader[i] == true) {
                        c.push('sort_');
                        c.push(sfx);
                    }
                    c.push('"');
                    if (eIndex) {
                        c.push(' data-order="');
                        c.push(_.indexs[i]);
                        c.push('"');
                    }
                    c.push(' style="padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px;');
                    if (eWidths) {
                        c.push('width:');
                        c.push(_.widths[i]);
                        c.push('%;white-space:nowrap;');
                    }
                    else if (_.eWidthsPx) {
                        c.push('width:');
                        c.push(_.widthsPx[i]);
                        c.push('px;');
                    }
                    else {
                        c.push('width:auto;');
                    }
                    if (_.headerStyle != '') {
                        c.push(_.headerStyle);
                    }
                    if (eTypesData) {
                        switch (typesData[i]) {
                            case 'N':
                                c.push(';text-align:right');
                                break;
                            case 'D':
                                c.push(';text-align:center');
                                break;
                            case 'S_R':
                            case 'DE':
                                c.push(';text-align:right');
                                break;
                            case 'DT':
                                c.push(';text-align:center');
                                break;
                            case 'S_C':
                            case 'N_C':
                            case 'B':
                                c.push(';text-align:center');
                                break;
                            case 'A':
                                c.push(';text-align:center');
                                break;
                            case 'A_L':
                                c.push(';text-align:left');
                                break;
                            case 'A_R':
                                c.push(';text-align:right');
                                break;
                            default:
                                c.push(';text-align:left');
                                break;
                        }
                    }
                    else {
                        c.push(';text-align:left');
                    }
                    c.push('">');
                    c.push('<div style="height: 0px; overflow: hidden;">');
                    c.push(_.headers[i]);
                    c.push('</div>');
                    c.push('</th>');
                }
                if (_.btnDelete && i == cHeaders - 1) {
                    if (eWidths) {
                        c.push('<th style="width:2.5%;padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px;');
                    } else {
                        c.push('<th style="width:10px;padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px;');
                    }
                    if (_.headerStyle != '') {
                        c.push(_.headerStyle);
                    }
                    c.push('"></th>');
                }
            }
            c.push('</tr></tfoot>');
            c.push('<tbody id="tbody_');
            c.push(sfx);
            c.push('"><tr><td class="text-center" colspan="');
            c.push(cHeaders + (_.btnEdit ? 1 : 0) + (_.btnDelete ? 1 : 0) + (_.totalByRow ? 1 : 0));
            c.push('">');
            c.push(_.language.noDataFound);
            c.push('</td></tr></tbody>');
            c.push('</table>');
            c.push('</div>');
            c.push('</div>');
            c.push('</div>');
            if (_.showBottom) {
                c.push('<div class="col-24"><div class="pagination-details">');
                c.push('<span>');
                c.push(_.language.showing);
                c.push(' <span id="currentPage_');
                c.push(sfx);
                c.push('" class="hide"></span>');
                c.push('<span id="totalPages_');
                c.push(sfx);
                c.push('" class="hide"></span>');
                c.push('<span id="totalEntries_');
                c.push(sfx);
                c.push('"></span>&nbsp;');
                c.push(_.language.entries);
                c.push('</span></div>');
            }
        }
        else {
            c.push('<div class="grid-bottom">');
            c.push('<div class="scroll-x w-100 ');
            c.push(_.class);
            c.push('">');
            c.push('<table class="grid');
            if (!_.eWidthsPx) {
                c.push(' w-100');
            }
            else if (eheadersGroup == true) {
                /*table-layout*/
                c.push(' ');
            } else {
                c.push(' table-layout');
            }

            c.push('" style="');
            if (_.eWidthsPx) {
                c.push('width:');
                c.push(countWidthsPx());
                c.push('px');
            }
            if (_.fixedColumn != null) {
                c.push(';border-collapse: inherit;clear: both;border: 1px solid white;');
            }
            c.push('">');
            if (eheadersGroup == true) {
                c.push('<thead>');
                c.push('<tr>');
                for (var i = 0; i < cHeadersGroup; i++) {
                    c.push('<th class="text-center" colspan="');
                    c.push(_.colspan[i]);
                    c.push('" style="');
                    c.push(_.headerStyle);
                    c.push('">');
                    c.push(_.headersGroup[i]);
                    c.push('</th>');
                }
                c.push('</tr>');
                c.push('</thead>');
            }
            c.push('<thead><tr>');
            /*Add JF*/
            var typesData, eTypesData = false;
            if (_.typesData.length > 0) {
                eTypesData = true;
                typesData = $jt[sfx].typesData.slice();
            }
            /*Add JF*/
            for (var i = 0; i < cHeaders; i++) {
                if (_.btnEdit && i == 0) {
                    if (eWidths) {
                        c.push('<th style="width:2.5%;');
                    } else {
                        c.push('<th style="width:10px;');
                    }
                    if (_.headerStyle != '') {
                        c.push(_.headerStyle);
                    }
                    c.push('"')
                    if (nFixedCol < _.fixedColumn) c.push(' class = "fixedHeader" ')
                    c.push('></th>');
                    nFixedCol++;
                }
                if (_.showColumns[i]) {
                    c.push('<th class="');
                    if (_.headerClass != '') {
                        c.push(_.headerClass);
                    }
                    if (_.sortHeader[i] == true) {
                        c.push(' sorting');
                    }
                    if (_.eWidthsPx) {
                        c.push(' word-ellipsis');
                    }
                    if (nFixedCol < _.fixedColumn) {
                        c.push(' fixedHeader');
                    }
                    c.push('" name="');
                    if (_.sortHeader[i] == true) {
                        c.push('sort_');
                        c.push(sfx);
                    }
                    c.push('"');
                    if (eIndex) {
                        c.push(' data-order="');
                        c.push(_.indexs[i]);
                        c.push('"');
                    }
                    c.push(' style="');
                    if (eWidths) {
                        c.push('width:');
                        c.push(_.widths[i]);
                        c.push('%;white-space:nowrap;');
                    }
                    else if (_.eWidthsPx) {
                        c.push('width:');
                        c.push(_.widthsPx[i]);
                        c.push('px;');
                    }
                    else {
                        c.push('width:auto;');
                    }
                    if (_.headerStyle != '') {
                        c.push(_.headerStyle);
                    }
                    /*Add JF*/
                    if (eTypesData) {
                        switch (typesData[i]) {
                            case 'N':
                                c.push(';text-align:right');
                                break;
                            case 'D':
                                c.push(';text-align:center');
                                break;
                            case 'S_R':
                            case 'DE':
                                c.push(';text-align:right');
                                break;
                            case 'DT':
                                c.push(';text-align:center');
                                break;
                            case 'S_C':
                            case 'N_C':
                            case 'B':
                                c.push(';text-align:center');
                                break;
                            case 'A':
                                c.push(';text-align:center');
                                break;
                            case 'A_L':
                                c.push(';text-align:left');
                                break;
                            case 'A_R':
                                c.push(';text-align:right');
                                break;
                            default:
                                c.push(';text-align:left');
                                break;
                        }
                    }
                    else {
                        c.push(';text-align:left');
                    }
                    /*Add JF*/
                    c.push('">');
                    c.push(_.headers[i]);
                    c.push('</th>');
                    nFixedCol++;
                }
                if (_.totalByRow && i == cHeaders - 1) {
                    //c.push('<th style="width:50px;');
                    if (eWidths) {
                        c.push('<th style="width:10%;');
                    } else {
                        c.push('<th style="width:90px;');
                    }
                    if (_.headerStyle != '') {
                        c.push(_.headerStyle);
                    }
                    c.push('" class="text-right');

                    if (nFixedCol < _.fixedColumn) c.push(' fixedHeader');
                    c.push('">Total</th>');
                    nFixedCol++;
                }
                if (_.btnDelete && i == cHeaders - 1) {
                    if (eWidths) {
                        c.push('<th style="width:2.5%;');
                    } else {
                        c.push('<th style="width:10px;');
                    }
                    if (_.headerStyle != '') {
                        c.push(_.headerStyle);
                    }
                    //c.push('"></th>');
                    c.push('"');
                    if (nFixedCol < _.fixedColumn) c.push(' class = "fixedHeader" ');
                    c.push('></th>');
                    nFixedCol++;
                }
            }
            c.push('</tr></thead>');
            if (!eFilter.up && !eFilter.down) {
                c.push(createFilter(cHeaders, true, true));
            }
            if (eFilter.up) {
                c.push(createFilter(cHeaders, eFilter.up));
            }
            c.push('<tbody id="tbody_');
            c.push(sfx);
            c.push('"><tr><td class="text-center" colspan="');
            c.push(cHeaders + (_.btnEdit ? 1 : 0) + (_.btnDelete ? 1 : 0) + (_.totalByRow ? 1 : 0));
            c.push('">');
            c.push(_.language.noDataFound);
            c.push('</td></tr></tbody>');
            if (eFilter.down) {
                c.push(createFilter(cHeaders, eFilter.up));
            }
            c.push('</table>');
            c.push('</div>');
            c.push('</div>');
            c.push('</div>');
            if (_.showBottom) {
                if (_.pagination) {
                    c.push('<div class="col-24 without-padding">');
                    c.push('<div class="pagination w-100">');
                    c.push('<div class="col-24"><div id="pagination_');
                    c.push(sfx);
                    c.push('" class="pagination-pages"></div>');
                    c.push('<select id="cboEntriesShow_');
                    c.push(sfx);
                    c.push('" style="width: auto;display: inline-block; margin-right: 4px; height: 29px;" class="form-control">');
                    var c10 = '<option value="10">10</option>',
                        c25 = '<option value="25">25</option>',
                        c50 = '<option value="50">50</option>',
                        c100 = '<option value="100">100</option>';
                    var ep = _.entriesPage;
                    if (ep != 10 && ep != 25 && ep != 50 && ep != 100) {
                        if (ep < 10) {
                            c.push('<option value="');
                            c.push(ep);
                            c.push('" selected>');
                            c.push(ep);
                            c.push('</option>');
                            c.push(c10);
                            c.push(c25);
                            c.push(c50);
                            c.push(c100);
                        } else if (ep < 25) {
                            c.push(c10);
                            c.push('<option value="');
                            c.push(ep);
                            c.push('" selected>');
                            c.push(ep);
                            c.push('</option>');
                            c.push(c25);
                            c.push(c50);
                            c.push(c100);
                        } else if (ep < 50) {
                            c.push(c10);
                            c.push(c25);
                            c.push('<option value="');
                            c.push(ep);
                            c.push('" selected>');
                            c.push(ep);
                            c.push('</option>');
                            c.push(c50);
                            c.push(c100);
                        } else if (ep < 100) {
                            c.push(c10);
                            c.push(c25);
                            c.push(c50);
                            c.push('<option value="');
                            c.push(ep);
                            c.push('" selected>');
                            c.push(ep);
                            c.push('</option>');
                            c.push(c100);
                        } else {
                            c.push(c10);
                            c.push(c25);
                            c.push(c50);
                            c.push(c100);
                            c.push('<option value="');
                            c.push(ep);
                            c.push('" selected>');
                            c.push(ep);
                            c.push('</option>');
                        }
                    }
                    else {
                        if (ep == 10) {
                            c.push('<option value="10" selected>10</option>');
                            c.push(c25);
                            c.push(c50);
                            c.push(c100);
                        }
                        if (ep == 25) {
                            c.push(c10);
                            c.push('<option value="25" selected>25</option>');
                            c.push(c50);
                            c.push(c100);
                        }
                        if (ep == 50) {
                            c.push(c10);
                            c.push(c25);
                            c.push('<option value="50" selected>50</option>');
                            c.push(c100);
                        }
                        if (ep == 100) {
                            c.push(c10);
                            c.push(c25);
                            c.push(c50);
                            c.push('<option value="100" selected>100</option>');
                        }
                    }
                    c.push('</select>');
                    c.push('<label class="control-label" style="display: inline-block; margin-top: 10px;">');
                    c.push(_.language.items);
                    /*c.push(_.language.showing);*/
                    c.push('</label>');
                    c.push('<label class="control-label" style="display: inline-block; float: right; margin-right: 0px; margin-top: 10px;">');
                    c.push(_.language.showing);
                    c.push(' <span id="currentPage_');
                    c.push(sfx);
                    c.push('">0</span>&nbsp;');
                    /*c.push(_.language.to);*/
                    c.push('-');
                    c.push('&nbsp;<span id="totalPages_');
                    c.push(sfx);
                    c.push('">0</span>&nbsp;');
                    c.push(_.language.of);
                    c.push('&nbsp;<span id="totalEntries_');
                    c.push(sfx);
                    c.push('">0</span>&nbsp;');
                    c.push(_.language.entries);
                    c.push('</label>');
                    c.push('</div>');
                    c.push('</div>');
                    c.push('</div></div>');
                } else {
                    c.push('<div class="col-24"><div class="pagination-details">');
                    c.push('<span>');
                    c.push(_.language.showing);
                    c.push(' <span id="currentPage_');
                    c.push(sfx);
                    c.push('" class="hide"></span>');
                    c.push('<span id="totalPages_');
                    c.push(sfx);
                    c.push('" class="hide"></span>');
                    c.push('<span id="totalEntries_');
                    c.push(sfx);
                    c.push('"></span>&nbsp;');
                    c.push(_.language.entries);
                    c.push('</span></div></div>');
                }
            }
            c.push('</div>');
        }
        ctrl.innerHTML = c.join('');
        ctrl.classList.add('show');
        orderSetup();
        if (_.filterPosition != '' || _.generalFilter) filterSetup();
        if (_.pagination && !_.scroll) {
            document.getElementById('cboEntriesShow_' + sfx).onchange = function () {
                $jt[sfx].entriesPage = this.value * 1;
                $showGrid(0);
            };
        }
        if (_.data && _.data.length > 0) {
            createMatrix(_.data);
            $showGrid(0);
        }
    };
    var validateUndefined = function (variable, defaultValue = '') {
        //let returnData;
        //if (variable == undefined) {
        //    returnData = defaultValue;
        //} else returnData = variable;
        return variable == undefined ? defaultValue : variable;
    }
    var setFixedColumns = function () {
        let totalWidth = 0;
        let grdHeads = ctrl.getElementsByTagName("thead")[0];
        let grdFilters = _.filterPosition == '' ? null : (_.filterPosition == 'UP' ? ctrl.getElementsByTagName("thead")[1] : ctrl.getElementsByTagName("tbody")[1]);
        let tbody = document.getElementById('tbody_jtse-grid_' + controlName);
        let bodyRows = tbody.getElementsByTagName("tr");
        let rowColumns;
        let headerColumns = grdHeads.childNodes[0].childNodes;
        let filterColumns = grdFilters == null ? null : grdFilters.childNodes[0].childNodes;
        let objParameters;
        let indexFixedColumn = _.fixedColumn;
        let flgTieneRegistros = false;
        flgTieneRegistros = (bodyRows.length > 0) && (bodyRows[0].children.length > 1);
        for (let k = 0; k < headerColumns.length; k++) {
            if (k <= indexFixedColumn) {
                objParameters = {
                    element: headerColumns[k],
                    isFilter: false,
                    isLastColumn: (k == indexFixedColumn),
                    isDetail: false
                }
                setStyles(objParameters);
                if (grdFilters != null) {
                    objParameters = {
                        element: filterColumns[k],
                        isFilter: _.filterPosition != '' && _.filterPosition != null && _.filterPosition != undefined,
                        isLastColumn: (k == indexFixedColumn),
                        isDetail: false
                    }
                    setStyles(objParameters);
                }
                totalWidth += headerColumns[k].offsetWidth;
            }
        }
        totalWidth = 0;
        if (flgTieneRegistros) {
            for (let i = 0; i < bodyRows.length; i++) {
                rowColumns = bodyRows[i].childNodes
                if (i == bodyRows.length - 1) {
                    if (rowColumns[_.btnEdit ? 1 : 0].getAttribute('colspan') * 1 > 1) indexFixedColumn -= (rowColumns[_.btnEdit ? 1 : 0].getAttribute('colspan') * 1) - 1;
                }
                for (let j = 0; j < rowColumns.length; j++) {
                    if (j <= indexFixedColumn) {
                        objParameters = {
                            element: rowColumns[j],
                            isFilter: false,
                            isLastColumn: (j == indexFixedColumn),
                            isDetail: true,
                            rowIndex: i
                        }
                        setStyles(objParameters);
                        totalWidth += rowColumns[j].offsetWidth;
                    }
                }
                totalWidth = 0;
            }
        }
        

        function setStyles(data) {
            data.element.style.cssText += 'position:sticky;left:' + totalWidth + 'px;';
            if (data.isFilter) data.element.style.cssText += 'background: #FFFFFF;';
            if (data.isLastColumn) data.element.style.cssText += 'border-right: 1px solid #e4eaec;';
            if (data.isDetail) data.element.style.cssText += 'background: ' + (data.rowIndex % 2 == 0 ? '#F6F6F8' : '#FFFFFF') + ';z-index:5';
            else {
                data.element.style.cssText += 'z-index:7';
                //data.element.classList.add('fixedHeader');
            };

        }
    };
    var $setData = function (d) {
        if (d) {
            if ($jt[sfx].indexCurrentPage == 0) {
                $jt[sfx].indexCurrentPage = 0;
                $jt[sfx].indexCurrentRange = 0;
                $jt[sfx].indexOrder = 0;
            }
            $jt[sfx].matrix = [];
            createMatrix(d);
            filterThread();
            $showGrid($jt[sfx].indexCurrentPage);
        }
    };
    var $clearGrid = function () {
        $jt[sfx].indexCurrentPage = 0;
        $jt[sfx].indexCurrentRange = 0;
        $jt[sfx].indexOrder = 0;
        $jt[sfx].matrix = [];
        $jt[sfx].data = [];
        $showGrid(0);
    };
    var $clearFilter = function () {
        var filters = document.getElementsByName("filter_" + sfx);
        var cFilters = filters.length;
        for (var i = 0; i < cFilters; i++) {
            filters[i].value = '';
        }
        if (cFilters > 0) {
            filterThread();
        }
    };
    var findLanguage = function (obj) {
        if (window[obj] != undefined && obj != '')
            return window[obj];
        else
            return {
                add: 'Agregar',
                export: 'Exportar',
                show: 'Mostrar',
                search: 'Búsqueda...',
                noDataFound: 'No hay registros...',
                /*showing: 'Mostrando',*/
                to: 'hasta',
                of: 'de',
                entries: 'registro(s)',
                items: 'Items por página',
                showing: 'Elementos mostrados'
            };
    };
    var createFilter = function (nReg, filterUp, hide, isScroll) {
        var c = [];
        if (_.typesFilterShow) {
            c.push('<');
            c.push(filterUp ? 'thead' : 'tbody');
            if (hide) {
                c.push(' class="hide"');
            }
            c.push('><tr>');
            for (var i = 0; i < nReg; i++) {
                if (_.btnEdit && i == 0) c.push('<td></td>');
                if (_.showColumns[i]) {
                    c.push('<td>');
                    switch (_.typesFilter[i]) {
                        case 'S':
                            c.push('<select id="');
                            c.push('cbo_');
                            c.push(sfx);
                            c.push('_');
                            c.push(i);
                            c.push('"');
                            c.push(' name="filter_');
                            c.push(sfx);
                            c.push('" class="form-control"></select>');
                            break;
                        case 'I':
                            c.push('<input name="filter_');
                            c.push(sfx);
                            c.push('" type="text" class="form-control lupa" autocomplete="off" />');
                            break;
                        default:
                            c.push('<input name="filter_');
                            c.push(sfx);
                            c.push('" style="display:none" />');
                            break;
                    }
                    c.push('</td>');
                }
                if (_.btnDelete && i == nReg - 1) c.push('<td></td>');
            }
            c.push('</tr></');
            c.push(filterUp ? 'thead' : 'tbody');
            c.push('>');
            return c.join('');
        }
    };
    var orderSetup = function () {
        var links = document.getElementsByName("sort_" + sfx);
        var cLinks = links.length;
        var link;
        for (var i = 0; i < cLinks; i++) {
            link = links[i];
            link.onclick = function () {
                sortMatrix(this);
                $showGrid($jt[sfx].indexCurrentPage);
            }
        }
    };
    var order = function (x, y) {
        var indexOrder = $jt[sfx].indexOrder;
        var valX = (isNaN(x[indexOrder]) ? x[indexOrder].toLowerCase() : x[indexOrder]);
        var valY = (isNaN(y[indexOrder]) ? y[indexOrder].toLowerCase() : y[indexOrder]);
        return (($jt[sfx].orderType == 0 ? valX > valY : valX < valY) ? 1 : -1);
    };
    var clearLinks = function () {
        var links = document.getElementsByName("sort_" + sfx);
        var cLinks = links.length;
        var link;
        for (var i = 0; i < cLinks; i++) {
            link = links[i];
            link.classList.add('sorting');
            link.classList.remove('sorting_desc');
            link.classList.remove('sorting_asc');
        }
    };
    var sortMatrix = function (link) {
        $jt[sfx].indexOrder = link.getAttribute("data-order") * 1;
        var field = link.className;
        var posAsc = field.indexOf("sorting_asc");
        var posDesc = field.indexOf("sorting_desc");
        $jt[sfx].orderType = (posAsc == -1 && posDesc == -1 ? 0 : (posAsc > -1 ? 1 : 0));
        clearLinks();
        if ($jt[sfx].orderType == 0) {
            link.classList.add('sorting_asc');
            link.classList.remove('sorting_desc');
            link.classList.remove('sorting');
        }
        else {
            link.classList.add('sorting_desc');
            link.classList.remove('sorting_asc');
            link.classList.remove('sorting');
        }
        $jt[sfx].matrix.sort(order);
    };
    var filterSetup = function () {
        var filters = document.getElementsByName("filter_" + sfx);
        var cFilters = filters.length;
        for (var i = 0; i < cFilters; i++) {
            switch (filters[i].tagName) {
                case 'INPUT':
                    filters[i].onkeyup = filter;
                    filters[i].onfocus = getFocus;
                    filters[i].onblur = lostFocus;
                    break;
                case 'SELECT':
                    filters[i].onchange = filter;
                    break;
            }
        }
        var search = document.getElementById('generalFilter_' + sfx);
        if (search) { search.onkeyup = filter; }
    };
    var getFocus = function (e) {
        this.classList.remove("search-ico");
    };
    var lostFocus = function (e) {
        this.classList.add("search-ico");
    };
    var filter = function (e) {
        clearTimeout($jt[sfx].threads);
        $jt[sfx].threads = setTimeout(function () { filterThread(e); }, 1);
    };
    var filterThread = function (e) {
        var filters = document.getElementsByName("filter_" + sfx);
        var cFilters = filters.length;
        var vFilters = [], exist, eTypesData = false, typesData = [], arr = [];
        $jt[sfx].matrix = [];
        var cEntries = _.data.length;
        var indexs = _.indexs.slice();
        var cFields, fields, field, x = 0, vSearch = '', existSearch;
        var optionDate = { "year": "numeric", "month": "2-digit", "day": "2-digit" };
        var optionDateTime = { "year": "numeric", "month": "2-digit", "day": "2-digit", "hour": "2-digit", "minute": "2-digit", "second": "2-digit" };
        if (_.typesData.length > 0) {
            eTypesData = true;
            typesData = _.typesData.slice();
        }
        var search = document.getElementById('generalFilter_' + sfx);
        if (search != undefined && search.value != '') {
            if (!$config.isIE) {
                vSearch = search.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
            } else {
                vSearch = $frQuitarAcentos(search.value).toLowerCase().trim();
            }
            for (var j = 0; j < cFilters; j++) {
                filters[j].className = 'form-control has-error';
                filters[j].disabled = true;
                if (!$config.isIE)
                    vFilters.push({ value: filters[j].value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), type: (filters[j].tagName == 'INPUT' ? 0 : 1) });
                else
                    vFilters.push({ value: $frQuitarAcentos(filters[j].value).toLowerCase().trim(), type: (filters[j].tagName == 'INPUT' ? 0 : 1) });
            }
        }
        else {
            for (var j = 0; j < cFilters; j++) {
                filters[j].className = 'form-control ' + (filters[j].value != "" ? "" : "lupa");
                filters[j].disabled = false;
                if (!$config.isIE)
                    vFilters.push({ value: filters[j].value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), type: (filters[j].tagName == 'INPUT' ? 0 : 1) });
                else
                    //vFilters.push({ value: filters[j].value.toLowerCase().trim(), type: (filters[j].tagName == 'INPUT' ? 0 : 1) });
                    vFilters.push({ value: $frQuitarAcentos(filters[j].value).toLowerCase().trim(), type: (filters[j].tagName == 'INPUT' ? 0 : 1) });
            }
        }
        var k = 0,
            showColumns = $jt[sfx].showColumns.slice();
        for (var i = 0; i < cEntries; i++) {
            fields = _.data[i];
            cFields = fields.length;
            exist = false;
            existSearch = true;
            k = 0;
            if (vSearch != '') {
                for (var j = 0; j < cFields; j++) {
                    if (showColumns[j]) {
                        filter = vFilters[k];
                        if (filter.type == 0 || filter.type == 1) {
                            if (eTypesData) {
                                switch (typesData[j]) {
                                    case 'DT':
                                        field = $frFormatFechaTiempoPeru(fields[indexs[j]].toString()); //(new Date(fields[indexs[j]])).toLocaleString('es-PE', optionDate);
                                        break;
                                    case 'D':
                                        field = $frFormatFechaPeru(fields[indexs[j]].toString()); //(new Date(fields[indexs[j]])).toLocaleString('es-PE', optionDate);
                                        break;
                                    case 'A':
                                    case 'A_L':
                                    case 'A_R':
                                        field = extension($jt[sfx].fnExtensions[j], fields, i);
                                        break;
                                    default:
                                        if (!$config.isIE)
                                            field = fields[indexs[j]].toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                                        else
                                            field = $frQuitarAcentos(fields[indexs[j]].toString());
                                        break;
                                }
                            }
                            else field = fields[indexs[j]].toString();
                            k++;
                            existSearch = (field.toLowerCase().trim().indexOf(vSearch) > -1);
                            if (existSearch) {
                                exist = true;
                                break;
                            }
                        }
                    }
                }
            } else if (!exist) {
                for (var j = 0; j < cFields; j++) {
                    if (showColumns[j]) {
                        exist = true;
                        filter = vFilters[k];
                        if (filter.type == 0) { // filter.type == 1
                            if (eTypesData) {
                                switch (typesData[j]) {
                                    case 'DT':
                                        field = $frFormatFechaTiempoPeru(fields[indexs[j]].toString()); //(new Date(fields[indexs[j]])).toLocaleString('es-PE', optionDate);
                                        break;
                                    case 'D':
                                        field = $frFormatFechaPeru(fields[indexs[j]].toString()); //(new Date(fields[indexs[j]])).toLocaleString('es-PE', optionDate);
                                        break;
                                    default:
                                        if (!$config.isIE)
                                            field = fields[indexs[j]].toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                                        else
                                            field = $frQuitarAcentos(fields[indexs[j]].toString());
                                        break;
                                }
                            }
                            else field = fields[indexs[j]].toString();
                            exist = exist && (field.toLowerCase().trim().indexOf(filter.value) > -1);
                        }
                        else {
                            if (!$config.isIE) {
                                exist = exist && (filter.value == "" || fields[indexs[j]].toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() == filter.value.toLowerCase().trim());
                            } else {
                                exist = exist && (filter.value == "" || $frQuitarAcentos(fields[indexs[j]]).toLowerCase().trim() == filter.value.toLowerCase().trim());
                            }

                        }
                        k++;
                        if (!exist) break;
                    }
                }
            }
            if (exist && existSearch) {
                arr[x] = [];
                arr[x] = fields.slice();
                x++;
            }
        }
        $jt[sfx].matrix = arr.slice();
        if (e) {
            $jt[sfx].indexCurrentPage = 0;
            $jt[sfx].indexCurrentRange = 0;
        }
        pagination($jt[sfx].indexCurrentPage);
    };
    var createMatrix = function (data) {
        $jt[sfx].totalRegistros = data.length;
        $jt[sfx].entriesPage = ($jt[sfx].pagination == true ? $jt[sfx].entriesPage : data.length);

        var arr = [];
        if (data.length > 0) {
            $jt[sfx].data = data;
        }
        else {
            $jt[sfx].data = [];
            $showGrid(0);
            return;
        }
        var separator = _.separator;
        var cEntries = $jt[sfx].data.length;
        var cColumns = $jt[sfx].data[0].split(separator).length;
        var columns, date, typesData, eTypesData = false;
        if (_.typesData.length > 0) {
            eTypesData = true;
            typesData = _.typesData.slice();
        }
        for (var i = 0; i < cEntries; i++) {
            columns = $jt[sfx].data[i].split(separator);
            arr[i] = [];
            for (var j = 0; j < cColumns; j++) {
                if (eTypesData) {
                    switch (typesData[j]) {
                        case 'N':
                        case 'NE':
                        case 'DE':
                            arr[i][j] = columns[j] * 1;
                            break;
                        case 'DT':
                        case 'D':
                            arr[i][j] = columns[j].toString();
                            //if (columns[j] != "") {
                            //    date = columns[j].split('/');
                            //    arr[i][j] = Date.UTC(date[2], (date[1] * 1) - 1, date[0], 5, 0, 0, 0);
                            //}
                            //else arr[i][j] = 0;
                            break;
                        case 'B':
                            arr[i][j] = (columns[j] == 'true' ? true : false);
                            break;
                        default:
                            arr[i][j] = columns[j].toString();
                            break;
                    }
                }
                else arr[i][j] = columns[j].toString();
            }
        }
        $jt[sfx].data = arr.slice();
        $jt[sfx].matrix = arr.slice();
        arr = [];
    };
    var $showGrid = function (indexPage) {
        arrTotalByColumns = [];
        var c = [];
        var separator = _.separator;
        let colspanTotalColumn = 0;//(_.btnEdit ? 1 : 0);
        for (let i = 0; i < _.iFirstTotalColumn; i++) {
            if (_.showColumns[i]) {
                colspanTotalColumn += 1;
            }
        }

        $jt[sfx].indexCurrentPage = indexPage;
        var cEntries = $jt[sfx].matrix.length;
        if (_.showBottom) {
            document.getElementById('totalEntries_' + sfx).innerHTML = cEntries;
        }
        if (cEntries > 0) {
            var start, end;

            if (!_.scroll) {
                start = indexPage * $jt[sfx].entriesPage;
                end = start + $jt[sfx].entriesPage;
                if (_.showBottom) {
                    document.getElementById('currentPage_' + sfx).innerHTML = start + 1;
                    document.getElementById('totalPages_' + sfx).innerHTML = (end <= cEntries ? end : cEntries);
                }
            }
            else {
                start = 0;
                end = cEntries;
            }

            var cColumns = $jt[sfx].matrix[0].length;
            var typesData, eTypesData = false, columns;

            if ($jt[sfx].typesData.length > 0) {
                eTypesData = true;
                typesData = $jt[sfx].typesData.slice();
            }

            var optionDate = {
                "year": "numeric", "month": "2-digit", "day": "2-digit"
            };
            var optionDateTime = {
                "year": "numeric", "month": "2-digit", "day": "2-digit", "hour": "2-digit", "minute": "2-digit", "second": "2-digit"
            };

            var erowSpam = false;

            if (_.rowspan != undefined) {
                erowSpam = true;
            }

            for (var i = start; i < end; i++) {
                if (i < cEntries) {
                    columns = $jt[sfx].matrix[i];
                    c.push('<tr ');

                    if (_.rowStyle != '') {
                        c.push(' style="');
                        c.push(_.rowStyle);
                        c.push('"');
                    }
                    else if (_.fnRowStyle != '') {
                        c.push(extension(_.fnRowStyle, columns, i));
                    }

                    if (_.fnRowEvent != '') {
                        c.push(' onclick="$$grid(\'');
                        c.push(controlName);
                        c.push('\').fnAction(\'');
                        c.push(_.namespace);
                        c.push('\',\'');
                        c.push(_.fnRowEvent);
                        c.push('\',');
                        c.push(i);
                        c.push(');"');
                    }

                    if (_.fnRowDblEvent != '') {
                        c.push(' ondblclick="$$grid(\'');
                        c.push(controlName);
                        c.push('\').fnAction(\'');
                        c.push(_.namespace);
                        c.push('\',\'');
                        c.push(_.fnRowDblEvent);
                        c.push('\',');
                        c.push(i);
                        c.push(');"');
                    }
                    c.push('>');

                    if (_.btnEdit) {
                        if (_.btnEditDesign) {
                            c.push('<td class="text-center">');
                            c.push('    <button class="btn btn-grid-edit hand" style="background-color:#62A8EA; padding: 6px 9px !important;" onclick="$$grid(\'');
                            c.push(controlName);
                            c.push('\').fnAction(\'');
                            c.push(_.namespace);
                            c.push('\',\'');
                            c.push(_.fnBtnEdit);
                            c.push('\',');
                            c.push(i);
                            c.push(');">');
                            c.push('<i class="fa fa-pencil btn-grid-edit hand" style="color:#fff"></i>');
                            c.push('</button></td>');
                        } else {
                            c.push('<td class="text-center"> <i class="fa fa-pencil btn-grid-edit hand" onclick="$$grid(\'');
                            c.push(controlName);
                            c.push('\').fnAction(\'');
                            c.push(_.namespace);
                            c.push('\',\'');
                            c.push(_.fnBtnEdit);
                            c.push('\',');
                            c.push(i);
                            c.push(');"></i></td>');
                        }
                    }

                    for (var j = 0; j < cColumns; j++) {
                        if (isNaN(columns[j])) {
                            if (arrTotalByColumns[j] == null) arrTotalByColumns[j] = '';
                        } else {
                            arrTotalByColumns[j] = ((arrTotalByColumns[j] == '' || arrTotalByColumns[j] == null) ? 0 : arrTotalByColumns[j]) +
                                ((columns[j] == '' ? 0 : columns[j]) * 1);
                            totalRow += (columns[j] * 1);
                        }
                        if (_.showColumns[j]) {
                            //if (erowSpam) {
                            //    if (j === ((_.rowspan[0] * 1) - 1)) {
                            //        c.push('<td rowspan="2"');
                            //    } else {
                            //        c.push('<td ');
                            //    }
                            //} else {
                            c.push('<td ');
                            /* }*/

                            /*if (_.columStyle != '') {
                                if (_.columStyle.split(",")[j]) {
                                    c.push(extension(_.columStyle.split(",")[j], columns, i));
                                }
                            }*/
                            c.push(' class="');
                            /*if (_.eWidthsPx) {
                                c.push(' word-break');
                            }*/
                            if (eTypesData) {
                                switch (typesData[j]) {
                                    case 'N':
                                        c.push(' text-right">');
                                        c.push(columns[j]);
                                        break;
                                    case 'NE':
                                        c.push(' text-right">');
                                        c.push($frDecimal(columns[j], 0));
                                        break;
                                    case 'D':
                                        c.push(' text-center">');
                                        //if (columns[j] == 0)
                                        c.push($frFormatFechaPeru(columns[j]));
                                        //else c.push($frFormatoFecha((new Date(columns[j])).toLocaleString('es-PE', optionDate)));

                                        break;
                                    case 'DE':
                                        c.push(' text-right">');
                                        c.push($frDecimal(columns[j], 2));
                                        break;
                                    case 'DT':
                                        c.push(' text-center">');
                                        c.push($frFormatFechaTiempoPeru(columns[j]));
                                        //if (columns[j] == 0) c.push('');
                                        //else c.push((new Date(columns[j])).toLocaleString('es-PE', optionDateTime));
                                        break;
                                    case 'S_C':
                                    case 'N_C':
                                    case 'B':
                                        c.push(' text-center">');
                                        c.push(columns[j]);
                                        break;
                                    case 'S_R':
                                        c.push(' text-right">');
                                        c.push(columns[j]);
                                        break;
                                    case 'A':
                                        c.push(' text-center">');
                                        c.push(extension($jt[sfx].fnExtensions[j], columns, i));
                                        break;
                                    case 'A_L':
                                        c.push(' text-left">');
                                        c.push(extension($jt[sfx].fnExtensions[j], columns, i));
                                        break;
                                    case 'A_R':
                                        c.push(' text-right">');
                                        c.push(extension($jt[sfx].fnExtensions[j], columns, i));
                                        break;
                                    default:
                                        c.push(' text-left">');
                                        c.push(columns[j]);
                                        break;
                                }
                            }
                            else {
                                c.push(' text-left">');
                                c.push(columns[j]);
                            }

                            c.push('</td>');
                        }
                    }
                    if (_.totalByRow) {
                        c.push('<td class="text-right" style>');
                        c.push(totalRow);
                        c.push('</td>');
                    }
                    if (_.btnDelete) {
                        c.push('<td class="text-center"><i class="fa fa-trash-o btn-grid-delete hand" onclick="$$grid(\'');
                        c.push(controlName);
                        c.push('\').fnAction(\'');
                        c.push(_.namespace);
                        c.push('\',\'');
                        c.push(_.fnBtnDelete);
                        c.push('\',');
                        c.push(i);
                        c.push(');"></i></td>');
                    }
                    c.push('</tr>');
                }
                arrTotalByRows[i] = totalRow;
                totalRow = 0;
            }
            if (_.flgTotalByColum) {
                c.push('<tr style="position:sticky;bottom:0px;z-index:6;background:white;">')
                if (_.btnEdit) c.push('<td></td>');
                for (let i = 0; i < cColumns; i++) {
                    if (_.showColumns[i]) {
                        c.push('<td class="text-right" colspan="' + (i == 0 ? colspanTotalColumn : 1) + '"');//
                        c.push('style="border-right: 1px solid rgb(228, 234, 236);border-top: 1px solid rgb(228, 234, 236);' + (i == 0 ? "text-align:center" : "") + '">');
                        c.push('<b>');
                        if (i == 0 && _.iFirstTotalColumn > 0) {
                            c.push('Total');
                            i = _.iFirstTotalColumn - 1;
                        } else {
                            c.push(_.totalByColumn[i] ? (arrTotalByColumns[i] == '0' ? '' : arrTotalByColumns[i]) : '');
                            if (arrTotalByColumns[i] != '' && !isNaN(arrTotalByColumns[i])) totalRow += arrTotalByColumns[i];
                        }
                        c.push('</b>');
                        c.push('</td>')
                    }
                }
                if (_.flgTotalByColum || _.btnDelete) {
                    c.push('<td class="text-right" colspan = ' + (1 + (_.btnEdit ? 1 : 0) + (_.btnDelete ? 1 : 0)) + '>');
                    c.push('<b>');
                    c.push(totalRow);
                    c.push('</b>');
                    c.push('</td>');
                }
                c.push('</tr>')
            }
            totalRow = 0;
        }
        else {
            c.push('<tr><td class="text-center" colspan="');
            c.push(_.headers.length + (_.btnEdit ? 1 : 0) + (_.btnDelete ? 1 : 0));
            c.push('">');
            c.push(_.language.noDataFound);
            c.push('</td></tr>');
            if (!_.scroll) {
                document.getElementById('currentPage_' + sfx).innerHTML = 0;
                document.getElementById('totalPages_' + sfx).innerHTML = 0;
                document.getElementById('totalEntries_' + sfx).innerHTML = 0;
            }
        }
        document.getElementById('tbody_' + sfx).innerHTML = c.join('');
        if (_.pagination && !_.scroll) {
            createPagination();
        }
        if (_.fixedColumn != null) setFixedColumns();
    };
    var selectedCurrentPage = function () {
        var page = document.getElementById("goPage_" + sfx + $jt[sfx].indexCurrentPage.toString());
        if (page) page.classList.add('active');
    };
    var createPagination = function () {
        var cEntries = $jt[sfx].matrix.length;
        var indexLastPage = Math.floor(cEntries / $jt[sfx].entriesPage);
        if (cEntries % $jt[sfx].entriesPage == 0) indexLastPage--;
        var indexLastRange = Math.floor(cEntries / ($jt[sfx].rangePage * $jt[sfx].entriesPage));
        if (cEntries % ($jt[sfx].rangePage * $jt[sfx].entriesPage) == 0) indexLastRange--;
        var content = "";
        var start = $jt[sfx].indexCurrentRange * $jt[sfx].rangePage;
        var end = start + $jt[sfx].rangePage;
        if ($jt[sfx].indexCurrentRange > 0 && cEntries > ($jt[sfx].rangePage * $jt[sfx].entriesPage)) {
            content += "<span class='pagination-button' onclick='$$grid(\"";
            content += controlName;
            /*content += "\").pagination(-1);' title='Ir al primer grupo de páginas'>&lt;&lt;</span>";*/
            content += "\").pagination(-1);' title='Ir al primer grupo de páginas'><i class='fa'></i></span>";
            content += "<span class='pagination-button' onclick='$$grid(\"";
            content += controlName;
            /*content += "\").pagination(-2);' title='Ir al anterior grupo de páginas'>&lt;</span>";*/
            content += "\").pagination(-2);' title='Ir al anterior grupo de páginas'><i class='fa'></i></span>";
        }

        for (var i = start; i < end; i += 1) {
            if (i <= indexLastPage) {
                content += "<span onclick='$$grid(\"";
                content += controlName;
                content += "\").pagination(";
                content += i;
                content += ");'  title='Ir a la pagina ";
                content += (i + 1).toString();
                content += "' id='goPage_";
                content += sfx;
                content += i.toString();
                content += "' class='pagination-button' >";
                content += (i + 1).toString();
                content += "</span>";
            } else break;
        }
        if ($jt[sfx].indexCurrentRange < indexLastRange && cEntries > ($jt[sfx].rangePage * $jt[sfx].entriesPage)) {
            content += "<span class='pagination-button' onclick='$$grid(\"";
            content += controlName;
            /*content += "\").pagination(-3);' title='Ir al siguiente grupo de páginas'>&gt;</span>";*/
            content += "\").pagination(-3);' title='Ir al siguiente grupo de páginas'><i class='fa'></i></span>";
            content += "<span class='pagination-button' onclick='$$grid(\"";
            content += controlName;
            /*content += "\").pagination(-4);' title='Ir al último grupo de páginas'>&gt;&gt;</span>";*/
            content += "\").pagination(-4);' title='Ir al último grupo de páginas'><i class='fa'></i></span>";
        }

        if (cEntries <= $jt[sfx].entriesPage) {
            document.getElementById('pagination_' + sfx).innerHTML = "";
        }
        else {
            document.getElementById('pagination_' + sfx).innerHTML = content;
            selectedCurrentPage();
        }
    };
    var pagination = function (indexPage) {
        var cEntries = $jt[sfx].matrix.length;
        var isRange = (indexPage < 0);
        if (isRange) {
            var indexLastPage = Math.floor(cEntries / $jt[sfx].entriesPage);
            if (cEntries % $jt[sfx].entriesPage == 0) indexLastPage--;
            var indexLastRange = Math.floor(cEntries / ($jt[sfx].rangePage * $jt[sfx].entriesPage));
            if (cEntries % ($jt[sfx].rangePage * $jt[sfx].entriesPage) == 0) indexLastRange--;
            switch (indexPage) {
                case -1:
                    indexPage = 0;
                    $jt[sfx].indexCurrentRange = 0;
                    break;
                case -2:
                    if ($jt[sfx].indexCurrentRange > 0) {
                        $jt[sfx].indexCurrentRange--;
                        indexPage = $jt[sfx].indexCurrentRange * $jt[sfx].rangePage;
                    }
                    break;
                case -3:
                    if ($jt[sfx].indexCurrentRange < indexLastRange) {
                        $jt[sfx].indexCurrentRange++;
                        indexPage = $jt[sfx].indexCurrentRange * $jt[sfx].rangePage;
                    }
                    break;
                case -4:
                    indexPage = indexLastPage;
                    $jt[sfx].indexCurrentRange = indexLastRange;
                    break;
            }
        }
        $jt[sfx].indexCurrentPage = indexPage;
        $showGrid(indexPage);
    };
    var $exportTextExcel = function (type) {
        var fullName;
        if ($jt[sfx].matrix.length > 0) {
            var cEntries = $jt[sfx].matrix.length;
            var nFields = $jt[sfx].headers.length;
            console.log($jt[sfx]);
            var showColumnsExport = $jt[sfx].showColumnsExport.slice();
            var indexsColumnsExport = $jt[sfx].indexsColumnsExport.slice();
            var nRegIndexColumns = indexsColumnsExport.length;
            var c = [], eTypesData = false, typesData;
            var fileName = (_.exportName != '' ? _.exportName : (type == 0 ? 'CsvExport' : 'ExcelExport'));

            if (type == 0) {
                var h = [];
                for (var i = 0; i < nFields; i++) {
                    if (showColumnsExport[i]) {
                        if ($jt[sfx].headers[i] != "") {
                            h.push($jt[sfx].headers[i]);
                        }
                    }
                }
                c.push(h.join(','));
                c.push('\r\n');
                for (var i = 0; i < cEntries; i++) {
                    h = [];
                    for (var j = 0; j < nFields; j++) {
                        if (showColumnsExport[j]) {
                            if ($jt[sfx].headers[j] != "") {
                                if ($jt[sfx].typesData[j] == "S_R") {
                                    if ((!isNaN($jt[sfx].matrix[i][j])) && ($jt[sfx].matrix[i][j].length > 0)) {

                                        h.push(($jt[sfx].matrix[i][j] * 1));

                                    } else h.push($jt[sfx].matrix[i][j]);
                                } else if ($jt[sfx].typesData[j] == "D") {
                                    h.push($frFormatFechaPeru($jt[sfx].matrix[i][j]));
                                } else if ($jt[sfx].typesData[j] == "DT") {
                                    h.push($frFormatFechaTiempoPeru($jt[sfx].matrix[i][j]));
                                } else {
                                    h.push($jt[sfx].matrix[i][j]);
                                }

                            }
                        }
                    }
                    c.push(h.join(','));
                    if (i < cEntries - 1) c.push('\r\n');
                }
                var formBlob = new Blob([c.join('')], {
                    encoding: "UTF-8", type: 'text/plain;charset=UTF-8'
                });
                fullName = fileName + '.txt';
            }
            else {
                if ($jt[sfx].typesData.length > 0) {
                    eTypesData = true;
                    typesData = $jt[sfx].typesData;
                }
                var optionDate = { "year": "numeric", "month": "2-digit", "day": "2-digit" };
                var optionDateTime = { "year": "numeric", "month": "2-digit", "day": "2-digit", "hour": "2-digit", "minute": "2-digit", "second": "2-digit" };

                /*var wscols = [{ wch: 6 },{ wch: 7 },{ wch: 10 },{ wch: 20 }];*/

                var wb_excel_grid = XLSX.utils.book_new();

                wb_excel_grid.Props = {
                    Title: "GS1 Perú",
                    Subject: "GS1 Perú",
                    Author: "GS1 Perú",
                    CreatedDate: new Date()
                };

                wb_excel_grid.SheetNames.push("Sheet1");

                var ws_data_excel_grid = [];
                var vi_NombreColumna = '';
                var vi_pos_simbo = 0;
                var vi_length_nombre = 0;

                if (indexsColumnsExport.length > 0) {
                    for (var i = 0; i < nRegIndexColumns; i++) {
                        vi_NombreColumna = $jt[sfx].headers[indexsColumnsExport[i]];
                        vi_pos_simbo = vi_NombreColumna.indexOf(" <i");

                        if (vi_pos_simbo > -1) {
                            vi_length_nombre = vi_pos_simbo;
                        } else {
                            vi_length_nombre = vi_NombreColumna.length;
                        }

                        c.push(vi_NombreColumna.substr(0, vi_length_nombre));
                    }
                }
                else {
                    for (var i = 0; i < nFields; i++) {
                        if (showColumnsExport[i]) {
                            if ($jt[sfx].headers[i] != "") {
                                vi_NombreColumna = $jt[sfx].headers[i];
                                vi_pos_simbo = vi_NombreColumna.indexOf(" <i");

                                if (vi_pos_simbo > -1) {
                                    vi_length_nombre = vi_pos_simbo;
                                } else {
                                    vi_length_nombre = vi_NombreColumna.length;
                                }

                                c.push(vi_NombreColumna.substr(0, vi_length_nombre));
                            }
                        }
                    }
                }

                ws_data_excel_grid.push(c);

                if (indexsColumnsExport.length > 0) {
                    var nRegIndexColumns = indexsColumnsExport.length;

                    for (var i = 0; i < cEntries; i++) {
                        c = [];
                        for (var j = 0; j < nRegIndexColumns; j++) {
                            if ($jt[sfx].typesData[indexsColumnsExport[j]] == "S_R") {
                                if ((!isNaN($jt[sfx].matrix[i][indexsColumnsExport[j]])) && ($jt[sfx].matrix[i][indexsColumnsExport[j]].length > 0)) {
                                    c.push(($jt[sfx].matrix[i][indexsColumnsExport[j]] * 1));

                                } else c.push($jt[sfx].matrix[i][indexsColumnsExport[j]]);
                            } else if ($jt[sfx].typesData[indexsColumnsExport[j]] == "D"){
                                c.push($frFormatFechaPeru($jt[sfx].matrix[i][indexsColumnsExport[j]]));
                            } else if ($jt[sfx].typesData[indexsColumnsExport[j]] == "DT"){
                                c.push($frFormatFechaTiempoPeru($jt[sfx].matrix[i][indexsColumnsExport[j]]));
                            }else {
                                c.push($jt[sfx].matrix[i][indexsColumnsExport[j]]);
                            }

                        }
                        ws_data_excel_grid.push(c);
                    }
                } else {
                    for (var i = 0; i < cEntries; i++) {
                        c = [];
                        for (var j = 0; j < nFields; j++) {
                            if (showColumnsExport[j]) {
                                if ($jt[sfx].headers[j] != "") {
                                    if ($jt[sfx].typesData[j] == "S_R") {
                                        if ((!isNaN($jt[sfx].matrix[i][j])) && ($jt[sfx].matrix[i][j].length > 0)) {
                                            c.push(($jt[sfx].matrix[i][j] * 1));

                                        } else c.push($jt[sfx].matrix[i][j]);

                                    } else if ($jt[sfx].typesData[j] == "D"){
                                        c.push($frFormatFechaPeru($jt[sfx].matrix[i][j]));
                                    } else if ($jt[sfx].typesData[j] == "DT"){
                                        c.push($frFormatFechaTiempoPeru($jt[sfx].matrix[i][j]));
                                    } else c.push($jt[sfx].matrix[i][j]);
                                    

                                }
                            }
                        }
                        ws_data_excel_grid.push(c);
                    }
                }

                var ws_excel_grid = XLSX.utils.aoa_to_sheet(ws_data_excel_grid);

                wb_excel_grid.Sheets["Sheet1"] = ws_excel_grid;

                /*ws_excel_grid['!pageSetup'] = { scale: '60' };*/

                /*ws_excel_grid['!cols'] = wscols;*/

                /*ws_excel_grid["A1"].s = {font: {sz: 30, bold: true}};*/

                var wbout_excel_grid = XLSX.write(wb_excel_grid, { bookType: 'xlsx', type: 'binary', showGridLines: false });

                function s2ab(s) {
                    var buf = new ArrayBuffer(s.length); /*convert s to arrayBuffer*/
                    var view = new Uint8Array(buf);  /*create uint8array as viewer*/
                    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; /*convert to octet*/
                    return buf;
                }

                var formBlob = new Blob([s2ab(wbout_excel_grid)], {
                    encoding: "UTF-8", type: 'application/octet-stream'
                });
                fullName = fileName + '.xlsx';

            }

            if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/))) {
                navigator.msSaveOrOpenBlob(formBlob, fullName);
            }
            else {
                var a = document.createElement('A');
                a.download = fullName;
                a.href = window.URL.createObjectURL(formBlob);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }
        else {
            $alert.show(_.language.noDataFound);
        }
    };
    var extension = function (fn, row, rowId) {
        if ($jt[_.namespace][fn] != undefined) {
            if (_.eProperties) {
                var obj = {};
                for (var i = 0; i < _.properties.length; i++) {
                    obj[_.properties[i]] = row[i];
                }
                return $jt[_.namespace][fn](obj, rowId);
            }
            else {
                return $jt[_.namespace][fn](row[rowId], rowId);
            }
        }
        else { console.log(fn + _msgError.m4); }
        /*return $jt[_.namespace][extension](columns, index);*/
    };
    var $filter = function (o) {
        var filters = document.getElementsByName("filter" + sfx);
        var cFilters = filters.length;
        for (var i = 0; i < cFilters; i++) {
            if (i == o.index) filters[i].value = o.value;
            else filters[i].value = '';
        }
    };
    var $selected = function (o) {
        /*console.log(sfx);*/
        var el = document.getElementById(sfx).getElementsByClassName("table-selected-tr")[0];

        if (el) {
            el.classList.remove("table-selected-tr");
        }
        if (o) {
            o.parentElement.parentElement.classList.add("table-selected-tr");
        }
    };
    var setFilterPosition = function (position) {
        var eFilter = {
            up: false,
            down: false
        };
        switch (position) {
            case 'UP':
                eFilter.up = true;
                break;
            case 'DOWN':
                eFilter.down = true;
                break;
        }
        return eFilter;
    };
    var countWidthsPx = function () {
        var c = 0;
        var n = _.widthsPx.length;
        for (var i = 0; i < n; i++) {
            if (_.showColumns[i]) c += _.widthsPx[i];
        }
        return c;
    };
    return {
        create: function (d) {
            $create(d);
        },
        setData: function (d, indexPage) {
            $setData(d);
            if (indexPage !== undefined) {
                pagination(indexPage);
            } else {
                pagination(0);
            }
        },
        showGrid: function (i) {
            $showGrid(i);
        },
        clearGrid: function () {
            $clearGrid();
        },
        clearFilter: function () {
            $clearFilter();
        },
        pagination: function (indexPage) {
            pagination(indexPage);
        },
        setMatrixRow: function (i, n, v) {
            $jt[sfx].matrix[i][n] = v;
        },
        setMatrix: function (matrix) {
            $jt[sfx].matrix = matrix.slice();
            $showGrid(0);
        },
        setDataMatrix: function (data) {
            $jt[sfx].matrix = data.slice();
            $jt[sfx].data = data.slice();
            $showGrid(0);
        },
        getData: function () {
            return $jt[sfx].matrix;
        },
        fnAction: function (namespace, fn, rowId) {
            if ($jt[namespace][fn] != undefined) {
                if (_.eProperties) {
                    var obj = {};
                    for (var i = 0; i < _.properties.length; i++) {
                        obj[_.properties[i]] = $jt[sfx].matrix[rowId][i];
                    }
                    $jt[namespace][fn](obj, rowId);
                }
                else {
                    $jt[namespace][fn]($jt[sfx].matrix[rowId], rowId);
                }
            }
            else { console.log('function ' + fn + _msgError.m4); }

        },
        filter: function (o) {
            $filter(o);
        },
        selected: function (o) {
            $selected(o);
        },
        exportTextExcel: function (o) {
            $exportTextExcel(o);
        }
    };
};