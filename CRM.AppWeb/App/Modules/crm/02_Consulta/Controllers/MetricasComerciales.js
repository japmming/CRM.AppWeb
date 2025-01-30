define([$appName,
    "MetricasComerciales", ["CAMPANIA", "EVENTO", "EVENTOS", "LIST_USUARIO_ASESOR_SUPERVISOR_ACTIVOS"]
], function (module, namespace, args) {
    "use strict";
    var service = function ($service, $http) {
        $service.CoMetrLista = function (item, callback) {
            return $http({
                url: "MetricasComerciales/ListarMetrica",
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
            $$modal('mdl_Reasignar_Usuario').create({
                WithScrollY: true,
                Width: 'sm',
                Title: 'Reasignar Asociado',
                ButtonNames: ['Aceptar', 'Cancelar'],
                ButtonClass: ['btn-save-ico', 'btn-cancel-ico'],
                FnActions: ['fnEvMdlReasignar_Usuario_Aceptar', 'fnEvMdlReasignar_Usuario_Cancelar'],
                Namespace: namespace
            });
        }

        $scope.cargarDatos = function () {
            $fnValidarCampos({
                containers: ['frmLeadsLST']
            });

            $fnValidarCampos({
                containers: ['FRM_MDL_Reasignar_Usuario']
            });


            var FechaActual = new Date();
            //txt_FECHA_INICIO.value = $frConvertToDateString(FechaActual);
            txt_FECHA_INICIO.dateValue = $frConvertToDateString(new Date(FechaActual.getFullYear(), FechaActual.getMonth(), 1));
            txt_FECHA_FINAL.dateValue = $frConvertToDateString(FechaActual);
            $scope.listarMeComercial();


        }

        $scope.listarMeComercial = function () {
            var request = [{
                token: $config.token,
            }, {
                ID_CAMPANA: cbo_LeadsNombre_Campania.value,
                ID_EVENTO: cbo_LeadsNombre_Evento.value,
                FCH_INICIO: CHK_FECHA_INICIO.checked ? txt_FECHA_INICIO.dateValue : '',
                FCH_FINAL: CHK_FECHA_FINAL.checked ? txt_FECHA_FINAL.dateValue : '',

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
                                header: "Ejecutivo",
                                propertie: "EJECUTIVO",
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
                                    typeData: "A",
                                    typeFilter: "A",
                                    sortHeader: true,
                                    width: 150,
                                    columnExport: true,
                                    totalByColumn: true,
                                    fnExtension: 'fnExVerLeads'
                                }
                                VL_ARRA_ESTADOS.push(DataItemColumn[0]);
                                _columnProperties.push(_itemColumn);
                                ncontador += 1;
                            }
                            //console.log(_columnProperties);



                            $$grid('grd_Metricas').create({
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
                                fnBtnRefresh: 'listarMeComercial',
                                /*fnExtensions: ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],*/
                                namespace: namespace
                            });

                            var listaUsuarios = listas[1] != '' ? listas[1].split('¬') : [];
                            $$grid('grd_Metricas').setData(listaUsuarios);
                            //console.log(listas);

                        }
                    } else {
                        $$grid('grd_Metricas').clearGrid();
                    }

                }
            });
        };

        $scope.configurarEventos = function () {
            btn_Buscar.onclick = function () {
                $scope.listarMeComercial();
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

            //cbo_LeadsNombre_Campania.onchange = function () {
            //    let idCampania = cbo_LeadsNombre_Campania.value;
            //    $scope.ListarComboEventosGrilla(idCampania);
            //};

            $scope.fnEvMdlReasignar_Usuario_Cancelar = function () {
                $$modal('mdl_Reasignar_Usuario').hide();
                $scope.limpiarMDL_REASIGNADO();
            };
        }

        $scope.cargarCombos = function () {
            $fnSetCombo({
                controlId: 'cbo_LeadsNombre_Campania',
                data: $global.lists.CAMPANIA,
                type: 'S',
                separator: '¦'
            });
            $fnSetCombo({
                controlId: 'cbo_LeadsNombre_Evento',
                data: $global.lists.EVENTOS,
                type: 'S',
                separator: '¦'
            });
            $fnSetCombo({
                controlId: 'CBO_MDLUSUARIOS',
                data: $global.lists.LIST_USUARIO_ASESOR_SUPERVISOR_ACTIVOS,
                type: 'S',
                separator: '¦'
            });
        };
        //#region
        //$scope.ListarComboEventosGrilla = function (idCampania = '', idEvento = '') {

        //    let arrEventos = [];
        //    if (idCampania != '') {
        //        let column = [];
        //        for (let i = 0; i < $global.lists.EVENTO.length; i++) {
        //            column = $global.lists.EVENTO[i].split('¦');
        //            if (column[1] == idCampania) arrEventos.push(column[0] + '¦' + column[2]);
        //        }
        //    }

        //    $fnSetCombo({
        //        controlId: 'cbo_LeadsNombre_Evento',
        //        data: idCampania != '' ? arrEventos : [],
        //        type: 'S',
        //        separator: '¦'
        //    });

        //    if (idEvento != '') cbo_MDL_LeadsCUD_Evento.value = idEvento;

        //};
        //#endregion


        //ver

        $scope.fnExVerLeads = function (row, index) {
            //console.log(row);

            if (contador > ncontador) {
                contador = 1;
            }

            let DataColumn = $jt['jtse-grid_' + 'grd_Metricas'].matrix[index];

            //let ItemDataColumn = '00';
            let ItemDataColumn = VL_ARRA_ESTADOS[contador - 1];
            //console.log(VL_ARRA_ESTADOS[contador - 1]);
            let c = [];
            c.push('<div class="hand text-left" onclick="$jt[\'' + namespace + '\'].fnEvVerLeads(\'' + index + '\',\'' + ItemDataColumn + '\',' + contador + ')">' + (DataColumn[contador] == '0' ? '' : DataColumn[contador]));
            //c.push('<i style="color: #62a8ea" class="fa fa-eye"></i> ' + row.NOM_USU);
            c.push('</div>');
            contador++;
            return c.join('');
        };

        $scope.fnEvVerLeads = function (index, id_column_estado, contador) {
            //console.log(id_column_estado);
            VL_ID_ESTADO = id_column_estado;
            var fields = $jt['jtse-grid_' + 'grd_Metricas'].matrix[index];
            var EJECUTIVO = fields[0]
            SPN_TOTAL_REASIGNADO.innerHTML = (fields[contador])

            let list = $global.lists.LIST_USUARIO_ASESOR_SUPERVISOR_ACTIVOS
            let nlist = list.length, field, value;

            for (var i = 0; i < nlist; i++) {
                field = list[i].split('¦');
                if (field[1] === EJECUTIVO) {
                    value = field[0];
                    break;
                }
            }

            CBO_MDLUSUARIOS.value = value;
            VL_ID_USUARIO_ANTE = value;

            module.goSubPage("MetricasComerciales", 'mdl_Reasignar_Usuario', {
                frmVerLeads: {
                    _idUser: EJECUTIVO,

                }
            })
            //console.log(id_column_estado);
            //console.log(EJECUTIVO);
            //console.log(fields[contador])
            //console.log($global.lists.LIST_USUARIO_ASESOR_SUPERVISOR_ACTIVOS)
            //console.log($fnFindText(EJECUTIVO, $global.lists.LIST_USUARIO_ASESOR_SUPERVISOR_ACTIVOS, 1, 1))
            $$modal('mdl_Reasignar_Usuario').show();
        };


        $scope.limpiarMDL_REASIGNADO = function () {
            CBO_MDLUSUARIOS.value = '';
        }

        $scope.fnEvMdlReasignar_Usuario_Aceptar = function () {
            if (VL_ID_USUARIO_ANTE != CBO_MDLUSUARIOS.value || CBO_MDLUSUARIOS.value != '') {
                var request = [{
                    token: $config.token
                }, {
                    ESTADO: VL_ID_ESTADO, //ID_ESTADO
                    ID_USUARIO_ANT: VL_ID_USUARIO_ANTE, //ante ASIGNADO ANTERIOR
                    ID_USUARIO_NEW: CBO_MDLUSUARIOS.value, //nuevo ASIGNADO NUEVO
                    REASIGNADO: '1',

                }, {
                    rf: 'UR'
                }];

                console.log(request);
                $service.LeadsCUD(request, function (d) {
                    if (d.success) {
                        if (d.data == 'OK') {
                            $$modal('mdl_Reasignar_Usuario').hide();
                            $alertbox.show('Se actualizó correctamente', 'S', 3)
                            $global.user.conexionSocket.send('NOTIFICACIONES¯');
                            $scope.listarMeComercial();
                        }
                    } else {
                        $alertbox.show($msg.error.server, 'E');
                    }
                });
            } else {
                $$modal('mdl_Reasignar_Usuario').hide();
                $alertbox.show('Reasignación inválida', 'E', 3)
            }
        }
    }

    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);

})