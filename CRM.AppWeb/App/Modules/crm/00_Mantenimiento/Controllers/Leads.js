define([$appName, "Leads", ["INTERES", "CANAL", "LIST_USUARIO_SOLI", "EVENTO", "CAMPANIA", "UBIGEO", "ESTADO", "LIST_USUARIO_ASESOR", "LIST_USUARIO_ASESOR_SUPERVISOR", "INTERES_NOM"
    , "CANAL_NOM", "ESTADO_NOM", "CAMPANIA_NOM", "EVENTO_NOM", "LIST_USUARIO_NOMBRE", "FORMULARIO_NOMBRE","REASIGNADO"]],
    function (module, namespace, args) {
        "use strict";
        var service = function ($service, $http) {

            $service.LeadsLST = function (item, callback) {
                return $http({
                    url: "Leads/Listar",
                    data: item,
                    method: "post",
                    callback: callback
                });
            };
            $service.LeadsCUD = function (item, callback) {
                return $http({
                    url: "Leads/CUD",
                    data: item,
                    method: "post",
                    callback: callback
                });
            };


        };

        var controller = function ($scope, $service) {
            var FechaActual = new Date();
            var LST_Leads = [], CHK_Leads = [],
                OBJ_Leads = [], isNewLead = false;
            var VL_ID_CAMPANA = '';
            var VL_ID_EVENTO = '';
            var VL_NOM_EVENTO = '';
            var VL_NOM_CAMPANA = '';
            var VL_USER = '';
            var LST_CHECK_ACTIVOS = [];
            var N_ITEM_Chk = 0;
            var LST_GRID = [];
            var VL_CHK_GRD_LST_D = [];
            var LST_CHECK_ACTIVOS = [];
            var LST_CHECK_OBJ_ACTIVOS = [];
            //let arrControles = ['txt¦CreadoPor', 'txt¦DNI', 'txt¦Nombres', 'txt¦Apellidos', 'txt¦Edad', 'cbo¦Departamento', 'txt¦TlfCelular',
            //    'txt¦Correo', 'cbo¦Interes', 'txt¦Modalidad', 'cbo¦Campania', 'cbo¦Evento', 'cbo¦Canal', 'cbo¦AsignarA', 'cbo¦Asistio'];
            $scope.init = function () {
                $scope.configurarControles();
                $scope.cargarCombos();
                $scope.cargarDatos();
                $scope.configurarEventos();
            };

            $scope.configurarControles = function () {
                let _btnOptions = {};
                let _showColumns = [];
                let _showColumnsExport = [];
                let _columnProperties = [];

                if ($global.usuarioAsesor) {
                    _columnProperties = [{
                        index: 0,
                        //header: "",
                        //propertie: "",
                        typeData: "A",
                        //typeFilter: "",
                        sortHeader: false,
                        //showColumn: true,
                        width: 20,
                        columnExport: false,
                        //totalColumn: false,
                        fnExtension: "fnEvVerDetalleLead"
                    },
                    {
                        index: 1,
                        header: '<input type="checkbox" id="checkboxGlobal" style="vertical-align: middle;">',
                        propertie: "CHECK",
                        typeData: "A",
                        //typeFilter: "",
                        sortHeader: false,
                        showColumn: false,
                        width: 20,
                        columnExport: false,
                        //totalColumn: false,
                        fnExtension: "fnExCheck"
                    },
                    {
                        index: 2,
                        header: "ID",
                        showColumn: false,
                        width: 20,
                        columnExport: false,
                    },

                    {
                        index: 3,
                        header: "Fecha de registro",
                        propertie: "FCH_INGRESO",
                        typeData: "DT",
                        typeFilter: "I",
                        //sortHeader: true,
                        //showColumn: true,
                        width: 110,
                        //columnExport: true,
                        //totalColumn: false,
                        //fnExtension: "",

                    },
                    {
                        index: 4,
                        header: "Asignado a",
                        propertie: "ASIGNADO",
                        //typeData: "S",
                        typeFilter: "S",
                        //sortHeader: true,
                        showColumn: false,
                        width: 200,
                        columnExport: false,
                        //totalColumn: false,
                        //fnExtension: "",

                    },
                    {
                        index: 5,
                        header: "Edad",
                        propertie: "EDAD",
                        //typeData: "S",
                        typeFilter: "I",
                        //sortHeader: true,
                        //showColumn: true,
                        width: 35,
                        //columnExport: true,
                        //totalColumn: false,
                        //fnExtension: "",

                    },
                    {
                        index: 6,
                        header: "DNI",
                        propertie: "DNI",
                        //typeData: "S",
                        typeFilter: "I",
                        //sortHeader: true,
                        //showColumn: true,
                        width: 60,
                        //columnExport: true,
                        //totalColumn: false,
                        //fnExtension: "",

                    },
                    {
                        index: 7,
                        header: "Nombres",
                        propertie: "NOMBRES",
                        //typeData: "S",
                        typeFilter: "I",
                        //sortHeader: true,
                        //showColumn: true,
                        width: 130,
                        //columnExport: true,
                        //totalColumn: false,
                        //fnExtension: ""

                    },
                    {
                        index: 8,
                        header: "Apellidos",
                        propertie: "APELLIDOS",
                        //typeData: "S",
                        typeFilter: "I",
                        //sortHeader: true,
                        //showColumn: true,
                        width: 130,
                        //columnExport: true,
                        //totalColumn: false,
                        //fnExtension: "",

                    },
                    {
                        index: 9,
                        header: "Correo electrónico",
                        propertie: "CORREO",
                        //typeData: "S",
                        typeFilter: "I",
                        //sortHeader: true,
                        //showColumn: true,
                        width: 170,
                        //columnExport: true,
                        //totalColumn: false,
                        //fnExtension: ""

                    },
                    {
                        index: 10,
                        header: "Teléfono",
                        propertie: "TELEFONO",
                        //typeData: "S",
                        typeFilter: "I",
                        //sortHeader: true,
                        //showColumn: true,
                        width: 70,
                        //columnExport: true,
                        //totalColumn: false,
                        //fnExtension: ""

                    },
                    {
                        index: 11,
                        header: "Departamento",
                        propertie: "DEPARTAMENTO",
                        //typeData: "S",
                        typeFilter: "I",
                        //sortHeader: true,
                        showColumn: false,
                        width: 100,
                        columnExport: false,
                        //totalColumn: false,
                        //fnExtension: ""

                    },
                    {
                        index: 12,
                        header: "Estado",
                        propertie: "ESTADO",
                        typeData: "A",
                        typeFilter: "S",
                        //sortHeader: true,
                        //showColumn: true,
                        width: 90,
                        //columnExport: true,
                        //totalColumn: false,
                        fnExtension: "fnEvEstadoLead",

                    },
                    {
                        index: 13,
                        header: "R",
                        propertie: "REASIGNADO",
                        //typeData: "S",
                        typeFilter: "S",
                        //sortHeader: true,
                        //showColumn: true,
                        width: 90,
                        //columnExport: true,
                        //totalColumn: false,
                    },
                    {
                        index: 14,
                        header: "Canal",
                        propertie: "CANAL",
                        //typeData: "S",
                        typeFilter: "S",
                        //sortHeader: true,
                        showColumn: false,
                        width: 90,
                        columnExport: false,
                        //totalColumn: false,
                        //fnExtension: ""

                    },
                    {
                        index: 15,
                        header: "Formulario",
                        propertie: "FORMULARIO",
                        //typeData: "S",
                        typeFilter: "S",
                        //sortHeader: true,
                        //showColumn: true,
                        width: 90,
                        //columnExport: true,
                        //totalColumn: false,
                        //fnExtension: ""

                    },
                    {
                        index: 16,
                        header: "Interés",
                        propertie: "INTERES",
                        //typeData: "S",
                        typeFilter: "S",
                        //sortHeader: true,
                        //showColumn: true,
                        width: 120,
                        //columnExport: true,
                        //totalColumn: false,
                        //fnExtension: "",

                    },
                    {
                        index: 17,
                        header: "Modalidad",
                        propertie: "COMENTARIO",
                        //typeData: "S",
                        typeFilter: "I",
                        sortHeader: false,
                        //showColumn: true,
                        width: 250,
                        //columnExport: true,
                        //totalColumn: false,
                        //fnExtension: "",

                    },
                    {
                        index: 18,
                        header: "Campaña",
                        propertie: "CAMPANA",
                        //typeData: "S",
                        typeFilter: "S",
                        //sortHeader: true,
                        //showColumn: true,
                        width: 200,
                        //columnExport: true,
                        //totalColumn: false,
                        //fnExtension: "",

                    },
                    {
                        index: 19,
                        propertie: "EVENTO",
                        header: "Evento",
                        //typeData: "S",
                        typeFilter: "S",
                        //sortHeader: true,
                        //showColumn: true,
                        width: 200,
                        //columnExport: true,
                        //totalColumn: false,
                        //fnExtension: "",

                    }];
                    _btnOptions = {
                        btnid: [],
                        names: [],
                        icons: [],
                        class: [],
                        fnEvents: []
                    };
                } else {
                    //_showColumns = [true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
                    //_showColumnsExport = [false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
                    _columnProperties = [{
                        index: 0,
                        header: "",
                        propertie: "",
                        typeData: "A",
                        typeFilter: "",
                        sortHeader: false,
                        showColumn: true,
                        width: 20,
                        columnExport: false,
                        totalColumn: false,
                        fnExtension: "fnEvVerDetalleLead"
                    },
                    {
                        index: 1,
                        header: '<input type="checkbox" id="checkboxGlobal" style="vertical-align: middle;">',
                        propertie: "CHECK",
                        typeData: "A",
                        typeFilter: "",
                        sortHeader: false,
                        showColumn: true,
                        width: 20,
                        columnExport: false,
                        totalColumn: false,
                        fnExtension: "fnExCheck"

                    },
                    {
                        index: 2,
                        header: "ID",
                        propertie: "",
                        typeData: "S",
                        typeFilter: "",
                        sortHeader: true,
                        showColumn: false,
                        width: 20,
                        columnExport: false,
                        totalColumn: false,
                        fnExtension: ""
                    },
                    {
                        index: 3,
                        header: "Fecha de registro",
                        propertie: "FCH_INGRESO",
                        typeData: "DT",
                        typeFilter: "I",
                        sortHeader: true,
                        showColumn: true,
                        width: 110,
                        columnExport: true,
                        totalColumn: false,
                        fnExtension: ""
                    },
                    {
                        index: 4,
                        header: "Asignado a",
                        propertie: "ASIGNADO",
                        typeData: "S",
                        typeFilter: "S",
                        sortHeader: true,
                        showColumn: true,
                        width: 200,
                        columnExport: true,
                        totalColumn: false,
                        fnExtension: ""
                    },
                    {
                        index: 5,
                        header: "Edad",
                        propertie: "EDAD",
                        typeData: "S",
                        typeFilter: "I",
                        sortHeader: true,
                        showColumn: true,
                        width: 35,
                        columnExport: true,
                        totalColumn: false,
                        fnExtension: ""
                    },
                    {
                        index: 6,
                        header: "DNI",
                        propertie: "DNI",
                        typeData: "S",
                        typeFilter: "I",
                        sortHeader: true,
                        showColumn: true,
                        width: 60,
                        columnExport: true,
                        totalColumn: false,
                        fnExtension: ""

                    },
                    {
                        index: 7,
                        header: "Nombres",
                        propertie: "NOMBRES",
                        typeData: "S",
                        typeFilter: "I",
                        sortHeader: true,
                        showColumn: true,
                        width: 130,
                        columnExport: true,
                        totalColumn: false,
                        fnExtension: ""

                    },
                    {
                        index: 8,
                        header: "Apellidos",
                        propertie: "APELLIDOS",
                        typeData: "S",
                        typeFilter: "I",
                        sortHeader: true,
                        showColumn: true,
                        width: 130,
                        columnExport: true,
                        totalColumn: false,
                        fnExtension: ""

                    },
                    {
                        index: 9,
                        header: "Correo electrónico",
                        propertie: "CORREO",
                        typeData: "S",
                        typeFilter: "I",
                        sortHeader: true,
                        showColumn: true,
                        width: 170,
                        columnExport: true,
                        totalColumn: false,
                        fnExtension: ""

                    },
                    {
                        index: 10,
                        header: "Teléfono",
                        propertie: "TELEFONO",
                        typeData: "S",
                        typeFilter: "I",
                        sortHeader: true,
                        showColumn: true,
                        width: 70,
                        columnExport: true,
                        totalColumn: false,
                        fnExtension: ""

                    },
                    {
                        index: 11,
                        header: "Departamento",
                        propertie: "DEPARTAMENTO",
                        typeData: "S",
                        typeFilter: "I",
                        sortHeader: true,
                        showColumn: true,
                        width: 100,
                        columnExport: true,
                        totalColumn: false,
                        fnExtension: ""

                    },
                    {
                        index: 12,
                        header: "Estado",
                        propertie: "ESTADO",
                        typeData: "A",
                        typeFilter: "S",
                        sortHeader: true,
                        showColumn: true,
                        width: 90,
                        columnExport: true,
                        totalColumn: false,
                        fnExtension: "fnEvEstadoLead"

                    },
                    {
                        index: 13,
                        header: "R",
                        propertie: "REASIGNADO",
                        typeData: "S",
                        typeFilter: "S",
                        sortHeader: true,
                        showColumn: true,
                        width: 90,
                        columnExport: true,
                        totalColumn: false,
                    },
                    {
                        index: 14,
                        header: "Canal",
                        propertie: "CANAL",
                        typeData: "S",
                        typeFilter: "S",
                        sortHeader: true,
                        showColumn: true,
                        width: 90,
                        columnExport: true,
                        totalColumn: false,
                        fnExtension: ""

                    },
                    {
                        index: 15,
                        header: "Formulario",
                        propertie: "FORMULARIO",
                        typeData: "S",
                        typeFilter: "S",
                        sortHeader: true,
                        showColumn: true,
                        width: 90,
                        columnExport: true,
                        totalColumn: false,
                        fnExtension: "",

                    },
                    {
                        index: 16,
                        header: "Interés",
                        propertie: "INTERES",
                        typeData: "S",
                        typeFilter: "S",
                        sortHeader: true,
                        showColumn: true,
                        width: 120,
                        columnExport: true,
                        totalColumn: false,
                        fnExtension: ""

                    },
                    {
                        index: 17,
                        header: "Modalidad",
                        propertie: "COMENTARIO",
                        typeData: "S",
                        typeFilter: "I",
                        sortHeader: false,
                        showColumn: true,
                        width: 250,
                        columnExport: true,
                        totalColumn: false,
                        fnExtension: ""

                    },
                    {
                        index: 18,
                        header: "Campaña",
                        propertie: "CAMPANA",
                        typeData: "S",
                        typeFilter: "S",
                        sortHeader: true,
                        showColumn: true,
                        width: 200,
                        columnExport: true,
                        totalColumn: false,
                        fnExtension: ""

                    },
                    {
                        index: 19,
                        header: "Evento",
                        propertie: "EVENTO",
                        typeData: "S",
                        typeFilter: "S",
                        sortHeader: true,
                        showColumn: true,
                        width: 200,
                        columnExport: true,
                        totalColumn: false,
                        fnExtension: ""

                    }];
                    _btnOptions = {
                        btnid: ['btn_Comp_AplicaNC', 'btn_eliminar_multiple'],
                        names: ['Asignar Asesor', 'Eliminar'],
                        icons: ['fa fa-bell', 'fa-trash-o'],
                        class: ['btn btn-grid-new pull-right border-left-grid', 'btn btn-grid-new pull-right border-left-grid'],
                        fnEvents: ['FnCompAsignarAsociado', 'FnEliminarMultiple']
                    };
                }

                $$grid('grd_LeadsLST').create({
                    columnProperties: _columnProperties,
                    headerStyle: $controls.grid.headerStyle,
                    data: [],
                    filterPosition: 'UP',
                    generalFilter: false,
                    entriesPage: 10,
                    rangePage: 5,
                    fixedColumn: 4,
                    btnNew: true, /*$global.permission.insert,*/
                    btnRefresh: true,
                    btnExportExcel: true, /*$global.permission.excel,*/
                    btnOptions: _btnOptions,
                    btnDelete: true, /*$global.permission.delete,*/
                    btnEdit: true, /*$global.permission.excel,*/
                    separator: '¦',
                    fnBtnNew: 'fnNewLead',
                    fnBtnEdit: 'fnEditLead',
                    fnBtnDelete: 'fnDeleteLead',
                    fnBtnDeleteMultiple: '',
                    fnBtnRefresh: 'fnListarGRDLead',
                    fnRowEvent: '',
                    widthsPx: true,
                    //indexsColumnsExport: [2, 3, 4, 5, 6, 7, 8],
                    namespace: namespace
                });
                //#region
                /*$$grid('grd_LeadsLST').create({
                    //         0                             1                                                    2            3                4           5      6        7          8                  9                10           11           12       13          14           15            16          17        18
                    headers: ['', '<input type="checkbox" id="checkboxGlobal" style="vertical-align: middle;">', 'ID', 'Fecha de registro', 'Asignado a', 'Edad', 'DNI', 'Nombres', 'Apellidos', 'Correo electrónico', 'Teléfono', 'Departamento', 'Estado', 'Canal', 'Formulario', 'Interés', 'Modalidad', 'Campaña', 'Evento'],
                    properties: ['', 'CHECK', '', 'FCH_INGRESO', 'ASIGNADO', 'EDAD', 'DNI', 'NOMBRES', 'APELLIDOS', 'CORREO', 'TELEFONO', 'DEPARTAMENTO', 'ESTADO', 'CANAL', 'FORMULARIO', 'INTERES', 'COMENTARIO', 'CAMPANA', 'EVENTO'],
                    typesData: ['A', 'A', 'S', 'DT', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'A', 'S', 'S', 'S', 'S', 'S', 'S'],
                    typesFilter: ['', '', '', 'I', 'S', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'S', 'S', 'S', 'S', 'I', 'S', 'S'],
                    sortHeader: [false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true],
                    showColumns: _showColumns,
                    widthsPx: [20, 20, 20, 110, 200, 35, 60, 130, 130, 170, 70, 100, 90, 90, 90, 120, 250, 200, 200],
                    indexs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
                    headerStyle: $controls.grid.headerStyle,
                    data: [],
                    filterPosition: 'UP',
                    generalFilter: false,
                    entriesPage: 10,
                    rangePage: 5,
                    fixedColumn: 4,
                    btnNew: true,
                    btnRefresh: true,
                    btnExportExcel: true,
                    btnOptions: _btnOptions,
                    btnDelete: true,
                    btnEdit: true,
                    separator: '¦',
                    fnBtnNew: 'fnNewLead',
                    fnBtnEdit: 'fnEditLead',
                    fnBtnDelete: 'fnDeleteLead',
                    fnBtnDeleteMultiple: '',
                    fnBtnRefresh: 'fnListarGRDLead',
                    fnRowEvent: '',
                    showColumnsExport: _showColumnsExport,
                    fnExtensions: ['fnEvVerDetalleLead', 'fnExCheck', '', '', '', '', '', '', '', '', '', '', 'fnEvEstadoLead', '', '', '', '', '', ''],
                    namespace: namespace
                });*/
                //#endregion
                $$modal('MDL_LeadsCUD').create({
                    WithScrollY: true,
                    FullScreen: true,
                    Namespace: namespace
                });

                $$modal('mdl_Asignar_Asociado').create({
                    WithScrollY: true,
                    Width: 'sm',
                    Title: 'Asignar Asociado',
                    ButtonNames: ['Aceptar', 'Cancelar'],
                    ButtonClass: ['btn-save-ico', 'btn-cancel-ico'],
                    FnActions: ['fnEvMdlAsignar_Asociado_Aceptar', 'fnEvMdlAsignar_Asociado_Cancelar'],
                    Namespace: namespace
                });

                $scope.fijarCabeceraGrilla();
                $scope.fnCalcularTotolesControles();
            };

            $scope.cargarCombos = function () {
                
                $fnSetCombo({
                    controlId: 'cbo_jtse-grid_grd_LeadsLST_13',
                    data: $global.lists.REASIGNADO,
                    type: 'T',
                    separator: '¦'
                });
                $fnSetCombo({
                    controlId: 'cbo_jtse-grid_grd_LeadsLST_18',
                    data: $global.lists.CAMPANIA_NOM,
                    type: 'T',
                    separator: '¦'
                });
                $fnSetCombo({
                    controlId: 'cbo_jtse-grid_grd_LeadsLST_19',
                    data: $global.lists.EVENTO_NOM,
                    type: 'T',
                    separator: '¦'
                });
                $fnSetCombo({
                    controlId: 'cbo_jtse-grid_grd_LeadsLST_12',
                    data: $global.lists.ESTADO_NOM,
                    type: 'T',
                    separator: '¦'
                });
                $fnSetCombo({
                    controlId: 'cbo_jtse-grid_grd_LeadsLST_14',
                    data: $global.lists.CANAL_NOM,
                    type: 'T',
                    separator: '¦'
                });
                $fnSetCombo({
                    controlId: 'cbo_jtse-grid_grd_LeadsLST_16',
                    data: $global.lists.INTERES_NOM,
                    type: 'T',
                    separator: '¦'
                });

                //console.log($global.lists.INTERES_NOM);

                $fnSetCombo({
                    controlId: 'CBO_MDLAsesores',
                    data: $global.lists.LIST_USUARIO_ASESOR_SUPERVISOR,
                    type: 'S',
                    separator: '¦'
                });

                var ListaUsuarios = $global.lists.LIST_USUARIO_NOMBRE;
                ListaUsuarios.push('SIN ASIGNAR' + '¦' + 'SIN ASIGNAR');

                $fnSetCombo({
                    controlId: 'cbo_jtse-grid_grd_LeadsLST_4',
                    data: ListaUsuarios,
                    type: 'T',
                    separator: '¦'
                });

                $fnSetCombo({
                    controlId: 'cbo_jtse-grid_grd_LeadsLST_15',
                    data: $global.lists.FORMULARIO_NOMBRE,
                    type: 'T',
                    separator: '¦'
                });
            };

            $scope.cargarDatos = function () {
                $fnValidarCampos({
                    containers: ['frmLeadsLST']
                });
                var FechaActual = new Date();
                //txt_FECHA_INICIO.value = $frConvertToDateString(FechaActual);
                txt_FECHA_INICIO.dateValue = $frConvertToDateString(new Date(FechaActual.getFullYear(), FechaActual.getMonth(), 1));
                txt_FECHA_FINAL.dateValue = $frConvertToDateString(FechaActual);
                if ($global.usuarioAsesor) {
                    VL_USER = $global.user.coduser;
                    $scope.listarEvLeav('R', '', VL_USER, '');
                } else {
                    if (args) {
                        if (args.frmVerLeads) {
                            if (args.frmVerLeads._idCampana || args.frmVerLeads._idEvento) {
                                VL_ID_CAMPANA = args.frmVerLeads._idCampana;
                                VL_NOM_CAMPANA = args.frmVerLeads._nombreCampana;
                                VL_ID_EVENTO = args.frmVerLeads._idEvento;
                                VL_NOM_EVENTO = args.frmVerLeads._nombreEvento;
                                document.getElementById('DIV_RE').style.display = 'inline';
                                title.innerHTML = "- Evento: " + VL_NOM_EVENTO;
                                $scope.listarEvLeav('R', '', '', VL_ID_EVENTO);
                            }

                            if (args.frmVerLeads._user) {
                                VL_USER = args.frmVerLeads._user;
                                $scope.listarEvLeav('R', '', VL_USER, '');
                                /*console.log($global.user.coduser);*/
                            }

                            if (args.frmVerLeads._idUser) {
                                VL_USER = args.frmVerLeads._idUser;
                                $scope.listarEvLeav('R', '', VL_USER, '');
                                document.getElementById('DIV_RE').style.display = 'inline';


                            }



                        } else {
                            $scope.listarEvLeav('R');
                        }
                    } else {
                        VL_USER = $global.user.coduser;
                        $scope.listarEvLeav('R', '', VL_USER, '');
                    }
                }

            };

            $scope.configurarEventos = function () {
                btn_Buscar.onclick = function () {
                    $scope.listarEvLeav('R', '', VL_USER, VL_ID_EVENTO);
                };
                BTN_REG_EV.onclick = function () {
                    if (args.frmVerLeads._idUser) {
                        module.goSubPage('Comerciales', 'view-Main', {
                        });

                    } else {
                        module.goSubPage('Eventos', 'view-Main', {
                            frmVerEventos: {
                                _idCampana: VL_ID_CAMPANA,
                                _nombreCampana: VL_NOM_CAMPANA
                            }
                        });
                    }

                };
                CHK_FECHA_INICIO.onchange = function () {
                    if (CHK_FECHA_INICIO.checked) {
                        txt_FECHA_INICIO.disabled = false;
                        txt_FECHA_INICIO.dateValue = $frConvertToDateString(new Date(FechaActual.getFullYear(), FechaActual.getMonth(), 1));
                    } else {
                        txt_FECHA_INICIO.disabled = true;

                    }
                };
                CHK_FECHA_FINAL.onchange = function () {
                    if (CHK_FECHA_FINAL.checked) {
                        txt_FECHA_FINAL.disabled = false;
                        txt_FECHA_FINAL.dateValue = $frConvertToDateString(FechaActual);
                    } else {
                        txt_FECHA_FINAL.disabled = true;

                    }
                };
                $scope.fnEvMdlAsignar_Asociado_Cancelar = function () {
                    $$modal('mdl_Asignar_Asociado').hide();
                };
                if (document.getElementById('checkboxGlobal')) {
                    document.getElementById('checkboxGlobal').onclick = function () {
                        $scope.cargarArrayCheckGlobal(this.checked);
                        /*console.log(LST_CHECK_ACTIVOS, LST_CHECK_OBJ_ACTIVOS);*/
                        //if (this.checked) {
                        //    this.value = '1';
                        //    $scope.cargarArrayCheckGlobal(this.value);
                        //} else {
                        //    this.value = '0';
                        //    $scope.cargarArrayCheckGlobal(this.value);
                        //}
                    };
                }
                
                

            };
            $scope.fnListarGRDLead = function () {
                if ($global.usuarioAsesor) {
                    VL_USER = $global.user.coduser;
                    $scope.listarEvLeav('R', '', VL_USER, '');
                } else {
                    if (args) {
                        if (args.frmVerLeads) {
                            if (args.frmVerLeads._idCampana || args.frmVerLeads._idEvento) {
                                $scope.listarEvLeav('R', '', '', VL_ID_EVENTO);
                            }
                            if (args.frmVerLeads._user) {
                                $scope.listarEvLeav('R', '', VL_USER, '');
                            }

                        } else {
                            $scope.listarEvLeav('R');
                        }
                    }
                }
                LST_CHECK_ACTIVOS = [];
                LST_CHECK_OBJ_ACTIVOS = [];
            };
            //#region Checkbox Grilla listado de leads
            $scope.fnEvChk_SeleccionarLead = function (row, index) {
                let c = [];
                let fields = $jt['jtse-grid_' + 'grd_LeadsLST'].matrix[index];
                let idRegistro = fields[2];
                if (fields[1] == '0' || fields[1] == '1') {
                    c.push('<input id="CHK_GRD_LeadsLST_I_' + index + '" type="checkbox" ');
                    if (fields[1] == "1") {
                        c.push('checked value="1" onclick="$jt[\'' + namespace + '\'].fnEvGRD_LeadsLST(\'' + index + '\',\'' + idRegistro + '\');"/>');
                    }
                    else if (fields[1] == "0") {
                        c.push('value="0"');
                        c.push(' onclick="$jt[\'' + namespace + '\'].fnEvGRD_LeadsLST(\'' + index + '\',\'' + idRegistro + '\');" /> ');
                    }
                }
                //c.push("</input>");
                return c.join('');
            };

            $scope.fnEvGRD_LeadsLST = function (index, idRegistro) {
                var check = document.getElementById('CHK_GRD_LeadsLST_I_' + index);
                if (check.checked) {
                    NUM_Extracto_Bancario++
                    $scope.cargarArrCHK_Extracto(idRegistro, true);
                    check.value = "1";
                    check.checked = true;
                } else {
                    NUM_Extracto_Bancario--
                    $scope.cargarArrCHK_Extracto(idRegistro, false);
                    check.value = "0";
                    check.checked = false;
                }
                //$scope.verificarCHK_LeadsLST();
            };

            $scope.cargarArrCHK_Extracto = function (idRegistro, flg) {
                if (flg) {
                    CHK_Leads.push(idRegistro);
                    OBJ_Leads[idRegistro] = idRegistro;
                    $scope.cargarLstCHK_Extracto(idRegistro, '1');
                } else {
                    var index = CHK_Leads.indexOf(idRegistro);
                    /*console.log(index);*/
                    if (index > -1) {
                        CHK_Leads.splice(index, 1);
                        delete OBJ_Leads[idRegistro];
                        $scope.cargarLstCHK_Extracto(idRegistro, '0');
                    }
                }
                CHK_Leads.sort();
            };

            $scope.cargarLstCHK_Extracto = function (idRegistro, flg) {
                var nLST = LST_Leads.length;
                var dataJTGrid = $jt['jtse-grid_' + 'grd_LeadsLST'].data;
                var column = [];
                for (var i = 0; i < nLST; i++) {
                    column = LST_Leads[i].split('¦');
                    if (column[2] == idRegistro && dataJTGrid[i][2] == idRegistro) {

                        /*console.log(dataJTGrid);*/

                        column[0] = flg;
                        dataJTGrid[i][0] = flg;
                        LST_Leads[i] = column.join('¦');
                        break;
                    }
                }
                dataJTGrid = $jt['jtse-grid_' + 'grd_LeadsLST'].matrix;
                nLST = dataJTGrid.length;
                for (var i = 0; i < nLST; i++) {
                    if (dataJTGrid[i][2] == idRegistro) {
                        dataJTGrid[i][0] = flg;
                        break;
                    }
                }

                $jt['jtse-grid_' + 'grd_LeadsLST'].matrix = dataJTGrid;
            };


            $scope.verificarCHK_Extracto = function () {
                var nLST = LST_Leads.length;
                var nOBJ = CHK_Leads.length;
                if (nLST > 0) {
                    if (nLST == nOBJ) {
                        document.getElementById('CHK_GRD_LeadsLST').checked = true;
                        document.getElementById('CHK_GRD_LeadsLST').value = "1";
                    } else {
                        document.getElementById('CHK_GRD_LeadsLST').checked = false;
                        document.getElementById('CHK_GRD_LeadsLST').value = "0";
                    }
                } else {
                    document.getElementById('CHK_GRD_LeadsLST').checked = false;
                }

            };
            /*CHECK GLOBAL*/
            $scope.cargarArrayCheckGlobal = function (bool) {
                var contadorListado = LST_GRID.length;
                var contadorListadoMatrix = $jt['jtse-grid_' + 'grd_LeadsLST'].matrix.length;

                if (contadorListado == contadorListadoMatrix) {

                    if (LST_GRID.length > 0) {
                        var FLG = (bool) ? '1' : '0';
                        var NLST_filas = LST_GRID.length;
                        var Columnas = [];

                        LST_CHECK_ACTIVOS = [];
                        LST_CHECK_OBJ_ACTIVOS = [];
                        //VL_Contador = 0;

                        for (var i = 0; i < NLST_filas; i++) {
                            Columnas = LST_GRID[i].split('¦');
                            Columnas[1] = FLG;
                            if (bool) {
                                LST_CHECK_ACTIVOS.push(Columnas[2]);
                                LST_CHECK_OBJ_ACTIVOS[Columnas[2]] = Columnas[2];
                                //VL_Contador++;
                            }


                            LST_GRID[i] = Columnas.join('¦');
                        }

                        $$grid('grd_LeadsLST').setData(LST_GRID);
                        //LBL_Seleccionados.innerHTML = 'Ha Seleccionado ' + VL_Contador + ' Registro(s)';
                    } else {
                        document.getElementById("checkboxGlobal").checked = false;
                    }

                } else {

                    var VI_LISTADO = $jt['jtse-grid_' + 'grd_LeadsLST'].matrix;

                    if (VI_LISTADO.length > 0) {
                        var FLG = (bool) ? '1' : '0';

                        var NLST_filas = VI_LISTADO.length;
                        var Columnas = [];

                        var VI_LST_CHECK_NUMAVISO = [];
                        //var VI_LST_CHECK_OBJ_ACTIVOS = LST_CHECK_OBJ_ACTIVOS.slice();

                        LST_CHECK_ACTIVOS = [];
                        LST_CHECK_OBJ_ACTIVOS = [];
                        //VL_Contador = 0;

                        for (var i = 0; i < NLST_filas; i++) {
                            Columnas = VI_LISTADO[i];
                            Columnas[1] = FLG;
                            if (bool) {
                                LST_CHECK_ACTIVOS.push(Columnas[2]);
                                LST_CHECK_OBJ_ACTIVOS[Columnas[2]] = Columnas[2];
                                //VL_Contador++;
                            }

                            VI_LST_CHECK_NUMAVISO[Columnas[2]] = Columnas[2];

                            VI_LISTADO[i] = Columnas;
                        }

                        NLST_filas = LST_GRID.length;
                        for (var i = 0; i < NLST_filas; i++) {
                            Columnas = LST_GRID[i].split('¦');
                            if (VI_LST_CHECK_NUMAVISO[Columnas[2]] == Columnas[2]) {
                                if (LST_CHECK_OBJ_ACTIVOS[Columnas[2]] == Columnas[2]) {
                                    Columnas[1] = '1';
                                } else {
                                    Columnas[1] = '0';
                                }
                            } else {
                                if (Columnas[1] == "1") {
                                    LST_CHECK_ACTIVOS.push(Columnas[2]);
                                    LST_CHECK_OBJ_ACTIVOS[Columnas[2]] = Columnas[2];
                                    //VL_Contador++;
                                }
                            }

                            LST_GRID[i] = Columnas.join('¦');
                        }

                        //console.log(LST_CHECK_ACTIVOS, LST_CHECK_OBJ_ACTIVOS);

                        $$grid('grd_LeadsLST').setData(LST_GRID);
                        //LBL_Seleccionados.innerHTML = 'Ha Seleccionado ' + VL_Contador + ' Registro(s)';
                    } else {
                        document.getElementById("checkboxGlobal").checked = false;
                    }
                }

                //var CHK = document.getElementById('checkboxGlobal');
                //var DATA_JT_GRID = $jt['jtse-grid_' + 'grd_LeadsLST'].matrix;
                //var nlist = DATA_JT_GRID.length;
                //var column = [];
                //var OBJ_DATOS_MATRIX = [];

                //LST_CHECK_ACTIVOS = [];
                //VL_CHK_GRD_LST_D = [];


                //for (var i = 0; i < nlist; i++) {
                //    column = DATA_JT_GRID[i];
                //    LST_CHECK_ACTIVOS.push(column[2]);
                //    VL_CHK_GRD_LST_D[column[2]] = column[2];
                //}

                //var nlistado = LST_GRID.length;
                //for (var x = 0; x < nlistado; x++) {
                //    column = LST_GRID[x].split('¦');
                //    if (column[2] == VL_CHK_GRD_LST_D[column[2]]) {
                //        column[1] = valor;
                //        //if (valor == "1") {

                //        //}
                //        LST_GRID[x] = column.join('¦');
                //    }
                //}
                //$$grid('grd_LeadsLST').setData(LST_GRID);
                //console.log(LST_CHECK_ACTIVOS, LST_GRID)
            };

            $scope.VerificarCheckCabecera = function () {
                var nlist = LST_GRID.length;
                var nlistObject = LST_CHECK_ACTIVOS.length;

                if (nlist == nlistObject) {
                    checkboxGlobal.checked = true;
                    checkboxGlobal.value = "1";
                } else {
                    checkboxGlobal.checked = false;
                    checkboxGlobal.value = "0";
                }
            };

            $scope.fnCalcularTotolesControles = function () {
                var controles = document.getElementsByName("filter_jtse-grid_grd_LeadsLST");
                var nControles = controles.length;
                for (var i = 0; i < nControles; i++) {

                    if (controles[i].tagName == "INPUT") {
                        controles[i].addEventListener("keyup", function (e) {
                            setTimeout(function () {
                                $scope.ValidarCheckGlobal();
                            }, 2);
                        });
                    } else if (controles[i].tagName == "SELECT") {
                        controles[i].addEventListener("change", function () {
                            setTimeout(function () {
                                $scope.ValidarCheckGlobal();

                            }, 2);
                        });
                    }
                }
            };

            $scope.ValidarCheckGlobal = function () {

                var VI_LISTADO = $jt['jtse-grid_' + 'grd_LeadsLST'].matrix;
                var NLST_filas = VI_LISTADO.length;
                var Contador = 0;

                for (var i = 0; i < NLST_filas; i++) {
                    if (VI_LISTADO[i][2] != "1") {
                        Contador++;
                    }
                }

                if (NLST_filas > 0) {
                    if (Contador > 0) {
                        document.getElementById("checkboxGlobal").checked = false;
                    } else if (Contador == 0) {
                        document.getElementById("checkboxGlobal").checked = true;
                    }
                    //else if (Contador < LST_CHECK_ACTIVOS.length) {
                    //    document.getElementById("checkboxGlobal").checked = true;
                    //}

                    //if (Contador > LST_CHECK_ACTIVOS.length) {
                    //    document.getElementById("checkboxGlobal").checked = false;
                    //} else if (Contador == LST_CHECK_ACTIVOS.length) {
                    //    document.getElementById("checkboxGlobal").checked = true;
                    //} else if (Contador < LST_CHECK_ACTIVOS.length) {
                    //    document.getElementById("checkboxGlobal").checked = true;
                    //}
                }
                //console.log(LST_CHECK_ACTIVOS, LST_CHECK_OBJ_ACTIVOS);
            };
            /*CHECK*/
            $scope.fnExCheck = function (row, index) {
                var field = $jt['jtse-grid_' + 'grd_LeadsLST'].matrix[index];
                var c = [];
                c.push('<input type="checkbox" id="CHK_GRD_LeadsLST_' + index + '" value="' + field[1] + '" ' + (field[1] == "1" ? 'checked' : '') + ' class="" onchange="$jt[\'' + namespace + '\'].fnEvCheck_GRD_LeastLST(\'' + index + '\')"');
                if (field[1] === "1") {
                    c.push('checked value="1"');
                } else {
                    c.push('value="0"')
                }
                c.push('>');
                return c.join('');
            };
            $scope.fnEvCheck_GRD_LeastLST = function (index) {
                var check = document.getElementById('CHK_GRD_LeadsLST_' + index);
                var field = $jt['jtse-grid_' + 'grd_LeadsLST'].matrix[index];
                if (check.checked) {
                    check.value = "1";
                    $scope.agregarDatosCheck(true, field[2]);
                } else {
                    check.value = "0";
                    $scope.agregarDatosCheck(false, field[2]);
                }
                $scope.ValidarCheckGlobal();
            };
            $scope.agregarDatosCheck = function (bool, codigo) {
                if (bool) {
                    N_ITEM_Chk++;
                    LST_CHECK_ACTIVOS.push(codigo);
                    $scope.cargarGrillaCHK(codigo, '1');
                } else {
                    N_ITEM_Chk--;
                    var index = LST_CHECK_ACTIVOS.indexOf(codigo);
                    if (index > -1) {
                        LST_CHECK_ACTIVOS.splice(index, 1);
                        $scope.cargarGrillaCHK(codigo, '0');
                    }
                }
                $scope.VerificarCheckCabecera();
            };
            $scope.cargarGrillaCHK = function (VP_ID, FLG) {
                var VP_N_LST = LST_GRID.length;
                var DATA_JT_GRID = $jt['jtse-grid_' + 'grd_LeadsLST'].data;
                var Column = [];
                for (var i = 0; i < VP_N_LST; i++) {
                    Column = LST_GRID[i].split('¦');
                    if (Column[2] == VP_ID && DATA_JT_GRID[i][2] == VP_ID) {
                        Column[1] = FLG;
                        DATA_JT_GRID[i][1] = FLG;
                        LST_GRID[i] = Column.join('¦');
                        break
                    }
                }

                DATA_JT_GRID = $jt['jtse-grid_' + 'grd_LeadsLST'].matrix;
                VP_N_LST = DATA_JT_GRID.length;

                for (var i = 0; i < VP_N_LST; i++) {
                    if (DATA_JT_GRID[i][2] == VP_ID) {
                        DATA_JT_GRID[i][1] = FLG;
                        break;
                    }
                }
            };
            $scope.FnCompAsignarAsociado = function () {
                var NCHK = LST_CHECK_ACTIVOS.length;
                if (NCHK > 0) {
                    $$modal('mdl_Asignar_Asociado').show();
                    CBO_MDLAsesores.value = '';
                } else {
                    $alertbox.show("Seleccione items.", 'E');
                }
            };
            $scope.FnEliminarMultiple = function () {
                var NCHK = LST_CHECK_ACTIVOS.length;
                if (NCHK > 0) {
                    $dialog.confirm('¿Está seguro(a) de eliminar los ' + NCHK + ' leads seleccionados?', 'Información', 'I', function (rpta) {
                        //console.log(LST_CHECK_ACTIVOS);
                        if (rpta) {
                            let request = [{
                                TOKEN: $config.token
                            }, {
                                VAR01: LST_CHECK_ACTIVOS
                            }, {
                                RF: 'DM'
                            }];
                            $service.LeadsCUD(request, function (result) {
                                if ($fnValidarServicios(result)) {
                                    $alertbox.show('Leads eliminados exitosamente', 'S', 4);
                                    $scope.fnListarGRDLead();
                                    $global.user.conexionSocket.send('NOTIFICACIONES¯')
                                } else {
                                    $alertbox.show($msg.error.server);
                                }
                            });
                        };
                    });
                } else {
                    $alertbox.show("Seleccione items.", 'E');
                }
            };
            $scope.fnEvMdlAsignar_Asociado_Aceptar = function () {
                if (CBO_MDLAsesores.value != '') {
                    var request = [{
                        VAR00: $config.token
                    }, {
                        VAR01: CBO_MDLAsesores.value,
                        VAR02: LST_CHECK_ACTIVOS,
                        VAR03: $global.user.coduser,
                        VAR04: '#IP_CLIENTE#',
                        VAR05: '1'
                    }, {
                        VAR06: 'UC',
                    }];
                    console.log(request);
                    $service.LeadsCUD(request, function (d) {
                        if (d.success) {
                            if (d.data = 'OK') {
                                $$modal('mdl_Asignar_Asociado').hide();
                                $scope.fnListarGRDLead();
                                LST_CHECK_ACTIVOS = [];
                                $global.user.conexionSocket.send('NOTIFICACIONES¯');
                                $alertbox.show('Se actualizó correctamente', 'S', 3);

                            }
                        } else {
                            $alertbox.show($msg.error.server, 'E');
                        }
                    });
                } else {
                    $alertbox.show('Reasignación inválida', 'E', 3)
                }
            };

            //#endregion

            $scope.fnNewLead = function () {
                isNewLead = true;
                //txt_MDL_LeadsCUD_CreadoPor.value = $global.user.name;
                //$$modal('MDL_LeadsCUD').show();
                module.goSubPage("LeadsCUD", 'VW-MDL_LeadsCUD', {
                    frmLeads: {
                        DATA: '',
                        CUD: 'C'
                    }
                });
                $$modal('MDL_LeadsCUD').show();
            }

            //#region Botones modal nuevo lead
            //$scope.fnEvMDL_NewLead_Save = function () {
            //    let request = [{
            //        TOKEN: $config.token
            //    }, {
            //        VAR01: txt_MDL_LeadsCUD_DNI.value,
            //        VAR02: txt_MDL_LeadsCUD_Nombres.value,
            //        VAR03: txt_MDL_LeadsCUD_Apellidos.value,
            //        VAR04: txt_MDL_LeadsCUD_Edad.value,
            //        VAR05: cbo_MDL_LeadsCUD_Departamento.value,
            //        VAR06: txt_MDL_LeadsCUD_TlfCelular.value,
            //        VAR07: txt_MDL_LeadsCUD_Correo.value,
            //        VAR08: cbo_MDL_LeadsCUD_Interes.value,
            //        VAR09: txt_MDL_LeadsCUD_Modalidad.value,
            //        VAR10: cbo_MDL_LeadsCUD_Campania.value,
            //        VAR11: cbo_MDL_LeadsCUD_Evento.value,
            //        VAR12: cbo_MDL_LeadsCUD_Canal.value,
            //        VAR13: cbo_MDL_LeadsCUD_AsignarA.value,
            //        VAR14: cbo_MDL_LeadsCUD_Asistio.value,
            //        VAR15: $global.user.coduser,
            //        VAR16: '#IP_CLIENTE#',
            //        VAR17: isNewLead ? '' : txt_MDL_LeadsCUD_CreadoPor.getAttribute('id_lead')
            //    }, {
            //        RF: isNewLead ? 'C' : 'U'
            //    }];
            //    $service.LeadsCUD(request, function (result) {
            //        if ($fnValidarServicios(result)) {
            //            $alertbox.show('Lead ' + isNewLead ? 'registrado' : 'editado' + ' exitosamente', 'S', 4);
            //            $$modal('MDL_LeadsCUD').hide();
            //        } else {
            //            $alertbox.show($msg.error.server, "E");
            //        }
            //    });

            //};

            $scope.fnEvMDL_NewLead_Cancel = function () {
                //$$modal('MDL_LeadsCUD').hide();
            };

            //#endregion

            $scope.fnEditLead = function (row, index) {
                let field = $jt['jtse-grid_' + 'grd_LeadsLST'].matrix[index];
                let idLead = field[2];
                //isNewLead = false;
                $scope.ListarLeads('F', idLead, 'U');
                //console.log(idLead);
                
                
            };

            $scope.ocultarModal_CUD = function () {
                $$modal('MDL_LeadsCUD').hide();
            }

            $scope.clearModal_NewLead = function () {
                let column = [];
                for (let i = 0; i < arrControles.length; i++) {
                    column = arrControles[i].split('¦');
                    if (column[1] == 'Evento') $scope.ListarComboEventos();
                    else document.getElementById(column[0] + '_MDL_LeadsCUD_' + column[1]).value = '';
                }

                 //txt_MDL_LeadsCUD_CreadoPor.value = '';
                 ////Datos personales
                 //txt_MDL_LeadsCUD_DNI.value = '';
                 //txt_MDL_LeadsCUD_Nombres.value = '';
                 //txt_MDL_LeadsCUD_Apellidos.value = '';
                 //txt_MDL_LeadsCUD_Edad.value = '';
                 //cbo_MDL_LeadsCUD_Departamento.value = '';
                 //// Datos de contacto
                 //txt_MDL_LeadsCUD_TlfCelular.value = '';
                 //txt_MDL_LeadsCUD_Correo.value = '';
                 ////Interes
                 //cbo_MDL_LeadsCUD_Interes.value = '';
                 //txt_MDL_LeadsCUD_Modalidad.value = '';
                 ////Datos del lead
                 //cbo_MDL_LeadsCUD_Campania.value = '';
                 //cbo_MDL_LeadsCUD_Evento.value = '';
                 //cbo_MDL_LeadsCUD_Canal.value = '';
                 //cbo_MDL_LeadsCUD_AsignarA.value = '';
                 //cbo_MDL_LeadsCUD_Asistio.value = '';
 
                 //$scope.ListarComboEventos() 
            };

            $scope.ListarLeads = function (tipo, idLead = '', accion = '') {
                let request = [{
                    TOKEN: $config.token
                }, {
                    //DATA: tipo == 'R' ? (CHK_FECHA_INICIO.checked ? $formatDateStandar(txt_FECHA_INICIO.value) : '') + '¦' + (CHK_FECHA_FINAL.checked ? $formatDateStandar(txt_FECHA_FINAL.value) : '') : idLead
                    DATA: tipo == 'R' ? (CHK_FECHA_INICIO.checked ? txt_FECHA_INICIO.dateValue : '') + '¦' + (CHK_FECHA_FINAL.checked ? txt_FECHA_FINAL.dateValue : '') : idLead
                }, {
                    RF: tipo
                }]

                $service.LeadsLST(request, function (result) {
                    if ($fnValidarServicios(result)) {
                        let arrData = tipo == 'R' ? result.data.split('¬') : result.data.split('¯');
                        //console.log(arrData);
                        if (tipo == 'R') {
                            if (arrData[0] == '') $$grid('grd_LeadsLST').clearGrid();
                            else $$grid('grd_LeadsLST').setData(arrData);
                        }
                        else {
                            module.goSubPage("LeadsCUD", 'VW-MDL_LeadsCUD', {
                                frmLeads: {
                                    idLead: idLead,
                                    DATA: arrData,
                                    CUD: accion
                                }
                            });
                            $$modal('MDL_LeadsCUD').show();
                        }
                    } else {
                        $alertbox.show($msg.error.server, "E");
                    }
                });
            };

            $scope.listarEvLeav = function (tipo, idCampana = '', idUser = '', idEvento = '') {
                let request = [{
                    VAR00: $config.token,
                }, {
                    //VAR01: (CHK_FECHA_INICIO.checked ? $formatDateStandar(txt_FECHA_INICIO.value) : '') + '¦' + (CHK_FECHA_FINAL.checked ? $formatDateStandar(txt_FECHA_FINAL.value) : ''),
                    VAR01: (CHK_FECHA_INICIO.checked ? txt_FECHA_INICIO.dateValue : '') + '¦' + (CHK_FECHA_FINAL.checked ? txt_FECHA_FINAL.dateValue : ''),
                    VAR02: idCampana,
                    VAR03: idUser,
                    VAR04: idEvento
                }, {
                    VAR05: tipo
                }]
                $service.LeadsLST(request, function (result) {
                    if ($fnValidarServicios(result)) {
                        LST_GRID = tipo == 'R' ? result.data.split('¬') : result.data.split('¯');
                        //console.log(LST_GRID);
                        if (tipo == 'R') {

                            //console.log(, $jt['jtse-grid_grd_LeadsLST'].indexCurrentRange);
                            var vi_indexPage = $jt['jtse-grid_grd_LeadsLST'].indexCurrentPage;
                            if (LST_GRID[0] == '') $$grid('grd_LeadsLST').clearGrid();
                            else {
                                $$grid('grd_LeadsLST').setData(LST_GRID);
                                $$grid('grd_LeadsLST').pagination(vi_indexPage);
                            }
                        }
                        //else {
                        //    module.goSubPage("LeadsCUD", 'VW-MDL_LeadsCUD', {
                        //        frmLeads: {
                        //            idLead: idLead,
                        //            DATA: LST_GRID,
                        //            CUD: accion,
                        //        }
                        //    });
                        //    $$modal('MDL_LeadsCUD').show();
                        //}
                    } else {
                        $alertbox.show($msg.error.server, "E");
                    }
                });
            }
            $scope.fnDeleteLead = function (row, index) {
                $dialog.confirm('¿Está seguro(a) de eliminar el lead seleccionado?', 'Información', 'I', function (rpta) {
                    if (rpta) {
                        let field = $jt['jtse-grid_' + 'grd_LeadsLST'].matrix[index];
                        let idLead = field[2];
                        let request = [{
                            TOKEN: $config.token
                        }, {
                            VAR01: idLead
                        }, {
                            RF: 'D'
                        }];
                        $service.LeadsCUD(request, function (result) {
                            if ($fnValidarServicios(result)) {
                                $alertbox.show('Lead eliminado exitosamente', 'S', 4);
                                $global.user.conexionSocket.send('NOTIFICACIONES¯')
                                $scope.fnListarGRDLead();
                            } else {
                                $alertbox.show($msg.error.server);
                            }
                        });
                    };
                });
            };

            $scope.ListarComboEventos = function (idCampania = '', idEvento = '') {
                let arrEventos = [];
                if (idCampania != '') {
                    let column = [];
                    for (let i = 0; i < $global.lists.EVENTO.length; i++) {
                        column = $global.lists.EVENTO[i].split('¦');
                        if (column[1] == idCampania) arrEventos.push(column[0] + '¦' + column[2]);
                    }
                }
                $fnSetCombo({
                    controlId: 'cbo_MDL_LeadsCUD_Evento',
                    data: idCampania != '' ? arrEventos : [],
                    type: 'S',
                    separator: '¦'
                });

                if (idEvento != '') cbo_MDL_LeadsCUD_Evento.value = idEvento;
            };

            $scope.fnEvVerDetalleLead = function (row, index) {
                let c = [];
                let fields = $jt['jtse-grid_' + 'grd_LeadsLST'].matrix[index];
                let idRegistro = fields[2];
                c.push('<i class="fa fa-eye btn-grid-edit" id="BTN_GRD_VerDetalle_I_' + index + '"  title= "Ver detalle"');
                c.push(' onclick="$jt[\'' + namespace + '\'].fnEvGRD_VerDetalleLead(\'' + index + '\',\'' + idRegistro + '\');" /> ');
                c.push(' </i>');
                return c.join('');
                
            };
           
            $scope.fnEvGRD_VerDetalleLead = function (index, idRegistro) {
                //console.log(idRegistro);                         
                $scope.ListarLeads('F', idRegistro, 'V') 
                
                
            }

            $scope.fnEvEstadoLead = function (row, index) {
                //let c = [];
                //let fields = $jt['jtse-grid_' + 'grd_LeadsLST'].matrix[index];
                ////let arrEstado = $global.lists.COMENTARIO_ESTADO;
                //let estado = fields[12];
                //let column = [];
                //for (let i = 0; i < $global.lists.ESTADO.length; i++) {
                //    column = $global.lists.ESTADO[i].split('¦');
                //    if (estado == column[1]) {
                //        c.push('<span class="text-left">' + column[1] + '</span>');
                //    }
                //}
                //return c.join('');

                var c = [];
                c.push('<span');
                if (row.ESTADO.trim() === 'Contactar') {
                    c.push(' class="span-Contactar" ');
                    c.push('>');
                } else if (row.ESTADO.trim() === 'Seguimiento') {
                    c.push(' class="span-Seguimiento" ');
                    c.push('>');
                } else if (row.ESTADO.trim() === 'No contesta') {
                    c.push(' class="span-No_contesta" ');
                    c.push('>');
                } else if (row.ESTADO.trim() === 'No accesible') {
                    c.push(' class="span-No_accesible" ');
                    c.push('>');
                } else if (row.ESTADO.trim() === 'No interesado/a') {
                    c.push(' class="span-No_interesado" ');
                    c.push('>');
                } else if (row.ESTADO.trim() === 'Volver a llamar') {
                    c.push(' class="span-Volver_llamar" ');
                    c.push('>');
                } else if (row.ESTADO.trim() === 'Interesado') {
                    c.push(' class="span-Interesado" ');
                    c.push('>');
                } else if (row.ESTADO.trim() === 'Hot') {
                    c.push(' class="span-Hot" ');
                    c.push('>');
                } else if (row.ESTADO.trim() === 'Postulante') {
                    c.push(' class="span-Postulante" ');
                    c.push('>');
                } else if (row.ESTADO.trim() === 'Matriculado') {
                    c.push(' class="span-Matriculado" ');
                    c.push('>');
                } else if (row.ESTADO.trim() === 'Cursos y programas') {
                    c.push(' class="span-Cursos_programas" ');
                    c.push('>');
                } else {
                    c.push(' class="span-Default" ');
                    c.push('>');
                }
                c.push(row.ESTADO.trim());
                c.push('</span>');


                return c.join('');
            }

            $scope.fijarCabeceraGrilla = function () {
                let grd = document.getElementById('grd_LeadsLST');
                //console.log(grd.getElementsByTagName("thead"));
                let thead = grd.getElementsByTagName("thead")[0];
                let theadFiltro = grd.getElementsByTagName("thead")[1];
                let column = thead.getElementsByTagName("th");
                let columnFiltro = theadFiltro.getElementsByTagName("td");
                let contenedorGrilla = grd.getElementsByClassName('scroll-x w-100')[0];
                contenedorGrilla.style.maxHeight = "calc(100vh - 300px)";
                //contenedorGrilla.style.maxHeight = '307px !important';
                contenedorGrilla.style.overflowY = 'auto';
                for (let i = 0; i < column.length; i++) {
                    column[i].style.position = 'sticky';
                    column[i].style.top = '0px';
                    column[i].style.zIndex = column[i].classList.contains('fixedHeader') ? '7' : '6';
                    columnFiltro[i].style.position = 'sticky';
                    columnFiltro[i].style.top = '25px';
                    columnFiltro[i].style.zIndex = '6';
                    columnFiltro[i].style.backgroundColor = '#FFFFFF';
                }
            };

            $scope.FnGuardarEstadoComentario = function (ID, ID_ESTADO, pantalla = '') {

                if (pantalla == 'Main') {
                    $scope.fnListarGRDLead();
                } else {
                    //
                    var vi_indexPage = $jt['jtse-grid_' + 'grd_LeadsLST'].indexCurrentPage

                    var nRegi = LST_GRID.length;
                    var columns = [];
                    for (var i = 0; i < nRegi; i++) {
                        columns = LST_GRID[i].split('¦');
                        if (columns[2] == ID) {
                            columns[12] = ID_ESTADO;
                            LST_GRID[i] = columns.join('¦');
                        }
                    }
                    //console.log(LST_GRID)
                    $$grid('grd_LeadsLST').setData(LST_GRID);
                    $$grid('grd_LeadsLST').pagination(vi_indexPage);
                }
               


            }
        };
        controller.$inject = ["$scope", "$service"];
        module.controller(namespace, controller, service);
    });