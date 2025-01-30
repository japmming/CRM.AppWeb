define([$appName,
    "Estado"
], function (module, namespace, args) {
    "use strict";
    var service = function ($service, $http) {
        $service.usuarioListas = function (item, callback) {
            return $http({
                url: "Estado/Listar",
                data: item,
                method: "post",
                callback: callback
            });

        };

        $service.EstadoCUD = function (item, callback) {
            return $http({
                url: "Estado/CUD_ESTADO",
                data: item,
                method: "post",
                callback: callback
            });


        };



    };
    var controller = function ($scope, $service) {
        var isNew = false;
        var CODUSER = '';
        var VL_ID = '';

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
                fnExtension: "fnExEditarEstado",
            },
            {
                index: 1,
                header: "ID Estado",
                typeFilter: "I",
                typeData: "S",
                propertie: 'idEstado',
                sortHeader: true,
                showColumn: true,
                width: 40,
                columnExport: true,

            },
            {
                index: 2,
                header: "Descripción",
                typeFilter: "I",
                typeData: "S",
                propertie: 'descripcion',
                sortHeader: true,
                showColumn: true,
                width: 40,
                columnExport: true,

            },
            {
                index: 3,
                /*header: "",*/
                typeFilter: "I",
                typeData: "A",
                propertie: 'opcEliminar',
                sortHeader: false,
                showColumn: $global.permission.delete,
                width: 5,
                columnExport: false,
                fnExtension: "fnExEliminarEstado",
            }],
            _btnOptions = {
                btnid: [],
                names: [],
                icons: [],
                class: [],
                fnEvents: []
            };

            $$grid('grd_Estado').create({
            columnProperties: _columnProperties,
            //headers: ['', 'ID Estado', 'Descripción', ''],
            //properties: ['opcEditar', 'idEstado', 'descripcion', 'opcEliminar'],
            //typesData: ['A', 'S', 'S', 'A'],
            //typesFilter: ['', 'I', 'I', ''],
            //sortHeader: [false, true, true, false],
            //showColumns: [true, true, true, true],
            //widths: [2, 3, 20, 2],
            //indexs: [0, 1, 2, 3],
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
            fnBtnNew: 'fnEvNuevoEstado',
            fnBtnEdit: '',
            fnBtnDelete: '',
            fnBtnDeleteMultiple: '',
            fnBtnRefresh: 'listarUsuarios',
            /*fnExtensions: ['fnExEditarEstado', '', '', 'fnExEliminarEstado'],*/
            namespace: namespace
            });
            $$modal('mdl_Editar_Estado').create({
                WithScrollY: true,
                Width: 'sm',
                Title: '',
                ButtonNames: ['Aceptar', 'Cancelar'],
                ButtonClass: ['btn-save-ico', 'btn-cancel-ico'],
                FnActions: ['fnEvMdlEstadoAceptar', 'fnEvMdlEstadoCancelar'],
                Namespace: namespace
            });



        };
        $scope.cargarDatos = function () {

            $scope.listarUsuarios();
            $fnValidarCampos({
                containers: ['FRM_MDL_ESTADO']
            });



        };

        $scope.configurarEventos = function () {

        };

        $scope.listarUsuarios = function () {
            var request = [{
                token: $config.token,
            }, {
                CODUSER: ''
            }, {
                RF: 'R'
            }];
            $service.usuarioListas(request, function (d) {
                if (d.success) {
                    //console.log(d);
                    var listas = d.data != '' ? d.data.split('¯') : [];
                    if (listas.length != '') {
                        var listaUsuarios = listas[0] != '' ? listas[0].split('¬') : [];
                        $$grid('grd_Estado').setData(listaUsuarios);

                    }
                }
            });
        };


        $scope.fnEvNuevoEstado = function () {
            isNew = true;
            $scope.limpiarControlesMDLEstado();

            $$modal('mdl_Editar_Estado').setTitle('Agregar Estado');
            $$modal('mdl_Editar_Estado').show();
            CODUSER = '';

        };

        $scope.fnExEditarEstado = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-pencil btn-grid-edit hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEditarEstado(\'');
            c.push(row.idEstado);
            c.push('\')"></i>');
            return c.join('');
        };
        $scope.fnEvEditarEstado = function (codUser) {
            isNew = false;
            CODUSER = codUser;
            TXT_MDLESTADO_ID.value = CODUSER;
            TXT_MDLESTADO_ID.setAttribute('disabled', 'disabled');



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
                        TXT_MDLESTADO_ID.value = fields[0];
                        TXT_MDLNOMBRE_DESCRIPCION_ESTADO.value = fields[1];

                    }

                }
            });

            $$modal('mdl_Editar_Estado').setTitle('Editar Estado');
            $$modal('mdl_Editar_Estado').show();
            TXT_MDLNOMBRE_DESCRIPCION_ESTADO.focus();
        };

        $scope.fnExEliminarEstado = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-trash-o btn-grid-delete hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEliminarEstado(\'');
            c.push(row.idEstado);

            c.push('\')"></i>');
            return c.join('');
        };
        $scope.fnEvEliminarEstado = function (idEstado) {
            $dialog.confirm("¿Estás seguro de quitar el estado " + idEstado + "?", "Eliminar Ítem", "W", function (d) {
                if (d == true) {
                    var request = [{
                        VAR00: $config.token
                    }, {
                        VAR01: idEstado
                    }, {
                        VAR02: 'D'
                    }];
                    $service.EstadoCUD(request, function (d) {
                        if (d.success && d.data != '') {
                            var dato = d.data.split('¦');
                            if (dato[0] == 'OK') {

                                $scope.listarUsuarios();
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

        $scope.fnEvMdlEstadoCancelar = function () {
            $$modal('mdl_Editar_Estado').hide();
            $scope.limpiarControlesMDLEstado();
        };
        $scope.fnEvMdlEstadoAceptar = function () {
            var item = {
                containers: ['FRM_MDL_ESTADO']
            };

            if ($fnValidarForm(item).resultado == 0) {
                var request = [{
                    VAR00: $config.token
                }, {
                    VAR01: TXT_MDLESTADO_ID.value,
                    VAR02: TXT_MDLNOMBRE_DESCRIPCION_ESTADO.value,
                   

                }, {
                    ACCION: isNew ? 'C' : 'U'
                }];
                $service.EstadoCUD(request, function (d) {
                    if (d.success && d.data != '') {
                        var dato = d.data.split('¦');
                        if (dato[0] == 'OK') {
                            $$modal('mdl_Editar_Estado').hide();
                            $scope.listarUsuarios();
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
                $alert.show('Completar los campos.', 'E');
            }

        };


        $scope.limpiarControlesMDLEstado = function () {
            TXT_MDLESTADO_ID.value = '';
            TXT_MDLNOMBRE_DESCRIPCION_ESTADO.value = '';

        };
    }
    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
});