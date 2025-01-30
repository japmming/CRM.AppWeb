define([$appName,
    "Campana",
    ['LIST_USUARIO_ASESOR_SUPERVISOR_ACTIVOS']
], function (module, namespace, args) {
    "use strict";
    var service = function ($service, $http) {
        $service.usuarioListas = function (item, callback) {
            return $http({
                url: "Campana/Listar",
                data: item,
                method: "post",
                callback: callback
            });

        };

        $service.CampanaCUD = function (item, callback) {
            return $http({
                url: "Campana/CUD_Campana",
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
        var VL_DATO = $global.lists.LIST_USUARIO_ASESOR_SUPERVISOR_ACTIVOS;
        var VL_USU;
        let arr_titulo = ['Datos', 'Asignar']

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

            //console.log($global);

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
                fnExtension: "fnExEditarCampana",
                

            },
            {
                index: 1,
                header: "IdCampana",
                propertie: "idCampana",
                sortHeader: true,
                showColumn: true,
                /*typeData: "S",*/
                typeFilter: "I",
                columnExport: false,
                width: 5,
            },
            {
                index: 2,
                header: "Código",
                propertie: "codigo",               
                sortHeader: true,
                showColumn: true,
                typeFilter: "I",
                columnExport: true,
                width: 10,                              
            },
            {
                index: 3,
                header: "Campaña",
                propertie: "nombreCampana",
                sortHeader: true,
                showColumn: true,
                typeFilter: "I",
                columnExport: true,
                width: 20,
            },
            {
                index: 4,
                header: "Usuarios",
                propertie: "nombreUsuarios",
                sortHeader: true,
                showColumn: true,
                typeFilter: "I",
                columnExport: true,
                width: 20,
            },
            {
                index: 5,
                header: "Fecha Inicio",
                propertie: "fch_Inicio",
                typeData: "D",
                sortHeader: true,
                showColumn: true,
                typeFilter: "I",
                columnExport: true,
                width: 20,
            },
            {
                index: 6,
                header: "Fecha Fin",
                propertie: "fch_Fin",
                typeData: "D",
                sortHeader: true,
                showColumn: true,
                typeFilter: "I",
                columnExport: true,
                width: 20,
            },
            {
                index: 7,
                header: "Lead en Curso",
                propertie: "lead_EnCurso",
                typeData: "S_C",
                sortHeader: true,
                showColumn: true,
                typeFilter: "I",
                columnExport: true,
                width: 10,
            },
            
            {
                index: 8,
                header: "",
                propertie: "ver_Evento",
                typeData: "A",
                sortHeader: false,
                showColumn: true,
                columnExport: false,
                width: 10,
                fnExtension: "fnExVerEvento"
            },
            {
                index: 9,
                /*header: "",*/
                propertie: "opcEliminar",
                typeData: "A",
                sortHeader: false,
                showColumn: $global.permission.delete,
                columnExport: false,
                width: 5,
                fnExtension: "fnExEliminarCampana"
            }],
            _btnOptions = {
                btnid: [],
                names: [],
                icons: [],
                class: [],
                fnEvents: []
            };

            $$grid('grd_Campana').create({
                columnProperties: _columnProperties,
                //headers: ['', 'Código', 'Campaña', 'Fecha Inicio', 'Fecha Fin', 'Lead en Curso', 'IdCampana', 'Ver Evento', ''],
                //properties: ['opcEditar', 'codigo', 'nombreCampana', 'fch_Inicio', 'fch_Fin', 'lead_EnCurso', 'idCampana', 'ver_Evento', 'opcEliminar'],
                //typesData: ['A', 'S', 'S', 'D', 'D', 'S_C', 'S', 'A', 'A'],
                //typesFilter: ['', 'I', 'I', 'I', 'I', 'I', 'I', '', ''],
                //sortHeader: [false, true, true, true, true, true, true, false, false],
                //showColumns: [true, true, true, true, true, true, false, true, true],
                //widths: [3, 6, 20, 15, 15, 10, 6, 6, 3],
                //indexs: [0, 1, 2, 3, 4, 5, 6, 7, 8],
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
                fnBtnNew: 'fnEvNuevoCampana',
                fnBtnEdit: '',
                fnBtnDelete: '',
                fnBtnDeleteMultiple: '',
                fnBtnRefresh: 'listarUsuarios',
                /*fnExtensions: ['fnExEditarCampana', '', '', '', '', '', '', 'fnExVerEvento', 'fnExEliminarCampana'],*/
                namespace: namespace
            });
            $$modal('mdl_Editar_Campana').create({
                WithScrollY: true,
                Width: 'sm',
                Title: '',
                ButtonNames: ['Aceptar', 'Cancelar'],
                ButtonClass: ['btn-save-ico', 'btn-cancel-ico'],
                FnActions: ['fnEvMdlCampanaAceptar', 'fnEvMdlCampanaCancelar'],
                Namespace: namespace
            });
            $$tabs('tab_MDLUsuariosCamp').create({
                //titles: ['Datos', 'Tipo'],
                titles: arr_titulo,
            });
            $$modal('MDL_lista_eventos').create({
                WithScrollY: true,
                FullScreen: true,
                Namespace: namespace
            });

        };
        $scope.cargarDatos = function () {

            $scope.listarUsuarios();
            $scope.cargarTipoUsuario();
            $fnValidarCampos({
                containers: ['FRM_MDL_CAMPANA']
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
                        $$grid('grd_Campana').setData(listaUsuarios);

                    }
                }
            });
        };

        $scope.fnEvNuevoCampana = function () {
            isNew = true;
            CODUSER = '';
            $scope.limpiarControlesMDLCampana();

            TXT_MDLCAMPANA_CODIGO.removeAttribute('disabled');
            $$modal('mdl_Editar_Campana').setTitle('Agregar Campaña');
            $$modal('mdl_Editar_Campana').show();
            
            

        };

        $scope.fnExEditarCampana = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-pencil btn-grid-edit hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEditarCampana(\'');
            c.push(row.idCampana);
            c.push('\')"></i>');
            return c.join('');
        };
        $scope.fnEvEditarCampana = function (codUser) {
            isNew = false;
            CODUSER = codUser;
            TXT_MDLCAMPANA_CODIGO.value = CODUSER;
            TXT_MDLCAMPANA_CODIGO.setAttribute('disabled', 'disabled');



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
                        //let listaUsuariosActivos = listas[1];
                        $global.lists.LIST_USUARIO_ASESOR_SUPERVISOR_ACTIVOS = listas[1].split('¬') ;
                        VL_DATO = listas[1].split('¬') ;
                        $scope.cargarTipoUsuario();
                        var fields = listaUsuarios[0].split('¦');
                        TXT_MDLCAMPANA_CODIGO.value = fields[1];
                        TXT_MDLNOMBRE_NOMBRE.value = fields[2];
                        $scope.marcarUsuario(fields[3]);
                        TXT_MDLCAMPANA_FECHA_INICIO.dateValue = fields[4];
                        TXT_MDLCAMPANA_FECHA_FIN.dateValue = fields[5];

                    }

                }
            });

            $$modal('mdl_Editar_Campana').setTitle('Editar Campaña');
            $$modal('mdl_Editar_Campana').show();
            TXT_MDLNOMBRE_NOMBRE.focus();
        };

        $scope.fnExEliminarCampana = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-trash-o btn-grid-delete hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEliminarCampana(\'');
            c.push(row.idCampana);
            c.push('\',\'');
            c.push(row.nombreCampana);
            c.push('\')"></i>');
            return c.join('');
        };
        $scope.fnEvEliminarCampana = function (idCampana, nombreCampana) {
            $dialog.confirm("¿Estás seguro de quitar la campaña " + nombreCampana + "?", "Eliminar Ítem", "W", function (d) {
                if (d == true) {
                    var request = [{
                        VAR00: $config.token
                    }, {
                        VAR01: idCampana
                    }, {
                        VAR02: 'D'
                    }];
                    $service.CampanaCUD(request, function (d) {
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

        $scope.fnEvMdlCampanaCancelar = function () {         
            $$modal('mdl_Editar_Campana').hide();
            $scope.limpiarControlesMDLCampana();
        };
        $scope.fnEvMdlCampanaAceptar = function () {         
                var item = {
                    containers: ['FRM_MDL_CAMPANA']
                };
                $scope.fnGuardarVL_USU();
                    if ($fnValidarForm(item).resultado == 0) {
                        if ($fnValidarFechaMin(TXT_MDLCAMPANA_FECHA_FIN.dateValue, TXT_MDLCAMPANA_FECHA_INICIO.dateValue) == true) {
                            var request = [{
                                VAR00: $config.token
                            }, {
                                VAR01: TXT_MDLNOMBRE_NOMBRE.value,
                                VAR02: TXT_MDLCAMPANA_CODIGO.value,
                                VAR03: VL_USU,
                                VAR04: TXT_MDLCAMPANA_FECHA_INICIO.dateValue,//$formatDateStandar(TXT_MDLCAMPANA_FECHA_INICIO.value),
                                VAR05: TXT_MDLCAMPANA_FECHA_FIN.dateValue,//$formatDateStandar(TXT_MDLCAMPANA_FECHA_FIN.value),
                                VAR06: $global.user.coduser,
                                VAR07: '#IP_CLIENTE#',
                                VAR08: CODUSER
                            }, {
                                ACCION: isNew ? 'C' : 'U'
                            }];
                            $service.CampanaCUD(request, function (d) {
                                if (d.success && d.data != '') {
                                    var dato = d.data.split('¦');
                                    if (dato[0] == 'OK') {
                                        $$modal('mdl_Editar_Campana').hide();
                                        $scope.cargarDatos();
                                        //$scope.listarUsuarios();
                                        $alert.show(dato[1], 'S');
                                    }
                                    else {
                                        $alert.show(dato[1], 'E');
                                    }
                                } else {
                                    $alertbox.show($msg.error.server, 'E');
                                }
                            });
                        }else {
                            $alertbox.show("La fecha final no puede ser menor a la fecha de inicio", "E", 4);
                        }
                    } else {
                        $alert.show('Completar los campos.', 'E');
                    }
                
                 
            
        };

        $scope.fnExVerEvento = function (row, index) {
            var c = [];
            c.push('<button class="btn btn-pago"');
            c.push(' onclick="$jt[\'' + namespace + '\'].fnVerEvento(\'' + index + '\')">');
            c.push('VER EVENTO</button>');
            return c.join('');



        };

        $scope.fnVerEvento = function (index) {
            var fields = $jt['jtse-grid_' + 'grd_Campana'].matrix[index];
            var IDCAMPANA = fields[1];
            var NOMBRE = fields[3];

            module.goSubPage("Eventos", 'VW-MDLLista_Eventos', {
                frmVerEventos: {
                    _idCampana: IDCAMPANA,
                    _nombreCampana: NOMBRE
                }
            });
            $$modal('MDL_lista_eventos').show();
        };

        $scope.limpiarControlesMDLCampana = function () {
            TXT_MDLNOMBRE_NOMBRE.value = '';
            TXT_MDLCAMPANA_CODIGO.value = '';
            TXT_MDLCAMPANA_FECHA_INICIO.value = '';
            TXT_MDLCAMPANA_FECHA_FIN.value = '';
            var Column = [];
            for (var i = 0; i < VL_DATO.length; i++) {
                Column = VL_DATO[i].split('¦');
                document.getElementById('CHEK_MDLUsuario_USER_' + Column[0]).checked = false;
            }
        };

        $scope.cargarTipoUsuario = function () {
            var c = [];
            var Column = [];
            for (var i = 0; i < VL_DATO.length; i++) {
                Column = VL_DATO[i].split('¦');
                c.push('<div class="col-sm-12">');
                c.push('<div class="form-group">')
                c.push('<div class="col-2">');
                c.push('<input type="checkbox" id="CHEK_MDLUsuario_USER_' + Column[0] + '"/>');
                c.push('</div>');
                c.push('<label class="control-label col-22 hand text-left" id="LBL_MDLUsuario_USER_' + Column[0] + '">' + Column[1] + '</label>');//+ Column[0] + ' - '
                c.push('</div>');
                c.push('</div>');
            }
            DIV_MDLUsuarios_USER.innerHTML = c.join('');
            for (var i = 0; i < VL_DATO.length; i++) {
                Column = VL_DATO[i].split('¦');
                document.getElementById('LBL_MDLUsuario_USER_' + Column[0]).addEventListener('click', function () {
                    document.getElementById('CHK' + this.id.substr(3)).click();
                });
            }
        };

        $scope.marcarUsuario = function (Dato) {
            if (Dato != '') {
                var VI_Lista = Dato.split('-');
                for (var i = 0; i < VI_Lista.length; i++) {
                    document.getElementById('CHEK_MDLUsuario_USER_' + VI_Lista[i]).checked = true;
                }             
            }
        };

        $scope.fnGuardarVL_USU = function () {
            var Column = [];
            var c = [];
            for (var i = 0; i < VL_DATO.length; i++) {
                Column = VL_DATO[i].split('¦');
                if (document.getElementById('CHEK_MDLUsuario_USER_' + Column[0]).checked == true) {
                    c.push(Column[0]);
                }
            }
            console.log(c.join())
            console.log(c.join('-'))
            VL_USU = c.join('-');
        }
    }
    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
});