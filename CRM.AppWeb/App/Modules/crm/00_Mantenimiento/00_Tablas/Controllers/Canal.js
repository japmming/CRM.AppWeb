define([$appName,
    "Canal"
], function (module, namespace, args) {
    "use strict";
    var service = function ($service, $http) {
        $service.CanalLista = function(item, callback) {
            return $http({
                url: "Canal/Listar",
                data: item,
                method: "post",
                callback: callback
            });
        };

        $service.CanalCUD = function (item, callback) {
            return $http({
                url: "Canal/CUD_Canal",
                data: item,
                method: "post",
                callback: callback
            });
        };
    };

    var controller = function ($scope, $service) {
        var isNew = false;
        var CODUSER = '';
       
        $scope.init = function () {
            $scope.configurarControles();
            $scope.cargarDatos();
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
                fnExtension: "fnExEditarCanal",
            },
            {
                index: 1,
                header: "IdCanal",
                typeFilter: "I",
                typeData: "S",
                propertie: 'IDCANAL',
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
                propertie: 'DESCRIPCION',
                sortHeader: true,
                showColumn: true,
                width: 40,
                columnExport: true,

            },
            {
                index: 3,
                header: "Fecha Creacion",
                typeFilter: "I",
                typeData: "S",
                propertie: 'FCH_CREACION',
                sortHeader: true,
                showColumn: false,
                width: 20,
                columnExport: true,

            },
            {
                index: 4,
                header: "Fecha Creacion",
                typeFilter: "I",
                typeData: "S",
                propertie: 'FCH_CREACION',
                sortHeader: true,
                showColumn: false,
                width: 20,
                columnExport: true,

            },
            {
                index: 5,
                /*header: "",*/
                typeFilter: "I",
                typeData: "A",
                propertie: 'opcEliminar',
                sortHeader: false,
                showColumn: $global.permission.delete,
                width: 5,
                columnExport: false,
                fnExtension: "fnExEliminarCanal"

            }],
            _btnOptions = {
                btnid: [],
                names: [],
                icons: [],
                class: [],
                fnEvents: []
            };
            $$grid('grd_Canal').create({
                columnProperties: _columnProperties,
                //headers: ['', 'IdCanal', 'Descripción', 'Fecha Creacion', 'Fecha Modificacion', ''],
                //properties: ['opcEditar', 'IDCANAL',  'DESCRIPCION', 'FCH_CREACION', 'FCH_MOD',  'opcEliminar'],
                //typesData: ['A', 'S', 'S', 'S', 'S', 'A'],
                //typesFilter: ['', 'I', 'I', 'I', '', ''],
                //sortHeader: [false, true, true, true, true, false],
                //showColumns: [true, true, true, false, false, true],
                //widths: [3, 1, 60, 3, 3, 3],
                //indexs: [0, 1, 2, 3, 4, 5],
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
                fnBtnNew: 'fnEvNuevoCanal',
                fnBtnEdit: '',
                fnBtnDelete: '',
                fnBtnDeleteMultiple: '',
                fnBtnRefresh: 'listarCanal',
                /*fnExtensions: ['fnExEditarCanal', '', '', '', '', 'fnExEliminarCanal'],*/
                namespace: namespace
            });
            $$modal('mdl_Editar_Canal').create({
                WithScrollY: true,
                Width: 'sm',
                Title: '',
                ButtonNames: ['Aceptar', 'Cancelar'],
                ButtonClass: ['btn-save-ico', 'btn-cancel-ico'],
                FnActions: ['fnEvMdlEventoAceptar', 'fnEvMdlEventoCancelar'],
                Namespace: namespace
            });

        }
        $scope.cargarDatos = function () {
            $scope.listarCanal();
            //$fnValidarCampos({
            //    containers: ['FRM_MDL_CANAL']
            //});
        };
        
        $scope.listarCanal = function () {
            var request = [{
                token: $config.token,
            }, {
                CODUSER: ''
            }, {
                RF: 'R'
            }];
            $service.CanalLista(request, function (d) {
                if (d.success) {
                    /*console.log(d);*/
                    var listas = d.data != '' ? d.data.split('¯') : [];
                    if (listas[0] != '') {
                        var listaUsuarios = listas[0] != '' ? listas[0].split('¬') : [];
                        $$grid('grd_Canal').setData(listaUsuarios);
                    }
                }
            });
        };

        //insertar
        $scope.fnEvNuevoCanal = function () {
            isNew = true;
            $scope.limpiarControlesMDLEvento();
            $$modal('mdl_Editar_Canal').setTitle('Agregar Canal');
            $$modal('mdl_Editar_Canal').show();

            
            CODUSER = '';

        };

        //Aceptar Cancelar Limpiar
        $scope.fnEvMdlEventoAceptar = function () {
            var item = {
                containers: ['FRM_MDL_Canal']
            };
            if ($fnValidarForm(item).resultado == 0) {
                var request = [{
                    VAR00: $config.token
                }, {
                    VAR01: CODUSER,
                    VAR02: TXT_MDLCANAL_DESC.value,
                    VAR03: $global.user.coduser,
                    VAR04: '#IP_CLIENTE#',
                }, {
                    ACCION: isNew ? 'C' : 'U'
                }];
                $service.CanalCUD(request, function (d) {
                    if (d.success && d.data != '') {
                        var dato = d.data.split('¦');
                        if (dato[0] == 'OK') {
                            $$modal('mdl_Editar_Canal').hide();
                            $scope.listarCanal();
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

        $scope.fnEvMdlEventoCancelar = function () {
            $$modal('mdl_Editar_Canal').hide();
            //    $scope.limpiarControlesMDL();
        };

        $scope.limpiarControlesMDLEvento = function () {
            TXT_MDLCANAL_DESC.value = '';

        };

        //Editar
        $scope.fnExEditarCanal = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-pencil btn-grid-edit hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEditarCanal(\'');
            c.push(row.IDCANAL);
            c.push('\')"></i>');
            return c.join('');
        };
        $scope.fnEvEditarCanal = function (codUser) {
            isNew = false;
            CODUSER = codUser;

            var request = [{
                token: $config.token,
            }, {
                CODUSER: CODUSER
            }, {
                RF: 'F'
            }];
            $service.CanalLista(request, function (d) {
                if (d.success) {
                    var listas = d.data != '' ? d.data.split('¯') : [];
                    if (listas.length > 0) {
                        var listaUsuarios = listas[0] != '' ? listas[0].split('¬') : [];
                        var fields = listaUsuarios[0].split('¦');
                        TXT_MDLCANAL_ID.value = fields[0];
                        TXT_MDLCANAL_DESC.value = fields[1];

                    }
                }
            });

            $$modal('mdl_Editar_Canal').setTitle('Editar Canal');
            $$modal('mdl_Editar_Canal').show();
        };

        //Eliminar
        $scope.fnExEliminarCanal = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-trash-o btn-grid-delete hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEliminarCanal(\'');
            c.push(row.IDCANAL);
            c.push('\',\'');
            c.push(row.DESCRIPCION);
            c.push('\')"></i>');
            return c.join('');
        };
        $scope.fnEvEliminarCanal = function (idCanal, desc) {
            $dialog.confirm("¿Estás seguro de quitar el canal " + desc + " ?", "Eliminar Ítem", "W", function (d) {
                if (d == true) {
                    var request = [{
                        VAR00: $config.token
                    }, {
                        VAR01: idCanal
                    }, {
                        VAR02: 'D'
                    }];
                    $service.CanalCUD(request, function (d) {
                        if (d.success && d.data != '') {
                            var dato = d.data.split('¦');
                            if (dato[0] == 'OK') {

                                $scope.listarCanal();
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
    }
    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
});