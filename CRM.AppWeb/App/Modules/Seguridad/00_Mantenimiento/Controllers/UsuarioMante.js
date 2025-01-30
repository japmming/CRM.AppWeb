define([$appName,
    "UsuarioMante",
    ['TIPOUSUARIO', 'SECTORISTA']
], function (module, namespace, args) {
    "use strict";
    var service = function ($service, $http) {
        $service.usuarioListas = function (item, callback) {
            return $http({
                url: "Usuarios/Listar",
                data: item,
                method: "post",
                callback: callback
            });
        };
        $service.usuarioCUD = function (item, callback) {
            return $http({
                url: "Usuarios/CUD",
                isFormData: true,
                formData: item,
                method: "post",
                callback: callback
            });
        };
        $service.anotacionesListar = function (item, callback) {
            return $http({
                url: "Usuarios/Listar_Anotaciones",
                data: item,
                method: "post",
                callback: callback
            });
        };
        $service.AnotacionesCUD = function (item, callback) {
            return $http({
                url: "Usuarios/CUD_Anotaciones",
                data: item,
                method: "post",
                callback: callback
            });
        };

        $service.Usuario_DescargarFoto = function (item, callback) {
            return $http({
                url: "Usuarios/DESCARGAR_FOTO",
                data: item,
                responseType: 'blob',
                method: "post",
                callback: callback
            });
        };
    };
    var controller = function ($scope, $service) {
        var MB_IMG_MAX = $global.variables.MB_MAX_FILE;
        var BOL_TXT_A1C1 = false;
        var listaModificada = [];
        var isNew = false;
        var VL_DATO = $global.lists.TIPOUSUARIO;
        var VL_TIPOS;
        var FechaActual = new Date();
        var isNew = false;
        var CODUSER = '';
        var VL_ID = '';
        let arr_titulo = ['Datos', 'Tipo']

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
                //header: "",
                propertie: "opcEditar",
                typeData: "A",
                //typeFilter: "",
                sortHeader: false,
                showColumn: $global.permission.edit,
                width: 4,
                columnExport: false,                
                fnExtension: "fnExEditarUsuario"
            },
            {
                index: 1,
                header: "Id",
                propertie: "id",
                /*typeData: "S",*/
                typeFilter: "I",
                sortHeader: true,
                showColumn: true,
                width: 10,
                columnExport: true              
            },
            {
                index: 2,
                header: "Nombre",
                propertie: "nombre",
                /*typeData: "S",*/
                typeFilter: "I",
                sortHeader: true,
                showColumn: true,
                width: 15,
                columnExport: true                   
            },
            {
                index: 3,
                header: "Tipo Usuario",
                propertie: "tipoUsuario",
                /*typeData: "S",*/
                typeFilter: "I",
                sortHeader: true,
                showColumn: true,
                width: 15,
                columnExport: true
            },
            {
                index: 4,
                header: "Cargo",
                propertie: "cargo",
                /*typeData: "S",*/
                typeFilter: "I",
                sortHeader: true,
                showColumn: true,
                width: 10,
                columnExport: true
            },
            {
                index: 5,
                header: "C. Sistema",
                propertie: "codigoSistema",
                /*typeData: "S",*/
                typeFilter: "I",
                sortHeader: true,
                showColumn: true,
                width: 10,
                columnExport: true
            },
            {
                index: 6,
                header: "C. Operación",
                propertie: "codigoOperacion",
                /*typeData: "S",*/
                typeFilter: "I",
                sortHeader: true,
                showColumn: true,
                width: 10,
                columnExport: true
            },
            {
                index: 7,
                header: "Fec. Reg.",
                propertie: "fechaRegistro",
                /*typeData: "S",*/
                typeFilter: "I",
                sortHeader: true,
                showColumn: true,
                width: 10,
                columnExport: true
            },
            {
                index: 8,
                header: "Estado",
                propertie: "estado",
                typeData: "A",
                typeFilter: "I",
                sortHeader: true,
                showColumn: true,
                width: 10,
                columnExport: true,
                fnExtension: "fnExEstadoAsociado"
            },
            {
                index: 9,
                /*header: "",*/
                propertie: "opcEliminar",
                typeData: "A",
                /*typeFilter: "",*/
                sortHeader: false,
                showColumn: $global.permission.delete,
                width: 4,
                columnExport: false,
                fnExtension: "fnExEliminarUsuario"
            }];
            _btnOptions = {
                btnid: [],
                names: [],
                icons: [],
                class: [],
                fnEvents: []
            };

            $$modal('mdl_MUS_Usuario').create({
                WithScrollY: true,
                Width: 'md',
                Title: '',
                ButtonNames: ['Aceptar', 'Cancelar'],
                ButtonClass: ['btn-save-ico', 'btn-cancel-ico'],
                FnActions: ['fnEvMdlUsuarioAceptar', 'fnEvMdlUsuarioCancelar'],
                Namespace: namespace
            });

            $$tabs('tab_MDLUsuario').create({
                //titles: ['Datos', 'Tipo'],
                titles: arr_titulo,
            });

            $$grid('grd_MUS_Usuarios').create({
                columnProperties: _columnProperties,
                //headers: ['', 'Id', 'Nombre', 'Tipo Usuario', 'Cargo', 'C. Sistema', 'C. Operación', 'Fec. Reg.', 'Estado', ''],
                //properties: ['opcEditar', 'id', 'nombre', 'tipoUsuario', 'cargo', 'codigoSistema', 'codigoOperacion', 'fechaRegistro', 'estado', 'opcEliminar'],
                //typesData: ['A', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'A', 'A'],
                //typesFilter: ['', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', ''],
                //sortHeader: [false, true, true, true, true, true, true, true, true, false],
                //showColumns: [true, true, true, true, true, true, true, true, true, true],
                //widths: [3, 6, 20, 20, 15, 10, 9, 6, 8, 3],
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
                fnBtnNew: 'fnEvNuevoUsuario',
                fnBtnEdit: '',
                fnBtnDelete: '',
                fnBtnDeleteMultiple: '',
                fnBtnRefresh: 'listarUsuarios',
                /*fnExtensions: ['fnExEditarUsuario', '', '', '', '', '', '', '', 'fnExEstadoAsociado', 'fnExEliminarUsuario'],*/
                namespace: namespace


            });



        };
        $scope.cargarDatos = function () {
            $scope.cargarCombos();
            $scope.cargarTipoUsuario();
            $scope.listarUsuarios();
            $fnValidarCampos({
                containers: ['FRM_MDL_USUARIO']
            });
            $alertbox.create();
            //document.getElementsByName('filter_jtse-grid_grd_MUS_Usuarios').style.display = 'none'
        };
        $scope.cargarCombos = function () {
            let ARR_SEXO = ['F¦Femenino', 'M¦Masculino']

            $fnSetCombo({
                controlId: 'CBO_MDLUsuario_Secto',
                data: $global.lists.SECTORISTA,
                type: 'S',
                separator: '¦'
            })
            //$fnSetCombo({
            //    controlId: 'CBO_MDLUsuario_Tipos',
            //    data: $global.lists.TIPOUSUARIO,
            //    type: 'S',
            //    separator: '¦'
            //})

            $fnSetCombo({
                controlId: 'CBO_MDLUsuario_Sexo',
                data: ARR_SEXO,
                type: 'S',
                separator: '¦'
            })
        };
        $scope.configurarEventos = function () {
            //IMG_MDLUsuario_Usuar.src = $urlBase + "Resources/Images/Image_Default.png";
            var VI_USUMANTE_N = '';
            var VI_USUMANTE_1 = '';
            var BOL_TXT_USUMANTE = false;

            //document.getElementById('CHEK_MDLUsuario_TIPO_43').addEventListener("change", function () {
            //    if (document.getElementById('CHEK_MDLUsuario_TIPO_43').checked == true) {
            //        DIV_MDLUsuario_Secto.style.display = 'block';
            //        CBO_MDLUsuario_Secto.classList.add('required');
            //    } else {
            //        DIV_MDLUsuario_Secto.style.display = 'none';
            //        CBO_MDLUsuario_Secto.classList.remove('required');
            //    }
            //});

            BTN_MDLUsuario_Usuar_Adj.onclick = function () {
                if (TXT_MDLUsuario_ID.value.trim() != '') {
                    TXT_MDLUsuario_ID.parentElement.classList.remove('has-error');
                    FIL_MDLUsuario_Usuar.click();
                } else {
                    TXT_MDLUsuario_ID.parentElement.classList.add('has-error');
                    $alertbox.show('Tiene que ingresar un ID', 'E', 4);
                }
            };
            FIL_MDLUsuario_Usuar.onchange = function () {
                if (this.files[0] != undefined) {
                    var n = this.files[0].name.split('.').length;
                    var ext = this.files[0].name.split('.')[n - 1].toUpperCase();
                    if (ext == "PNG" || ext == "JPG" || ext == "JPEG" || ext == "BMP") {
                        if (this.files[0].size <= MB_IMG_MAX) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                IMG_MDLUsuario_Usuar.src = e.target.result;
                            };
                            reader.readAsDataURL(this.files[0]);
                            TXT_MDLUsuario_Usuar.value = TXT_MDLUsuario_ID.value;
                        } else {
                            $dialog.alert('El archivo que intenta subir supera las 2MB permitidas.', 'Información', 'E');
                            this.files = null;
                            TXT_MDLUsuario_Usuar.value = "";
                            //FIL_MDLUsuario_Usuar.files[0] = undefined;
                        }
                    } else {
                        $dialog.alert('El archivo que intenta subir es de extensión .' + ext, 'Información', 'E');
                        this.files = null;
                        TXT_MDLUsuario_Usuar.value = "";
                        //FIL_MDLUsuario_Usuar.files[0] = undefined;
                    }
                } else {
                    $alertbox.show('Error al adjuntar archivo', 'E', 4);
                }
            };
            BTN_MDLUsuario_Usuar_Des.onclick = function () {
                var request = [{
                    VAR01: TXT_MDLUsuario_ID.value,
                }];
                $service.Usuario_DescargarFoto(request, function (d) {
                    if (d.success) {
                        if (d.data != '') {
                            var blob_FILE = d.data;
                            if (blob_FILE.size > 0) {
                                var fileURL = URL.createObjectURL(blob_FILE);
                                var a = document.createElement('A');
                                a.download = document.getElementById('TXT_MDLUsuario_ID').value + '.JPG';
                                a.href = fileURL;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            } else {
                                $alertbox.show('El archivo solicitado no existe en el servidor', 'E', 6);
                            }
                        } else {
                            $alertbox.show('Falla de descarga intentar mas tarde', 'E', 6);
                        }
                    }
                });
            };

            TXT_MDLUsuario_ID.onkeyup = function () {
                TXT_MDLUsuario_Usuar.value = '';
                //FIL_MDLUsuario_Usuar.files[0] = undefined;
                FIL_MDLUsuario_Usuar.files = null;
                IMG_MDLUsuario_Usuar.src = '';
            };
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
                    if (listas.length > 0) {
                        var listaUsuarios = listas[0] != '' ? listas[0].split('¬') : [];
                        $$grid('grd_MUS_Usuarios').setData(listaUsuarios);
                        listaModificada = listaUsuarios;
                    }
                }
            });
        };

        $scope.fnEvNuevoUsuario = function () {
            isNew = true;
            TXT_MDLUsuario_ID.value = '';
            TXT_MDLUsuario_ID.removeAttribute('disabled');
            $$modal('mdl_MUS_Usuario').setTitle('Agregar Usuario');
            $$modal('mdl_MUS_Usuario').show();
            TXT_MDLUsuario_ID.focus();
            CODUSER = '';
            $scope.limpiarControlesMDL();
        };
        $scope.fnExEditarUsuario = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-pencil btn-grid-edit hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEditarUsuario(\'');
            c.push(row.id);
            c.push('\')"></i>');
            return c.join('');
        };
        $scope.fnEvEditarUsuario = function (codUser) {
            isNew = false;
            CODUSER = codUser;
            TXT_MDLUsuario_ID.value = CODUSER;
            TXT_MDLUsuario_ID.setAttribute('disabled', 'disabled');

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
                        /*CBO_MDLUsuario_Tipos.value = fields[0];*/
                        TXT_MDLUsuario_Nombr.value = fields[1];
                        TXT_MDLUsuario_Cargo.value = fields[2];
                        TXT_MDLUsuario_ClvSi.value = fields[3];
                        TXT_MDLUsuario_ClvOp.value = fields[4];
                        TXT_MDLUsuario_Email.value = fields[5];
                        CHK_MDLUsuario_Dispo.checked = fields[6] == '0' ? false : true;
                        TXT_MDLUsuario_Telfo.value = fields[7];
                        TXT_MDLUsuario_Celul.value = fields[9];
                        TXT_MDLUsuario_Anexo.value = fields[8];
                        TXT_MDLUsuario_Cread.value = fields[10];
                        TXT_MDLUsuario_UltFh.dateValue = fields[11];
                        $scope.marcarTipoUsuario(fields[12]);
                        CBO_MDLUsuario_Secto.value = fields[13];
                        CHK_MDLUsuario_activo.checked = fields[14] == '0' ? false : true;
                        TXT_MDLUsuario_FechaNacimiento.dateValue = fields[15];

                        CHK_MDLUsuario_Conexion_Ext.checked = fields[16] == '0' ? false : true;
                        if (fields[17] == '') { CBO_MDLUsuario_Sexo.selectedIndex = 0; }
                        else { CBO_MDLUsuario_Sexo.value = fields[17]; }
                        TXT_MDLUsuario_Direccion.value = fields[18];

                    }

                    var request = [{
                        VAR01: TXT_MDLUsuario_ID.value,
                    }];
                    $service.Usuario_DescargarFoto(request, function (d) {
                        if (d.success) {
                            var blob_FILE = d.data;
                            if (blob_FILE.size > 0) {
                                //var blob = new Blob([blob_FILE], { "type": "image/jpg" });
                                //blob_img_tmp = URL.createObjectURL(blob_FILE);
                                IMG_MDLUsuario_Usuar.src = URL.createObjectURL(blob_FILE);
                                TXT_MDLUsuario_Usuar.value = CODUSER;
                                TXT_MDLUsuario_Usuar.setAttribute('disabled', 'disabled');
                            } else {
                                IMG_MDLUsuario_Usuar.src = '';
                            }
                        } else {
                            IMG_MDLUsuario_Usuar.src = '';
                        }
                    });

                }
            });

            $$modal('mdl_MUS_Usuario').setTitle('Editar Usuario');
            $$modal('mdl_MUS_Usuario').show();
        };
        $scope.fnExEliminarUsuario = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-trash-o btn-grid-delete hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEliminarUsuario(\'');
            c.push(index);
            c.push('\')"></i>');
            return c.join('');
        };
        $scope.fnEvEliminarUsuario = function (index) {
            var fields = $jt['jtse-grid_' + 'grd_MUS_Usuarios'].matrix[index];
            var CODUSER = fields[1];
            var NOMUSER = fields[2];
            $dialog.confirm("¿Estás seguro de eliminar el usuario " + CODUSER + ' - ' + NOMUSER + " ?", "Eliminar Ítem", "W", function (d) {
                if (d == true) {
                    var item = [{
                        token: $config.token
                    }, {
                        CODUSER: CODUSER
                    }, {
                        ACCION: 'D'
                    }];

                    var request = {
                        data: "¯" + module.jsonToString(item) + "¯",
                        FILE_IMG: FIL_MDLUsuario_Usuar.files[0]
                    };

                    $service.usuarioCUD(request, function (d) {
                        if (d.success && d.data != '') {
                            var dato = d.data.split('¦');
                            if (dato[0] == 'OK') {
                                $scope.listarUsuarios();
                                $alert.show('Se eliminó correctamente', 'S');
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

        $scope.cargarTipoUsuario = function () {
            var c = [];
            var Column = [];
            for (var i = 0; i < VL_DATO.length; i++) {
                Column = VL_DATO[i].split('¦');
                c.push('<div class="col-sm-8">');
                c.push('<div class="form-group">')
                c.push('<div class="col-2">');
                c.push('<input type="checkbox" id="CHEK_MDLUsuario_TIPO_' + Column[0] + '"/>');
                c.push('</div>');
                c.push('<label class="control-label col-22 hand text-left" id="LBL_MDLUsuario_TIPO_' + Column[0] + '">' + Column[0] + ' - ' + Column[1] + '</label>');
                c.push('</div>');
                c.push('</div>');
            }
            DIV_MDLUsuario_TIPO.innerHTML = c.join('');
            for (var i = 0; i < VL_DATO.length; i++) {
                Column = VL_DATO[i].split('¦');
                document.getElementById('LBL_MDLUsuario_TIPO_' + Column[0]).addEventListener('click', function () {
                    document.getElementById('CHK' + this.id.substr(3)).click();
                });
            }
        };
        $scope.marcarTipoUsuario = function (Dato) {
            if (Dato != '') {
                var VI_Lista = Dato.split('-');
                for (var i = 0; i < VI_Lista.length; i++) {
                    document.getElementById('CHEK_MDLUsuario_TIPO_' + VI_Lista[i]).checked = true;
                }
                //if (document.getElementById('CHEK_MDLUsuario_TIPO_43').checked) {
                //    DIV_MDLUsuario_Secto.style.display = 'block';
                //    CBO_MDLUsuario_Secto.classList.add('required');
                //} else {
                //    DIV_MDLUsuario_Secto.style.display = 'none';
                //    CBO_MDLUsuario_Secto.classList.remove('required');
                //}
            }
        };

        $scope.fnEvMdlUsuarioAceptar = function () {
            var item = {
                containers: ['FRM_MDL_USUARIO']
            };
            $scope.fnGuardarVL_Tipos();
            if ($fnValidarForm(item).resultado == 0) {
                var itemData = [{
                    token: $config.token,
                }, {
                    /*01*/ CODUSER: TXT_MDLUsuario_ID.value,
                    /*02*/ TIPOUSER: '', //CBO_MDLUsuario_Tipos.value,
                    /*03*/ NOMUSER: TXT_MDLUsuario_Nombr.value,
                    /*04*/ CARGUSER: TXT_MDLUsuario_Cargo.value,
                    /*05*/ PASSUSER: TXT_MDLUsuario_ClvSi.value,
                    /*06*/ PASSOPER: TXT_MDLUsuario_ClvOp.value,
                    /*07*/ ZONEUSER: CBO_MDLUsuario_Secto.value,
                    /*08*/ EMAILEJEC: TXT_MDLUsuario_Email.value,
                    /*09*/ FLG_DISPONIBLE: CHK_MDLUsuario_Dispo.checked ? '1' : '0',
                    /*10*/ TELEFONO: TXT_MDLUsuario_Telfo.value,
                    /*11*/ ANEXO: TXT_MDLUsuario_Anexo.value,
                    /*12*/ CELULAR: TXT_MDLUsuario_Celul.value,
                    /*13*/ IP_MODIFICACION: '#IP_CLIENTE#',
                    /*14*/ ID_USUARIO_MOD: $global.user.coduser,
                    /*15*/ ID_TIPOUSER: VL_TIPOS,
                    /*16*/ FLG_ESTADO: CHK_MDLUsuario_activo.checked ? '1' : '0',
                    /*17*/ FCH_NACIMIENTO: TXT_MDLUsuario_FechaNacimiento.dateValue,
                    /*18*/ FLG_EXTRANJERO: CHK_MDLUsuario_Conexion_Ext.checked ? '1' : '0',
                    /*19*/ SEXO: CBO_MDLUsuario_Sexo.value,
                    /*10*/ DIRECCION: TXT_MDLUsuario_Direccion.value
                }, {
                    ACCION: isNew ? 'C' : 'U'
                }];
                /*console.log(module.jsonToString(itemData));*/
                var request = {
                    data: "¯" + module.jsonToString(itemData) + "¯",
                    FILE_IMG: FIL_MDLUsuario_Usuar.files[0]
                };
                var edad = calcularEdad(TXT_MDLUsuario_FechaNacimiento.dateValue);
                if (edad < 18) {
                    $alert.show('Fecha de nacimiento inválida', 'E');
                } else {
                    $service.usuarioCUD(request, function (d) {
                        if (d.success && d.data != '') {
                            if (d.data == 'OK') {
                                $$modal('mdl_MUS_Usuario').hide();
                                $scope.cargarDatos();
                                $alert.show('Se registró satisfactoriamente.', 'S');
                            }
                            else {
                                $alert.show(d.data, 'E');
                            }
                        }
                    });                  
                }
                
            } else {
                $alert.show('Error en la validación de datos.', 'E');
            }
        };
        $scope.fnEvMdlUsuarioCancelar = function () {
            $$modal('mdl_MUS_Usuario').hide();
            $scope.limpiarControlesMDL();
        };

        function calcularEdad(fecha_nacimiento) {
            var hoy = new Date();
            var cumpleanos = new Date(fecha_nacimiento);
            var edad = hoy.getFullYear() - cumpleanos.getFullYear();
            var m = hoy.getMonth() - cumpleanos.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
                edad--;
            }
            return edad;
        }


        $scope.limpiarControlesMDL = function () {
            TXT_MDLUsuario_ID.value = '';
            TXT_MDLUsuario_Nombr.value = '';
            TXT_MDLUsuario_Cargo.value = '';
            TXT_MDLUsuario_ClvSi.value = '';
            TXT_MDLUsuario_ClvOp.value = '';
            TXT_MDLUsuario_Email.value = '';
            TXT_MDLUsuario_Usuar.value = '';
            CHK_MDLUsuario_Dispo.checked = false;
            TXT_MDLUsuario_Telfo.value = '';
            TXT_MDLUsuario_Celul.value = '';
            TXT_MDLUsuario_Anexo.value = '';
            TXT_MDLUsuario_Cread.value = '';
            TXT_MDLUsuario_UltFh.value = '';
            CBO_MDLUsuario_Secto.value = '';
            CHK_MDLUsuario_activo.checked = false;
            TXT_MDLUsuario_FechaNacimiento.value = '';
            var Column = [];
            for (var i = 0; i < VL_DATO.length; i++) {
                Column = VL_DATO[i].split('¦');
                document.getElementById('CHEK_MDLUsuario_TIPO_' + Column[0]).checked = false;
            }
            IMG_MDLUsuario_Usuar.src = '';
            CBO_MDLUsuario_Sexo.value = '';
        };

        $scope.validacionFiles = function (INP) {
            var BOL_FILE = false;
            var msjerror = 0;
            var nombre, c, type;
            if (INP.files.length != 0) {
                if (INP.files[0].name != undefined) {
                    nombre = INP.files[0].name;
                    c = nombre.split('.').length;
                    //carro.pdf => c = 2
                    //carro. rojo .xml => c = 3
                    if (c > 0) {
                        c = c - 1;
                        type = nombre.split('.')[c];
                        if (type.toUpperCase() == 'PNG' || type.toUpperCase() == 'JPG' || type.toUpperCase() == 'JPEG') {
                            if (INP.files[0].size < MB_IMG_MAX) {
                                BOL_FILE = true;
                            } else {
                                msjerror = 1;
                            }
                        } else {
                            msjerror = 2;
                        }
                    }
                }
            }
            if (!BOL_FILE) {
                if (msjerror == 1) {
                    $alert.show('El archivo que intenta subir supera las 5MB permitidas.', 'E');
                } else if (msjerror == 2) {
                    $alert.show('El archivo que intenta subir es de extensión .' + type, 'E');
                }
            }
            return BOL_FILE
        };

        $scope.fnGuardarVL_Tipos = function () {
            var Column = [];
            var c = [];
            for (var i = 0; i < VL_DATO.length; i++) {
                Column = VL_DATO[i].split('¦');
                if (document.getElementById('CHEK_MDLUsuario_TIPO_' + Column[0]).checked == true) {
                    c.push(Column[0]);
                }
            }
            //console.log(c.join())
            //console.log(c.join('-'))
            VL_TIPOS = c.join('-');
        }
        $scope.valorDisponible = function () {
            var valordisponiblecheck;
            document.getElementById('chb_MUS_MdlUsuario_DISPO').checked = valordisponiblecheck;
            var valordisponibletext = document.getElementById('txt_MUS_MdlUsuario_DISPO').value;
            if (valordisponiblecheck) {

                document.getElementById('txt_MUS_MdlUsuario_DISPO').value == '0';
            } else {

                document.getElementById('txt_MUS_MdlUsuario_DISPO').value == '1';
            }

        }

        $scope.fnExEstadoAsociado = function (row, index) {
            var c = [];
            //console.log(row);
            c.push('<span');
            if (row.estado.trim().toUpperCase() === 'ACTIVO') {
                c.push(' class="span-Activo" ');
                c.push('>');
            } else {
                c.push(' class="span-Moroso" ');
                c.push('>');
            }
            c.push(row.estado.trim().toUpperCase());
            c.push('</span>');


            return c.join('');
        };

        $scope.limpiarControlesMDLAnotaciones = function () {
            TXT_MDLAnotaciones_Anotaciones.value = '';
            txt_MDLAnotaciones_Fecha.value = $frConvertToDateString(FechaActual);
            MDLAnotaciones_Hora.value = '';
        };
    };
    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
});