define([$appName,
    "MetricaEventos", ["CAMPANIA", "EVENTO"]
], function (module, namespace, args) {
    "use strict";
    var service = function ($service, $http) {
        $service.metricasEventosListas = function (item, callback) {
            return $http({
                url: "MetricasEventos/Listar",
                data: item,
                method: "post",
                callback: callback
            });
        };
      
    };

    var controller = function ($scope, $service) {
        var isNew = false;
        var metricasEventosListas = [];
        let arrGRDEventos = [];
    
        $scope.init = function () {
            $scope.configurarControles();
            $scope.cargarDatos();
            $scope.configurarEventos();
            $scope.cargarCombos();
        };
        $scope.configurarControles = function () {
            let _btnOptions = {};
            let _showColumns = [];
            let _showColumnsExport = [];
            let _columnProperties = [];

            _columnProperties = [{
                index: 0,
                header: "Evento",
                propertie: "evento",
                /*typeData: "S",*/
                sortHeader: true,
                width: 33,
                columnExport: true,
            },
            {
                index: 1,
                header: "% Asistentes Evento",
                propertie: "asistentesEvento",
                typeData: "S_C",
                sortHeader: true,
                width: 33,
                columnExport: true,
            },
            {
                index: 2,
                header: "% Clientes Evento",
                propertie: "matriculadosEvento",
                typeData: "S_C",
                sortHeader: true,
                width: 33,
                columnExport: true,
            }],
            _btnOptions = {
                btnid: [],
                names: [],
                icons: [],
                class: [],
                fnEvents: []
            };

            $$grid('grd_Metricas_Eventos').create({
                columnProperties: _columnProperties,
                //headers: ['Evento', '% Asistentes Evento', '% Matriculados Evento'],
                //properties: ['evento', 'asistentesEvento', 'matriculadosEvento'],
                //typesData: ['S', 'S_C', 'S_C'],
                //typesFilter: ['', '', ''],
                //sortHeader: [true, true, true],
                //showColumns: [true, true, true],
                //widths: [35, 35, 35],
                //indexs: [0, 1, 2],
                headerStyle: $controls.grid.headerStyle,
                data: [],
                borderTop: false,
                btnNew: false,
                btnEdit: false,
                btnDelete: false,
                btnDeleteMultiple: false,
                btnRefresh: true,
                btnExportExcel: $global.permission.excel,
                filterPosition: '',
                generalFilter: true,
                entriesPage: 15,
                rangePage: 5,
                separator: '¦',
                fnBtnNew: '',
                fnBtnEdit: '',
                fnBtnDelete: '',
                fnBtnDeleteMultiple: '',
                fnBtnRefresh: 'listarMetricasEventos',
                /*fnExtensions: ['', '', ''],*/
                namespace: namespace
            });      
        }
        $scope.cargarDatos = function () {
            $scope.listarMetricasEventos();
            $scope.cargarCombos();
        };

        $scope.configurarEventos = function () {
            cbo_LeadsNombre_Campania.onchange = function () {
                let idCampania = cbo_LeadsNombre_Campania.value;
                $scope.ListarComboEventosGrilla(idCampania);
               
            };

            cbo_LeadsNombre_Evento.onchange = function () {
                let idEvento = cbo_LeadsNombre_Evento.value;
                $scope.ListarEventosGrilla(idEvento);
            }

            
        };
       
        $scope.listarMetricasEventos = function () {
            var request = [{
                VAR00: $config.token,
            }, {
                    VAR01: ''
            }, {
                VAR03: 'R'
            }];
            $service.metricasEventosListas(request, function (d) {
                if (d.success) {
                    if (d.data != '') {                       
                        metricasEventosListas = d.data.split('¬');
                        /*$$grid('grd_Metricas_Eventos').setData(metricasEventosListas);*/
                    }

                }
            });
        };
       
        $scope.cargarCombos = function () {
            $fnSetCombo({
                controlId: 'cbo_LeadsNombre_Campania',
                data: $global.lists.CAMPANIA,
                type: 'S',
                separator: '¦'
            });
        };


        
        $scope.ListarComboEventosGrilla = function (idCampania = '', idEvento = '') {
            
            let arrEventos = [];
            if (idCampania != '') {
                let column = [];
                for (let i = 0; i < $global.lists.EVENTO.length; i++) {
                    column = $global.lists.EVENTO[i].split('¦');
                    if (column[1] == idCampania) arrEventos.push(column[0] + '¦' + column[2]);
                }
                arrGRDEventos = [];
                let columnE = [];
                let asistentesEvento = '';
                let matriculadosEvento = '';

                let TotalLeadsCampanaEv = 0; 
                let TotalLeadsMatriculadosEv = 0;
                let MatriculadosCampana = '';

                for (let i = 0; i < metricasEventosListas.length; i++) {
                    columnE = metricasEventosListas[i].split('¦');
                    if (columnE[1] == idCampania) {

                        TotalLeadsCampanaEv += columnE[3] * 1; /*Leads Total Campaña */
                        TotalLeadsMatriculadosEv += columnE[4] * 1 /*Leads Total solo matriculados */
                        

                        if ((columnE[3] == '0')) {

                            asistentesEvento = '0.00';
                            matriculadosEvento = '0.00';


                        } else {
                            if (columnE[4] != '0') {
                                asistentesEvento = $frDecimal((((columnE[3] - columnE[4]) / columnE[3]) * 100), 2);
                                matriculadosEvento = $frDecimal(((columnE[4] / columnE[3]) * 100), 2);

                                

                            } else {
                                asistentesEvento = '100.00';
                                matriculadosEvento = '0.00';

                            }
                            
                        }
                        arrGRDEventos.push(columnE[2] + '¦' + asistentesEvento + '%' + '¦' + matriculadosEvento + '%');
                        
                    }
                }
                if (TotalLeadsCampanaEv == '0' ) {
                    MatriculadosCampana = '0.00';
                    spnMatriculadosCAMPANIA.innerHTML = MatriculadosCampana + "%";
                } else {
                    if (TotalLeadsMatriculadosEv != '0') {
                        MatriculadosCampana = $frDecimal(((TotalLeadsMatriculadosEv / TotalLeadsCampanaEv) * 100), 2);
                        spnMatriculadosCAMPANIA.innerHTML = MatriculadosCampana + "%";
                    } else {
                        MatriculadosCampana = '0.00';
                        spnMatriculadosCAMPANIA.innerHTML = MatriculadosCampana + "%";
                    }
                    
                }
                $$grid('grd_Metricas_Eventos').setData(arrGRDEventos);
            }

            $fnSetCombo({
                controlId: 'cbo_LeadsNombre_Evento',
                data: idCampania != '' ? arrEventos : [],
                type: 'T',
                separator: '¦'
            });

            if (idEvento != '') cbo_MDL_LeadsCUD_Evento.value = idEvento;
            
        };
        $scope.ListarEventosGrilla = function (idEvento = '') {
            let arrGRDEv = [];
            let columnE = [];
            let asistentesEvento = '';
            let matriculadosEvento = '';
            if (idEvento != '') {
                for (let i = 0; i < metricasEventosListas.length; i++) {
                    columnE = metricasEventosListas[i].split('¦');
                    if (columnE[0] == idEvento) {

                        if ((columnE[3] == '0')) {

                            asistentesEvento = '0.00';
                            matriculadosEvento = '0.00';

                        } else {
                            if (columnE[4] != '0') {
                                asistentesEvento = $frDecimal((((columnE[3] - columnE[4]) / columnE[3]) * 100), 2);
                                matriculadosEvento = $frDecimal(((columnE[4] / columnE[3]) * 100), 2);
                            } else {
                                asistentesEvento = '100.00';
                                matriculadosEvento = '0.00';
                            }

                        }
                        arrGRDEv.push(columnE[2] + '¦' + asistentesEvento + '%' + '¦' + matriculadosEvento + '%');
                    }
                }

                $$grid('grd_Metricas_Eventos').setData(arrGRDEv);
            } else {
                $$grid('grd_Metricas_Eventos').setData(arrGRDEventos);
            }
            
        }

        
    }
    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
});