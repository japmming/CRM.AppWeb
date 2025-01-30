define([$appName,
    "Eventos"
], function (module, namespace, args) {
    "use strict";
    var service = function ($service, $http) {
        $service.usuarioListas = function (item, callback) {
            return $http({
                url: "Evento/Listar",
                data: item,
                method: "post",
                callback: callback
            });
        };
        $service.EventoCUD = function (item, callback) {
            return $http({
                url: "Evento/CUD_Evento",
                data: item,
                method: "post",
                callback: callback
            });
        };
    };

    var controller = function ($scope, $service) {
        var isNew = false;
        var CODUSER = '';
        var VL_ID_CAMPANA = '';
        var VL_ID_EVENTO = '';
        var listaCampana = '';
        var VL_NOMBRE_CAMPANA = '';
        $scope.init = function () {
            $scope.configurarControles();
            $scope.cargarDatos();
            $scope.configurarEventos();
        };
        $scope.configurarControles = function () {
            let _btnOptions = {};
            let _showColumns = [];
            let _showColumnsExport = [];
            let _columnProperties = [];

            _columnProperties = [{
                index: 0,
                /*header: "",*/
                typeFilter: "",
                typeData: "A",
                propertie: 'opcEditar',
                sortHeader: false,
                showColumn: $global.permission.edit,
                width: 5,
                columnExport: false,
                fnExtension: "fnExEditarEvento",
            },
            {
                index: 1,
                header: "IdEvento",
                propertie: "ID_EVENTO",
                sortHeader: true,
                showColumn: true,
                typeData: 'S',
                typeFilter: "",
                columnExport: false,
                width: 5,
            },
            {
                index: 2,
                header: "Código",
                propertie: "CODIGO",
                sortHeader: true,
                showColumn: true,
                typeFilter: "I",
                columnExport: true,
                width: 15,
            },
            {
                index: 3,
                header: "Nombre",
                propertie: "NOMBRE",
                sortHeader: true,
                showColumn: true,
                typeFilter: "I",
                columnExport: true,
                width: 20,
            },
            {
                index: 4,
                header: "Campaña",
                propertie: "CAMPANA",
                sortHeader: true,
                showColumn: true,
                typeFilter: "I",
                columnExport: true,
                width: 20,
            },
            {
                index: 5,
                header: "Fecha Inicio",
                propertie: "FCH_INICIO",
                sortHeader: true,
                showColumn: true,
                typeData: 'D',
                typeFilter: "I",
                columnExport: true,
                width: 20,
            },
            {
                index: 6,
                header: "Fecha Termino",
                propertie: "FCH_TERMINO",
                sortHeader: true,
                showColumn: true,
                typeData: 'D',
                typeFilter: "I",
                columnExport: true,
                width: 20,
            },
            {
                index: 7,
                header: "Leads en curso",
                propertie: "LEADS",
                sortHeader: true,
                showColumn: true,
                typeData: 'S_C',
                typeFilter: "I",
                columnExport: true,
                width: 10,
            },
            {
                index: 8,
                header: "",
                propertie: "opcVer",
                sortHeader: false,
                showColumn: true,
                typeData: 'A',
                typeFilter: "",
                columnExport: false,
                width: 10,
                fnExtension: "fnExVerLead"
            },
      
            {
                index: 9,
                header: "",
                propertie: "opcEliminar",
                sortHeader: false,
                showColumn: $global.permission.delete,
                typeData: 'A',
                typeFilter: "",
                columnExport: false,
                width: 5,
                fnExtension: "fnExEliminarEvento"
            }],
            _btnOptions = {
                btnid: [],
                names: [],
                icons: [],
                class: [],
                fnEvents: []
            };

            $$grid('grd_Evento').create({
                columnProperties: _columnProperties,
                //headers: ['', 'Código', 'Nombre', 'Campaña', 'Fecha Inicio', 'Fecha Termino', 'Leads en curso', '', 'IdEvento', ''],
                //properties: ['opcEditar', 'CODIGO', 'NOMBRE', 'CAMPANA', 'FCH_INICIO', 'FCH_TERMINO', 'LEADS', 'opcVer', 'ID_EVENTO', 'opcEliminar'],
                //typesData: ['A', 'S', 'S', 'S', 'D', 'D', 'S_C', 'A', 'S', 'A'],
                //typesFilter: ['', 'I', 'I', 'I', 'I', 'I', 'I', '', '', ''],
                //sortHeader: [false, true, true, true, true, true, true, false, true, false],
                //showColumns: [true, true, true, true, true, true, true, true, false, true],
                //widths: [3, 6, 35, 35, 5, 5, 2, 5, 1, 3],
                //indexs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                headerStyle: $controls.grid.headerStyle,
                data: [],
                borderTop: false,
                btnNew: $global.permission.insert,
                btnEdit: false,
                btnDelete: false,
                btnDeleteMultiple: false,
                btnRefresh: true,
                btnExportExcel: $global.permission.excel,
                filterPosition: 'UP',
                generalFilter: true,
                entriesPage: 15,
                rangePage: 5,
                separator: '¦',
                fnBtnNew: 'fnEvNuevoEvento',
                fnBtnEdit: '',
                fnBtnDelete: '',
                fnBtnDeleteMultiple: '',
                fnBtnRefresh: 'listarGrilla',
                /*fnExtensions: ['fnExEditarEvento', '', '', '', '', '', '', 'fnExVerLead', '', 'fnExEliminarEvento'],*/
                namespace: namespace
            });
            $$modal('mdl_Editar_Evento').create({
                WithScrollY: true,
                Width: 'sm',
                Title: '',
                ButtonNames: ['Aceptar', 'Cancelar'],
                ButtonClass: ['btn-save-ico', 'btn-cancel-ico'],
                FnActions: ['fnEvMdlEventoAceptar', 'fnEvMdlEventoCancelar'],
                Namespace: namespace
            });
            $$modal('MDL_lista_leads').create({
                WithScrollY: true,
                FullScreen: true,
                Namespace: namespace
            });
        };
        $scope.cargarDatos = function () {
            /*$scope.listarEventos();*/
            $scope.cargarCombos();
            $fnValidarCampos({
                containers: ['FRM_MDL_Evento']
            });


            if (args) {

                if (args.frmVerEventos) {
                    console.log(args.frmVerEventos);
                    if (args.frmVerEventos._nombreCampana != '') {
                        if (args.frmVerEventos._idCampana) {
                            VL_ID_CAMPANA = args.frmVerEventos._idCampana;
                            VL_NOMBRE_CAMPANA = args.frmVerEventos._nombreCampana;
                            document.getElementById('DIV_REGRESAR').style.display = 'inline';
                            titulo.innerHTML = "- Campaña: " + VL_NOMBRE_CAMPANA;
                            $scope.listarEventos('', VL_ID_CAMPANA);
                        }
                    } else {
                        $scope.listarEventos();
                    }

                } else {
                    $scope.listarEventos();

                }
            } else {
                $scope.listarEventos();
            }
        };

        $scope.configurarEventos = function () {
            BTN_AsigSoliCodEdi_Regresar.onclick = function () {
                module.goSubPage('Campana', 'view-Main');
            };

            CBO_MDLCampana.onchange = function () {
                $scope.CambiarFechaCampana();
            }
        };
        $scope.fnEvNuevoEvento = function () {
            isNew = true;
            $scope.limpiarControlesMDLEvento();
            $$modal('mdl_Editar_Evento').setTitle('Agregar Evento');
            $$modal('mdl_Editar_Evento').show();

            TXT_MDLEVENTO_CODIGO.removeAttribute('disabled');
            if (VL_ID_CAMPANA != '') {
                CBO_MDLCampana.value = VL_ID_CAMPANA;
                $scope.CambiarFechaCampana();
                CBO_MDLCampana.setAttribute('disabled', 'disabled');
            } else {
                CBO_MDLCampana.removeAttribute('disabled');
            }

            CODUSER = '';

        };
        $scope.listarEventos = function (IdEvento = '', IdCampana = '') {
            var request = [{
                VAR00: $config.token,
            }, {
                VAR01: IdEvento,
                VAR02: IdCampana,
            }, {
                VAR03: 'R'
            }];
            $service.usuarioListas(request, function (d) {
                if (d.success) {
                    //console.log(d);
                    var listas = d.data != '' ? d.data.split('¯') : [];
                    if (listas[0] != '') {
                        var listaUsuarios = listas[0] != '' ? listas[0].split('¬') : [];
                        $$grid('grd_Evento').setData(listaUsuarios);

                    }
                    if (listas[1] != '') {
                        listaCampana = listas[1] != '' ? listas[1].split('¬') : [];
                        $fnSetCombo({
                            controlId: 'CBO_MDLCampana',
                            data: listaCampana,
                            type: 'S',
                            separator: '¦'
                        })
                    }

                }
            });
        };
        $scope.listarGrilla = function () {
            if (VL_ID_CAMPANA != '') {
                $scope.listarEventos('', VL_ID_CAMPANA);
            } else {
                $scope.listarEventos();
            }
        };
        $scope.cargarCombos = function () {

        };

        $scope.limpiarControlesMDLEvento = function () {
            TXT_MDlEVENTO_NOMBRE.value = '';
            TXT_MDLEVENTO_CODIGO.value = '';
            TXT_MDLEVENTO_FECHA_INICIO.value = '';
            TXT_MDLEVENTO_FECHA_FIN.value = '';
            CBO_MDLCampana.selectedIndex = 0;
            TXT_MDLEVENTO_FECHA_INICIO_CAMPAÑA.value = '';
            TXT_MDLEVENTO_FECHA_FIN_CAMPAÑA.value = '';
        };

        //editar

        $scope.fnExEditarEvento = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-pencil btn-grid-edit hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEditarEvento(\'');
            c.push(row.ID_EVENTO);
            c.push('\')"></i>');
            return c.join('');
        };
        $scope.fnEvEditarEvento = function (codUser) {
            isNew = false;
            $scope.limpiarControlesMDLEvento();
            CODUSER = codUser;

            TXT_MDLEVENTO_CODIGO.setAttribute('disabled', 'disabled');
            CBO_MDLCampana.setAttribute('disabled', 'disabled');

            var request = [{
                token: $config.token,
            }, {
                CODUSER: CODUSER
            }, {
                RF: 'F'
            }];
            $service.usuarioListas(request, function (d) {
                if (d.success) {
                    var listas = d.data != '' ? d.data.split('¯') : [];
                    if (listas.length > 0) {
                        var listaUsuarios = listas[0] != '' ? listas[0].split('¬') : [];
                        var fields = listaUsuarios[0].split('¦');
                        TXT_MDlEVENTO_NOMBRE.value = fields[0];
                        TXT_MDLEVENTO_CODIGO.value = fields[1];
                        TXT_MDLEVENTO_FECHA_INICIO.dateValue = fields[2];
                        TXT_MDLEVENTO_FECHA_FIN.dateValue = fields[3];
                        CBO_MDLCampana.value = fields[4];
                        $scope.CambiarFechaCampana();

                    }
                }
            });

            $$modal('mdl_Editar_Evento').setTitle('Editar Evento');
            $$modal('mdl_Editar_Evento').show();
            TXT_MDlEVENTO_NOMBRE.focus();
        };
        //cancelar
        $scope.fnEvMdlEventoCancelar = function () {
            $$modal('mdl_Editar_Evento').hide();
            //    $scope.limpiarControlesMDL();
        };

        //ver lead
        $scope.fnExVerLead = function (row, index) {
            var c = [];
            c.push('<button class="btn btn-pago"');
            c.push('onclick="$jt[\'' + namespace + '\'].fnEvVerLead(\'' + index + '\')">');
            c.push('VER LEADS</button>');
            return c.join('');
        };
        $scope.fnEvVerLead = function (index) {
            var fields = $jt['jtse-grid_' + 'grd_Evento'].matrix[index];
            var ID_EVENTO = fields[1];
            var NOMBRE_EVENTO = fields[3];
            module.goSubPage("Leads", 'VW-MDLLista_Leads', {
                frmVerLeads: {
                    _idCampana: VL_ID_CAMPANA,
                    _nombreCampana: VL_NOMBRE_CAMPANA,
                    _idEvento: ID_EVENTO,
                    _nombreEvento: NOMBRE_EVENTO
                }
            })
            $$modal('MDL_lista_leads').show();
        };
        //eliminar
        $scope.fnExEliminarEvento = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-trash-o btn-grid-delete hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEliminarEvento(\'');
            c.push(row.ID_EVENTO);
            c.push('\',\'');
            c.push(row.CODIGO);
            c.push('\')"></i>');
            return c.join('');
        };
        $scope.fnEvEliminarEvento = function (idEvento, Codigo) {
            $dialog.confirm("¿Estás seguro de quitar el evento " + Codigo + " ?", "Eliminar Ítem", "W", function (d) {
                if (d == true) {
                    var request = [{
                        VAR00: $config.token
                    }, {
                        VAR01: idEvento
                    }, {
                        VAR02: 'D'
                    }];
                    $service.EventoCUD(request, function (d) {
                        if (d.success && d.data != '') {
                            var dato = d.data.split('¦');
                            if (dato[0] == 'OK') {

                                $scope.listarGrilla();
                                $alert.show(dato[1], 'S');
                            }
                            else {
                                $alert.show(dato[1], 'E');
                            }
                        } else {
                            $alertbox.show($msg.error.server, 'E');
                        }
                    });
                }
            });
        };
        //aceptar
        $scope.fnEvMdlEventoAceptar = function () {           
            //#if ($fnValidarFechaMaxima(TXT_MDLEVENTO_FECHA_INICIO.value, $formatDateStandar(TXT_MDLEVENTO_FECHA_FIN_CAMPAÑA.value)) == true) {
            //    if ($fnValidarFechaMin(TXT_MDLEVENTO_FECHA_INICIO.value, $formatDateStandar(TXT_MDLEVENTO_FECHA_INICIO_CAMPAÑA.value)) == true) {
            //        if ($fnValidarFechaMin(TXT_MDLEVENTO_FECHA_FIN.value, TXT_MDLEVENTO_FECHA_INICIO.value) == true) {
            //            var item = {
            //                containers: ['FRM_MDL_Evento']
            //            };
            //            if ($fnValidarForm(item).resultado == 0) {
            //                var request = [{
            //                    VAR00: $config.token
            //                }, {
            //                    VAR01: TXT_MDlEVENTO_NOMBRE.value,
            //                    VAR02: TXT_MDLEVENTO_CODIGO.value,
            //                    VAR03: TXT_MDLEVENTO_FECHA_INICIO.value, //$formatDateStandar(TXT_MDLEVENTO_FECHA_INICIO.value), //
            //                    VAR04: TXT_MDLEVENTO_FECHA_FIN.value,    //$formatDateStandar(TXT_MDLEVENTO_FECHA_FIN.value), //
            //                    VAR05: $global.user.coduser,
            //                    VAR06: '#IP_CLIENTE#',
            //                    VAR07: CODUSER,
            //                    VAR08: CBO_MDLCampana.value
            //                }, {
            //                    ACCION: isNew ? 'C' : 'U'
            //                }];
            //                $service.EventoCUD(request, function (d) {
            //                    if (d.success && d.data != '') {
            //                        var dato = d.data.split('¦');
            //                        if (dato[0] == 'OK') {
            //                            $$modal('mdl_Editar_Evento').hide();
            //                            $scope.listarGrilla();
            //                            $alert.show(dato[1], 'S');
            //                        }
            //                        else {
            //                            $alert.show(dato[1], 'E');
            //                        }
            //                    } else {
            //                        $alertbox.show($msg.error.server, 'E');
            //                    }
            //                });
            //            } else {
            //                $alert.show('Completar los campos.', 'E');
            //            }

            //        }
            //        else {
            //            $alertbox.show("La fecha final no puede ser menor a la fecha de inicio", "E", 4);
            //        } 
            //    } else {
            //        $alertbox.show("Las fechas del evento tienen que estar dentro del rango de fechas de campaña ", "E", 4);
            //    }
            //} else {
            //    $alertbox.show("Las fechas del evento tienen que estar dentro del rango de fechas de campaña", "E", 4);
            //#}

            var item = {
                containers: ['FRM_MDL_Evento']
            };
            if ($fnValidarForm(item).resultado == 0) {
                if ($fnValidarFechaMin(TXT_MDLEVENTO_FECHA_INICIO.dateValue, $formatDateStandar(TXT_MDLEVENTO_FECHA_INICIO_CAMPAÑA.value)) == true) {
                    if ($fnValidarFechaMaxima(TXT_MDLEVENTO_FECHA_FIN.dateValue, $formatDateStandar(TXT_MDLEVENTO_FECHA_FIN_CAMPAÑA.value)) == true) {
                        if ($fnValidarFechaMin(TXT_MDLEVENTO_FECHA_INICIO.dateValue, $formatDateStandar(TXT_MDLEVENTO_FECHA_INICIO_CAMPAÑA.value)) == true) {
                            if ($fnValidarFechaMin(TXT_MDLEVENTO_FECHA_FIN.dateValue, $formatDateStandar(TXT_MDLEVENTO_FECHA_INICIO_CAMPAÑA.value)) == true) {
                                if ($fnValidarFechaMaxima(TXT_MDLEVENTO_FECHA_INICIO.dateValue, TXT_MDLEVENTO_FECHA_FIN.dateValue) == true) {
                                    var request = [{
                                        VAR00: $config.token
                                    }, {
                                        VAR01: TXT_MDlEVENTO_NOMBRE.value,
                                        VAR02: TXT_MDLEVENTO_CODIGO.value,
                                        VAR03: TXT_MDLEVENTO_FECHA_INICIO.dateValue, //$formatDateStandar(TXT_MDLEVENTO_FECHA_INICIO.value), //
                                        VAR04: TXT_MDLEVENTO_FECHA_FIN.dateValue,    //$formatDateStandar(TXT_MDLEVENTO_FECHA_FIN.value), //
                                        VAR05: $global.user.coduser,
                                        VAR06: '#IP_CLIENTE#',
                                        VAR07: CODUSER,
                                        VAR08: CBO_MDLCampana.value
                                    }, {
                                        ACCION: isNew ? 'C' : 'U'
                                    }];
                                    $service.EventoCUD(request, function (d) {
                                        if (d.success && d.data != '') {
                                            var dato = d.data.split('¦');
                                            if (dato[0] == 'OK') {
                                                $$modal('mdl_Editar_Evento').hide();
                                                $scope.listarGrilla();
                                                $alert.show(dato[1], 'S');
                                            }
                                            else {
                                                $alert.show(dato[1], 'E');
                                            }
                                        } else {
                                            $alertbox.show($msg.error.server, 'E');
                                        }
                                    });
                                

                            
                                } else {
                                    $alertbox.show("La fecha final no puede ser menor a la fecha de inicio", "E", 4);
                                }
                            } else {
                                $alertbox.show("Las fechas del evento tienen que estar dentro del rango de fechas de campaña 1", "E", 4);
                            }
                        } else {
                            $alertbox.show("Las fechas del evento tienen que estar dentro del rango de fechas de campaña 2", "E", 4);
                        }
                    } else {
                        $alertbox.show("Las fechas del evento tienen que estar dentro del rango de fechas de campaña 3", "E", 4);
                    }
                } else {
                    $alertbox.show("Las fechas del evento tienen que estar dentro del rango de fechas de campaña 4", "E", 4);
                }
            } else {
                $alert.show('Completar los campos.', 'E');
            }
               
        };

        $scope.CambiarFechaCampana = function () {
            var Id_Campana = CBO_MDLCampana.value;
            var columns = [];
            if (Id_Campana != '') {
                if (listaCampana != '') {
                    for (var i = 0; i < listaCampana.length; i++) {
                        columns = listaCampana[i].split('¦');
                        if (Id_Campana == columns[0]) {
                            TXT_MDLEVENTO_FECHA_INICIO_CAMPAÑA.value = columns[2];
                            TXT_MDLEVENTO_FECHA_FIN_CAMPAÑA.value = columns[3];
                        }
                    }

                }
            } else {
                TXT_MDLEVENTO_FECHA_INICIO_CAMPAÑA.value = '';
                TXT_MDLEVENTO_FECHA_FIN_CAMPAÑA.value = '';
            }

        };
    }
    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
});