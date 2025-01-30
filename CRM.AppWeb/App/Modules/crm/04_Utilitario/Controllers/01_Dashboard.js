define([$appName,
    "01_Dashboard"
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
        var dato = ['3.18¦3.17¦0.01', '7.15¦4.18¦2.97'];
        var LST_MESES = ['1¦Enero', '2¦Febrero', '3¦Marzo', '4¦Abril', '5¦Mayo', '6¦Junio', '7¦Julio', '8¦Agosto', '9¦Setiembre', '10¦Octubre', '11¦Noviembre', '12¦Diciembre']
        $scope.init = function () {
            $scope.configurarControles();
            $scope.cargarDatos();
            $scope.configurarEventos();
        };
        $scope.configurarControles = function () {
            $$grid('GRD_01_Dashboard_AsociadoCategoriaCantidad').create({
                headers: ['Asociado Categorías', 'Cantidad'],
                properties: ['COL_1', 'COL_2'],
                typesData: ['S', 'NE'],
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
            $$grid('GRD_01_Dashboard_EmpresasFasesActivate').create({
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

            $$grid('GRD_01_Dashboard_AsociadosxEjecutiva').create({
                headersGroup: ['', 'Registro', 'Documento', 'Pago'],
                colspan: [1, 1, 2, 2],
                headers: ['Asociado por Ejecutiva', 'Cliente no ha cargado', 'Pendiente por revisar', 'Validado', 'Rechazado', 'Cliente no ha cargado', 'Pendiente por revisar', 'Validado', 'Rechazado', 'Cliente no ha cargado', 'Pendiente por revisar', 'Validado', 'Rechazado'],
                properties: ['COL_1', 'COL_2', 'COL_3', 'COL_4', 'COL_5', 'COL_6', 'COL_7', 'COL_8', 'COL_9', 'COL_10', 'COL_11', 'COL_12', 'COL_13'],
                typesData: ['S', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
                typesFilter: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
                sortHeader: [true, true, true, true, true, true, true, true, true, true, true, true, true],
                showColumns: [true, false, true, false, false, true, true, false, false, true, true, false, false],
                //showColumns: [true, true, true, true, true, true, true, true, true, true, true, true, true],
                widths: [20, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                indexs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
            $alertbox.create({});
            if (args) {

            }
            
            $scope.cargarCombosGRID();
            $scope.listarDatos('');
        };
        $scope.listarDatos = function (ESTADO) {
            var request = [{
                VAR00: $config.token,
            }, {
                VAR01: CBO_01_Dashboard_IngresoXServicioAso_Año.value,
                VAR02: CBO_01_Dashboard_IngresoXServicioAso_Mes.value,
                VAR03: ESTADO,
            }, {
                VAR99: 'A'
            }]
            $service.DASHBOARD_ASESORIA(request, function (d) {
                if (d.success) {
                    if (d.data != '') {
                        if (ESTADO != '') {
                            $scope.LlenarDataTablaDinamica(d.data);
                        } else {
                            var DATOS = d.data.split('¯');
                            //$scope.cargarNumero(DATOS[0], 'SPN_01_Dashboard_ASOCACTIVOS')
                            SPN_01_Dashboard_ASOCACTIVOS.innerHTML = $frDecimal((DATOS[0].replace(/,/g, '')), 0);
                            //SPN_01_Dashboard_ASOCACTIVAT.innerHTML = $frDecimal((DATOS[1].replace(/,/g, '')), 0);
                            SPN_01_Dashboard_PREFDISPONI.innerHTML = $frDecimal((DATOS[2].replace(/,/g, '')), 0);
                            SPN_01_Dashboard_GTIN13.innerHTML = $frDecimal((DATOS[3].replace(/,/g, '')), 0);
                            $$grid('GRD_01_Dashboard_AsociadoCategoriaCantidad').setData(DATOS[4].split('¬'));
                            $$grid('GRD_01_Dashboard_EmpresasFasesActivate').setData(DATOS[5].split('¬'));
                            $$grid('GRD_01_Dashboard_AsociadosxEjecutiva').setData(DATOS[6].split('¬'));
                            $scope.LlenarDataTablaDinamica(DATOS[7]);
                            if (DATOS[8] != '') {
                                $scope.cargarAsociadosEstados(DATOS[8]);                                
                            }
                            if (DATOS[1] != '') {
                                $scope.cargarAsociadosActivate(DATOS[1]);                                
                            }
                            SPN_01_Dashboard_GTIN08.innerHTML = $frDecimal((DATOS[9].replace(/,/g, '')), 0);
                            SPN_01_Dashboard_PREFDISPONI06.innerHTML = $frDecimal((DATOS[10].replace(/,/g, '')), 0);

                        }
                    } else {
                        if (ESTADO != '') {
                            $scope.LlenarDataTablaDinamica(d.data);
                        } else {
                            $alertbox.show($msg.error.procedure, 'E');
                        }
                    }
                } else {
                    $alertbox.show($msg.error.server, 'E');
                }
            });
        }
        $scope.configurarEventos = function () {
            CBO_01_Dashboard_IngresoXServicioAso_Año.onchange = function () {
                $scope.listarDatos('R');
            };
            CBO_01_Dashboard_IngresoXServicioAso_Mes.onchange = function () {
                $scope.listarDatos('R');
            };
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
                controlId: 'CBO_01_Dashboard_IngresoXServicioAso_Año',
                data: Años.split('¬'),
                type: 'S',
                separator: '¦'
            });
            $fnSetCombo({
                controlId: 'CBO_01_Dashboard_IngresoXServicioAso_Mes',
                data: LST_MESES,
                type: 'S',
                separator: '¦'
            });
            CBO_01_Dashboard_IngresoXServicioAso_Año.value = Año;
            CBO_01_Dashboard_IngresoXServicioAso_Mes.value = RPT[2];
        }
        $scope.BuscarAños = function () {
            var Fecha = new Date();
            var Año = Fecha.getFullYear();
            var Year = parseInt(Año);
            var MES = Fecha.getMonth() + 1;
            var c = [];
            var N = 0;
            for (var i = 0; i < 5; i++) {
                N = Year - i;
                c.push(N + '¦' + N);
            }
            return Year + '_' + c.join('¬') + '_' + MES;
        };

        $scope.LlenarDataTablaDinamica = function (LISTA) {
            var c = [];
            var VI_ARR = LISTA.split('¬');
            var N = VI_ARR.length;
            var VI_COLUMNS = [];
            var TOTAL = 0.00;
            if (LISTA != "") {
                for (var i = 0; i < N; i++) {
                    VI_COLUMNS = VI_ARR[i].split('¦');
                    c.push('<tr>');
                    c.push('<th>' + VI_COLUMNS[0] + '</th>');
                    c.push('<td style="text-align: center">S/</td>')
                    c.push('<td style="text-align: right">' + $frDecimal((VI_COLUMNS[1].replace(/,/g, '')), 2) + '</td>')
                    c.push('</tr>');
                    TOTAL = TOTAL + (VI_COLUMNS[1] * 1.00);
                }
            }
            c.push('<tr>');
            c.push('<th>TOTAL</th>');
            c.push('<td style="text-align: center">S/</td>')
            c.push('<td style="text-align: right">' + $frDecimal(TOTAL, 2)  + '</td>')
            c.push('</tr>');
            document.getElementById('TBody_GRD_01_Dashboard_IngresoXServicioAso').innerHTML = c.join('');
        };

        $scope.cargarAsociadosEstados = function (data) {
            var Estados = data.split('¬')
            var c = [];            
            var Column = [];
            
            for (var i = 0; i < Estados.length; i++) {
                Column = Estados[i].split('¦');
                c.push('<div class="widget-chart-content displey-flex">');
                c.push('<div class="widget-content-title font-size ">' + Column[1]+'</div>');
                c.push('<div class="widget-content-right">');
                c.push('<div class="widget-numbers font-size "><span>' + Column[0] +'</span></div>');             
                c.push('</div>');
                c.push('</div>');
            }
                       
            if (document.getElementById('DIV_ASOCIADOS_ESTADOS')) {
                DIV_ASOCIADOS_ESTADOS.innerHTML = c.join('');
            }

        };
        $scope.cargarAsociadosActivate = function (data) {
            var Asociados = data.split('¬')
            var c = [];
            var Column = [];

            for (var i = 0; i < Asociados.length; i++) {
                Column = Asociados[i].split('¦');
                c.push('<div class="widget-chart-content displey-flex">');
                c.push('<div class="widget-content-title font-size ">' + Column[1] + '</div>');
                c.push('<div class="widget-content-right">');
                c.push('<div class="widget-numbers font-size "><span>' + Column[0] + '</span></div>');
                c.push('</div>');
                c.push('</div>');
            }

            if (document.getElementById('DIV_ASOCIADOS_ACTIVATE')) {
                DIV_ASOCIADOS_ACTIVATE.innerHTML = c.join('');
            }

        };
    };
    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
});