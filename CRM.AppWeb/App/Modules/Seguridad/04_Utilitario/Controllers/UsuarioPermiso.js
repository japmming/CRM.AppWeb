define([$appName,
    "UsuarioPermiso", ["LISTADO_MODULO"]
], function (module, namespace, args) {
    "use strict";
    var service = function ($service, $http) {
        $service.layoutListas = function (item, callback) {
            return $http({
                method: "post",
                url: "Layout/Layout_Listas",
                data: item,
                callback: callback
            });
        };

        $service.usuarioListasPermiso = function (item, callback) {
            return $http({
                url: "UsuarioPermiso/LISTAR_USUARIOS",
                data: item,
                method: "post",
                callback: callback
            });
        };

        $service.ListasMenuPermisos = function (item, callback) {
            return $http({
                url: "UsuarioPermiso/LISTAR",
                data: item,
                method: "post",
                callback: callback
            });
        };

        $service.GuardarMenuPermisos = function (item, callback) {
            return $http({
                url: "UsuarioPermiso/GUARDAR_USUARIOS",
                data: item,
                method: "post",
                callback: callback
            });
        };
    };
    var controller = function ($scope, $service) {
        var data = [];
        var datos = [];
        var listaUsu = [];
        var CodigoUsuario = "";
        var codAplicacion = "";
        var nombre_usuario = "";

        //---------
        var clicks = 0;
        var delay = 300;
        var timer = null;


        $scope.init = function () {
            $scope.configurarControles();
            $scope.cargarCombos();
            $scope.cargarDatos();
            $scope.configurarEventos();
        };

        $scope.configurarControles = function () {

            $$modal('MDL_USUARIO_PERMISO').create({
                WithScrollY: true,
                Width: 'md',
                Title: '',
                //ButtonNames: ['Aceptar', 'Cancelar'],
                //ButtonClass: ['btn-save-ico', 'btn-cancel-ico'],
                //FnActions: ['', ''],
                Namespace: namespace
            });

            $$grid('GRID_UP_BUSCAR_USUARIO').create({
                title: '',
                headers: ['Código', 'Nombres', 'Estado'],
                properties: ['codigo', 'nombres', 'Estado'],
                typesData: ['S', 'S', 'S'],
                filterPosition: '',
                typesFilter: ['I', 'I', 'I'],
                sortHeader: [false, false, false],
                showColumns: [true, true, false],
                widths: [10, 50, 0],
                indexs: [0, 1, 2],
                headerStyle: $controls.grid.headerStyle,
                data: [],
                borderTop: false,
                btnNew: false,
                btnEdit: false,
                btnDelete: false,
                btnDeleteMultiple: false,
                btnRefresh: false,
                btnExportExcel: false,
                btnExportText: false,
                generalFilter: false,
                entriesPage: 10,
                rangePage: 5,
                separator: '¦',
                fnBtnNew: '',
                fnBtnEdit: '',
                fnBtnDelete: '',
                fnRowEvent: 'mostrar_Usuario',
                fnBtnRefresh: '',
                fnExtensions: ['', '', ''],
                namespace: namespace
            });
        };

        $scope.cargarCombos = function () {
            $fnSetCombo({
                controlId: 'Seleccionar_Modulos',
                data: $global.lists.LISTADO_MODULO,
                type: 'E',
                description: '--Selecciona Module--',
            });
        }

        $scope.cargarDatos = function () {

            $alertbox.create({});

            //var item = { data: $global.user.ruc + '¦' + $global.user.coduser + '¦' + $global.accessType };

            //$service.layoutListas(item, function (d) {
            //    if (d.success) {
            //        if (d.data != "") {
            //            var rpta = d.data.split('¯');

            //            //data = rpta[0].split('¬');
            //            var combo_data = rpta[1].split('¬');

            //            
            //        }
            //    }
            //});

            $scope.cargarUsuario();
        };

        $scope.configurarEventos = function () {

            Seleccionar_Modulos.onchange = function () {

                if (this.value != "") {
                    var item = {
                        containers: ['frmUsuarioPermiso']
                    }

                    if ($fnValidarForm(item).resultado == 0) {

                        var request = [{
                            token: $config.token
                        }, {
                            CODSECU: permiso_buscar_Module.value.toUpperCase(),
                            MODULO: this.value
                        }, {
                            RF: 'F'
                        }];

                        $service.ListasMenuPermisos(request, function (d) {
                            if (d.success) {
                                if (d.data != "") {
                                    datos = [];
                                    var vi_datos = d.data.split('¯');
                                    datos = vi_datos[0].split('¬');

                                    if (vi_datos[1] != "") {
                                        var opcion_a = vi_datos[1].split('¦');
                                        //console.log(opcion_a);

                                        CHX_permiso_dashboard.checked = opcion_a[0] == '1' ? true : false;
                                        CHX_permiso_notificaciones.checked = opcion_a[1] == '1' ? true : false;
                                        CHX_permiso_preg_frecuentes.checked = opcion_a[2] == '1' ? true : false;
                                        codAplicacion = opcion_a[3];
                                        CHX_permiso_grupos.checked = opcion_a[4] == '1' ? true : false;
                                    } else {
                                        CHX_permiso_dashboard.checked = false;
                                        CHX_permiso_notificaciones.checked = false;
                                        CHX_permiso_preg_frecuentes.checked = false;
                                        codAplicacion = '';
                                        CHX_permiso_grupos.checked = false;
                                    }


                                    //console.log(vi_datos);
                                    $scope.crearListadoMenu(datos);
                                    //$scope.crearTreeTable();
                                } else {
                                    $scope.limpiarListadoMenu();
                                }
                            }
                        });

                    } else {
                        $alertbox.show('Completar campos.', 'E', 5);
                        this.value = "";
                        $scope.limpiarListadoMenu();

                    }
                } else {
                    $scope.limpiarListadoMenu();
                }




                //
            };

            btb_permiso_buscar_Module.onclick = function () {
                $$modal('MDL_USUARIO_PERMISO').setTitle('Búsqueda de Usuario');
                $$modal('MDL_USUARIO_PERMISO').show();
                TXT_UP_BUSCAR_USUARIO.focus();
            };

            TXT_UP_BUSCAR_USUARIO.onkeypress = function (e) {
                if (e.keyCode == "13") {
                    $scope.search_modules(this.value, listaUsu);
                }
            };

            permiso_buscar_Module.onkeyup = function (e) {
                if (e.keyCode == "113") {
                    $$modal('MDL_USUARIO_PERMISO').setTitle('Búsqueda de Usuario');
                    $$modal('MDL_USUARIO_PERMISO').show();
                    TXT_UP_BUSCAR_USUARIO.focus();

                } else if (e.keyCode == "13") {
                    $scope.Busqueda_sin_modal(this.value);
                }
            };

            permiso_buscar_Module.onblur = function () {
                if (this.value.length > 0) {
                    if (CodigoUsuario != this.value) {
                        $scope.Busqueda_sin_modal(this.value);
                    }
                } else {
                    permiso_user_name.value = "";
                    $scope.limpiarListadoMenu();
                    Seleccionar_Modulos.value = "";
                    CodigoUsuario = "";
                    $scope.cargarEstado();
                    permiso_buscar_Module.parentNode.classList.remove('has-error');
                    permiso_user_name.parentNode.classList.remove('has-error');
                }

            };

            BTN_UP_BUSCAR.onclick = function () {
                $scope.search_modules(TXT_UP_BUSCAR_USUARIO.value, listaUsu);
            }

            UsuarioPermiso_aceptar.onclick = function () {

                var item = {
                    containers: ['frmUsuarioPermiso']
                }

                if ($fnValidarForm(item).resultado == 0) {
                    var request = [{
                        token: $config.token
                    }, {
                        usario: permiso_buscar_Module.value.toUpperCase(),
                        modulo: Seleccionar_Modulos.value,
                        aplicacion: codAplicacion
                    }, {
                        datos: $scope.enviardatos(datos)
                    }, {
                        dashboard: CHX_permiso_dashboard.checked ? '1' : '0',
                        notificaciones: CHX_permiso_notificaciones.checked ? '1' : '0',
                        preg_frecuentes: CHX_permiso_preg_frecuentes.checked ? '1' : '0',
                        grupos: CHX_permiso_grupos.checked ? '1' : '0'

                    }];

                    //console.log(request);

                    $service.GuardarMenuPermisos(request, function (d) {
                        if (d.success) {
                            console.log(d.data);
                            if (d.data != "") {
                                var rpta = d.data.split('¦');
                                if (rpta[0] == "OK") {
                                    $alertbox.show("Registro guardado.", "S", 4);
                                    codAplicacion = rpta[1];
                                } else {
                                    $alertbox.show("No se pudo guardar.", "E", 4);
                                }
                            } else {
                                $alertbox.show("Error en proceso.", "E", 4);
                            }
                        } else {
                            $alertbox.show($msg.error.server, "E", 4);
                        }
                    });

                } else {
                    $alertbox.show("Completar campos", "E", 4);
                }
            }


            permiso_refresh.onclick = function () {
                var item = {
                    containers: ['frmUsuarioPermiso']
                }

                if ($fnValidarForm(item).resultado == 0) {

                    var request = [{
                        token: $config.token
                    }, {
                        CODSECU: permiso_buscar_Module.value.toUpperCase(),
                        MODULO: Seleccionar_Modulos.value
                    }, {
                        RF: 'F'
                    }];

                    $service.ListasMenuPermisos(request, function (d) {
                        if (d.success) {
                            if (d.data != "") {
                                datos = [];
                                console.log(d.data);
                                var vi_datos_rpt = d.data.split('¯');
                                datos = vi_datos_rpt[0].split('¬');
                                $scope.crearListadoMenu(datos);
                                if (vi_datos_rpt[1] != "") {
                                    var opcion_a = vi_datos_rpt[1].split('¦');
                                    //console.log(opcion_a);

                                    CHX_permiso_dashboard.checked = opcion_a[0] == '1' ? true : false;
                                    CHX_permiso_notificaciones.checked = opcion_a[1] == '1' ? true : false;
                                    CHX_permiso_preg_frecuentes.checked = opcion_a[2] == '1' ? true : false;
                                    codAplicacion = opcion_a[3];
                                    CHX_permiso_grupos.checked = opcion_a[4] == '1' ? true : false;
                                } else {
                                    CHX_permiso_dashboard.checked = false;
                                    CHX_permiso_notificaciones.checked = false;
                                    CHX_permiso_preg_frecuentes.checked = false;
                                    codAplicacion = '';
                                    CHX_permiso_grupos.checked = false;
                                }
                                //$scope.crearTreeTable();
                            } else {
                                $scope.limpiarListadoMenu();
                            }
                        }
                    });

                } else {
                    $alertbox.show('Completar campos.', 'E', 5);
                    Seleccionar_Modulos.value = "";

                }
            }

            //---------------evento checked

            chk_usuario_permiso_acceso.onchange = function () {
                $scope.eventoCheck(5, this.checked);
            };

            chk_usuario_permiso_insertar.onchange = function () {
                $scope.eventoCheck(6, this.checked);
            };

            chk_usuario_permiso_editar.onchange = function () {
                $scope.eventoCheck(7, this.checked);
            }

            chk_usuario_permiso_eliminar.onchange = function () {
                $scope.eventoCheck(8, this.checked);
            }

            chk_usuario_permiso_excel.onchange = function () {
                $scope.eventoCheck(9, this.checked);
            }
        };

        //--------------Nuevo Proceso de Grilla-------------

        $scope.crearListadoMenu = function (lista) {
            var contenido = [], campos = [], menu;
            //console.log(lista);

            var crearmenu = function () {
                var c = [];
                var nlist = lista.length;
                var nro1;
                var obj = [];
                //var count1 = 0;

                for (var i = 0; i < nlist; i++) {
                    obj = [];
                    campos = lista[i].split('¦');
                    if (campos[0] == campos[3]) {
                        menu = BusquedaMenus(campos[0]);

                        c.push('<tr data-codigomenu="' + campos[10] + '" data-usermenuid="' + campos[11] + '">');
                        c.push('<td style="display:none">');
                        c.push(campos[0]);
                        c.push('</td>');
                        c.push('<td');

                        if (menu.length > 0) {

                            c.push(' style="padding-left: 6px;cursor:pointer;" title="' + campos[1] + '">');
                            c.push('<i class="fa fa-chevron-down" style="font-size: 12px;margin-right: 6px;" aria-hidden="true" onclick="$jt[\'' + namespace + '\'].eventoTogleList(\'' + campos[0] + '\',' + campos[0].length + ',this);"></i>');

                        } else {

                            c.push(' style="padding-left:21px;" title="' + campos[1] + '">');
                        }

                        c.push('<span style="user-select: none;" onclick="$jt[\'' + namespace + '\'].eventClick(\'' + campos[10] + '\');">' + campos[1] + '</span>');
                        c.push('</td>');
                        c.push('<td style="text-align: center;">');
                        c.push($scope.checkbox(campos[5], campos[10], 5));
                        c.push('</td>');
                        c.push('<td style="text-align: center;">');
                        c.push($scope.checkbox(campos[6], campos[10], 6));
                        c.push('</td>');
                        c.push('<td style="text-align: center;">');
                        c.push($scope.checkbox(campos[7], campos[10], 7));
                        c.push('</td>');
                        c.push('<td style="text-align: center;">');
                        c.push($scope.checkbox(campos[8], campos[10], 8));
                        c.push('</td>');
                        c.push('<td style="text-align: center;">');
                        c.push($scope.checkbox(campos[9], campos[10], 9));
                        c.push('</td>');
                        c.push('</tr>');

                        if (menu.length > 0) {
                            obj.push(campos[0]);
                            c.push(crearMenu2(menu, 1, obj));
                        }
                        //count1++;
                    }
                }
                contenido.push(c.join(''));
            };

            var crearMenu2 = function (data, nro = 0, obj = []) {
                //console.log(obj);

                var obj2 = [];
                //obj.slice();
                var c2 = [];

                /*console.log();*/
                for (var i = 0; i < data.length; i++) {

                    obj2 = [];
                    campos = data[i].split('¦');
                    menu = BusquedaMenus(campos[0]);
                    //console.log(menu);
                    obj2.push(obj.join('-'));
                    obj2.push(campos[0]);
                   //c.push('<tr data-codigomenu="' + campos[10] + '"> data-usermenuid="' + campos[11] + '"');
                    c2.push('<tr class="" data-id="' + obj2.join('-') + '" data-flag="0" data-codigomenu="' + campos[10] + '" data-usermenuid="' + campos[11] + '">');
                    c2.push('<td style="display:none">');
                    c2.push(campos[0]);
                    c2.push('</td>');
                    c2.push('<td ');

                    c2.push(' style="padding-left: ' + (16 * nro) + 'px;">');

                    if (menu.length > 0) {
                        if (data.length == (i + 1)) {
                            c2.push('<span>└</span>');
                        } else {
                            c2.push('<span>├</span>');
                        }
                        c2.push('<i class="fa fa-chevron-down" style="font-size: 12px;margin-right: 6px;" onclick="$jt[\'' + namespace + '\'].eventoTogleList(\'' + obj2.join('-') + '\',' + obj2.join('-').length + ',this);" aria-hidden="true"></i>');
                    } else {
                        if (data.length == (i + 1)) {
                            c2.push('<span style="margin-right: 5px;">└</span>');
                        }
                        else {
                            c2.push('<span style="margin-right: 5px;">├</span>');
                        }
                    }

                    c2.push('<span style="user-select: none;" onclick="$jt[\'' + namespace + '\'].eventClick(\'' + campos[10] + '\');">' + campos[1] + '</span>');
                    c2.push('</td>');
                    c2.push('<td style="text-align: center;">');
                    c2.push($scope.checkbox(campos[5], campos[10], 5));
                    c2.push('</td>');
                    c2.push('<td style="text-align: center;">');
                    c2.push($scope.checkbox(campos[6], campos[10], 6));
                    c2.push('</td>');
                    c2.push('<td style="text-align: center;">');
                    c2.push($scope.checkbox(campos[7], campos[10], 7));
                    c2.push('</td>');
                    c2.push('<td style="text-align: center;">');
                    c2.push($scope.checkbox(campos[8], campos[10], 8));
                    c2.push('</td>');
                    c2.push('<td style="text-align: center;">');
                    c2.push($scope.checkbox(campos[9], campos[10], 9));
                    c2.push('</td>');
                    c2.push('</tr>');

                    if (menu.length > 0) {
                        c2.push(crearMenu2(menu, nro + 1, obj2));
                    }
                }

                return c2.join('');
            }

            var BusquedaMenus = function (codigo) {
                var rpta = "", nfilas = lista.length, campos = [], c = [];
                for (var i = 0; i < nfilas; i++) {
                    campos = lista[i].split('¦');
                    if (campos[3] == codigo && campos[0] != codigo) {
                        c.push(lista[i]);
                    }
                }
                rpta = c.slice();
                return rpta;
            }

            crearmenu();

            listado_module.innerHTML = contenido.join('');

            $scope.cargarCheckGeneralMarcado(lista);
        };

        $scope.limpiarListadoMenu = function () {

            datos = [];

            chk_usuario_permiso_acceso.checked = false;
            chk_usuario_permiso_insertar.checked = false;
            chk_usuario_permiso_editar.checked = false;
            chk_usuario_permiso_eliminar.checked = false;
            chk_usuario_permiso_excel.checked = false;

            var c = [];

            c.push('<tr>');
            c.push('<td colspan="7" style="text-align:center">No hay Resultado</td>');
            c.push('</tr>');

            listado_module.innerHTML = c.join('');

        };

        $scope.checkbox = function (dato, id, index) {
            var rpta = "";
            if (dato == "1") {
                rpta = '<input type="checkbox" id="checbox_' + id + '_' + index + '" checked  onclick="$jt[\'' + namespace + '\'].actualizarArray(this,\'' + id + '\',' + index + ');">';
            } else {
                rpta = '<input type="checkbox" id="checbox_' + id + '_' + index + '" onclick="$jt[\'' + namespace + '\'].actualizarArray(this,\'' + id + '\',' + index + ');">';
            }
            return rpta;
        };

        //--------------proceso de busqueda de usuarios pupput

        $scope.search_modules = function (value, listado) {

            var nlistado = listado.length;
            var listasSearch = [];
            var columnas = [];

            value = value.toLowerCase();

            for (var i = 0; i < nlistado; i++) {
                columnas = listado[i].split('¦');
                if (value == "" || (columnas[2].toLowerCase().trim().indexOf(value) > -1)) {
                    listasSearch.push(columnas);
                }
            }

            $scope.pintarBusqueda(listasSearch);
        };

        //-----------------------------------------

        $scope.pintarBusqueda = function (matriz) {
            var c = [];

            var nmatriz = matriz.length;
            if (nmatriz > 0) {
                for (var i = 0; i < nmatriz; i++) {
                    c.push(matriz[i][1] + "¦" + matriz[i][2] + "¦" + matriz[i][8]);
                }
            }

            $$grid('GRID_UP_BUSCAR_USUARIO').setData(c);

        };

        $scope.mostrar_Usuario = function (row, index) {
            CodigoUsuario = row.codigo;
            permiso_buscar_Module.value = row.codigo;
            permiso_user_name.value = row.nombres;
            $scope.cargarEstado(row.Estado);
            $scope.modalclose();
            $scope.limpiarListadoMenu();
            Seleccionar_Modulos.value = "";

        };

        $scope.modalclose = function () {
            $$modal('MDL_USUARIO_PERMISO').hide();
            TXT_UP_BUSCAR_USUARIO.value = "";
            nombre_usuario = "";
            //$$grid('GRID_UP_BUSCAR_USUARIO').clearGrid();
        };

        $scope.Busqueda_sin_modal = function (value) {


            var request = [
                {
                    token: $config.token,
                }, {
                    CODUSER: value
                }, {
                    RF: 'F'
                }];

            $service.usuarioListasPermiso(request, function (d) {
                if (d.success) {
                    if (d.data != "") {
                        console.log(d.data);
                        var columnas = d.data.split('¦');
                        var objecto = {};
                        objecto.id = columnas[1];
                        CodigoUsuario = value;
                        objecto.nombre = columnas[2];
                        objecto.estado = columnas[8];
                        $scope.mostrar_cod_nom(objecto);
                        permiso_buscar_Module.parentNode.classList.remove('has-error');
                        permiso_user_name.parentNode.classList.remove('has-error');

                    } else {
                        $alert.show("Datos no encontrados.");
                        permiso_user_name.value = "";
                        $scope.limpiarListadoMenu();
                        Seleccionar_Modulos.value = "";
                        CodigoUsuario = value;
                        $scope.cargarEstado();
                        permiso_buscar_Module.parentNode.classList.remove('has-error');
                        permiso_user_name.parentNode.classList.remove('has-error');
                    }
                }
            });

        };

        $scope.mostrar_cod_nom = function (objecto) {
            permiso_user_name.value = objecto.nombre;
            $scope.cargarEstado(objecto.estado);
            $scope.limpiarListadoMenu();
            Seleccionar_Modulos.value = "";

        };

        //----------------------------------------------

        $scope.eventoTogle = function (tree, nro1 = 0, nro2 = 0) {

            if (datos.length > 0) {
                var trpadre = document.getElementById("padre_" + nro1).children[0];
                var trsubhuijo;
                if (tree == "subpadre") {
                    trsubhuijo = document.getElementById("sub_padre_" + nro1 + "_" + nro2).children[1];
                }
                var hijos;
                var contadorhijos = 0;

                if (tree == "padre") {
                    if (nro2 > 0) {
                        if (trpadre.className == "fa fa-chevron-down") {
                            trpadre.className = "fa fa-chevron-right";
                            for (var i = 0; i < nro2; i++) {
                                document.getElementById("sub_padre_" + nro1 + "_" + i).click();
                                document.getElementById("sub_padre_" + nro1 + "_" + i).parentNode.style.display = "none";

                            }
                        } else {
                            trpadre.className = "fa fa-chevron-down";
                            for (var i = 0; i < nro2; i++) {
                                document.getElementById("sub_padre_" + nro1 + "_" + i).click();
                                document.getElementById("sub_padre_" + nro1 + "_" + i).parentNode.style.display = "";
                            }
                        }
                    }
                } else {
                    if (trsubhuijo != undefined) {
                        hijos = document.getElementById("contador_" + nro1 + "_" + nro2).getAttribute("data-count");
                        contadorhijos = hijos * 1;
                        if (trsubhuijo.className == "fa fa-chevron-down") {
                            trsubhuijo.className = "fa fa-chevron-right";
                            for (var i = 0; i < contadorhijos; i++) {
                                document.getElementById("hijo_" + nro1 + "_" + nro2 + "_" + i).parentNode.style.display = "none";
                            }

                        } else {
                            trsubhuijo.className = "fa fa-chevron-down";
                            for (var i = 0; i < contadorhijos; i++) {
                                if (trpadre.className == "fa fa-chevron-down") {
                                    document.getElementById("hijo_" + nro1 + "_" + nro2 + "_" + i).parentNode.style.display = "";
                                }
                            }
                        }
                    }
                }
            }
        }

        //-------------------evento check

        $scope.actualizarArray = function (ctrl, id, index) {
            //console.log(id, index);
            var column = [];
            var bool = "";

            if (ctrl.checked) {
                bool = "1";
            } else {
                bool = "0";
            }

            var nlista = datos.length;

            for (var i = 0; i < nlista; i++) {
                column = datos[i].split('¦');
                if (column[10] == id) {
                    column[index] = bool;

                    datos[i] = column.join('¦');
                    break;
                }
            }

            $scope.cargarCheckGeneralMarcado(datos);


        };

        $scope.cargarEstado = function (valor = "") {
            if (valor == "0") {

                Permiso_usuario_Estado.classList.remove("activo");
                Permiso_usuario_Estado.classList.add("inactivo");
                Permiso_usuario_Estado.innerHTML = "Inactivo";

            } else if (valor == "1") {

                Permiso_usuario_Estado.classList.remove("inactivo");
                Permiso_usuario_Estado.classList.add("activo");
                Permiso_usuario_Estado.innerHTML = "Activo";

            } else {
                Permiso_usuario_Estado.classList.remove("activo");
                Permiso_usuario_Estado.classList.remove("inactivo");
                Permiso_usuario_Estado.innerHTML = "";
            }
        };

        $scope.enviardatos = function (d) {
            var c = [], regi = [];

            var listadoControles = listado_module.children;
            var nlistadoControles = listadoControles.length, controles, controlTr;



            //console.log(listadoControles);

            for (let i = 0; i < nlistadoControles; i++) {
                regi = [];
                controlTr = listadoControles[i];
                controles = controlTr.children;
                console.log(controles);
                regi.push((controles[2].children[0].checked) ? '1' : '0');
                regi.push((controles[3].children[0].checked) ? '1' : '0');
                regi.push((controles[4].children[0].checked) ? '1' : '0');
                regi.push((controles[5].children[0].checked) ? '1' : '0');
                regi.push((controles[6].children[0].checked) ? '1' : '0');
                regi.push(controlTr.dataset.usermenuid);
                regi.push(controlTr.dataset.codigomenu);

                c.push(regi.join('¦'));
                //c.push(controles.children[2].checked + "¦" + column[6] + "¦" + column[7] + "¦" + column[8] + "¦" + column[9] + "¦" + column[11] + "¦" + column[10]);
            }

            //console.log(c);

            //for (var i = 0; i < n; i++) {
            //    column = d[i].split('¦');
            //                                                                                       
            //    c.push(column[5] + "¦" + column[6] + "¦" + column[7] + "¦" + column[8] + "¦" + column[9] + "¦" + column[11] + "¦" + column[10]);
            //}


            console.log(c);
            return c.join('¬');
        };

        //------------------------------------------------

        $scope.cargarCheckGeneralMarcado = function (lista) {

            var nlista = lista.length;
            var column = [];

            var acceso = 0;
            var insertar = 0;
            var editar = 0;
            var eliminar = 0;
            var excel = 0;

            for (var i = 0; i < nlista; i++) {
                column = lista[i].split('¦');

                if (column[5] == "1") acceso++;

                if (column[6] == "1") insertar++;

                if (column[7] == "1") editar++;

                if (column[8] == "1") eliminar++;

                if (column[9] == "1") excel++;

            }

            chk_usuario_permiso_acceso.checked = (acceso == nlista ? true : false);
            chk_usuario_permiso_insertar.checked = (insertar == nlista ? true : false);
            chk_usuario_permiso_editar.checked = (editar == nlista ? true : false);
            chk_usuario_permiso_eliminar.checked = (eliminar == nlista ? true : false);
            chk_usuario_permiso_excel.checked = (excel == nlista ? true : false);

            /*console.log('entro');*/
        };

        $scope.eventoCheck = function (codigo, check) {

            var ndatos = datos.length;
            var column = [];
            var d = ((check) ? '1' : '0');

            var filas = listado_module.children;
            let nfilas = filas.length;
            
            //console.log(codigo, check);

            for (let i = 0; i < nfilas; i++) {
                column = datos[i].split('¦');
                column[codigo] = d;
                datos[i] = column.join('¦');
                //console.log(filas[i]);
                //console.log(filas[i].children[(codigo * 1) - 3]);
                filas[i].children[(codigo * 1) - 3].children[0].checked = check;
            }




            //$scope.crearListadoMenu(datos);
        };

        $scope.eventClick = function (id) {
            clicks++;
            if (clicks == 1) {
                timer = setTimeout(function () {
                    clicks = 0;
                    $scope.filtrarporfila(id, '1');
                }, delay);
            } else {
                clearTimeout(timer);
                clicks = 0;
                $scope.filtrarporfila(id, '0');
            }
            //console.log(id);
        };

        $scope.filtrarporfila = function (id, dato) {
            var nlista = datos.length;
            var column = [];

            //console.log(dato);

            for (var i = 0; i < nlista; i++) {
                column = datos[i].split('¦');

                if (column[10] == id) {

                    column[5] = dato;
                    column[6] = dato;
                    column[7] = dato;
                    column[8] = dato;
                    column[9] = dato;

                    datos[i] = column.join('¦');

                    break;
                }
            }

            document.getElementById('checbox_' + id + '_' + 5).checked = (dato == '0' ? false : true);           
            document.getElementById('checbox_' + id + '_' + 6).checked = (dato == '0' ? false : true);
            document.getElementById('checbox_' + id + '_' + 7).checked = (dato == '0' ? false : true);
            document.getElementById('checbox_' + id + '_' + 8).checked = (dato == '0' ? false : true);
            document.getElementById('checbox_' + id + '_' + 9).checked = (dato == '0' ? false : true);

            $scope.cargarCheckGeneralMarcado(datos);

            /* $scope.crearListadoMenu(datos);*/
        };

        //-------------------event toggle

        $scope.eventoTogleList = function (cod, n, ctrl) {
            var filas = listado_module.children;
            var nfilas = filas.length;
            var codigopadre, flag, clase = "", claseDesple = "";

            if (ctrl.classList.contains('fa-chevron-right')) {
                claseDesple = "fa fa-chevron-down";
                clase = "";
                ctrl.className = claseDesple;
            } else {
                claseDesple = "fa fa-chevron-right";
                clase = "hide";
                ctrl.className = claseDesple;
            }

            for (var i = 0; i < nfilas; i++) {
                if (filas[i].dataset.id) {

                    codigopadre = filas[i].dataset.id;
                    if (codigopadre.substr(0, n) == cod) {
                        if (codigopadre.length != n) {
                            filas[i].className = clase;
                            if (filas[i].children[1].children[1]) {
                                //console.log(filas[i].children[1].children[1].tagName);
                                if (filas[i].children[1].children[1].tagName == "I") {
                                    //console.log(filas[i].children[1].children[1]);
                                    filas[i].children[1].children[1].className = claseDesple;
                                }
                                /*console.log(.tagName);*/
                            }


                        }
                    }
                }
            }

            /*listado_module.querySelectorAll('data-id[]');*/
        };

        //------------------Listado Usuario

        $scope.cargarUsuario = function () {

            var request = [
                {
                    token: $config.token,
                }, {
                    CODUSER: ''
                }, {
                    RF: 'R'
                }];

            $service.usuarioListasPermiso(request, function (d) {
                if (d.success) {
                    if (d.data != "") {
                        var listado = d.data.split('¯');
                        listaUsu = listado[0].split('¬');
                        $scope.search_modules(TXT_UP_BUSCAR_USUARIO.value, listaUsu);

                    }
                }
            });

        }

    };

    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
});