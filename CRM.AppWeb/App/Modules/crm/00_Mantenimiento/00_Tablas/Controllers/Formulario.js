define([$appName,
    "Formulario"
], function (module, namespace, args) {
    "use strict";
    var service = function ($service, $http) {
        $service.usuarioListas = function (item, callback) {
            return $http({
                url: "Formulario/Listar",
                data: item,
                method: "post",
                callback: callback
            });

        };

        $service.FormularioCUD = function (item, callback) {
            return $http({
                url: "Formulario/CUD_FORMULARIO",
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
                fnExtension: "fnExEditarFormulario",
            },
            {
                index: 1,
                header: "ID Formulario",
                typeFilter: "I",
                typeData: "S",
                propertie: 'idFormulario',
                sortHeader: true,
                showColumn: true,
                width: 10,
                columnExport: true,

            },
            {
                index: 2,
                header: "Página",
                typeFilter: "I",
                typeData: "S",
                propertie: 'pagina',
                sortHeader: true,
                showColumn: true,
                width: 35,
                columnExport: true,

            },
            {
                index: 3,
                header: "Nombre",
                typeFilter: "I",
                typeData: "S",
                propertie: 'nombreFormulario',
                sortHeader: true,
                showColumn: true,
                width: 35,
                columnExport: true,

            },
            {
                index: 4,
                /*header: "",*/
                /*typeFilter: "",*/
                typeData: "A",
                propertie: 'opcEliminar',
                sortHeader: false,
                showColumn: $global.permission.delete,
                width: 5,
                columnExport: false,
                fnExtension: "fnExEliminarFormulario",
            }],
            _btnOptions = {
                btnid: [],
                names: [],
                icons: [],
                class: [],
                fnEvents: []
            };


            $$grid('grd_Formulario').create({
                columnProperties: _columnProperties,
                //headers: ['', 'ID Formulario', 'Página', 'Nombre', ''],
                //properties: ['opcEditar', 'idFormulario', 'pagina', 'nombreFormulario', 'opcEliminar'],
                //typesData: ['A', 'S', 'S', 'S', 'A'],
                //typesFilter: ['', 'I', 'I', 'I', ''],
                //sortHeader: [false, true, true, true,  false],
                //showColumns: [true, true, true, true, true],
                //widths: [2, 3, 20, 10, 2],
                //indexs: [0, 1, 2, 3, 4],
                headerStyle: $controls.grid.headerStyle,
                data: [],
                borderTop: false,
                btnNew: true,
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
                fnBtnNew: 'fnEvNuevoFormulario',
                fnBtnEdit: '',
                fnBtnDelete: '',
                fnBtnDeleteMultiple: '',
                fnBtnRefresh: 'listarUsuarios',
                /*fnExtensions: ['fnExEditarFormulario', '', '', '', 'fnExEliminarFormulario'],*/
                namespace: namespace
            });
            $$modal('mdl_Editar_Formulario').create({
                WithScrollY: true,
                Width: 'sm',
                Title: '',
                ButtonNames: ['Aceptar', 'Cancelar'],
                ButtonClass: ['btn-save-ico', 'btn-cancel-ico'],
                FnActions: ['fnEvMdlFormularioAceptar', 'fnEvMdlFormularioCancelar'],
                Namespace: namespace
            });



        };
        $scope.cargarDatos = function () {

            $scope.listarUsuarios();
            $fnValidarCampos({
                containers: ['FRM_MDL_FORMULARIO']
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
                        $$grid('grd_Formulario').setData(listaUsuarios);

                    }
                }
            });
        };


        $scope.fnEvNuevoFormulario = function () {
            isNew = true;
            $scope.limpiarControlesMDLFormulario();

            $$modal('mdl_Editar_Formulario').setTitle('Agregar Formulario');
            $$modal('mdl_Editar_Formulario').show();
            CODUSER = '';

        };

        $scope.fnExEditarFormulario = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-pencil btn-grid-edit hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEditarFormulario(\'');
            c.push(row.idFormulario);
            c.push('\')"></i>');
            return c.join('');
        };
        $scope.fnEvEditarFormulario = function (codUser) {
            isNew = false;
            CODUSER = codUser;
            TXT_MDLFORMULARIO_ID.value = CODUSER;
            TXT_MDLFORMULARIO_ID.setAttribute('disabled', 'disabled');



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
                        TXT_MDLFORMULARIO_ID.value = fields[0];
                        TXT_MDLNOMBRE_PAGINA.value = fields[1];
                        TXT_MDLNOMBRE_FORMULARIO.value = fields[2];
                    }

                }
            });

            $$modal('mdl_Editar_Formulario').setTitle('Editar Formulario');
            $$modal('mdl_Editar_Formulario').show();
            TXT_MDLNOMBRE_PAGINA.focus();
        };

        $scope.fnExEliminarFormulario = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-trash-o btn-grid-delete hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEliminarFormulario(\'');
            c.push(row.idFormulario);
            c.push('\',\'');
            c.push(row.nombreFormulario);
            c.push('\')"></i>');
            
            return c.join('');
        };
        $scope.fnEvEliminarFormulario = function (idFormulario, nombreFormulario) {
            $dialog.confirm("¿Estás seguro de quitar el formulario " + nombreFormulario + "?", "Eliminar Ítem", "W", function (d) {
                if (d == true) {
                    var request = [{
                        VAR00: $config.token
                    }, {
                        VAR01: idFormulario
                    }, {
                        VAR02: 'D'
                    }];
                    $service.FormularioCUD(request, function (d) {
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

        $scope.fnEvMdlFormularioCancelar = function () {
            $$modal('mdl_Editar_Formulario').hide();
            $scope.limpiarControlesMDLFormulario();
        };
        $scope.fnEvMdlFormularioAceptar = function () {
            var item = {
                containers: ['FRM_MDL_FORMULARIO']
            };

            if ($fnValidarForm(item).resultado == 0) {
                var request = [{
                    VAR00: $config.token
                }, {

                    VAR01: CODUSER,
                    VAR02: TXT_MDLNOMBRE_PAGINA.value,
                    VAR03: TXT_MDLNOMBRE_FORMULARIO.value,

                }, {
                    ACCION: isNew ? 'C' : 'U'
                }];
                $service.FormularioCUD(request, function (d) {
                    if (d.success && d.data != '') {
                        var dato = d.data.split('¦');
                        if (dato[0] == 'OK') {
                            $$modal('mdl_Editar_Formulario').hide();
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


        $scope.limpiarControlesMDLFormulario = function () {
            TXT_MDLFORMULARIO_ID.value = '';
            TXT_MDLNOMBRE_PAGINA.value = '';
            TXT_MDLNOMBRE_FORMULARIO.value = '';
        };
    }
    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
});