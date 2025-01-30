var $$table = function (controlName) {
    var ctrl = document.getElementById(controlName);
    var suffix = 'jtse-grid_';
    var _msgError = {
        m1: 'Control not found',
        m2: 'Header not found',
        m3: 'Header should not be zero',
        m4: 'Scope not found',
        m5: 'Function not defined'
    };
    var $create = function (o) {
        if (ctrl == undefined || o == undefined) {
            console.log(_msgError.m1);
            return;
        }
        if (o.Headers == undefined) {
            console.log(_msgError.m2);
            return;
        }
        if (o.Headers.length == 0) {
            console.log(_msgError.m3);
            return;
        }
        var eWidths = false,
            eIndex = false,
            eNew = false,
            eEdit = false,
            eDelete = false,
            eSort = true,
            eFilterUp = true,
            eFilterDown = false,
            eFilterGeneral = true,
            eExport = false,
            eActions = false,
            ePagination = true,
            eExportExcel = true,
            eExportText = true;
        var headers = [],
            widths = [],
            showColumns = [],
            showColumnsExport = [],
            showToolTip = [],
            indexs = [],
            types = [],
            filters = [],
            enableSort = [],
            cHeaders = 0,
            cFilters = 0,
            cActions = 0,
            cShowSearch = 10,
            headerStyle = "",
            c = [],
            _headerClass = [],
            _headerSort = [];
        _headerClass = o.HeaderClass;
        _headerSort = o.HeaderSort;
        var _order = -1;
        var name = controlName;
        headers = o.Headers;
        cHeaders = o.Headers.length;
        cFilters = cHeaders;
        if (o.Widths != undefined) {
            eWidths = true;
            widths = o.Widths;
        }
        if (o.ShowColumns != undefined) showColumns = o.ShowColumns.slice();
        else for (var i = 0; i < cHeaders; i++) showColumns[i] = true;
        if (o.ShowColumnsExport != undefined) showColumnsExport = o.ShowColumnsExport.slice();
        else for (var i = 0; i < cHeaders; i++) showColumnsExport[i] = true;
        if (o.ShowToolTip != undefined) showToolTip = o.ShowToolTip.slice();
        //else for (var i = 0; i < cHeaders; i++) showToolTip[i] = true;
        if (o.Indexs != undefined) {
            eIndex = true;
            indexs = o.Indexs.slice();
        }
        else for (var i = 0; i < cHeaders; i++) indexs[i] = i;
        if (o.DataType != undefined) types = o.DataType.slice();
        else for (var i = 0; i < cHeaders; i++) types[i] = 'S';
        if (o.DataTypeFilter != undefined) filters = o.DataTypeFilter;
        else for (var i = 0; i < cHeaders; i++) filters[i] = 'I';
        if (o.FilterUp != undefined) eFilterUp = o.FilterUp;
        if (o.FilterDown != undefined) eFilterDown = o.FilterDown;
        if (eFilterUp || eFilterDown) {
            if (o.DataTypeFilter != undefined) filters = o.DataTypeFilter.slice();
        } else {
            if (o.DataTypeFilter != undefined) filters = o.DataTypeFilter.slice();
        }
        if (o.New != undefined) eNew = o.New;
        if (o.Edit != undefined) eEdit = o.Edit;
        if (o.Delete != undefined) eDelete = o.Delete;
        if (o.Sort != undefined) eSort = o.Sort;
        if (o.EnableSort != undefined) enableSort = o.EnableSort.slice();
        else for (var i = 0; i < cHeaders; i++) enableSort[i] = true;
        //if (o.FilterUp != undefined) eFilterUp = o.FilterUp;
        if (o.FilterDown != undefined) eFilterDown = o.FilterDown;
        if (o.FilterGeneral != undefined) eFilterGeneral = o.FilterGeneral;
        if (o.Export != undefined) eExport = o.Export;
        if (o.Pagination != undefined) ePagination = o.Pagination;
        if (o.HeaderStyle) headerStyle = o.HeaderStyle;
        else headerStyle = '';
        if (o.ShowSearch != undefined) cShowSearch = o.ShowSearch;
        if (o.FnActions != undefined && o.FnActions.length > 0) {
            eActions = true;
            cActions = o.FnActions.length;
        }
        if (o.ExportExcel != undefined) eExportExcel = o.ExportExcel;
        if (o.ExportText != undefined) eExportText = o.ExportText;
        o.FnExportExcel = o.FnExportExcel || '';
        o.FnExportText = o.FnExportText || '';
        var lang = findLanguage(o.Lang != undefined ? o.Lang : '');
        c.push('<div class="col-24">');
        if (o.BorderTop != undefined && o.BorderTop) c.push('<hr />');
        if (o.Title != undefined) {
            c.push('<div class="row">');
            c.push('<h4 id="');
            c.push(o.Title);
            c.push('" class="table-title"></h1>');
            c.push('</div>');
        }
        c.push('<div class="w-100" style="display: table;vertical-align: middle;text-align:right;">');
        if ((eFilterUp || eFilterDown) && eFilterGeneral == true) {
            c.push('<div style="display:table-cell; padding:8px;text-align: right;vertical-align:middle" >');
            c.push('<input id="search');
            c.push(name);
            c.push('" style="width:60%;display:inline-block" type="text" class="form-control" placeholder="');
            c.push(lang.Search);
            c.push('">');
            c.push('</div>');
        }
        if (eExport || eNew) {
            c.push('<div style="display:table-cell;width:150px;vertical-align:middle" >');
            if (eExport) {
                c.push('<div class="btn-export" style="padding:7px" ');
                if (!eNew) {
                    c.push(' style="margin-bottom:auto; padding:7px" ');
                }
                c.push('>');
                c.push('<label>');
                c.push(lang.Export);
                c.push('</label>');
                if (eExportExcel) {
                    c.push('<span id="exportExcel');
                    c.push(name);
                    c.push('"><i class="fa fa-file-excel-o"></i></span>');
                }
                if (eExportText) {
                    c.push('<span id="exportText');
                    c.push(name);
                    c.push('"><i class="fa fa-file-text-o"></i></span>');
                }
                c.push('</div > ');
            }
            if (eNew) {
                c.push('<div id="btnAdd');
                c.push(name);
                c.push('" class="btn-add"><i class="fa fa-plus" title=');
                c.push(lang.Add);
                c.push('></i></div>');
            }
            c.push('</div>');
        }
        c.push('</div><div class="row">');
        c.push('<div class=" scroll-x col-lg-24 ');
        c.push(o.Class != undefined ? o.Class : '');
        c.push('">');
        c.push('<table class="table w-100"><thead ');
        c.push(' ><tr>');
        for (var i = 0; i < cHeaders; i++) {
            if (o.DataTypeFilter[i] != "") {
                _order += 1;
            }
            if (eEdit && i == 0)
                c.push('<th style="width:2.5%"></th>');
            if (showColumns[i]) {
                //c.push('<th  id="');
                //if (o.ShowToolTip) {
                //	if (o.ShowToolTip[i]) {

                //	}
                //	else {
                //		c.push(headers[i]);
                //	}
                //}
                //else {
                //	c.push(headers[i]);
                //}
                //c.push('" class="');
                c.push('<th class="');
                if (_headerSort) {
                    if (_headerSort[i] == true) {
                        c.push('sorting ');
                    }
                } else { c.push('sorting '); }
                if (_headerClass) {
                    c.push(_headerClass[i]);
                }
                if (_headerSort) {
                    if (_headerSort[i] == true) {
                        c.push('" name="sort');
                    }
                    else {
                        c.push('" name="');
                    }
                } else { c.push('" name="sort'); }
                c.push(name);
                if (eIndex) {
                    c.push('" data-order="');
                    c.push(indexs[_order]);
                    c.push('" style="');
                    c.push(headerStyle);
                    if (headerStyle != '') c.push(';');
                    c.push('width:');
                }
                else {
                    c.push('" style="');
                    c.push(headerStyle);
                    if (headerStyle != '') c.push(';');
                    c.push('width:')
                }
                if (eWidths) {
                    c.push(widths[i]);
                    c.push('%');
                }
                else {
                    c.push('auto');
                }
                c.push('">');
                //if (o.ShowToolTip) {
                //	if (showToolTip[i]) {
                //		c.push('<label id="' + headers[i] + '" class="control-label" style="padding-right:20px">');
                //		c.push('<span></span>');
                //		c.push('<span class="red hide">&nbsp;*</span>');
                //		c.push('<i class="fa fa-question-circle question-tbl" role="tooltip" data-namespace=\"' + o.Scope + '\" data-id="' + headers[i] + '"></i>');
                //		c.push('</label>');
                //	}
                //}
                c.push(headers[i]);
                c.push('</th>');
            }
            if (eDelete && i == cHeaders - 1)
                c.push('<th style="width:2.5%"></th>');
            if (eActions) {
                if (i == cHeaders - 1) {
                    c.push('<th style="width:');
                    c.push(cActions * 2.5);
                    c.push('%" colspan="');
                    c.push(cActions);
                    c.push('">Opc</th>');
                }
            }
        }
        c.push('</tr></thead>');
        if (eFilterUp || (eFilterUp == false && eFilterDown == false)) c.push(createFilter(name, filters, cFilters, cActions, showColumns, eEdit, eDelete, eActions, 'U'));
        c.push('<tbody id="tBody');
        c.push(name);
        c.push('"><tr><td class="text-center" colspan="');
        var colspan = cHeaders + (eEdit ? 1 : 0) + (eDelete ? 1 : 0) + (eActions ? o.FnActions.length : 0);
        c.push(colspan);
        c.push('">');
        c.push(lang.NoDataFound);
        c.push('</td></tr></tbody>');
        if (eFilterDown) c.push(createFilter(name, filters, cFilters, cActions, showColumns, eEdit, eDelete, eActions, 'D'));
        c.push('</table></div></div>');
        if (ePagination) {
            c.push('<div class="row"><div class="pagination col-lg-24 ');
            c.push(o.Class != undefined ? o.Class : '');
            c.push('">');
            c.push('<div class="col-sm-12 col-xs-12">')
            c.push('<div class="form-group mar-left pull-left">');
            c.push('<label class="mar-left" style="color:#526069">');
            c.push(lang.Show);
            c.push('</label>');
            c.push('<select id="cboFieldShow');
            c.push(name);
            c.push('" class="form-control mar-left" style="display:inline-block;width:auto">');
            var c10 = '<option value="10">10</option>',
                c25 = '<option value="25">25</option>',
                c50 = '<option value="50">50</option>',
                c100 = '<option value="100">100</option>';
            if (o.EntriesPage != undefined) {
                var ep = o.EntriesPage;
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
            }
            else {
                c.push('<option value="10" selected>10</option>');
                c.push(c25);
                c.push(c50);
                c.push(c100);
            }
            c.push('</select></div>');
            c.push('<div class="pagination-details col-sm-12 col-xs-12" style="margin-left:5px; margin-top:4px">');
            c.push('<span>');
            c.push(lang.Showing);
            c.push(' <span id="currentPage');
            c.push(name);
            c.push('">0</span>&nbsp;');
            c.push(lang.To);
            c.push('&nbsp;<span id="totalPages');
            c.push(name);
            c.push('">0</span>&nbsp;');
            c.push(lang.Of);
            c.push('&nbsp;<span id="totalEntries');
            c.push(name);
            c.push('">0</span>&nbsp;');
            c.push(lang.Entries);
            c.push('</span></div>');
            c.push('</div>');
            c.push('<div id="pagination');
            c.push(name);
            c.push('" class="pagination-pages text-right col-sm-12 col-xs-12"></div></div></div>');

        } else {
            c.push('<div class="pagination-details col-sm-12 col-xs-12" style="margin-left:5px; margin-top:4px">');
            c.push('<span>');
            c.push(lang.Showing);
            c.push(' <span id="currentPage');
            c.push(name);
            c.push('" class="hide"></span>');
            //c.push(lang.To);
            c.push('<span id="totalPages');
            c.push(name);
            c.push('" class="hide"></span>');
            //c.push(lang.Of);
            c.push('<span id="totalEntries');
            c.push(name);
            c.push('"></span>&nbsp;');
            c.push(lang.Entries);
            c.push('</span></div>');
        }
        ctrl.innerHTML = c.join('');
        if (eSort) orderSetup();
        if (eFilterUp || eFilterDown) filterSetup();
        if (eExport) {
            if (eExportExcel) {
                if (o.FnExportExcel != '') {
                    document.getElementById('exportExcel' + name).onclick = function () { $jt[o.Scope][o.FnExportExcel](); };
                }
                else {
                    document.getElementById('exportExcel' + name).onclick = function () { exportTextExcel(1); };
                }
            }
            if (eExportText) {
                if (o.FnExportText != '') {
                    document.getElementById('exportText' + name).onclick = function () { $jt[o.Scope][o.FnExportText](); };
                }
                else {
                    document.getElementById('exportText' + name).onclick = function () { exportTextExcel(0); };
                }
            }
        }
        if (eNew) {
            if (o.FnNew != undefined && o.Scope != undefined)
                document.getElementById('btnAdd' + name).addEventListener('click', $jt[o.Scope][o.FnNew]);
            else if (o.Scope == undefined) console.log(_msgError.m4);
        }
        if (ePagination) {
            document.getElementById('cboFieldShow' + name).onchange = function () {
                $jt[suffix + name].EntriesPage = this.value * 1;
                showTable(0);
            };
        }
        $jt[suffix + name] = {
            Headers: headers,
            DataType: types,
            DataTypeFilter: filters,
            ShowColumns: showColumns,
            ShowColumnsExport: showColumnsExport,
            ShowToolTip: showToolTip,
            Widths: widths,
            Indexs: indexs,
            Data: (o.Data != undefined ? o.Data : []),
            Matrix: [],
            Class: 'col-24',
            New: eNew,
            Edit: eEdit,
            Delete: eDelete,
            Sort: eSort,
            EnableSort: enableSort,
            FilterUp: eFilterUp,
            FilterDown: eFilterDown,
            FilterGeneral: eFilterGeneral,
            Export: eExport,
            Pagination: ePagination,
            ShowSearch: cShowSearch,
            HeaderStyle: headerStyle,
            ExportName: (o.ExportName != undefined ? o.ExportName : ''),
            FnNew: (o.FnNew != undefined ? o.FnNew : ''),
            FnEdit: (o.FnEdit != undefined ? o.FnEdit : ''),
            FnDelete: (o.FnDelete != undefined ? o.FnDelete : ''),
            FnRowEvent: (o.FnRowEvent != undefined ? o.FnRowEvent : ''),
            FnRowStyle: (o.FnRowStyle != undefined ? o.FnRowStyle : ''),
            FnColumStyle: (o.FnColumStyle != undefined ? o.FnColumStyle : ''),
            FnActions: (o.FnActions != undefined ? o.FnActions : []),
            Scope: (o.Scope != undefined ? o.Scope : ''),
            Icons: (o.Icons != undefined ? o.Icons : (o.Actions != undefined ? new Array(o.Actions.length) : [])),
            Separator: '¦',
            Lang: o.Lang != undefined ? o.Lang : '',
            FnExtensions: (o.FnExtensions != undefined ? o.FnExtensions : []),
            FnExtensionEditButton: (o.FnExtensionEditButton != undefined ? o.FnExtensionEditButton : ''),
            FnExtensionDeleteButton: (o.FnExtensionDeleteButton != undefined ? o.FnExtensionDeleteButton : ''),
            IndexCurrentPage: 0,
            IndexCurrentRange: 0,
            EntriesPage: (o.EntriesPage != undefined ? o.EntriesPage : 10),
            RangePage: (o.RangePage != undefined ? o.RangePage : 10),
            IndexOrder: 0,
            ExportExcel: eExportExcel,
            ExportText: eExportText,
            FnExportExcel: o.FnExportExcel,
            FnExportText: o.FnExportText,
        };
        if (o.Data != undefined && o.Data.length > 0) {
            createMatrix();
            showTable(0);
        }
    };
    var $setData = function (d) {
        if (d != undefined) {
            var nameObj = suffix + controlName;
            if ($jt[nameObj].IndexCurrentPage == 0) {
                $jt[nameObj].IndexCurrentPage = 0,
                    $jt[nameObj].IndexCurrentRange = 0,
                    $jt[nameObj].IndexOrder = 0;
            }
            $jt[nameObj].Matrix = [];
            createMatrix(d);
            filterThread();
            showTable($jt[nameObj].IndexCurrentPage);
        }
    };
    var $clearTable = function () {
        var nameObj = suffix + controlName;
        $jt[nameObj].IndexCurrentPage = 0,
            $jt[nameObj].IndexCurrentRange = 0,
            $jt[nameObj].IndexOrder = 0;
        $jt[nameObj].Matrix = [];
        showTable(0);
    };
    var findLanguage = function (obj) {
        if (window[obj] != undefined && obj != '')
            return window[obj];
        else
            return {
                Add: 'Agregar',
                Export: 'Exportar',
                Show: 'Mostrar',
                Search: 'Busqueda...',
                NoDataFound: 'No hay registros...',
                Showing: 'Mostrando',
                To: 'hasta',
                Of: 'de',
                Entries: 'registro(s)'
            };
    };
    var createFilter = function (name, filters, cFilters, cActions, showColumns, eEdit, eDelete, eActions, pos) {
        var c = [];
        c.push('<');
        c.push(pos == 'U' ? 'thead' : 'tbody');
        c.push(pos == 'U' ? ' class="hide"' : '');
        c.push('><tr>');
        for (var i = 0; i < cFilters; i++) {
            if (eEdit && i == 0) c.push('<td></td>');
            if (showColumns[i]) {
                c.push('<td>');
                switch (filters[i]) {
                    case 'S':
                        c.push('<select id="');
                        c.push('cbo_');
                        c.push(name);
                        c.push('_');
                        c.push(i);
                        c.push('"');
                        c.push(' name="filter');
                        c.push(name);
                        c.push('" class="form-control"></select>');
                        break;
                    case 'I':
                        c.push('<input name="filter');
                        c.push(name);
                        c.push('" type="text" class="form-control lupa" />');
                        break;
                    default:
                        c.push('<input name="filter');
                        c.push(name);
                        c.push('" style="display:none" />');
                        break;
                }
                c.push('</td>');
            }
            if (eDelete && i == cFilters - 1) c.push('<td></td>');
            if (eActions && i == cFilters - 1) for (var k = 0; k < cActions; k++) c.push('<td></td>');
        }
        c.push('</tr></');
        c.push(pos == 'U' ? 'thead' : 'tbody');
        c.push('>');
        return c.join('');
    };
    var orderSetup = function () {
        var links = document.getElementsByName("sort" + controlName);
        var cLinks = links.length;
        var link;
        for (var i = 0; i < cLinks; i++) {
            link = links[i];
            link.onclick = function () {
                sortMatrix(this);
                showTable($jt[suffix + controlName].IndexCurrentPage);
            }
        }
    };
    var order = function (x, y) {
        var IndexOrder = $jt[suffix + controlName].IndexOrder;
        var valX = (isNaN(x[IndexOrder]) ? x[IndexOrder].toLowerCase() : x[IndexOrder]);
        var valY = (isNaN(y[IndexOrder]) ? y[IndexOrder].toLowerCase() : y[IndexOrder]);
        return (($jt[suffix + controlName].OrderType == 0 ? valX > valY : valX < valY) ? 1 : -1);
    };
    var clearLinks = function () {
        var links = document.getElementsByName("sort" + controlName);
        var cLinks = links.length;
        var link;
        for (var i = 0; i < cLinks; i++) {
            link = links[i];
            link.classList.add('sorting');
            link.classList.remove('sorting_desc');
            link.classList.remove('sorting_asc');
            //link.className = 'sorting';
        }
    };
    var sortMatrix = function (link) {
        var nameObj = suffix + controlName;
        $jt[nameObj].IndexOrder = link.getAttribute("data-order") * 1;
        var field = link.className;
        var posAsc = field.indexOf("sorting_asc");
        var posDesc = field.indexOf("sorting_desc");
        $jt[nameObj].OrderType = (posAsc == -1 && posDesc == -1 ? 0 : (posAsc > -1 ? 1 : 0));
        clearLinks();
        if ($jt[nameObj].OrderType == 0) {
            link.classList.add('sorting_asc');
            link.classList.remove('sorting_desc');
            link.classList.remove('sorting');
        }//link.className = '';
        else {
            link.classList.add('sorting_desc');
            link.classList.remove('sorting_asc');
            link.classList.remove('sorting');
        }//link.className = 'sorting_desc';
        $jt[nameObj].Matrix.sort(order);
    };
    var filterSetup = function () {
        var filters = document.getElementsByName("filter" + controlName);
        var cFilters = filters.length;
        for (var i = 0; i < cFilters; i++) {
            switch (filters[i].tagName) {
                case 'INPUT':
                    filters[i].onkeyup = filter;
                    filters[i].onfocus = getfocus;
                    filters[i].onblur = lostfocus;
                    break;
                case 'SELECT':
                    filters[i].onchange = filter;
                    break;
            }
        }
        var search = document.getElementById('search' + controlName);
        if (search != undefined) search.onkeyup = filter;
    };
    var getfocus = function (e) {
        this.classList.remove("lupa");
    }
    var lostfocus = function (e) {
        this.classList.add("lupa");
    }
    var filter = function (e) {
        clearTimeout($jt[suffix + controlName].Threads);
        $jt[suffix + controlName].Threads = setTimeout(function () { filterThread(e); }, 1);
    };
    var filterThread = function (e) {
        var nameObj = suffix + controlName;
        var filters = document.getElementsByName("filter" + controlName);
        var cFilters = filters.length;
        var vFilters = [], exist, eDataType = false, dataType, arr = [];
        $jt[nameObj].Matrix = [];
        var cEntries = $jt[nameObj].Data.length;
        var Indexs = $jt[nameObj].Indexs.slice();
        var cFields, fields, field, x = 0, vSearch = '', existSearch;
        var optionDate = { "year": "numeric", "month": "2-digit", "day": "2-digit" };
        var optionDateTime = { "year": "numeric", "month": "2-digit", "day": "2-digit", "hour": "2-digit", "minute": "2-digit", "second": "2-digit" };
        if ($jt[nameObj].DataType != undefined) {
            eDataType = true;
            dataType = $jt[nameObj].DataType;
        }
        var search = document.getElementById('search' + controlName);
        if (search != undefined && search.value != '') {
            if (!$config.isIE) {
                vSearch = search.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
            } {
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
                    vFilters.push({ value: $frQuitarAcentos(filters[j].value).toLowerCase().trim(), type: (filters[j].tagName == 'INPUT' ? 0 : 1) });
            }
        }
        for (var i = 0; i < cEntries; i++) {
            fields = $jt[nameObj].Data[i];
            cFields = fields.length;
            exist = false;
            existSearch = true;
            if (vSearch != '') {
                for (var j = 0; j < cFilters; j++) {
                    filter = vFilters[j];
                    if (filter.type == 0 || filter.type == 1) {
                        if (eDataType) {
                            switch (dataType[j]) {
                                case 'D':
                                    field = (new Date(fields[Indexs[j]])).toLocaleString('es-PE', optionDate);
                                    break;
                                case 'A':
                                case 'A_L':
                                case 'A_R':
                                    field = extension($jt[nameObj].FnExtensions[j], fields, i);
                                    break;
                                /*case 'DT':
                                    field = (new Date(fields[$jt[suffix + nameTag].Indexs[j]])).toLocaleString('es-PE', optionDateTime);*/
                                default:
                                    if (!$config.isIE)
                                        field = fields[Indexs[j]].toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                                    else
                                        field = $frQuitarAcentos(fields[Indexs[j]].toString());
                                    break;
                            }
                        }
                        else field = fields[Indexs[j]].toString();
                        existSearch = (field.toLowerCase().trim().indexOf(vSearch) > -1);
                        if (existSearch) {
                            exist = true;
                            break;
                        }
                    }
                }
            } else if (!exist) {
                for (var j = 0; j < cFilters; j++) {
                    exist = true;
                    filter = vFilters[j];
                    if (filter.type == 0) {
                        if (eDataType) {
                            switch (dataType[j]) {
                                case 'D':
                                    field = (new Date(fields[Indexs[j]])).toLocaleString('es-PE', optionDate);
                                    break;
                                /*case 'DT':
                                    field = (new Date(fields[$jt[suffix + nameTag].Indexs[j]])).toLocaleString('es-PE', optionDateTime);*/
                                default:
                                    if (!$config.isIE)
                                        field = fields[Indexs[j]].toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                                    else
                                        field = $frQuitarAcentos(fields[Indexs[j]].toString());
                                    break;
                            }
                        }
                        else field = fields[Indexs[j]].toString();
                        exist = exist && (field.toLowerCase().trim().indexOf(filter.value) > -1);
                    }
                    else exist = exist && (filter.value == "" || fields[Indexs[j]].toLowerCase().trim() == filter.value.toLowerCase().trim());
                    if (!exist) break;
                }
            }
            if (exist && existSearch) {
                arr[x] = [];
                arr[x] = fields.slice();
                x++;
            }
        }
        $jt[nameObj].Matrix = arr.slice();
        if (e != undefined) {
            $jt[nameObj].IndexCurrentPage = 0,
                $jt[nameObj].IndexCurrentRange = 0;
        }
        pagination($jt[nameObj].IndexCurrentPage);
    };
    var createMatrix = function (_data) {
        if (ctrl != undefined && $jt[suffix + controlName] != undefined) {
            var nameObj = suffix + controlName;
            $jt[nameObj].TotalRegistros = (_data) ? _data.length : 0;
            $jt[nameObj].EntriesPage = ($jt[nameObj].Pagination == true ? $jt[nameObj].EntriesPage : _data.length);

            var arr = [];
            if (_data != undefined) {
                if (_data.length > 0) $jt[nameObj].Data = _data;
                else {
                    $jt[nameObj].Data = [];
                    showTable(0);
                    return;
                }
            }
            var separator = ($jt[nameObj].Separator != undefined ? $jt[nameObj].Separator : '¦');
            var cEntries = $jt[nameObj].Data.length;
            var cColumns = $jt[nameObj].Data[0].split(separator).length;
            var columns, date, dataType, eDataType = false;
            if ($jt[nameObj].DataType != undefined) {
                eDataType = true;
                dataType = $jt[nameObj].DataType;
            }
            for (var i = 0; i < cEntries; i++) {
                columns = $jt[nameObj].Data[i].split(separator);
                arr[i] = [];
                for (var j = 0; j < cColumns; j++) {
                    if (eDataType) {
                        switch (dataType[j]) {
                            case 'N':
                            case 'DE':
                                arr[i][j] = columns[j] * 1;
                                break;
                            case 'DT':
                            case 'D':
                                if (columns[j] != "") {
                                    date = columns[j].split('/');
                                    arr[i][j] = Date.UTC(date[2], (date[1] * 1) - 1, date[0], 5, 0, 0, 0);
                                }
                                else arr[i][j] = 0;
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
            $jt[nameObj].Data = arr.slice();
            $jt[nameObj].Matrix = arr.slice();
            arr = [];
        }
    };
    var showTable = function (indexPage) {

        if (ctrl != undefined && $jt[suffix + controlName] != undefined) {
            var name = controlName, c = [];
            var nameObj = suffix + controlName;
            var separator = ($jt[nameObj].Separator != undefined ? $jt[nameObj].Separator : '¦');
            var cActions = ($jt[nameObj].FnActions != undefined ? $jt[nameObj].FnActions.length : 0);
            $jt[nameObj].IndexCurrentPage = indexPage;
            var cEntries = $jt[nameObj].Matrix.length;
            if (cEntries > 0) {
                var start = indexPage * $jt[nameObj].EntriesPage;
                var end = start + $jt[nameObj].EntriesPage;
                //if ($jt[nameObj].Pagination) {
                document.getElementById('currentPage' + name).innerHTML = start + 1;
                document.getElementById('totalPages' + name).innerHTML = (end <= cEntries ? end : cEntries);
                //}
                document.getElementById('totalEntries' + name).innerHTML = cEntries;
                var cColumns = $jt[nameObj].Matrix[0].length;
                var dataType, eDataType = false, columns;
                if ($jt[nameObj].DataType != undefined) {
                    eDataType = true;
                    dataType = $jt[nameObj].DataType;
                }
                var optionDate = {
                    "year": "numeric", "month": "2-digit", "day": "2-digit"
                };
                var optionDateTime = {
                    "year": "numeric", "month": "2-digit", "day": "2-digit", "hour": "2-digit", "minute": "2-digit", "second": "2-digit"
                };
                var Edit = $jt[nameObj].Edit,
                    Delete = $jt[nameObj].Delete,
                    Scope = $jt[nameObj].Scope,
                    FnEdit = $jt[nameObj].FnEdit,
                    FnDelete = $jt[nameObj].FnDelete,
                    FnRowEvent = $jt[nameObj].FnRowEvent,
                    FnRowStyle = $jt[nameObj].FnRowStyle,
                    FnColumStyle = $jt[nameObj].FnColumStyle,
                    FnActions = $jt[nameObj].FnActions,
                    Icons = $jt[nameObj].Icons,
                    ShowColumns = $jt[nameObj].ShowColumns.slice();

                for (var i = start; i < end; i++) {
                    if (i < cEntries) {
                        columns = $jt[nameObj].Matrix[i];
                        c.push('<tr ');
                        if (FnRowStyle != '') {
                            c.push(extension($jt[nameObj].FnRowStyle, columns, i));
                        }
                        if (FnRowEvent != '') {
                            c.push(' onclick="$$table(\'');
                            c.push(name);
                            c.push('\').fnAction(\'');
                            c.push(Scope);
                            c.push('\',\'');
                            c.push(FnRowEvent);
                            c.push('\',');
                            c.push(i);
                            c.push(');"');
                        }
                        c.push('>');
                        if (Edit) {
                            if ($jt[nameObj].FnExtensionEditButton == '') {
                                c.push('<td><i class="fa fa-pencil btn-edit" style="cursor:pointer" onclick="$$table(\'');
                                c.push(name);
                                c.push('\').fnAction(\'');
                                c.push(Scope);
                                c.push('\',\'');
                                c.push(FnEdit);
                                c.push('\',');
                                c.push(i);
                                c.push(');"></i></td>');
                            }
                            else {
                                c.push('<td>');
                                c.push(extension($jt[nameObj].FnExtensionEditButton, columns, i, 'E'));
                                c.push('</td>');
                            }
                        }
                        for (var j = 0; j < cColumns; j++) {
                            if (ShowColumns[j]) {
                                c.push('<td ');
                                if (FnColumStyle != '') {
                                    if (FnColumStyle.split(",")[j]) {
                                        c.push(extension(FnColumStyle.split(",")[j], columns, i));
                                    }
                                }
                                if (eDataType) {
                                    switch (dataType[j]) {
                                        case 'N':
                                            c.push(' class= "text-right">');
                                            c.push(columns[j]);
                                            break;
                                        case 'D':
                                            c.push(' class= "text-center">');
                                            if (columns[j] == 0) c.push('');
                                            else c.push($frFormatoFecha((new Date(columns[j])).toLocaleString('es-PE', optionDate)));

                                            break;
                                        case 'DE':
                                            c.push(' class= "text-right">');
                                            c.push($fnDecimal(columns[j]));
                                            break;
                                        case 'DT':
                                            c.push(' class= "text-center">');
                                            if (columns[j] == 0) c.push('');
                                            else c.push((new Date(columns[j])).toLocaleString('es-PE', optionDateTime));
                                            break;
                                        case 'SC':
                                        case 'NC':
                                        case 'B':
                                            c.push(' class= "text-center">');
                                            c.push(columns[j]);
                                            break;
                                        case 'A':
                                            c.push(' class= "text-center">');
                                            c.push(extension($jt[nameObj].FnExtensions[j], columns, i));
                                            break;
                                        case 'AL':
                                            c.push(' class= "text-left">');
                                            c.push(extension($jt[nameObj].FnExtensions[j], columns, i));
                                            break;
                                        default:
                                            c.push(' class= "text-left">');
                                            c.push(columns[j]);
                                            break;
                                    }
                                }
                                else {
                                    c.push(' class= "text-left">');
                                    c.push(columns[j]);
                                }
                                c.push('</td>');
                            }
                        }
                        if (Delete) {
                            if ($jt[nameObj].FnExtensionDeleteButton == '') {
                                c.push('<td><i class="fa fa-trash-o btn-delete" style="cursor:pointer" onclick="$$table(\'');
                                c.push(name);
                                c.push('\').fnAction(\'');
                                c.push(Scope);
                                c.push('\',\'');
                                c.push(FnDelete);
                                c.push('\',');
                                c.push(i);
                                c.push(');"></i></td>');
                            }
                            else {
                                c.push('<td>');
                                c.push(extension($jt[nameObj].FnExtensionDeleteButton, columns, i, 'D'));
                                c.push('</td>');
                            }
                        }
                        if (cActions > 0) {
                            for (var k = 0; k < cActions; k++) {
                                c.push('<td><i class="fa fa-');
                                c.push(Icons[k]);
                                c.push('" style="color: #62a8ea;cursor:pointer" onclick="$$table(\'');
                                c.push(name);
                                c.push('\').fnAction(\'');
                                c.push(Scope);
                                c.push('\',\'');
                                c.push(FnActions[k]);
                                c.push('\',');
                                c.push(i);
                                c.push(');"></i></td>');
                            }
                        }
                        c.push('</tr>');
                    }
                }
            }
            else {
                c.push('<tr><td class="text-center" colspan="');
                c.push($jt[nameObj].Headers.length + ($jt[nameObj].Edit ? 1 : 0) + ($jt[nameObj].Delete ? 1 : 0) + cActions);
                c.push('">');
                var lang = findLanguage($jt[nameObj].Lang);
                c.push(lang.NoDataFound);
                c.push('</td></tr>');
                document.getElementById('currentPage' + name).innerHTML = 0;
                document.getElementById('totalPages' + name).innerHTML = 0;
                document.getElementById('totalEntries' + name).innerHTML = 0;
            }
            document.getElementById('tBody' + name).innerHTML = c.join('');
            if ($jt[nameObj].Pagination) {
                createPagination();
            }
            //else {
            if ($jt[nameObj].TotalRegistros >= $jt[nameObj].ShowSearch || $jt[nameObj].ShowSearch == undefined) {
                if (document.getElementById(controlName).getElementsByTagName("thead")[1]) {
                    document.getElementById(controlName).getElementsByTagName("thead")[1].classList.remove("hide");
                }
            }
            else {
                if (document.getElementById(controlName).getElementsByTagName("thead")[1]) {
                    document.getElementById(controlName).getElementsByTagName("thead")[1].classList.add("hide");
                }
            }
            //}

        }
    };
    var selectedCurrentPage = function () {
        var page = document.getElementById("goPage" + controlName + $jt[suffix + controlName].IndexCurrentPage);
        if (page != undefined) page.className += " active";
    };
    var createPagination = function () {
        if (ctrl != undefined && $jt[suffix + controlName] != undefined) {
            var name = controlName;
            var nameObj = suffix + controlName;
            var cEntries = $jt[nameObj].Matrix.length;
            var indexLastPage = Math.floor(cEntries / $jt[nameObj].EntriesPage);
            if (cEntries % $jt[nameObj].EntriesPage == 0) indexLastPage--;
            var indexLastRange = Math.floor(cEntries / ($jt[nameObj].RangePage * $jt[nameObj].EntriesPage));
            if (cEntries % ($jt[nameObj].RangePage * $jt[nameObj].EntriesPage) == 0) indexLastRange--;
            var content = "";
            var start = $jt[nameObj].IndexCurrentRange * $jt[nameObj].RangePage;
            var end = start + $jt[nameObj].RangePage;
            if ($jt[nameObj].IndexCurrentRange > 0 && cEntries > ($jt[nameObj].RangePage * $jt[nameObj].EntriesPage)) {
                content += "<span class='pagination-button' onclick='$$table(\"";
                content += name;
                content += "\").pagination(-1);' title='Ir al primer grupo de páginas'>&lt;&lt;</span>";
                content += "<span class='pagination-button' onclick='$$table(\"";
                content += name;
                content += "\").pagination(-2);' title='Ir al anterior grupo de páginas'>&lt;</span>";
            }

            for (var i = start; i < end; i += 1) {
                if (i <= indexLastPage) {
                    content += "<span onclick='$$table(\"";
                    content += name;
                    content += "\").pagination(";
                    content += i;
                    content += ");'  title='Ir a la pagina ";
                    content += (i + 1).toString();
                    content += "' id='goPage";
                    content += name;
                    content += i.toString();
                    content += "' class='pagination-button' >";
                    content += (i + 1).toString();
                    content += "</span>";
                } else break;
            }
            if ($jt[nameObj].IndexCurrentRange < indexLastRange && cEntries > ($jt[nameObj].RangePage * $jt[nameObj].EntriesPage)) {
                content += "<span class='pagination-button' onclick='$$table(\"";
                content += name;
                content += "\").pagination(-3);' title='Ir al siguiente grupo de páginas'>&gt;</span>";
                content += "<span class='pagination-button' onclick='$$table(\"";
                content += name;
                content += "\").pagination(-4);' title='Ir al último grupo de páginas'>&gt;&gt;</span>";
            }

            if (cEntries <= $jt[nameObj].EntriesPage) {
                document.getElementById('pagination' + name).innerHTML = "";
                var ShowPages = $jt[suffix + name].EntriesPage;
            }
            else {
                document.getElementById('pagination' + name).innerHTML = content;
                selectedCurrentPage();
            }

        }
    };
    var pagination = function (indexPage) {
        if (ctrl != undefined && $jt[suffix + controlName] != undefined) {
            var nameObj = suffix + controlName;
            var cEntries = $jt[nameObj].Matrix.length;
            var isRange = (indexPage < 0);
            if (isRange) {
                var indexLastPage = Math.floor(cEntries / $jt[nameObj].EntriesPage);
                if (cEntries % $jt[nameObj].EntriesPage == 0) indexLastPage--;
                var indexLastRange = Math.floor(cEntries / ($jt[nameObj].RangePage * $jt[nameObj].EntriesPage));
                if (cEntries % ($jt[nameObj].RangePage * $jt[nameObj].EntriesPage) == 0) indexLastRange--;
                switch (indexPage) {
                    case -1:
                        indexPage = 0;
                        $jt[nameObj].IndexCurrentRange = 0;
                        break;
                    case -2:
                        if ($jt[nameObj].IndexCurrentRange > 0) {
                            $jt[nameObj].IndexCurrentRange--;
                            indexPage = $jt[nameObj].IndexCurrentRange * $jt[nameObj].RangePage;
                        }
                        break;
                    case -3:
                        if ($jt[nameObj].IndexCurrentRange < indexLastRange) {
                            $jt[nameObj].IndexCurrentRange++;
                            indexPage = $jt[nameObj].IndexCurrentRange * $jt[nameObj].RangePage;
                        }
                        break;
                    case -4:
                        indexPage = indexLastPage;
                        $jt[nameObj].IndexCurrentRange = indexLastRange;
                        break;
                }
            }
            $jt[nameObj].IndexCurrentPage = indexPage;
            showTable(indexPage);
        }
    };
    var exportTextExcel = function (type) {
        if (ctrl != undefined && $jt[suffix + controlName]) {
            var nameObj = suffix + controlName, fullName;
            if ($jt[nameObj].Matrix.length > 0) {
                var cEntries = $jt[nameObj].Matrix.length;
                var nFields = $jt[nameObj].Headers.length;
                var showColumnsExport = $jt[nameObj].ShowColumnsExport.slice();
                var c = [], eDataType = false, dataType;
                var fileName = ($jt[nameObj].ExportName != '' ? $jt[nameObj].ExportName : (type == 0 ? 'CsvExport' : 'ExcelExport'));
                if (type == 0) {
                    var h = [];
                    for (var i = 0; i < nFields; i++) {
                        if (showColumnsExport[i]) {
                            if ($jt[nameObj].Headers[i] != "") {
                                h.push(document.getElementById($jt[nameObj].Headers[i]).innerHTML);
                            }
                        }
                    }
                    c.push(h.join(','));
                    c.push('\r\n');
                    for (var i = 0; i < cEntries; i++) {
                        h = [];
                        for (var j = 0; j < nFields; j++) {
                            if (showColumnsExport[j]) {
                                if ($jt[nameObj].Headers[j] != "") {//Ray
                                    h.push($jt[nameObj].Matrix[i][j]);
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
                    /*var a = document.createElement('A');
					a.download = fileName + '.txt';
					a.href = window.URL.createObjectURL(formBlob);
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);*/
                }
                else {
                    if ($jt[nameObj].DataType != undefined) {
                        eDataType = true;
                        dataType = $jt[nameObj].DataType;
                    }
                    var optionDate = { "year": "numeric", "month": "2-digit", "day": "2-digit" };
                    var optionDateTime = { "year": "numeric", "month": "2-digit", "day": "2-digit", "hour": "2-digit", "minute": "2-digit", "second": "2-digit" };
                    c.push('<html><head><meta charset="UTF-8"><style>');
                    c.push('.number_2{ mso-number-format:"0\.00"} .string{ mso-number-format:"\\@"} ');
                    c.push('</style></head><body><table><thead><tr>');
                    for (var i = 0; i < nFields; i++) {
                        if (showColumnsExport[i]) {
                            if ($jt[nameObj].Headers[i] != "") {
                                c.push('<th>');
                                if (document.getElementById($jt[nameObj].Headers[i])) {
                                    c.push(document.getElementById($jt[nameObj].Headers[i]).innerHTML);
                                }
                                c.push('</th>');
                            }
                        }
                    }
                    c.push('</tr></thead><tbody>');
                    for (var i = 0; i < cEntries; i++) {
                        c.push('<tr>');
                        for (var j = 0; j < nFields; j++) {
                            if (showColumnsExport[j]) {
                                if ($jt[nameObj].Headers[j] != "") { //Ray
                                    c.push('<td style="text-align:');
                                    if (eDataType) {
                                        switch (dataType[j]) {
                                            case 'N':
                                                c.push('right" class="number_2">');
                                                c.push($jt[nameObj].Matrix[i][j].toFixed(2));
                                                break;
                                            case 'D':
                                                c.push('center" class="string">');
                                                if ($jt[nameObj].Matrix[i][j] == 0) c.push('');
                                                else c.push((new Date($jt[nameObj].Matrix[i][j])).toLocaleString('es-PE', optionDate));
                                                break;
                                            case 'DT':
                                                c.push('center" class="string">');
                                                if ($jt[nameObj].Matrix[i][j] == 0) c.push('');
                                                else c.push((new Date($jt[nameObj].Matrix[i][j])).toLocaleString('es-PE', optionDate));
                                                break;
                                            case 'SC':
                                            case 'NC':
                                            case 'B':
                                                c.push('left" class="string">');
                                                c.push($jt[nameObj].Matrix[i][j]);
                                                break;
                                            default:
                                                c.push('left" class="string">');
                                                c.push($jt[nameObj].Matrix[i][j]);
                                                break;
                                        }
                                    }
                                    else {
                                        c.push('left" class="string">');
                                        c.push($jt[nameObj].Matrix[i][j]);
                                    }
                                    c.push('</td>');
                                }
                            }
                        }
                        c.push('</tr>');
                    }
                    c.push('</tbody></table></body></html>');
                    var formBlob = new Blob([c.join('')], {
                        encoding: "UTF-8", type: 'application/vnd.ms-excel;charset=UTF-8'
                    });
                    fullName = fileName + '.xls';
                    /*var a = document.createElement('A');
					a.download = fileName + '.xls';
					a.href = window.URL.createObjectURL(formBlob);
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);*/
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
                var lang = findLanguage($jt[nameObj].Lang);
                console.log(lang.NoDataFound);
            }
        }
    };
    var extension = function (extension, columns, index, button) {
        if (ctrl != undefined && $jt[suffix + controlName] != undefined) {
            var name = controlName, c = [];
            var nameObj = suffix + name;
            if (button != undefined) return $jt[$jt[nameObj].Scope][extension](columns, index, button);
            else return $jt[$jt[nameObj].Scope][extension](columns, index);
        }
    };
    var $filter = function (o) {
        var filters = document.getElementsByName("filter" + controlName);
        var cFilters = filters.length;
        for (var i = 0; i < cFilters; i++) {
            if (i == o.index) filters[i].value = o.value;
            else filters[i].value = '';
        }
    };
    var $selected = function (o) {
        var el = document.getElementById(controlName).getElementsByClassName("table-selected-tr")[0];
        if (el) {
            el.classList.remove("table-selected-tr");
        }
        if (o) {
            o.parentElement.parentElement.classList.add("table-selected-tr");
        }
    }
    return {
        create: function (d) {
            $create(d);
        },
        setData: function (d) {
            $setData(d);
        },
        showTable: function (i) {
            showTable(i);
        },
        clearTable: function () {
            $clearTable();
        },
        pagination: function (indexPage) {
            pagination(indexPage);
        },
        setMatrix: function (i, n, v) {
            $jt[suffix + controlName].Matrix[i][n] = v;
        },
        setMatrixTabla: function (_matrix) {
            $jt[suffix + controlName].Matrix = _matrix;
            showTable(0);
        },
        setDataTabla: function (_data) {
            $jt[suffix + controlName].Matrix = _data.slice();
            $jt[suffix + controlName].Data = _data.slice();
            showTable(0);
        },
        getData: function () {
            return $jt[suffix + controlName].Matrix;
        },
        fnAction: function (scope, fn, rowId) {
            if ($jt[scope][fn] != undefined)
                $jt[scope][fn]($jt[suffix + controlName].Matrix[rowId], rowId);
            else console.log(fn + _msgError.m5);
        },
        filter: function (o) {
            $filter(o);
        },
        selected: function (o) {
            $selected(o);
        },
    };
};