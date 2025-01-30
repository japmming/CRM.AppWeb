define([$appName,
    "Interes"
], function (module, namespace, args) {
    "use strict";
    var service = function ($service, $http) {
        $service.usuarioListas = function (item, callback) {
            return $http({
                url: "Interes/Listar",
                data: item,
                method: "post",
                callback: callback
            });

        };

        $service.InteresCUD = function (item, callback) {
            return $http({
                url: "Interes/CUD_INTERES",
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
                fnExtension: "fnExEditarInteres",
            },
            {
                index: 1,
                header: "ID Interes",
                typeFilter: "I",
                typeData: "S",
                propertie: 'idInteres',
                sortHeader: true,
                showColumn: true,
                width: 30,
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
                width: 50,
                columnExport: true,

            },
            {
                index: 3,
                /*header: "",*/
                typeFilter: "",
                typeData: "A",
                propertie: 'opcEliminar',
                sortHeader: false,
                showColumn: $global.permission.delete,
                width: 5,
                columnExport: false,
                fnExtension: "fnExEliminarInteres",
            }],
            _btnOptions = {
                btnid: [],
                names: [],
                icons: [],
                class: [],
                fnEvents: []
            };



            $$grid('grd_Interes').create({
                columnProperties: _columnProperties,
                //headers: ['', 'ID Interes', 'Descripción', ''],
                //properties: ['opcEditar', 'idInteres', 'descripcion', 'opcEliminar'],
                //typesData: ['A', 'S', 'S', 'A'],
                //typesFilter: ['', 'I', 'I', ''],
                //sortHeader: [false, true, true, false],
                //showColumns: [true, true, true,  true],
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
                fnBtnNew: 'fnEvNuevoInteres',
                fnBtnEdit: '',
                fnBtnDelete: '',
                fnBtnDeleteMultiple: '',
                fnBtnRefresh: 'listarUsuarios',
                /*fnExtensions: ['fnExEditarInteres', '', '', 'fnExEliminarInteres'],*/
                namespace: namespace
            });
            $$modal('mdl_Editar_Interes').create({
                WithScrollY: true,
                Width: 'sm',
                Title: '',
                ButtonNames: ['Aceptar', 'Cancelar'],
                ButtonClass: ['btn-save-ico', 'btn-cancel-ico'],
                FnActions: ['fnEvMdlInteresAceptar', 'fnEvMdlInteresCancelar'],
                Namespace: namespace
            });

           

        };
        $scope.cargarDatos = function () {

            $scope.listarUsuarios();
            $fnValidarCampos({
                containers: ['FRM_MDL_INTERES']
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
                        $$grid('grd_Interes').setData(listaUsuarios);

                    }
                }
            });
        };


        $scope.fnEvNuevoInteres = function () {
            isNew = true;
            $scope.limpiarControlesMDLInteres();

            $$modal('mdl_Editar_Interes').setTitle('Agregar Interes');
            $$modal('mdl_Editar_Interes').show();
            CODUSER = '';

        };

        $scope.fnExEditarInteres = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-pencil btn-grid-edit hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEditarInteres(\'');
            c.push(row.idInteres);
            c.push('\')"></i>');
            return c.join('');
        };
        $scope.fnEvEditarInteres = function (codUser) {
            isNew = false;
            CODUSER = codUser;
            TXT_MDLINTERES_ID.value = CODUSER;
            TXT_MDLINTERES_ID.setAttribute('disabled', 'disabled');



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
                        TXT_MDLINTERES_ID.value = fields[0];
                        TXT_MDLNOMBRE_DESCRIPCION.value = fields[1];

                        




                    }

                }
            });

            $$modal('mdl_Editar_Interes').setTitle('Editar Interes');
            $$modal('mdl_Editar_Interes').show();
            TXT_MDLNOMBRE_DESCRIPCION.focus();
        };

        $scope.fnExEliminarInteres = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-trash-o btn-grid-delete hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEliminarInteres(\'');
            c.push(row.idInteres);
            
            c.push('\')"></i>');
            return c.join('');
        };
        $scope.fnEvEliminarInteres = function (idInteres) {
            $dialog.confirm("¿Estás seguro de quitar el interes " + idInteres + "?", "Eliminar Ítem", "W", function (d) {
                if (d == true) {
                    var request = [{
                        VAR00: $config.token
                    }, {
                        VAR01: idInteres
                    }, {
                        VAR02: 'D'
                    }];
                    $service.InteresCUD(request, function (d) {
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

        $scope.fnEvMdlInteresCancelar = function () {
            $$modal('mdl_Editar_Interes').hide();
            $scope.limpiarControlesMDLInteres();
        };
        $scope.fnEvMdlInteresAceptar = function () {  
            var item = {
                containers: ['FRM_MDL_INTERES']
            };

            if ($fnValidarForm(item).resultado == 0) {
                var request = [{
                    VAR00: $config.token
                }, {
                    VAR01: TXT_MDLINTERES_ID.value,
                    VAR02: TXT_MDLNOMBRE_DESCRIPCION.value,
                    VAR03: $global.user.coduser,
                    VAR04: '#IP_CLIENTE#',
                    
                }, {
                    ACCION: isNew ? 'C' : 'U'
                }];
                $service.InteresCUD(request, function (d) {
                    if (d.success && d.data != '') {
                        var dato = d.data.split('¦');
                        if (dato[0] == 'OK') {
                            $$modal('mdl_Editar_Interes').hide();
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


        $scope.limpiarControlesMDLInteres = function () {
            TXT_MDLINTERES_ID.value = '';
            TXT_MDLNOMBRE_DESCRIPCION.value = '';
            
        };
    }
    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
});