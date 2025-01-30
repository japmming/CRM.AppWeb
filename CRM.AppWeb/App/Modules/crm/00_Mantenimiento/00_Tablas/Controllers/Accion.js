define([$appName,
    "Accion"
], function (module, namespace, args) {
    "use strict";
    var service = function ($service, $http) {
        $service.AccionLista = function (item, callback) {
            return $http({
                url: "Accion/Listar",
                data: item,
                method: "post",
                callback: callback
            });
        };
        $service.AccionCUD = function (item, callback) {
            return $http({
                url: "Accion/CUD_Accion",
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
                fnExtension: "fnExEditarAccion",
            },
            {
                index: 1,
                header: "IdAccion",
                typeFilter: "",
                typeData: "S",
                propertie: 'ID_ACCION',
                sortHeader: true,
                showColumn: true,
                width: 20,
                columnExport: true,
                    
            },
            {
                index: 2,
                header: "Descripción",
                typeFilter: "",
                typeData: "S",
                propertie: 'DESC',
                sortHeader: true,
                showColumn: true,
                width: 60,
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
                fnExtension: "fnExEliminarAccion"
            }],
            _btnOptions = {
                btnid: [],
                names: [],
                icons: [],
                class: [],
                fnEvents: []
            };

            $$grid('grd_Accion').create({
                columnProperties: _columnProperties,
                //headers: ['', 'IdAccion','Descripción', ''],
                //properties: ['opcEditar', 'ID_ACCION', 'DESC', 'opcEliminar'],
                //typesData: ['A', 'S', 'S', 'A'],
                //typesFilter: ['', '', '', ''],
                //sortHeader: [false, true, true, false],
                //showColumns: [true, true, true, true],
                //widths: [3, 1, 50, 5],
                //indexs: [0, 1 , 2, 3],
                headerStyle: $controls.grid.headerStyle,
                data: [],
                borderTop: false,
                btnNew: $global.permission.insert,
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
                fnBtnNew: 'fnEvNuevaAccion',
                fnBtnEdit: '',
                fnBtnDelete: '',
                fnBtnDeleteMultiple: '',
                fnBtnRefresh: 'listarAccion',
                /*fnExtensions: ['fnExEditarAccion', '', '', 'fnExEliminarAccion'],*/
                namespace: namespace
            });
            $$modal('mdl_Editar_Accion').create({
                WithScrollY: true,
                Width: 'sm',
                Title: '',
                ButtonNames: ['Aceptar', 'Cancelar'],
                ButtonClass: ['btn-save-ico', 'btn-cancel-ico'],
                FnActions: ['fnEvMdlEventoAceptar', 'fnEvMdlEventoCancelar'],
                Namespace: namespace
            });
        };
        //cargar

        $scope.cargarDatos = function () {
            $scope.listarAccion();
            //$fnValidarCampos({
            //    containers: ['FRM_MDL_Evento']
            //});
        };

        //listar 

        $scope.listarAccion = function (codigo) {
            var request = [{
                token: $config.token,
            }, {
                CODUSER: codigo
            }, {
                RF: 'R'
            }];
            $service.AccionLista(request, function (d) {
                if (d.success) {
                    //console.log(d);
                    var listas = d.data != '' ? d.data.split('¯') : [];
                    if (listas[0] != '') {
                        var listaUsuarios = listas[0] != '' ? listas[0].split('¬') : [];
                        $$grid('grd_Accion').setData(listaUsuarios);
                    }
                }
            });
        };

        //insertar 

        $scope.fnEvNuevaAccion = function () {
            isNew = true;
            $scope.limpiarControlesMDLEvento();
            $$modal('mdl_Editar_Accion').setTitle('Agregar Accion');
            $$modal('mdl_Editar_Accion').show();


            CODUSER = '';

        };

        //aceptar cancelar limpiar

        $scope.fnEvMdlEventoAceptar = function () {
            var item = {
                containers: ['FRM_MDL_ACCION']
            };
            if ($fnValidarForm(item).resultado == 0) {
                var request = [{
                    VAR00: $config.token
                }, {

                    VAR01: CODUSER,
                    VAR02: TXT_MDLACCION_DESC.value,
                    
                }, {
                    ACCION: isNew ? 'C' : 'U'
                }];
                $service.AccionCUD(request, function (d) {
                    if (d.success && d.data != '') {
                        var dato = d.data.split('¦');
                        if (dato[0] == 'OK') {
                            $$modal('mdl_Editar_Accion').hide();
                            $scope.listarAccion();
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
            $$modal('mdl_Editar_Accion').hide();
            //    $scope.limpiarControlesMDL();
        };

        $scope.limpiarControlesMDLEvento = function () {
            TXT_MDLACCION_DESC.value = '';
            TXT_MDLACCION_ID.value = '';
        };

        //editar

        $scope.fnExEditarAccion = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-pencil btn-grid-edit hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEditarAccion(\'');
            c.push(row.ID_ACCION);
            c.push('\')"></i>');
            return c.join('');
        };

        $scope.fnEvEditarAccion = function (codUser) {
            isNew = false;
            CODUSER = codUser;
            var request = [{
                token: $config.token,
            }, {
                CODUSER: CODUSER
            }, {
                RF: 'F'
            }];
            $service.AccionLista(request, function (d) {
                if (d.success) {
                    var listas = d.data != '' ? d.data.split('¯') : [];
                    if (listas.length > 0) {
                        var listaUsuarios = listas[0] != '' ? listas[0].split('¬') : [];
                        var fields = listaUsuarios[0].split('¦');
                        TXT_MDLACCION_ID.value = fields[0];
                        TXT_MDLACCION_DESC.value = fields[1];
                    }
                }
            });

            $$modal('mdl_Editar_Accion').setTitle('Editar Accion');
            $$modal('mdl_Editar_Accion').show();
        };

        //Eliminar
        $scope.fnExEliminarAccion = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-trash-o btn-grid-delete hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEliminarAccion(\'');
            c.push(row.ID_ACCION);
            c.push('\',\'');
            c.push(row.DESC);
            c.push('\')"></i>');
            return c.join('');
        };
        $scope.fnEvEliminarAccion = function (idAccion, desc) {
            console.log(idAccion, desc);
            $dialog.confirm("¿Estás seguro de quitar el canal " + desc + " ?", "Eliminar Ítem", "W", function (d) {

                if (d == true) {
                    var request = [{
                        VAR00: $config.token
                    }, {
                        VAR01: idAccion
                    }, {
                        VAR02: 'D'
                    }];
                    $service.AccionCUD(request, function (d) {
                        if (d.success && d.data != '') {
                            var dato = d.data.split('¦');
                            if (dato[0] == 'OK') {

                                $scope.listarAccion();
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