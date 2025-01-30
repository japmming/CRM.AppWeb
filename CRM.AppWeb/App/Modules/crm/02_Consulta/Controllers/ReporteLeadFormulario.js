define([$appName,
    "ReporteLeadFormulario", ["CAMPANIA", "EVENTO", "LIST_EJECUTIVOS_CON_LEADS", "LIST_USUARIO_ASESOR_SUPERVISOR","LIST_USUARIO_NOMBRE"]
], function (module, namespace, args) {
    "use strict";
    var service = function ($service, $http) {
        $service.CoMetrLista = function (item, callback) {
            return $http({
                url: "ReporteLeadFormulario/ListarReporteFormulario",
                data: item,
                method: "post",
                callback: callback
            });
        };
    };

    var controller = function ($scope, $service) {
        var FechaActual = new Date();
        let contador = 1;
        let ncontador = 0;
        let VL_ARRA_ESTADOS = [];
        let VL_ID_USUARIO_ANTE = "";
        let VL_ID_ESTADO = "";
        $scope.init = function () {
            $scope.configurarControles();
            $scope.cargarDatos();
            $scope.cargarCombos();
            $scope.configurarEventos();
        }

        $scope.configurarControles = function () {

        };


        $scope.cargarDatos = function () {
            $fnValidarCampos({
                containers: ['frmLeadsLST']
            });


            var FechaActual = new Date();
            //txt_FECHA_INICIO.value = $frConvertToDateString(FechaActual);
            txt_FECHA_INICIO.dateValue = $frConvertToDateString(new Date(FechaActual.getFullYear(), FechaActual.getMonth(), 1));
            txt_FECHA_FINAL.dateValue = $frConvertToDateString(FechaActual);
            $scope.listarReFormulario();


        }

        $scope.listarReFormulario = function () {
            var request = [{
                token: $config.token,
            }, {
                ID_CAMPANA: cbo_LeadsNombre_Campania.value,
                ID_EVENTO: cbo_LeadsNombre_Evento.value,               
                FCH_INICIO: CHK_FECHA_INICIO.checked ? txt_FECHA_INICIO.dateValue : '',
                FCH_FINAL: CHK_FECHA_FINAL.checked ? txt_FECHA_FINAL.dateValue : '',
                EJECUTIVO: cbo_LeadsNombre_Ejecutivo.value,

            }, {
                RF: 'R'
            }];
            $service.CoMetrLista(request, function (d) {
                if (d.success) {
                    if (d.data != '') {
                        var listas = d.data != '' ? d.data.split('¯') : [];
                        if (listas.length > 0) {
                            let _columnProperties = [];
                            let _itemColumn = [];

                            _columnProperties = [{
                                index: 0,
                                header: "Formulario",
                                propertie: "FORMULARIO",
                                /*typeData: "A",*/
                                typeFilter: "I",
                                sortHeader: true,
                                width: 150,
                                columnExport: true,
                            }
                            ]

                            let DataColumnas = listas[1] != '' ? listas[0].split('¬') : [];
                            VL_ARRA_ESTADOS = [];
                            let DataItemColumn;
                            ncontador = 0;
                            //console.log(DataColumnas);

                            for (let x = 0; x < DataColumnas.length; x++) {
                                DataItemColumn = DataColumnas[x].split('¦');
                                //console.log(DataItemColumn);
                                _itemColumn = {
                                    index: x + 1,
                                    header: DataItemColumn[1],
                                    propertie: DataItemColumn[0],
                                    typeData: "S_R",
                                    typeFilter: "I",
                                    sortHeader: true,
                                    width: 150,
                                    columnExport: true,
                                    totalByColumn: true,
                                    fnExtension: ''
                                }
                                VL_ARRA_ESTADOS.push(DataItemColumn[0]);
                                _columnProperties.push(_itemColumn);
                                ncontador += 1;
                            }
                            //console.log(_columnProperties);



                            $$grid('grd_repFormulario').create({
                                columnProperties: _columnProperties,
                                //headers: ['Ejecutivo', 'Contactar', 'Seguimiento', 'No contesta ', 'No accesible', 'No interesado/a', 'Volver a llamar', 'Interesado', 'Hot', 'Postulante', 'Matriculado', 'Cursos y programas', 'Proximo Inicio', 'Duplicado'],
                                //properties: ['EJECTUVO', 'CONTACTAR', 'SEGUIMIENTO', 'NCONTESTA', 'NOACCES', 'NOINTERES', 'VOLVERALLAMAR', 'INTERES', 'HOT', 'POSTULANTE', 'MATRICULADO', 'CURSOS', 'PROX', 'DUP'],
                                //typesData: ['S', 'S_R', 'S_R', 'S_R', 'S_R', 'S_R', 'S_R', 'S_R', 'S_R', 'S_R', 'S_R', 'S_R', 'S_R', 'S_R'],
                                //typesFilter: ['I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I'],
                                //sortHeader: [true, true, true, true, true, true, true, true, true, true, true, true, true, true],
                                //showColumns: [true, true, true, true, true, true, true, true, true, true, true, true, true, true],
                                //widths: [25, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                                //indexs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
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
                                totalByRow: true,
                                widthsPx: true,
                                entriesPage: 15,
                                rangePage: 5,
                                separator: '¦',
                                fnBtnNew: '',
                                fnBtnEdit: '',
                                fnBtnDelete: '',
                                fnBtnDeleteMultiple: '',
                                fnBtnRefresh: 'listarReCanal',
                                /*fnExtensions: ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],*/
                                namespace: namespace
                            });

                            var listaUsuarios = listas[1] != '' ? listas[1].split('¬') : [];
                            $$grid('grd_repFormulario').setData(listaUsuarios);
                            //console.log(listas);

                        }
                    } else {
                        $$grid('grd_repFormulario').clearGrid();
                    }

                }
            });
        };

        $scope.configurarEventos = function () {
            btn_Buscar.onclick = function () {
                $scope.listarReFormulario();
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

            cbo_LeadsNombre_Campania.onchange = function () {
                let idCampania = cbo_LeadsNombre_Campania.value;
                $scope.ListarComboEventosGrilla(idCampania);
            };
        }

        $scope.cargarCombos = function () {
            $fnSetCombo({
                controlId: 'cbo_LeadsNombre_Campania',
                data: $global.lists.CAMPANIA,
                type: 'T',
                separator: '¦'
            });
            //var ListaUsuarios = $global.lists.LIST_USUARIO_ASESOR_SUPERVISOR //LIST_USUARIO_NOMBRE;
            //ListaUsuarios.push('SIN ASIGNAR' + '¦' + 'SIN ASIGNAR');
            $fnSetCombo({
                controlId: 'cbo_LeadsNombre_Ejecutivo',
                data: $global.lists.LIST_USUARIO_ASESOR_SUPERVISOR,
                type: 'T',
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
            }

            $fnSetCombo({
                controlId: 'cbo_LeadsNombre_Evento',
                data: idCampania != '' ? arrEventos : [],
                type: 'T',
                separator: '¦'
            });

            if (idEvento != '') cbo_MDL_LeadsCUD_Evento.value = idEvento;

        };
    }

    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
})