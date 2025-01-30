define([$appName,
    "Dashboard"
], function (module, namespace, args) {
    "use strict";
    var service = function ($service, $http) {
        $service.DASHBOARD_ASESORIA = function (item, callback) {
            return $http({
                url: "Generic/DASHBOARD_ASESORIA",
                data: item,
                method: "post",
                callback: callback
            });
        };
    };
    var controller = function ($scope, $service) {       
        var LST_MESES = ['1¦Enero', '2¦Febrero', '3¦Marzo', '4¦Abril', '5¦Mayo', '6¦Junio', '7¦Julio', '8¦Agosto', '9¦Setiembre', '10¦Octubre', '11¦Noviembre', '12¦Diciembre']
        $scope.init = function () {
            $scope.configurarControles();
            $scope.cargarDatos();
            $scope.configurarEventos();
        };
        $scope.configurarControles = function () {
            //#region Grillas de prueba
            //$$grid('GRD_PuntajeGeneral').create({
            //    headers: ['Actual', 'Anterior', 'Diferencia'],
            //    properties: ['COL_1', 'COL_2', 'COL_3'],
            //    typesData: ['DE', 'DE', 'DE'],
            //    typesFilter: ['A', 'A', 'A'],
            //    //typesFilterShow: false, --Revisar funcion completa error provacado con setData
            //    sortHeader: [true, true, true],
            //    showColumns: [true, true, true],
            //    widths: [33, 33, 33],
            //    indexs: [0, 1, 2],
            //    headerStyle: 'background-color: #bf83b9 !important; color: #fff !important;',
            //    data: dato,
            //    borderTop: false,
            //    toolbarDesign: true,
            //    btnNew: false,
            //    btnEdit: false,
            //    btnDelete: false,
            //    btnDeleteMultiple: false,
            //    btnRefresh: true,
            //    btnExportExcel: false,
            //    filterPosition: 'UP',
            //    generalFilter: false,
            //    entriesPage: 15,
            //    rangePage: 5,
            //    separator: '¦',
            //    fnBtnNew: '',
            //    fnBtnEdit: '',
            //    fnBtnDelete: '',
            //    fnBtnDeleteMultiple: '',
            //    fnBtnRefresh: '',
            //    fnExtensions: ['', '', '', ''],
            //    namespace: namespace
            //});
            //$$grid('GRD_PuntajeGeneral1').create({
            //    headers: ['Actual', 'Anterior', 'Diferencia'],
            //    properties: ['COL_1', 'COL_2', 'COL_3'],
            //    typesData: ['DE', 'DE', 'DE'],
            //    typesFilter: ['A', 'A', 'A'],
            //    typesFilterShow: false,
            //    sortHeader: [true, true, true],
            //    showColumns: [true, true, true],
            //    widths: [33, 33, 33],
            //    indexs: [0, 1, 2],
            //    headerStyle: 'background-color: #22bcb9 !important; color: #fff !important;',
            //    data: ['3.18¦3.17¦0.01', '7.15¦4.18¦2.97'],
            //    borderTop: false,
            //    toolbarDesign: true,
            //    btnNew: false,
            //    btnEdit: false,
            //    btnDelete: false,
            //    btnDeleteMultiple: false,
            //    btnRefresh: true,
            //    btnExportExcel: false,
            //    filterPosition: 'UP',
            //    generalFilter: false,
            //    entriesPage: 15,
            //    rangePage: 5,
            //    separator: '¦',
            //    fnBtnNew: '',
            //    fnBtnEdit: '',
            //    fnBtnDelete: '',
            //    fnBtnDeleteMultiple: '',
            //    fnBtnRefresh: '',
            //    fnExtensions: ['', '', '', ''],
            //    namespace: namespace
            //});
            //$$grid('GRD_PuntajeGeneral2').create({
            //    headers: ['Actual', 'Anterior', 'Diferencia'],
            //    properties: ['COL_1', 'COL_2', 'COL_3'],
            //    typesData: ['DE', 'DE', 'DE'],
            //    typesFilter: ['A', 'A', 'A'],
            //    typesFilterShow: false,
            //    sortHeader: [true, true, true],
            //    showColumns: [true, true, true],
            //    widths: [33, 33, 33],
            //    indexs: [0, 1, 2],
            //    headerStyle: 'background-color: #c4b000 !important; color: #fff !important;',
            //    data: ['3.18¦3.17¦0.01', '7.15¦4.18¦2.97'],
            //    borderTop: false,
            //    toolbarDesign: true,
            //    btnNew: false,
            //    btnEdit: false,
            //    btnDelete: false,
            //    btnDeleteMultiple: false,
            //    btnRefresh: true,
            //    btnExportExcel: false,
            //    filterPosition: 'UP',
            //    generalFilter: false,
            //    entriesPage: 15,
            //    rangePage: 5,
            //    separator: '¦',
            //    fnBtnNew: '',
            //    fnBtnEdit: '',
            //    fnBtnDelete: '',
            //    fnBtnDeleteMultiple: '',
            //    fnBtnRefresh: '',
            //    fnExtensions: ['', '', '', ''],
            //    namespace: namespace
            //});
            //#endregion

            $$grid('GRD_Dashboard_AsociadoCategoriaCantidad').create({
                headers: ['Asociado Categorías', 'Cantidad'],
                properties: ['COL_1', 'COL_2'],
                typesData: ['S', 'N'],
                typesFilter: ['A', 'A'],
                sortHeader: [true, true],
                showColumns: [true, true],
                widths: [60, 40],
                indexs: [0, 1],
                headerStyle: 'background-color:#71b790 !important; color: #fff !important;',
                data: [],
                borderTop: false,
                toolbarDesign: true,
                btnNew: false,
                btnEdit: false,
                btnDelete: false,
                btnDeleteMultiple: false,
                btnRefresh: true,
                btnExportExcel: false,
                filterPosition: '',
                generalFilter: false,
                entriesPage: 15,
                rangePage: 5,
                separator: '¦',
                fnBtnNew: '',
                fnBtnEdit: '',
                fnBtnDelete: '',
                fnBtnDeleteMultiple: '',
                fnBtnRefresh: '',
                fnExtensions: ['', ''],
                namespace: namespace,
                showBottom: false,
                pagination: false,
            });
            $$grid('GRD_Dashboard_EmpresasFasesActivate').create({
                headers: ['Empresas en fases - Activate', 'Cliente no ha cargado', 'Pendiente por revisar', 'Validado'],
                properties: ['COL_1', 'COL_2', 'COL_3', 'COL_4'],
                typesData: ['S', 'N', 'N', 'N'],
                typesFilter: ['A', 'A', 'A', 'A'],
                sortHeader: [true, true, true, true],
                showColumns: [true, true, true, true],
                widths: [40, 20, 20, 20],
                indexs: [0, 1, 2, 3],
                headerStyle: 'background-color: #22bcb9 !important; color: #fff !important;',
                data: [],
                borderTop: false,
                toolbarDesign: true,
                btnNew: false,
                btnEdit: false,
                btnDelete: false,
                btnDeleteMultiple: false,
                btnRefresh: true,
                btnExportExcel: false,
                filterPosition: '',
                generalFilter: false,
                entriesPage: 15,
                rangePage: 5,
                separator: '¦',
                fnBtnNew: '',
                fnBtnEdit: '',
                fnBtnDelete: '',
                fnBtnDeleteMultiple: '',
                fnBtnRefresh: '',
                fnExtensions: ['', ''],
                namespace: namespace,
                showBottom: false,
                pagination: false,
            });

            $$grid('GRD_Dashboard_AsociadosxEjecutiva').create({
                headersGroup: ['', 'Registro', 'Documento', 'Pago'],
                colspan: [1, 2, 2, 2],
                headers: ['Asociado por Ejecutiva', 'Cliente no ha cargado', 'Pendiente por revisar', 'Cliente no ha cargado', 'Pendiente por revisar', 'Cliente no ha cargado', 'Pendiente por revisar'],
                properties: ['COL_1', 'COL_2', 'COL_3', 'COL_4', 'COL_5', 'COL_6', 'COL_7'],
                typesData: ['S', 'N', 'N', 'N', 'N', 'N', 'N'],
                typesFilter: ['A', 'A', 'A', 'A', 'A', 'A', 'A'],
                sortHeader: [true, true, true, true, true, true, true],
                showColumns: [true, true, true, true, true, true, true],
                widths: [30, 12, 12, 12, 12, 12, 12],
                indexs: [0, 1, 2, 3, 4, 5, 6],
                headerStyle: 'background-color:#71b790 !important; color: #fff !important;',
                data: [],
                borderTop: false,
                toolbarDesign: true,
                btnNew: false,
                btnEdit: false,
                btnDelete: false,
                btnDeleteMultiple: false,
                btnRefresh: true,
                btnExportExcel: false,
                filterPosition: '',
                generalFilter: false,
                entriesPage: 15,
                rangePage: 5,
                separator: '¦',
                fnBtnNew: '',
                fnBtnEdit: '',
                fnBtnDelete: '',
                fnBtnDeleteMultiple: '',
                fnBtnRefresh: '',
                fnExtensions: ['', ''],
                namespace: namespace,
                showBottom: false,
                pagination: false,
            });
            $$grid('GRD_Dashboard_AsociadosxEjecutiva_').create({
                headersGroup: ['', 'Registro', 'Documento', 'Pago', ''],
                colspan: [1, 3, 3, 3, 1],
                headers: ['Asociado por Ejecutiva', 'Cliente no ha cargado', 'Pendiente por revisar', 'Validado', 'Cliente no ha cargado', 'Pendiente por revisar', 'Validado', 'Cliente no ha cargado', 'Pendiente por revisar', 'Validado', 'Asociados Activate'],
                properties: ['COL_1', 'COL_2', 'COL_3', 'COL_4', 'COL_5', 'COL_6', 'COL_7', 'COL_8', 'COL_9', 'COL_10', 'COL_11'],
                typesData: ['S', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
                typesFilter: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
                sortHeader: [true, true, true, true, true, true, true, true, true, true, true],
                showColumns: [true, true, true, true, true, true, true, true, true, true, true],
                widths: [20, 8, 8, 8, 8, 8, 8, 8, 8, 8, 10],
                indexs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                headerStyle: 'background-color:#71b790 !important; color: #fff !important;',
                data: [],
                borderTop: false,
                toolbarDesign: true,
                btnNew: false,
                btnEdit: false,
                btnDelete: false,
                btnDeleteMultiple: false,
                btnRefresh: true,
                btnExportExcel: false,
                filterPosition: '',
                generalFilter: false,
                entriesPage: 15,
                rangePage: 5,
                separator: '¦',
                fnBtnNew: '',
                fnBtnEdit: '',
                fnBtnDelete: '',
                fnBtnDeleteMultiple: '',
                fnBtnRefresh: '',
                fnExtensions: ['', ''],
                namespace: namespace,
                showBottom: false,
                pagination: false,
            });
        };
        $scope.cargarDatos = function () {
            if (args) {

            }
            $scope.listarDatos();
            $scope.cargarCombosGRID();
        };
        $scope.listarDatos = function () {
            var request = [{
                VAR00: $config.token,
            }, {
                VAR01: '',
            }, {
                VAR99: 'A'
            }]
            $service.DASHBOARD_ASESORIA(request, function (d) {
                if (d.success) {
                    if (d.data != '') {
                        var DATOS = d.data.split('¯');
                        //$scope.cargarNumero(DATOS[0], 'SPN_DASHBORAD_ASOCACTIVOS')
                        SPN_DASHBORAD_ASOCACTIVOS.innerHTML = DATOS[0];
                        SPN_DASHBORAD_ASOCACTIVAT.innerHTML = DATOS[1];
                        SPN_DASHBORAD_PREFDISPONI.innerHTML = DATOS[2];
                        SPN_DASHBORAD_GTIN13.innerHTML = DATOS[3];
                        $$grid('GRD_Dashboard_AsociadoCategoriaCantidad').setData(DATOS[4].split('¬'));
                        $$grid('GRD_Dashboard_EmpresasFasesActivate').setData(DATOS[5].split('¬'));
                        $$grid('GRD_Dashboard_AsociadosxEjecutiva').setData(DATOS[6].split('¬'));
                    } else {
                        $alertbox.show($msg.error.procedure, 'E');
                    }
                } else {
                    $alertbox.show($msg.error.server, 'E');
                }
            });
        }
        $scope.configurarEventos = function () {
            //ACC_1.onclick =
            //    ACC_2.onclick =
            //    ACC_3.onclick = function () {
            //        var ID = this.getAttribute('for');
            //        ID = ID.substr(-1);
            //        if (document.getElementById("spn_" + ID).className == 'icon fa fa-plus pull-right') {
            //            setTimeout(function () {
            //                document.getElementById("spn_" + ID).setAttribute("class", "icon fa fa-minus pull-right");
            //            }, 200);
            //        } else {
            //            setTimeout(function () {
            //                document.getElementById("spn_" + ID).setAttribute("class", "icon fa fa-plus pull-right");
            //            }, 200);
            //        }
            //    }

        };
        $scope.cargarNumero = function (NUMERO, CTRL) {
            var ID = document.getElementById(CTRL);
            ID.innerHTML = '0';
            var n = parseInt((NUMERO * 1) + 1);
            for (var i = 0; i < n; i++) {
                setTimeout((100));
                ID.innerHTML = i
            }
        }
        $scope.cargarCombosGRID = function () {
            var RPT = $scope.BuscarAños().split('_');
            var Año = RPT[0];
            var Años = RPT[1];
            $fnSetCombo({
                controlId: 'CBO_Dashboard_IngresoXServicioAso_Año',
                data: Años.split('¬'),
                type: 'S',
                separator: '¦'
            });
            $fnSetCombo({
                controlId: 'CBO_Dashboard_IngresoXServicioAso_Mes',
                data: LST_MESES,
                type: 'S',
                separator: '¦'
            });
            CBO_Dashboard_IngresoXServicioAso_Año.value = Año;
            CBO_Dashboard_IngresoXServicioAso_Mes.value = RPT[2];
        }
        $scope.BuscarAños = function () {
            var Fecha = new Date();
            var Año = Fecha.getFullYear();
            var Year = parseInt(Año);
            var MES = Fecha.getMonth();
            var c = [];
            var N = 0;
            for (var i = 0; i < 5; i++) {
                N = Year - i;
                c.push(N + '¦' + N);
            }
            return Year + '_' + c.join('¬') + '_' + MES;
        };
    };
    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
});
/*
 let dataTrig = $('.accordion__item h4');

    for (let i = 0; i < dataTrig.length; i ++) {
        let id = dataTrig[i].getAttribute('data-trig'),
            trigger = $('.accordion__item h4[data-trig="' + id + '"]'),
            content = $('.accordion__item > div[data-trig="' + id + '"]');

        trigger.on('click', function () {
            content.slideToggle(300);
            $(this).toggleClass('active');
        })
    }
});
*/