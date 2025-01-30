define([$appName,
    "Layout"
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

        $service.LeadsLST = function (item, callback) {
            return $http({
                url: "Leads/Listar",
                data: item,
                method: "post",
                callback: callback
            });
        };

        $service.NotificacionLeida = function (item, callback) {
            return $http({
                url: "Layout/NotificacionesCUD",
                data: item,
                method: "post",
                callback: callback,
                enableLoading: false
            });
        };

        $service.ListarNotificaciones = function (item, callback) {
            return $http({
                method: "post",
                url: "Layout/ListarNotificaciones",
                data: item,
                callback: callback,
                enableLoading: false
            });
        };

        $service.LayoutUsuarioCUD = function (item, callback) {
            return $http({
                url: "Usuarios/LayoutUsuarioCUD",
                data: item,
                method: "post",
                callback: callback,
                enableLoading: false
            });
        }
    };

    var controller = function ($scope, $service) {
        let idThread;
        var isAdmin = false;
        var isAsesor = false;
        var isSupervisor = false;
        var islist = false;
        var listaAsociados = '';
        var listado_modulos = '';
        var checkMarcado = [];
        var listado = [];
        var listadoCbo = [];
        var VL_MODULO_ACTUAL = "";
        var lista_options = "";
        let contadorNotificaciones = 0, arrHeaderOcultos = [], hiloPrincipal_Not = null, hiloSecundario_Not = null,
            arrRecordatorios = [];
        //alert('layout');
        $scope.init = function () {

            if (!$fnIsMobile.any()) {
                document.body.classList.add('mobile');
            }
            if ($fnGetStorage($appName)) {

                $scope.fnCargarVariables();
                if ($global.user.coduser != 'ADMIN') {
                    //document.getElementById('imgModule').style.display = "none";
                    document.getElementById('imgDashboard').style.display = "none";
                    //document.getElementById('imgNotificacion').style.display = "none";
                }
                $scope.configurarControles();
                //$scope.CargarAsociados();
                $scope.cargarDatos();
                if ($global.user.disponible == '1') {
                    CHK_LA_Conectado.checked = true;
                    DIV_CHK_LA_Conectado.classList.add('alt');
                } else {
                    CHK_LA_Conectado.checked = false;
                    DIV_CHK_LA_Conectado.classList.remove('alt');
                }
                loadDatePicker('mm/dd/yyyy');
                window.onkeydown = function (e) { $scope.fnF5(e) };
                window.onbeforeunload = function (event) {
                    var e, k;
                    if (window.event) // IE
                    {
                        e = window.event;
                    }
                    else if (event.which) // Netscape/Firefox/Opera
                    {
                        e = event.which;
                    }
                    if (!$config.isDeveloper) {
                        if (wasPressed == false) {
                            localStorage.clear();
                            location.href = $urlBase;
                        }
                    }
                };
                var wasPressed = false;
                $scope.fnF5 = function (e) {
                    var key;
                    var k;
                    if (window.event) // IE
                    {
                        key = e.keyCode;
                        k = window.event;
                    }
                    else if (e.which) // Netscape/Firefox/Opera
                    {
                        key = e.which;
                        k = e;
                    }
                    if (wasPressed) return;
                    if (key == 116 || k.ctrlKey && key == 82) {
                        wasPressed = true;
                    }
                };
            }
            else {
                localStorage.clear();
                location.href = $urlBase;
            }

            //if ($config.DeveloperTitle.length > 0) {
            //    DIV_LAYOUT_DEVELOPER_TITLE.parentElement.style = "position: absolute;left: calc(100vw - 60%);";
            //    DIV_LAYOUT_DEVELOPER_TITLE.style = "text-align: center;";

            //    var c = [];

            //    c.push('<div style="');
            //    c.push('color: red;');
            //    c.push('line-height: 1.7;');
            //    c.push('font-size: 20px;');
            //    c.push('display: inline;');
            //    c.push('padding-left: 40px;');
            //    c.push('background-color: #ffffea;');
            //    c.push('border: 1px solid #d6d600;');
            //    c.push('padding-right: 40px;');
            //    c.push('"><span style="');
            //    c.push('vertical-align: initial;');
            //    c.push('">' + $config.DeveloperTitle + '</span></div>');

            //    DIV_LAYOUT_DEVELOPER_TITLE.innerHTML = c.join('');

            //} else {

            //    DIV_LAYOUT_DEVELOPER_TITLE.parentElement.style = "";
            //    DIV_LAYOUT_DEVELOPER_TITLE.style = "";
            //    DIV_LAYOUT_DEVELOPER_TITLE.innerHTML = "";
            //}


        };

        $scope.configurarControles = function () {
            document.getElementById('spn_LA_Version').innerHTML = 'v.' + $appVersion;
            document.getElementById('mensajeBienvenida').innerHTML = 'Bienvenido(a) <b>' + $global.user.name.split(' ')[0] + '</b>';
            $scope.fullScreen();
            $scope.configurarBotones();
            window.onresize = function () {
                $$modal().center();
            };

            $$modal('mdl_RECORDATORIO').create({
                //WithScrollY: false,
                //FullScreen: false,
                Width: 'sm',
                Title: 'Recordatorio',
                ButtonNames: ['Leido'],
                ButtonClass: ['btn-check-ico'],
                FnActions: ['fnEvRecordatorioLeido'],
                Namespace: namespace
            });

            //$$modal('mdl_PAG_LNEAS_NEGOCIO').create({
            //    WithScrollY: false,
            //    FullScreen: false,
            //    Width: 'sm',
            //    Title: 'Seleccione - Linea Negocio',
            //    ButtonNames: ['Seleccion', 'Cancelar'],
            //    ButtonClass: ['btn-check-ico', 'btn-cancel-ico'],
            //    FnActions: ['fnEvPresupuestoSeleccionar', 'fnEvPresupuestoCancelar'],
            //    Namespace: namespace
            //});
            //$$grid('grd_DATA_LINEAS_NEGOCIO').create({
            //    headers: ['', 'Código', 'Unidad', 'Descripción'],
            //    properties: ['CHECK', 'CODIGO', 'UNIDAD', 'DESCRIPCION'],
            //    typesData: ['A', 'S', 'S', 'S'],
            //    typesFilter: ['', 'I', 'I', 'I'],
            //    sortHeader: [false, false, false, false],
            //    showColumns: [true, true, true, true],
            //    widths: [20, 20, 20, 40],
            //    indexs: [0, 1, 2, 3],
            //    headerStyle: $controls.grid.headerStyle,
            //    data: [],
            //    filterPosition: '',
            //    generalFilter: false,
            //    entriesPage: 15,
            //    pagination: false,
            //    rangePage: 5,
            //    separator: '¦',
            //    borderTop: false,
            //    btnNew: false,
            //    btnEdit: false,
            //    btnDelete: false,
            //    btnDeleteMultiple: false,
            //    btnRefresh: false,
            //    btnExportExcel: false,
            //    fnRowEvent: 'FnEv_fnClickCheck',
            //    fnExtensions: ['fnExCheck', '', '', ''],
            //    showBottom: false,
            //    namespace: namespace
            //});

        };

        $scope.cargarDatos = function () {
            //$global.user.name

            var arrTipoUser = $global.user.tipousuario.split('-');
            for (var i = 0; i < arrTipoUser.length; i++) {
                if (arrTipoUser[i] == '01') {
                    isAdmin = true;
                } else if (arrTipoUser[i] == '02') {
                    isAsesor = true;
                } else if (arrTipoUser[i] == '03') {
                    isSupervisor = true;
                }
            }
            $global.usuarioAdmin = isAdmin;
            $global.usuarioAsesor = isAsesor;

            if (isAsesor) {
                document.getElementById('drop_down_notification').style.right = '-70px';
                document.getElementById('ppr_LA_User').style.right = '70px';
                //document.getElementById('drop_down_notification').style.right = '-70';
            }
            else {
                document.getElementById('drop_down_notification').style.right = '15px';
                document.getElementById('ppr_LA_User').style.right = '120px';
            }

            //alert($global.usuarioAdmin ? 'true': 'false');

            var item = { data: $global.user.ruc + '¦' + $global.user.coduser + '¦' + $global.accessType };
            $service.layoutListas(item, function (d) {
                if (d.success) {
                    $scope.show_Modules(d.data.split('¯'));
                    drop_down.children[0].onclick();

                    islist = true;
                    //document.getElementById("btn_LA_Toggle").click();
                    switch ($global.accessType) {
                        case 'PER':
                            //module.goSubPage('Inicio', 'view-Main', {
                            //    viewLayout: {
                            //        prueba: '1'
                            //    }
                            //});
                            break;
                    }
                }
            });
            //$scope.listarEquipo();
            $scope.listarNotificaciones();
            //$scope.consultarRecordatorios();
            $scope.conteoLeadsSinAsignar();
            $alertbox.create();

            if ($global.user.conexionSocket == null || $global.user.conexionSocket == '') {
                $scope.connectSocketServer()
                //idThread = setInterval(5000, $scope.connectSocketServer());
            }
        };

        $scope.fullScreen = function () {
            $scope.toogleFullScreen = false;
            document.addEventListener("fullscreenchange", function () {
                if ($scope.toogleFullScreen) $scope.toogleFullScreen = false;
                else $scope.toogleFullScreen = true;
            }, false);
            document.addEventListener("mozfullscreenchange", function () {
                if ($scope.toogleFullScreen) $scope.toogleFullScreen = false;
                else $scope.toogleFullScreen = true;;
            }, false);
            document.addEventListener("webkitfullscreenchange", function () {
                if ($scope.toogleFullScreen) $scope.toogleFullScreen = false;
                else $scope.toogleFullScreen = true;
            }, false);
            document.addEventListener("msfullscreenchange", function () {
                if ($scope.toogleFullScreen) $scope.toogleFullScreen = false;
                else $scope.toogleFullScreen = true;
            }, false);
        };

        $scope.configurarBotones = function () {
            $scope.configurarToggle();

            IMG_LOGO_HEADER.style.background = "url('" + $urlBase + "Resources/Images/ico_natcodee.png') no-repeat center left";
            //IMG_LOGO_HEADER.style.background = "url('" + $urlBase + "Resources/Images/favicon.ico') no-repeat center left";
            IMG_MODULO.src = $urlBase + "Resources/Images/modulo.png";

            IMG_LG_ESP.src = $urlBase + "Resources/Images/Flags/españa_512px.png";
            IMG_LG_ENG.src = $urlBase + "Resources/Images/Flags/ENG_512px.png";
            imgSalir.onclick = function () {
                $dialog.confirm('¿Desea salir del sistema?', "NATCODEE", "Q", function (value) {
                    if (value == true) {
                        $fnRemoveStorage($appName);
                        $fnRemoveStorage($appName + '_Parameters');
                        location.href = $urlBase;

                    }
                });
            };
            //document.getElementById('btn_LA_SalirSistema').onclick = function () {
            //    $dialog.confirm('¿Desea salir del sistema?', "GS1 Perú", "Q", function (value) {
            //        if (value == true) {
            //            location.href = $urlBase;
            //        }
            //    });
            //};
            //#region document.getElementById('btn_LA_FullScreen').onclick
            //document.getElementById('btn_LA_FullScreen').onclick = function () {
            //    var doc = document.documentElement;
            //    if (!$scope.toogleFullScreen) {
            //        if (doc.requestFullscreen) doc.requestFullscreen();
            //        else if (doc.mozRequestFullScreen) doc.mozRequestFullScreen();
            //        else if (doc.webkitRequestFullScreen) doc.webkitRequestFullScreen();
            //        else if (doc.msRequestFullscreen) doc.msRequestFullscreen();
            //    }
            //    else {
            //        if (document.exitFullscreen) document.exitFullscreen();
            //        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
            //        else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
            //        else if (document.msExitFullscreen) document.msExitFullscreen();
            //    }
            //    var i = this.children[0];
            //    if (i.className.indexOf('fa fa-compress') > -1) i.className = i.className.replace('fa fa-compress', 'fa fa-expand');
            //    else i.className = i.className.replace('fa fa-expand', 'fa fa-compress');
            //};
            //#endregion
            document.getElementById('ppr_LA_User').onmouseleave = function () {
                document.getElementById('ppr_LA_User').classList.add('hide');
            };
            document.getElementById('btn_LA_CambiarContrasenia').onclick = function () {
                module.goSubPage('UsuarioCambioPass', 'view-Main');
            };
            document.getElementById('btn_LA_VerLeads').onclick = function () {
                module.goSubPage('Leads', 'view-Main', {
                    frmVerLeads: {
                        _user: $global.user.coduser,

                    }
                });
            };
            document.getElementById('imgHelp').onclick = function () {
                if ($global.moduleCurrent == "5") {
                    module.goSubPage('PreguntasFrecuentes', 'view-Main');
                } else if ($global.moduleCurrent == "9") {//Catalogo    - Calidad
                    module.goSubPage('02_PreguntasFrecuentes', 'view-Main');
                } else if ($global.moduleCurrent == "6") { //Tesoreria - Facturacion
                    module.goSubPage('03_PreguntasFrecuentes', 'view-Main');
                } else if ($global.moduleCurrent == "7") {//Presupuesto
                    module.goSubPage('04_PreguntasFrecuentes', 'view-Main');
                } else if ($global.moduleCurrent == "8") {//Seguridad
                    module.goSubPage('05_PreguntasFrecuentes', 'view-Main');
                } else if ($global.moduleCurrent == "11") {//Consultoria
                    module.goSubPage('06_PreguntasFrecuentes', 'view-Main');
                } else if ($global.moduleCurrent == "10") {//Educacion
                    module.goSubPage('07_PreguntasFrecuentes', 'view-Main');
                } else {
                    module.goSubPage('PreguntasFrecuentes', 'view-Main');
                }
            };

            imgDashboard.onclick = function () {
                if ($global.moduleCurrent == "5") {
                    module.goSubPage('01_Dashboard', 'view-Main', { viewLayout: { module: $global.moduleCurrent } });
                } else if ($global.moduleCurrent == "9") {//Catalogo    - Calidad
                    module.goSubPage('02_Dashboard', 'view-Main', { viewLayout: { module: $global.moduleCurrent } });
                } else if ($global.moduleCurrent == "6") { //Tesoreria - Facturacion
                    module.goSubPage('03_Dashboard', 'view-Main', { viewLayout: { module: $global.moduleCurrent } });
                } else if ($global.moduleCurrent == "7") {//Presupuesto
                    module.goSubPage('04_Dashboard', 'view-Main', { viewLayout: { module: $global.moduleCurrent } });
                } else if ($global.moduleCurrent == "8") {//Seguridad
                    module.goSubPage('05_Dashboard', 'view-Main', { viewLayout: { module: $global.moduleCurrent } });
                } else if ($global.moduleCurrent == "11") {//Consultoria
                    module.goSubPage('06_Dashboard', 'view-Main', { viewLayout: { module: $global.moduleCurrent } });
                } else if ($global.moduleCurrent == "10") {//Educacion
                    module.goSubPage('07_Dashboard', 'view-Main', { viewLayout: { module: $global.moduleCurrent } });
                } else {
                    module.goSubPage('Dashboard', 'view-Main', { viewLayout: { module: $global.moduleCurrent } });
                }
            };
            imgHome.onclick = function () {
                if ($global.moduleCurrent == "5") {
                    module.goSubPage('Leads', 'view-Main');
                    //if ($global.usuarioAsesor) {
                    //    module.goSubPage('Leads', 'view-Main');
                    //} else {
                    //    module.goSubPage('Campana', 'view-Main');
                    //}
                } else if ($global.moduleCurrent == "8") {//Seguridad
                    module.goSubPage('Inicio', 'view-Main');
                } else {
                    module.goSubPage('Inicio', 'view-Main');
                }
            };

            document.getElementById('imgNotificacion').onclick = function () {
                if ($global.user.tipousuario != '') {
                    //if (isSupAsociado) {
                    if (drop_down.classList.contains('show-module')) { drop_down.classList.remove('show-module') }
                    if (drop_down_equipo.classList.contains('show')) { drop_down_equipo.classList.remove('show') }
                    var popoverUser = document.getElementById('ppr_LA_User');
                    if (popoverUser.className == 'popover-user') {
                        popoverUser.classList.add('hide');
                    }
                    var drop_down_noti = document.getElementById('drop_down_notification');
                    if (drop_down_noti.className == 'drop_down_notification') {
                        drop_down_noti.classList.add("show");
                        notification_load.classList.add("notification-list-drop");
                    }
                    else {
                        drop_down_noti.classList.remove("show");
                        notification_load.classList.remove("notification-list-drop");
                    }
                    ppr_LA_User.classList.add('hide');
                    //}
                }
            };




            document.getElementById('imgUsuarios').onclick = function () {
                if ($global.user.tipousuario != '') {
                    if (isAdmin) {
                        if (drop_down.classList.contains('show-module')) { drop_down.classList.remove('show-module') }
                        if (drop_down_notification.classList.contains('show')) { drop_down_notification.classList.remove('show') }
                        var drop_down_equipo = document.getElementById('drop_down_equipo');
                        if (drop_down_equipo.className == 'drop_down_equipo') {
                            drop_down_equipo.classList.add("show");
                            equipo_load.classList.add("list-drop");
                        }
                        else {
                            drop_down_equipo.classList.remove("show");
                            equipo_load.classList.remove("list-drop");
                        }
                        ppr_LA_User.classList.add('hide');
                    }
                }
            };


            //imgModule.onclick = function () {
            //    module_load.setAttribute("class", "search-drop");
            //    drop_down.setAttribute("class", "drop-down-module show");
            //};
            document.getElementById('imgUsuAvatar').onclick = function () {
                let coords = imgUsuAvatar.getBoundingClientRect();
                if (drop_down_notification.classList.contains('show')) { drop_down_notification.classList.remove('show') }
                if (drop_down_equipo.classList.contains('show')) { drop_down_equipo.classList.remove('show') }
                console.log('left ' + coords.left);
                var popoverUser = document.getElementById('ppr_LA_User');
                if (popoverUser.className == 'popover-user') {
                    popoverUser.classList.add('hide');
                }
                else {
                    popoverUser.classList.remove('hide');
                    ppr_LA_User.style.left = coords.left + 'px !important';//revisar
                }
                module_load.setAttribute("class", "");
                drop_down.setAttribute("class", "drop-down-module");
            };

            document.getElementById('imgModule').onclick = function () {
                if (drop_down_notification.classList.contains('show')) { drop_down_notification.classList.remove('show') }
                if (drop_down_equipo.classList.contains('show')) { drop_down_equipo.classList.remove('show') }
                var drop_down = document.getElementById('drop_down');
                if (drop_down.className == 'drop-down-module') {
                    //drop_down.classList.add("show");
                    drop_down.classList.add("show-module");
                    module_load.classList.add("search-drop");
                }
                else {
                    //drop_down.classList.remove("show");
                    drop_down.classList.remove("show-module");
                    module_load.classList.remove("search-drop");
                }
                ppr_LA_User.classList.add('hide');
            };

            search_module.onkeyup = search_module.onfocus = search_module.onmousemove = function () {
                $scope.search(this.value);
            };

            document.getElementById("btnRefrescar").onclick = function () {
                $scope.CargarAsociados();
            };

            module_load.onblur = module_load.onmouseleave = module_load.onmouseleave = function () {
                module_load.setAttribute("class", "");
                drop_down.setAttribute("class", "drop-down-module");
            };

            equipo_load.onblur = equipo_load.onmouseleave = equipo_load.onmouseleave = function () {
                equipo_load.setAttribute("class", "");
                drop_down_equipo.setAttribute("class", "drop_down_equipo");
            };

            //notification_load.onblur = notification_load.onmouseleave = notification_load.onmouseleave = function () {
            //    notification_load.setAttribute("class", "");
            //    drop_down_notification.setAttribute("class", "drop_down_notification");
            //    document.getElementById('').classList.remove('fade-in');
            //};

            document.getElementById("BTN_Notificaciones_ACTUALIZAR").onclick = function () {
                $scope.listarNotificaciones();
                //$scope.consultarRecordatorios();
            }

            document.getElementById("BTN_Equipo_ACTUALIZAR").onclick = function () {
                $scope.listarEquipo();
            }

            CHK_LA_Conectado.onchange = function () {
                var request = [{
                    VAR00: $config.token,
                }, {
                    VAR01: $global.user.coduser,
                    VAR02: CHK_LA_Conectado.checked ? '1' : '0',
                    VAR03: '#IP_CLIENTE#'
                }, {
                    CUD00: 'DI'
                }]
                $service.LayoutUsuarioCUD(request, function (d) {
                    if (d.success) {
                        if (d.data) {
                            if (d.data == 'OK') {
                                if (CHK_LA_Conectado.checked) {
                                    DIV_CHK_LA_Conectado.classList.add('alt');
                                } else {
                                    DIV_CHK_LA_Conectado.classList.remove('alt');
                                }
                            } else {
                                $alertbox.show(d.data, 'E');
                            }
                        } else {
                            $alertbox.show($msg.error.procedure, 'E');
                        }
                    } else {
                        $alertbox.show($msg.error.server, 'E');
                    }

                });
            };

            BTN_DescartarNotificaciones.onclick = function () {
                let arrNotificaciones = document.getElementsByClassName('checkNotification');
                let arrIds = [];
                for (let i = 0; i < arrNotificaciones.length; i++) arrIds.push(arrNotificaciones[i].getAttribute('id-notificacion') + '¦' + arrNotificaciones[i].getAttribute('tipo'));
                $scope.marcarComoLeido(arrIds.join('¬'), '', 'T');

            }
        };

        $scope.configurarToggle = function () {
            //document.getElementById('btn_LA_Toggle').onclick = document.getElementById('img_LA_Logo').onclick = document.getElementById('spn_LA_Logo').onclick = function () {
            document.getElementById('btn_LA_Toggle').onclick = function () {
                $scope.cambiartoggle();
            };
        };

        $scope.cambiartoggle = function (p) {
            //p "fa fa-arrow-left inactive"
            // "fa fa-arrow-left inactive"
            var menus = document.getElementsByClassName("menu")[0].children;
            var o;
            var toggle = document.getElementById('btn_LA_Toggle').children[0];

            //var nav_LA_Header = document.getElementById("nav_LA_Header");
            //var nav_LA_Container = document.getElementById("nav_LA_Container");


            var div_LA_Menubar = document.getElementById("div_LA_Menubar");
            //var spn_LA_Logo = document.getElementById("spn_LA_Logo");
            var menuItemCategories = document.getElementsByClassName("menu-item-category");
            var nMenuItemCategories = menuItemCategories.length;
            var menuTitles = document.getElementsByClassName("menu-title");
            var nMenuTitles = menuTitles.length;
            var menuArrows = document.getElementsByClassName("menu-arrow");
            var nMenuArrows = menuArrows.length;
            //var spn_LA_Title = document.getElementById('spn_LA_Title');
            //var li_LA_Avatar = document.getElementById('li_LA_Avatar');
            //var navbars = document.getElementsByClassName('navbar-toolbar');
            var subMenus = document.getElementsByClassName('menu-sub-item');

            //if (toggle.className == "fa fa-arrow-left inactive") {
            if (toggle.className == "fa icono-list") {
                toggle.className = "fa icono-list close";
                ico_lists.innerHTML = "";
                //toggle.className = "fa fa-arrow-left active";
                for (var i = 0; i < nMenuItemCategories; i++) {
                    menuItemCategories[i].style.visibility = "none";
                }
                for (var i = 0; i < nMenuTitles; i++) {
                    menuTitles[i].style.visibility = "hidden";
                }
                for (var i = 0; i < nMenuArrows; i++) {
                    menuArrows[i].style.display = "none";
                }
                div_LA_Menubar.style.width = "0px";
                div_LA_Menubar.className = 'menubar toggle';
                for (var i = 0; i < menus.length; i++) {
                    o = menus[i];
                    o.classList.remove('toggle');
                }
                for (var i = 0; i < subMenus.length; i++) {
                    subMenus[i].classList.add('menu-ico-left');
                }
                //spn_LA_Title.classList.remove('hidden-toggle');
                //li_LA_Avatar.classList.remove('hidden-toggle');
            }
            else {
                //toggle.className = "fa fa-arrow-left inactive";
                toggle.className = "fa icono-list";
                ico_lists.innerHTML = "";
                for (var i = 0; i < nMenuItemCategories; i++) {
                    menuItemCategories[i].style.display = "";
                }
                for (var i = 0; i < nMenuTitles; i++) {
                    menuTitles[i].style.visibility = "visible";
                }
                for (var i = 0; i < nMenuArrows; i++) {
                    menuArrows[i].style.display = "";
                }
                div_LA_Menubar.style.width = "260px";
                div_LA_Menubar.className = 'menubar';
                for (var i = 0; i < menus.length; i++) {
                    o = menus[i];
                    o.classList.add('toggle');
                }
                for (var i = 0; i < subMenus.length; i++) {
                    subMenus[i].classList.remove('menu-ico-left');
                }
                //spn_LA_Title.classList.add('hidden-toggle');
                //li_LA_Avatar.classList.add('hidden-toggle');
            }

        }

        $scope.configurarMenu = function (show) {
            //Implementar menu dinámico
            var menus = document.getElementsByClassName("btnsMenu");
            var o, v;
            for (var i = 0; i < menus.length; i++) {
                o = menus[i];
                if (!show) {
                    var li = o.parentElement;
                    //o.getBoundingClientRect().height
                    li.style.height = 26 + "px";
                }
                o.onclick = function () {
                    $scope.toggleMenu(this);
                    //$scope.consultarRecordatorios();
                };
            }
            if (show) {
                var arrows = document.getElementsByClassName('menu-icon-arrow');
                for (var j = 0; j < arrows.length; j++) {
                    arrows[j].classList.add('rotate-90');
                }
            }
        };

        $scope.toggleMenu = function (ctrl) {
            var o, v, c = 0;
            var li = ctrl.parentElement;
            var url = ctrl.getAttribute("data-menu");
            var menus = document.getElementsByClassName("btnsMenu");
            for (var j = 0; j < menus.length; j++) {
                v = menus[j];
                if (v.parentElement.classList.contains('open'))
                    v.parentElement.classList.remove('open');
            }
            if (url != '') {
                $fnSetPermission(ctrl.getAttribute('data-permisos').split(','));
                module.goSubPage(url, 'view-Main', { ParametroMenu: { _Pramatro: ctrl.getAttribute('data-parametro') } });
                document.getElementById("btn_LA_Toggle").click();
                li.classList.add('open');
            }
            var ul = li.getElementsByTagName('UL')[0];
            if (ul != undefined) {
                var altoMax = ctrl.getBoundingClientRect().height + ul.getBoundingClientRect().height;
                if (li.getBoundingClientRect().height < altoMax) {
                    if (li.parentElement.classList.contains('menu-sub') && li.parentElement.parentElement.style.height != '')
                        li.parentElement.parentElement.style.height = '';
                    if (li.style.height == '') li.style.height = li.getBoundingClientRect().height + 'px';
                    li.style.height = altoMax + 'px';
                    if (li.children[0].children[2]) li.children[0].children[2].classList.add('rotate-90');
                    //if (li.parentElement.classList.contains('menu-sub')) li.parentElement.parentElement.style.height = (ctrl.getBoundingClientRect().height + ul.getBoundingClientRect().height + li.parentElement.getBoundingClientRect().height) + 'px';
                }
                else {
                    if (li.parentElement.classList.contains('menu-sub') && li.parentElement.parentElement.style.height != '')
                        li.parentElement.parentElement.style.height = '';
                    if (li.style.height == '') li.style.height = li.getBoundingClientRect().height + 'px';
                    li.style.height = ctrl.getBoundingClientRect().height + 'px';
                    if (li.children[0].children[2]) li.children[0].children[2].classList.remove('rotate-90');
                    //if (li.parentElement.classList.contains('menu-sub')) li.parentElement.parentElement.style.height = (ctrl.getBoundingClientRect().height - ul.getBoundingClientRect().height + li.parentElement.getBoundingClientRect().height) + 'px';
                }
            }
            else {
                if (li.parentElement.classList.contains('menu-sub') && li.parentElement.parentElement.style.height != '')
                    li.parentElement.parentElement.style.height = '';
                if (li.style.height == '') li.style.height = li.getBoundingClientRect().height + 'px';
                //li.style.height = ctrl.getBoundingClientRect().height + 'px';
                if (li.children[0].children[2]) li.children[0].children[2].classList.remove('rotate-90');
                //if (li.parentElement.classList.contains('menu-sub')) li.parentElement.parentElement.style.height = (ctrl.getBoundingClientRect().height + li.parentElement.getBoundingClientRect().height) + 'px';
            }
        };

        $scope.mostrarMenu = function (lista) {
            var contenido = [], campos, menus;
            var fnCrearMenu = function () {
                var c = [];
                var n1 = lista.length;
                for (var i = 0; i < n1; i++) {
                    campos = lista[i].split('¦');
                    if (campos[0] == campos[3]) {
                        menus = fnBuscarMenu(campos[0]);
                        c.push('<li class="menu-item');
                        if (menus.length > 0) {
                            c.push(' parent');
                        }
                        c.push('">');
                        c.push('<a href="javascript:void(0)"  class="btnsMenu" data-id="');
                        c.push(campos[0]);
                        c.push('" data-idMenu="');
                        c.push(campos[3]);
                        c.push('" data-tipo="');
                        c.push(campos[0]);
                        c.push('" data-menu="');
                        c.push(campos[2]);
                        c.push('" data-permisos="');
                        c.push(campos[5]);
                        c.push(',');
                        c.push(campos[6]);
                        c.push(',');
                        c.push(campos[7]);
                        c.push(',');
                        c.push(campos[8]);
                        c.push(',');
                        c.push(campos[9]);
                        c.push(',');
                        c.push(campos[10]);
                        c.push('" data-parametro="');
                        c.push(campos[12]);
                        c.push('" title="');
                        c.push(campos[1]);
                        c.push('">');
                        c.push('<i class="menu-icon ');
                        c.push(campos[4]);
                        c.push('"></i>');
                        c.push('<span class="menu-title">');
                        c.push(campos[1]);
                        c.push('</span>');
                        if (menus.length > 0) {
                            c.push('<i class="menu-icon-arrow fa fa-chevron-left"></i>');
                        }
                        c.push('</a > ');
                        if (menus.length > 0) {
                            c.push('<ul class="menu-sub">');
                            c.push(fnCrearMenu2(menus));
                            c.push('</ul>');
                        }
                        c.push("</li>");
                    }
                }
                contenido.push(c.join(''));
            };
            var fnCrearMenu2 = function (data) {
                var c = [];
                var n2 = data.length;
                for (var i = 0; i < n2; i++) {
                    campos = data[i].split('¦');
                    menus = fnBuscarMenu(campos[0]);
                    c.push('<li class="menu-sub-item');
                    if (menus.length > 0) {
                        c.push(' parent');
                    }
                    c.push('">');
                    c.push('<a href="javascript:void(0)" class="btnsMenu" data-id="');
                    c.push(campos[0]);
                    c.push('" data-idMenu="');
                    c.push(campos[3]);
                    c.push('" data-tipo="');
                    c.push(campos[0]);
                    c.push('" data-menu="');
                    c.push(campos[2]);
                    c.push('" data-permisos="');
                    c.push(campos[5]);
                    c.push(',');
                    c.push(campos[6]);
                    c.push(',');
                    c.push(campos[7]);
                    c.push(',');
                    c.push(campos[8]);
                    c.push(',');
                    c.push(campos[9]);
                    c.push(',');
                    c.push(campos[10]);
                    c.push('" data-parametro="');
                    c.push(campos[12]);
                    c.push('" title="');
                    c.push(campos[1]);
                    c.push('">');
                    c.push('<i class="menu-icon ');
                    c.push(campos[4]);
                    c.push('"></i>');
                    c.push('<span class="menu-title">');
                    c.push(campos[1]);
                    c.push('</span>');
                    if (menus.length > 0) {
                        c.push('<i class="menu-icon-arrow fa fa-chevron-left"></i>');
                    }
                    c.push('</a > ');
                    if (menus.length > 0) {
                        c.push('<ul class="menu-sub"><li class="menu-sub-item">');
                        c.push(fnCrearMenu2(menus));
                        c.push('</ul>');
                    }
                    c.push("</li>");
                }
                return c.join('');
            };

            var fnBuscarMenu = function (codigo) {
                var rpta = '', c = [], campos, n = lista.length;
                for (var i = 0; i < n; i++) {
                    campos = lista[i].split('¦');
                    if (campos[3] == codigo && campos[0] != codigo) {
                        c.push(lista[i]);
                    }
                }
                rpta = c.slice();
                return rpta;
            };
            fnCrearMenu();
            document.getElementById('ul_LA_Menu').innerHTML = contenido.join('');
        };

        $scope.fnCargarVariables = function () {
            if ($fnGetStorage($appName) && $fnGetStorage($appName + '_Parameters') != '') {
                $config.token = $fnGetStorage($appName);
                $global.user.ruc = $config.rucApp;
                var datos = $fnGetStorage($appName + '_Parameters').split('¦');
                //let arrDatos = datos.split('¦');
                //let arrDatos = datos.split('±');
                //let dataUser = arrDatos[0].split('¦');
                $global.user.coduser = datos[0];
                $global.user.name = datos[1];
                $global.user.job = datos[3];
                $global.user.oper = datos[4];
                $global.user.correo = datos[5];
                $global.user.telefono = datos[6];
                $global.user.anexo = datos[7];
                $global.user.celular = datos[8];
                $global.user.disponible = datos[9];

                $global.user.tipousuario = datos[10];

                $global.layout.title = datos[1];
                $global.accessType = datos[2];

                $scope.consultarRecordatorios();
                //$global.lists.recordatorios = arrDatos[1].split('¬');


                //setTimeout(function () { $scope.MostrarDialogoSession(); }, datos[11]);
            }
        };

        $scope.consultarRecordatorios = function () {
            let request = [{
                TOKEN: $config.token
            }, {
                VAR00: 'R'
            }]
            $service.ListarNotificaciones(request, function (d) {
                if ($fnValidarServicios(d)) {
                    arrRecordatorios = d.data;
                    $scope.iniciarConteoRecordatorio();
                }
            });
        }

        $scope.iniciarConteoRecordatorio = function (nuevoArrRecordatorios = '') {
            if (nuevoArrRecordatorios != '') arrRecordatorios = nuevoArrRecordatorios;
            //if ($global.lists.RECORDATORIOS[0] != '' && $global.lists.RECORDATORIOS.length > 0) {
            if (arrRecordatorios[0] != '' && arrRecordatorios.length > 0 && hiloPrincipal_Not == null && hiloSecundario_Not == null) {
                //let primeraNotificacion = $global.user.arrRecordatorios[0].split('¦');
                let primerRecordatorio = arrRecordatorios[0].split('¦');
                let tiempo = primerRecordatorio[2];
                hiloPrincipal_Not = setTimeout(function () { $scope.mostrarAlertaRecordatorio(); }, tiempo);
            }
        }
        $scope.mostrarAlertaRecordatorio = function () {
            //let notificacion = $global.user.arrRecordatorios[0].split('¦');
            let recordatorio = arrRecordatorios[0].split('¦');
            let tiempoAnterior = recordatorio[2] * 1;
            if (isAsesor && recordatorio[1] == $global.user.coduser) {
                lblRecordatorio_Accion.innerHTML = recordatorio[3];
                lblRecordatorio_Nombre_Apellido.innerHTML = 'Nombres y Apellidos: ' + recordatorio[4];
                lblRecordatorio_Correo.innerHTML = 'Correo: ' + recordatorio[5];
                lblRecordatorio_Telefono.innerHTML = 'Telefono: ' + recordatorio[6];
                lbl_Recordatorio_Comentario.innerHTML = 'Comentario: ' + recordatorio[7];
                lbl_Recordatorio_Fecha_Hora.innerHTML = 'Fecha y hora de recordatorio: ' + recordatorio[8];
                let mdlHeaderElement = document.querySelectorAll("#mdl_RECORDATORIO #mdl_RECORDATORIO_Modal #mdl_RECORDATORIO_ModalDialog #mdl_RECORDATORIO_Content #mdl_RECORDATORIO_Header");
                let mdlContentElement = document.querySelectorAll("#mdl_RECORDATORIO #mdl_RECORDATORIO_Modal #mdl_RECORDATORIO_ModalDialog #mdl_RECORDATORIO_Content");
                mdlHeaderElement[0].style.background = '#ffc107';
                mdlContentElement[0].style.borderTop = '5px solid #ffc107';
                $$modal('mdl_RECORDATORIO').show();
            }
            //$alertbox.show('Recordatorio: ' + recordatorio[3], 'S', 14);
            arrRecordatorios.shift();
            clearInterval(hiloPrincipal_Not);
            hiloPrincipal_Not = null;
            if (arrRecordatorios.length > 0 && arrRecordatorios[0] != '') {
                recordatorio = arrRecordatorios[0].split('¦');
                let nuevoTiempo = tiempoAnterior - (recordatorio[2] * 1);
                hiloSecundario_Not = setTimeout(function () { $scope.mostrarAlertaRecordatorio(); }, nuevoTiempo);
            } else {
                clearInterval(hiloSecundario_Not);
                hiloSecundario_Not = null;
            }
        }

        $scope.search = function (valor) {
            var listasSearch = [];
            valor = valor.toLowerCase().trim();
            var nlistas;
            //var listas = ["1¦Asociado", "2¦Tipo Asociado", "3¦Standar Codigo", "4¦Monedas", "5¦Inscripcion de Productos", "6¦Orden Entrega", "7¦Baja de Codigo"];
            if (listaAsociados.length > 0) {
                nlistas = listaAsociados.length;
                //console.log(nlistas);
            }
            var columnas = [];
            for (var i = 0; i < nlistas; i++) {
                columnas = listaAsociados[i].split('¦');
                if (valor.length != 0 && (columnas[0].toLowerCase().trim().indexOf(valor) > -1 ||
                    columnas[2].toLowerCase().trim().indexOf(valor) > -1)) {
                    listasSearch.push(columnas);
                }
            }
            $scope.BusquedaEncontrada(listasSearch);
        };

        $scope.CargarAsociados = function () {
            var request = [{
                token: $config.token
            }, {
                ruc: ''
            }, {
                rf: 'S'
            }];
            //$service.asociadoListas(request, function (d) {
            //    if (d.success) {
            //        var listas = d.data !== '' ? d.data.split('¯') : [];
            //        if (listas.length > 0) {
            //            listaAsociados = listas[0] !== '' ? listas[0].split('¬') : [];
            //        }
            //    }
            //});
        }

        $scope.BusquedaEncontrada = function (matriz) {
            var c = [];
            var nfilas = matriz.length;
            //console.log(matriz);
            if (search_module.value.length > 0) {
                let coords = search_module_y_icon.getBoundingClientRect();
                if (nfilas > 0) {
                    c.push('<div class="search_panel" style="position: absolute;margin-left: ' + (coords.left - 5) + 'px;background-color: #fff; width: ' + coords.width + 'px; top:' + coords.bottom + 'px;">');
                    //c.push('<div class="search_panel_header">Se Cargaron ' + nfilas + ' registro(s)</div>');
                    c.push('<div class="search_panel_body">');
                    for (var i = 0; i < nfilas; i++) {
                        c.push('<div class="search_item_load"');
                        //c.push(' Data-CodEmpre="');
                        //c.push(matriz[i][0]);
                        //c.push('" ');
                        //c.push(' Data-NomEmpre="');
                        //c.push(matriz[i][2]);
                        //c.push('" ');

                        c.push(' onclick="$jt[\'' + namespace + '\'].fnEvEditarAsociado(\'' + matriz[i][0] + '\');" >');
                        //c.push(' onclick="alert(\'' + matriz[i][0] + '\');" >');
                        c.push(matriz[i][0]);
                        c.push(' ');
                        c.push(matriz[i][2]);
                        c.push('</div>');
                    }
                    c.push('</div>');
                    c.push('</div>');
                } else {
                    c.push('<div class="search_panel"style="position: absolute;margin-left: ' + (coords.left - 6) + 'px;background-color: #fff; width: ' + coords.width + 'px; top:' + coords.bottom + 'px;">');
                    c.push('<div class="search_panel_header">No hay registros</div>');
                    c.push('</div>');
                }
            } else {
                c.push('');
            }
            search_load.innerHTML = c.join('');
        };

        $scope.fnEvEditarAsociado = function (obj) {
            var CodEmpre = obj;

            if (CodEmpre != null && CodEmpre.length > 0) {
                var request = [{
                    token: $config.token
                }, {
                    codigo: CodEmpre
                }, {
                    rf: 'F'
                }];
                //$service.asociadoListas(request, function (d) {
                //    if (d.success) {
                //        search_load.innerHTML = "";
                //        search_module.value = '';
                //        var listas = d.data.split('¯');
                //        var _detalleAsociado = listas[0].split('¦');
                //        module.goSubPage('AsociadoNuevo', 'vw-PAG_DETALLE_ASOCIADO', {
                //            frmAsociadoNuevo: {
                //                _mdlPagDetAsociado: 'mdl_PAG_DETALLE_ASOCIADO',
                //                _codigo: CodEmpre,
                //                _asociado: _detalleAsociado[5],
                //                _detalleAsociado: _detalleAsociado,
                //                _ejecutivo: listas[1] !== '' ? listas[1].split('¬') : [],
                //                _ias: listas[2] !== '' ? listas[2].split('¬') : [],
                //                _sectoresPisco: listas[3] !== '' ? listas[3].split('¬') : []
                //            }
                //        });
                //        //document.getElementById("$jt[\'' + namespace + '\']__Header").style.display = "none";
                //        $$modal('mdl_PAG_DETALLE_ASOCIADO').show();
                //    } else {
                //        search_load.innerHTML = "";
                //    }
                //});
            }
        };

        //$scope.foco_seleccionado = function (valor) {
        //    //if (valor == true) {
        //    //    ico_lists.style.color = "#5ca4e4";
        //    //    span_modules.style.color = "#464646";
        //    //    icon_dows.style.color = "#464646";
        //    //} else {
        //    //    ico_lists.style.color = "";
        //    //    span_modules.style.color = "";
        //    //    icon_dows.style.color = "";
        //    //}
        //};

        $scope.ExisteImgModule = function (image_url) {
            var http = new XMLHttpRequest();

            http.open('HEAD', image_url, false);
            //http.send();

            return http.status != 404;
        }

        $scope.show_Modules = function (lista) {
            var registros = lista[0];
            var c = [];
            var listado = lista[1].split('¬');
            var nlista = listado.length;
            var columna = [];
            var imgSrc = '';
            //#region Nuevo Diseño
            //c.push('<div id="drop_down" class="drop-down-module" style="will-change: transform; position: absolute; top: 34px; right: -100px; transform: translate3d(-180px, 44px, 0px); width: 160px;">');
            c.push('<div id="drop_down" class="drop-down-module" style="will-change: transform; position: absolute; top: 16px; right: -100px; transform: translate3d(-180px, 44px, 0px); width: 280px;">');
            for (var i = 0; i < nlista; i++) {
                columna = listado[i].split('¦');
                //imgSrc = '"' + $urlBase + 'Resources/Images/Modules/' + columna[1].normalize("NFD").replace(/[\u0300-\u036f]/g, "") + '.png';
                imgSrc = '"' + $urlBase + 'Resources/Images/Modules/' + columna[0] + '.png';
                //console.log(imgSrc);
                //imgSrc = '"' + $urlBase +'Resources/Images/Modules/' + columna[1].normalize("NFD").replace(/[\u0300-\u036f]/g, "") + '.jpg';
                if ($scope.ExisteImgModule(imgSrc)) {
                    c.push('<div id="LNK_' + columna[0] + '" style="padding:10px 10px;" onclick="$jt[\'' + namespace + '\'].show_Menus(\'' + columna[0] + '\',\'' + registros + '\',\'' + columna[1] + '\');"><div style="padding:0px 5px;"><img src="' + $urlBase + 'Resources/Images/Modules/' + columna[0] + '.png" style="width:100%;"/></div><div style="padding-top:2px;text-overflow: ellipsis;">' + columna[1] + '</div></div>')
                } else {
                    //c.push('<div id="LNK_' + columna[0] + '" style="padding:10px 10px;" onclick="$jt[\'' + namespace + '\'].show_Menus(\'' + columna[0] + '\',\'' + registros + '\',\'' + columna[1] + '\');"><div style="padding:0px 5px;"><img src="' + $urlBase + 'Resources/Images/Modules/' + columna[1].normalize("NFD").replace(/[\u0300-\u036f]/g, "") + '.png" style="width:100%;"/></div><div style="padding-top:2px;text-overflow: ellipsis;">' + columna[1] + '</div></div>')
                    c.push('<div id="LNK_' + columna[0] + '" style="padding:10px 10px;" onclick="$jt[\'' + namespace + '\'].show_Menus(\'' + columna[0] + '\',\'' + registros + '\',\'' + columna[1] + '\');"><div style="padding:0px 5px;"><img src="' + $urlBase + 'Resources/Images/Modules/default-module.png" style="width:100%;"/></div><div style="padding-top:2px;text-overflow: ellipsis;">' + columna[1] + '</div></div>')
                }

                //c.push('<div id="LNK_' + columna[0] + '" style="padding:10px 0px;" onclick="$jt[\'' + namespace + '\'].show_Menus(\'' + columna[0] + '\',\'' + registros + '\',\'' + columna[1] + '\');"><span style="background-color:#21618C;color:white;padding:5px 8px;border-radius:20px;">' + columna[1].substring(0, 1) + '</span><div style="padding-top:7px;">' + columna[1] + '</div></div>')
                //c.push('<button  id="LNK_' + columna[0] + '" onclick="$jt[\'' + namespace + '\'].show_Menus(\'' + columna[0] + '\',\'' + registros + '\',\'' + columna[1] + '\');" class="dropdown-item">' + columna[1] + '</button>');
            }
            c.push('</div>')
            //#endregion          
            module_load.innerHTML = c.join('');
            listado_modulos = listado;
            lista_options = lista[2];

            if (nlista == 1)
                document.getElementById('imgModule').style.display = "none";
        };

        $scope.desactivarActual = function (listado_modulos) {
            var nlista = listado_modulos.length;
            var columna = [];
            for (var i = 0; i < nlista; i++) {
                columna = listado_modulos[i].split('¦');
                document.getElementById("LNK_" + columna[0]).setAttribute("class", "dropdown-item inactive");
            }
        };

        $scope.show_Menus = function (id, registros, menu) {
            $scope.desactivarActual(listado_modulos);
            $global.moduleCurrent = id;
            document.getElementById("LNK_" + id).setAttribute("class", "dropdown-item active");

            var filas = registros.split('¬');
            var nfilas = filas.length;
            var registro = [];

            for (var i = 0; i < nfilas; i++) {
                if (id == filas[i].split('¦')[11]) {
                    registro.push(filas[i]);
                }
            }

            $scope.optionesLayout(lista_options, id);
            $scope.mostrarMenu(registro);
            $scope.configurarMenu();

            //if (islist == true) {
            //    document.getElementById("btn_LA_Toggle").click();
            //}

            islist = true;
            var toggle = document.getElementById('btn_LA_Toggle').children[0];
            if (toggle.className == "fa icono-list") {
                document.getElementById("btn_LA_Toggle").click();
            }

            foo_LA_modulo_menu.innerHTML = menu;
            VL_MODULO_ACTUAL = menu;
            if ($global.moduleCurrent == "7") {
                if ($global.presupuesto.idPresupuesto.trim() == '') {

                } else {
                    foo_LA_presupuesto_anno.innerHTML = $global.presupuesto.PRESUPUESTO;
                    foo_LA_presupuesto_linea.innerHTML = "Linea: " + $global.presupuesto.linea;
                    $scope.CargarPresupuestoEjecutado();
                    foo_LA_presupuesto_anno.style.display = "inline";
                    foo_LA_presupuesto_linea.style.display = "inline";
                    foo_LA_presupuesto_ejecutado.style.display = "inline";
                }
            } else {
                foo_LA_presupuesto_anno.style.display = "none";
                foo_LA_presupuesto_linea.style.display = "none";
                foo_LA_presupuesto_ejecutado.style.display = "none";
            }
            if ($global.moduleCurrent == "6") {
                //$scope.CargarCajero();
                //$scope.CargarTipoCambio();
            } else {
                FOO_LA_CAJERO.style.display = 'none';
                document.getElementById('FOO_LA_COM-VEN_D').style.display = 'none';
            }

            if ($global.moduleCurrent == "5") {
                module.goSubPage('Leads', 'view-Main');
                //if ($global.usuarioAsesor) {
                //    module.goSubPage('Leads', 'view-Main');
                //} else {
                //    module.goSubPage('Campana', 'view-Main');
                //}                
            } else if ($global.moduleCurrent == "8") {//Seguridad
                module.goSubPage('Inicio', 'view-Main');
            } else {
                module.goSubPage('Leads', 'view-Main');

            }
            //11-Consultoria
            //10-educacion

        };

        $scope.fnExCheck = function (row, index) {
            var c = [];
            //c.push('<input type="checkbox" id="check_soli_' + row.CODIGO + '" value="' + row.CHECK + '" ' + (row.CHECK == "1" ? 'checked' : '') + ' class="">');
            c.push('<input type="radio" id="RDB_LiNe_' + row.CODIGO + '" name="NME_RDB_LiNe_' + row.CODIGO + '" value="' + row.CHECK + '" ' + (row.CHECK == "1" ? 'checked' : '') + ' class=""/>');
            return c.join('');
        };
        $scope.FnEv_fnClickCheck = function (row, index) {
            var check = document.getElementById('RDB_LiNe_' + row.CODIGO);
            if (check.value == "0" || check.value == "") {
                check.value = "1";
                check.checked = true;
                $scope.fnCheckArray(row.CODIGO, true);

            } else if (check.value == "1") {
                check.value = "0";
                check.checked = false;
                $scope.fnCheckArray(row.CODIGO, false);

            }
        };
        $scope.fnCheckArray = function (id, bool) {
            checkMarcado = [];
            if (bool) {
                checkMarcado.push(id);
                $scope.cambiarGrilla(id, '1');
            } else {
                var index = checkMarcado.indexOf(id);
                if (index > -1) {
                    checkMarcado.splice(index, 1);
                    $scope.cambiarGrilla(id, '0');
                }
            }
            checkMarcado.sort();
        };
        $scope.cambiarGrilla = function (id, bool) {
            var nlistado = listado.length;
            var columna = [];
            for (var i = 0; i < nlistado; i++) {
                columna = listado[i].split('¦');
                if (columna[1] == id) {
                    columna[0] = bool;
                    listado[i] = columna.join('¦');
                } else {
                    columna[0] = "0";
                    listado[i] = columna.join('¦');
                }
            }
            $$grid('grd_DATA_LINEAS_NEGOCIO').setData(listado);
        };

        $scope.fnEvPresupuestoSeleccionar = function () {
            var item = {
                containers: ['FRM_MDL_PAG_LNEAS_NEGOCIO']
            };
            if ($fnValidarForm(item).resultado == 0 && checkMarcado.length > 0) {
                foo_LA_presupuesto_anno.style.display = "inline";
                foo_LA_presupuesto_linea.style.display = "inline";
                foo_LA_presupuesto_ejecutado.style.display = "inline";
                //console.log(listadoCbo);
                var presupuesto = listadoCbo.split('¬')[CBO_PRESUPUESTO.selectedIndex - 1];
                var linea = null;
                for (var i = 0; i < listado.length; i++) {
                    if (listado[i].split("¦")[1] == checkMarcado[checkMarcado.length - 1])
                        linea = listado[i];
                }
                var VI_PRESUPUESTO = presupuesto.split("¦");
                console.log(VI_PRESUPUESTO);
                $global.presupuesto.idPresupuesto = VI_PRESUPUESTO[0];
                $global.presupuesto.annoPresupuesto = VI_PRESUPUESTO[1];
                $global.presupuesto.PRESUPUESTO = VI_PRESUPUESTO[2];
                $global.presupuesto.idLinea = linea.split("¦")[1];
                $global.presupuesto.codigoLinea = linea.split("¦")[2];
                $global.presupuesto.linea = linea.split("¦")[3];
                $global.presupuesto.Cerrado = VI_PRESUPUESTO[5];
                $global.presupuesto.CerradoOrdenCompra = VI_PRESUPUESTO[8];
                $global.presupuesto.TipocambioVenta = VI_PRESUPUESTO[6];
                $global.presupuesto.TipocambioCompra = VI_PRESUPUESTO[7];
                foo_LA_presupuesto_anno.innerHTML = $global.presupuesto.PRESUPUESTO;
                foo_LA_presupuesto_linea.innerHTML = "Linea: " + $global.presupuesto.linea;
                $scope.CargarPresupuestoEjecutado();
                module.goSubPage('04_Inicio', 'view-Main');
            } else {
                $alertbox.show('Debe seleccionar una linea de negocio y un presupuesto a trabajar', 'E');
            }
        };
        $scope.CargarPresupuestoEjecutado = function () {
            var request = [{
                token: $config.token
            }, {
                ingreso: '0',
                unidad: $global.presupuesto.codigoLinea,
                periodo: $global.presupuesto.annoPresupuesto,
                fechainicial: '',
                fechafinal: ''
            }, {
                rf: 'R'
            }];
            $service.presuEjecutado(request, function (d) {
                if (d.success) {
                    var importeEjecutado = d.data !== '' ? d.data : '0';
                    foo_LA_presupuesto_ejecutado.innerHTML = "S/." + importeEjecutado;
                    $$modal('mdl_PAG_LNEAS_NEGOCIO').hide();
                }
            });
        };
        $scope.fnEvPresupuestoCancelar = function () {
            if (checkMarcado.length == 0)
                $alertbox.show('Debe seleccionar una linea de negocio', 'E');
            else
                $$modal('mdl_PAG_LNEAS_NEGOCIO').hide();
        };

        $scope.optionesLayout = function (lista, id) {

            if (lista != "") {

                if (lista) {
                    lista = lista.split('¬');
                    var nlista = lista.length;
                    var column = [];
                    var flag_dash = "", flag_preg = "", flag_noti = "", flag_grup = "";


                    for (var i = 0; i < nlista; i++) {
                        column = lista[i].split('¦');
                        if (column[4] == id) {
                            flag_dash = column[0];
                            flag_noti = column[1];
                            flag_preg = column[2];
                            flag_grup = column[5];
                            break;
                        }
                    }

                    if (flag_dash != "" && flag_noti != "" && flag_preg != "" && flag_grup != "") {
                        imgHelp.style.display = flag_preg == "1" ? 'inline-block' : "none";
                        imgDashboard.style.display = flag_dash == "1" ? 'inline-block' : "none";
                        //imgNotificacion.style.display = flag_noti == "1" ? 'inline-block' : "none";
                        imgUsuarios.style.display = flag_grup == "1" ? 'inline-block' : "none";

                    } else {
                        imgHelp.style.display = "none";
                        imgDashboard.style.display = "none";
                        //imgNotificacion.style.display = "none";
                        imgUsuarios.style.display = "none";
                    }
                }

            } else {
                imgHelp.style.display = "none";
                imgDashboard.style.display = "none";
                //imgNotificacion.style.display = "none";
            }

        };

        //$scope.CargarCajero = function () {
        //    var request = [{
        //        VAR00: $config.token,
        //    }, {
        //        CAB01: $global.user.coduser,
        //    }, {
        //        DET01: ''
        //    }, {
        //        CRUDS: 'R'
        //    }, {
        //        TYPES: '',
        //    }]
        //    $service.CRUDS_COMPROBANTE(request, function (d) {
        //        if (d.success) {
        //            if (d.data != '') {
        //                var dato = d.data.split('¬');
        //                var x = dato[0].split('¦');
        //                var c = [];

        //                $global.factura.serieFac = x[0];
        //                $global.factura.serieBol = x[1];
        //                $global.factura.serieNCF = x[2];
        //                $global.factura.serieNCB = x[3];
        //                $global.factura.serieNDF = x[4];
        //                $global.factura.serieNDB = x[5];
        //                $global.factura.cajeroID = x[6];

        //                c.push('FAC: ')
        //                c.push((x[0] != '') ? x[0] : '-')
        //                c.push(' / BOL: ')
        //                c.push((x[1] != '') ? x[1] : '-')
        //                c.push(' / NC: ')
        //                c.push((x[2] != '') ? x[2] : '-')
        //                c.push(' | ')
        //                c.push((x[3] != '') ? x[3] : '-')
        //                c.push(' / ND: ')
        //                c.push((x[4] != '') ? x[4] : '-')
        //                c.push(' | ')
        //                c.push((x[5] != '') ? x[5] : '-')
        //                console.log(c.join(''))
        //                FOO_LA_CAJERO.innerHTML = c.join('');
        //                FOO_LA_CAJERO.style.display = 'inline';
        //            } else {
        //                FOO_LA_CAJERO.style.display = 'none';
        //            }
        //        } else {
        //            $alertbox.show($msg.error.server, 'E')
        //        }
        //    })
        //};
        //$scope.CargarTipoCambio = function () {
        //    var request = [{
        //        token: $config.token,
        //    }, {
        //        RF: 'F'
        //    }];
        //    $service.TipoCambioListar(request, function (d) {
        //        if (d.success) {
        //            if (d.data != '') {
        //                var listaTipoCambio = d.data.split('¬');
        //                if (listaTipoCambio.length > 0) {
        //                    var tipocambio = listaTipoCambio[0].split('¦');
        //                    document.getElementById('FOO_LA_COM-VEN_D').style.display = 'inline';
        //                    document.getElementById('FOO_LA_COM-VEN_D').innerHTML = 'Compra : ' + tipocambio[0] + '/ Venta : ' + tipocambio[1];
        //                }
        //            } else {
        //                $dialog.alert('No ha registrado un tipo de cambio.', 'Información', 'E');
        //            }
        //        } else {
        //            $alertbox.show($msg.error.server, 'E')
        //        }
        //    });
        //};

        $scope.MostrarDialogoSession = function () {
            var fiveMinutes = 60 * 1;
            $scope.MostrarTiempoSession(fiveMinutes);
            $dialog.alert("Tu sesión se cerrará en automático dentro de 1 minuto", "Información", "W", function () { });
        };

        $scope.MostrarTiempoSession = function (duration) {
            var timer = duration, minutes, seconds;
            setInterval(function () {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                if (--timer < 0) {
                    timer = duration;
                    $scope.LimpiezaSessionApp();
                }
            }, 1000);
        };

        $scope.LimpiezaSessionApp = function () {
            document.getElementById("dropdown_module").style.display = "none";
            $fnRemoveStorage("usuario");
            $fnRemoveStorage($appName + '_Parameters');
            $fnRemoveStorage($appName);
            location.href = $urlBase;
        };

        //$scope.listarEquipo = function () {
        //    var item = [{
        //        VAR00: $config.token
        //    }];
        //    $service.ListarEjecutivos(item, function (d) {
        //        if (d.success) {
        //            if (d.data != "" && isSupAsociado) {
        //                BTN_Equipo_TODOS.classList.add('btn-active');
        //                if (BTN_Equipo_DISPONIBLES.classList.contains('btn-active')) { BTN_Equipo_DISPONIBLES.classList.remove('btn-active'); }
        //                if (BTN_Equipo_NO_DISPONIBLES.classList.contains('btn-active')) { BTN_Equipo_NO_DISPONIBLES.classList.remove('btn-active'); }
        //                var arrData = d.data.split('¬');
        //                $scope.show_Equipo(arrData);
        //            }
        //        }
        //    });
        //};


        $scope.show_Equipo = function (lista) {
            var ARR_TODOS = lista;
            var ARR_DISPONIBLES = [];
            var ARR_NO_DISPONIBLES = [];

            var column = [];
            for (var i = 0; i < lista.length; i++) {
                column = lista[i].split('¦')
                if (column[0] == '0') {
                    ARR_NO_DISPONIBLES.push(lista[i]);
                } else {
                    ARR_DISPONIBLES.push(lista[i]);
                }
            }

            $scope.LlenarDivEquipo(ARR_TODOS);

            BTN_Equipo_TODOS.onclick = function () {
                $scope.LlenarDivEquipo(ARR_TODOS, '');
                this.classList.add('btn-active');
                if (BTN_Equipo_DISPONIBLES.classList.contains('btn-active')) { BTN_Equipo_DISPONIBLES.classList.remove('btn-active'); }
                if (BTN_Equipo_NO_DISPONIBLES.classList.contains('btn-active')) { BTN_Equipo_NO_DISPONIBLES.classList.remove('btn-active'); }
            }
            BTN_Equipo_DISPONIBLES.onclick = function () {
                $scope.LlenarDivEquipo(ARR_DISPONIBLES, 'D');
                this.classList.add('btn-active');
                if (BTN_Equipo_TODOS.classList.contains('btn-active')) { BTN_Equipo_TODOS.classList.remove('btn-active'); }
                if (BTN_Equipo_NO_DISPONIBLES.classList.contains('btn-active')) { BTN_Equipo_NO_DISPONIBLES.classList.remove('btn-active'); }
            }
            BTN_Equipo_NO_DISPONIBLES.onclick = function () {
                $scope.LlenarDivEquipo(ARR_NO_DISPONIBLES, 'N');
                this.classList.add('btn-active');
                if (BTN_Equipo_TODOS.classList.contains('btn-active')) { BTN_Equipo_TODOS.classList.remove('btn-active'); }
                if (BTN_Equipo_DISPONIBLES.classList.contains('btn-active')) { BTN_Equipo_DISPONIBLES.classList.remove('btn-active'); }
            }
        };

        $scope.LlenarDivEquipo = function (lista_equipo, estado) {
            var nlista = lista_equipo.length;
            var c = [];
            if (nlista > 0) {
                var columna = [];
                for (var i = 0; i < nlista; i++) {
                    columna = lista_equipo[i].split('¦');
                    c.push('<div id="compromiso' + i + '" class="Notificacion dropdown-item" style="display:flex;flex-direction:row;margin-top:15px;margin-bottom:15px;">');
                    c.push('<div style="margin-left:15px;width:100%;overflow:hidden;text-overflow:ellipsis;">');
                    c.push('<div style="width:8px;height:8px;background-color:' + (columna[0] == '0' ? 'red' : 'green') + ';border-radius:30px;margin-top:5px;margin-rigth:15px;position:absolute;"></div>');
                    c.push('<span title="' + columna[1] + '" style="color:#686868;margin-left:20px;">' + columna[1] + '</span><br/>');
                    c.push('</div>');
                    c.push('</div>');
                }
            } else {
                if (estado == 'D') {
                    c.push('<div style="padding: 10px 10px;">No hay usuarios disponibles.</div>');
                } else if (estado == 'N') {
                    c.push('<div style="padding: 10px 10px;">Todos los usuarios se encuentran disponibles.</div>');
                }

            }

            DIV_listado_Equipo.innerHTML = c.join('');
        }

        $scope.listarNotificaciones = function () {
            var item = [{
                TOKEN: $config.token
            }, {
                RF: 'N'
            }];
            $service.ListarNotificaciones(item, function (d) {
                if (d.success) {
                    if (d.data != "" /*&& isSupAsociado*/) {
                        $scope.show_Notificaciones(d.data);
                    }
                }
            });
        };

        $scope.conteoLeadsSinAsignar = function () {
            var item = [{
                TOKEN: $config.token
            }, {
                RF: 'L'
            }];
            $service.ListarNotificaciones(item, function (d) {
                if (d.success) {
                    if (d.data != "" && (isSupervisor || isAdmin)) {
                        $alertbox.show('Tienes ' + d.data + ' leads registrados por asignar');
                    }
                }
            });
        };

        $scope.show_Notificaciones = function (lista) {
            arrHeaderOcultos = [];
            var ARR_NOTIFICACIONES = lista.split('¨');
            var ARR_HTML_NOTIFICACIONES = [];
            var html = '';
            var ARR_NOTIFICACION = [];
            let ARR_DET_NOTIFICACIONES = [];
            let column = [];
            var TOTAL_NOTIFICACIONES = 0;
            let NOTIFICACIONES_VISIBLES = 0;
            for (var i = 0; i < ARR_NOTIFICACIONES.length; i++) {
                if (ARR_NOTIFICACIONES[i] != '') {
                    NOTIFICACIONES_VISIBLES = 0;
                    ARR_NOTIFICACION = ARR_NOTIFICACIONES[i].split('¯');

                    if (/*contadorNotificaciones > 0 &&*/ ARR_NOTIFICACION[1] != '') {
                        ARR_DET_NOTIFICACIONES = ARR_NOTIFICACION[1].split('¬');
                        for (let j = 0; j < ARR_DET_NOTIFICACIONES.length; j++) {
                            column = ARR_DET_NOTIFICACIONES[j].split('¦');
                            if ((ARR_NOTIFICACION[0] == 'LEADS' && ((isAdmin || isSupervisor) && column[0] == 'ADMINAPI') || ((isAsesor || isSupervisor) && column[9] == $global.user.coduser) || isAdmin)
                                || (ARR_NOTIFICACION[0] == 'RECORDATORIOS' && isAsesor && $global.user.coduser == column[1])
                                || (ARR_NOTIFICACION[0] == 'LEADS POR CONTACTAR' && ((isAdmin || isSupervisor)) || ((isAsesor || isSupervisor) && column[9] == $global.user.coduser)) 
                                || (ARR_NOTIFICACION[0] == 'LEADS REASIGNADOS' && ((isAdmin || isSupervisor)) || ((isAsesor || isSupervisor) && column[9] == $global.user.coduser))){
                                TOTAL_NOTIFICACIONES++;
                                NOTIFICACIONES_VISIBLES++;
                                
                            }
                        }
                        //TOTAL_NOTIFICACIONES += ARR_NOTIFICACION[1] == '' ? 0 : ARR_NOTIFICACION[1].split('¬').length;
                    }

                    html = $scope.LlenarDivNotificaciones(ARR_NOTIFICACION[1], ARR_NOTIFICACION[0], i, NOTIFICACIONES_VISIBLES);


                    ARR_HTML_NOTIFICACIONES.push(html);
                }
            }
            DIV_listado_Notificaciones.innerHTML = ARR_HTML_NOTIFICACIONES.join('');
            SPN_Notificaciones_Cantidad.innerHTML = TOTAL_NOTIFICACIONES;

            let GET_HEADER_NOTIFICACION_DIVS = document.getElementsByClassName('HeaderNotification');
            let GET_LEAD_NOTIFICACION_DIVS = document.getElementsByClassName('DIV_Lead_Notification');
            let ARR_CHECK_LEIDO = document.getElementsByClassName('checkNotification');

            for (let i = 0; i < GET_HEADER_NOTIFICACION_DIVS.length; i++) {
                if (GET_HEADER_NOTIFICACION_DIVS[i] != '') {
                    GET_HEADER_NOTIFICACION_DIVS[i].onclick = function () {
                        let id = this.getAttribute('id-notificacion');
                        if (document.getElementById('notificacion_div_' + id).classList.contains('fade-in')) {
                            document.getElementById('notificacion_div_' + id).classList.remove('fade-in');
                        } else {
                            document.getElementById('notificacion_div_' + id).classList.add('fade-in');
                        }
                        document.getElementById('arrow' + id).classList.toggle('rotate-90');
                    }
                }
            }

            for (let i = 0; i < GET_LEAD_NOTIFICACION_DIVS.length; i++) {
                if (GET_LEAD_NOTIFICACION_DIVS[i] != '') {
                    GET_LEAD_NOTIFICACION_DIVS[i].onclick = function () {
                        $scope.ListarLeads(this.getAttribute('id-lead'));
                    }
                }
            }

            for (let i = 0; i < ARR_CHECK_LEIDO.length; i++) {
                if (ARR_CHECK_LEIDO[i] != '') {
                    ARR_CHECK_LEIDO[i].onclick = function () {
                        //alert('check');
                        $scope.marcarComoLeido(this.getAttribute('id-notificacion'), this.getAttribute('tipo'), 'U');

                    }
                }
            }

            if (arrHeaderOcultos.length > 0) {
                let arrHeadersNotificacion = document.getElementsByClassName('HeaderNotification');
                for (let i = 0; i < arrHeadersNotificacion.length; i++) {
                    for (let j = 0; j < arrHeaderOcultos.length; j++) {
                        if (arrHeadersNotificacion[i].getAttribute('id-notificacion') == arrHeaderOcultos[j]) {
                            arrHeadersNotificacion[i].style.display = 'none';
                            break;
                        }
                    }
                }
            }

            notification_load.onblur = notification_load.onmouseleave = notification_load.onmouseleave = function () {
                notification_load.setAttribute("class", "");
                drop_down_notification.setAttribute("class", "drop_down_notification");
                var GET_NOTIFICACION_DETAILS = document.querySelectorAll('.DetailNotification');
                var GET_NOTIFICACION_ARROWS = document.querySelectorAll('.notify-icon-arrow');
                GET_NOTIFICACION_DETAILS.forEach(
                    function (element) {
                        if (element.classList.contains('fade-in')) {
                            element.classList.remove('fade-in');
                        }
                    }
                );
                GET_NOTIFICACION_ARROWS.forEach(
                    function (element) {
                        if (element.classList.contains('rotate-90')) {
                            element.classList.remove('rotate-90');
                        }
                    }
                );
            };
        };


        $scope.LlenarDivNotificaciones = function (contenido, tipo, id, cantNotificacionesVisibles) {
            var c = [];
            if (contenido != '') {
                let filas = contenido.split('¬');
                let nlista = filas.length;
                let columna = [];
                contadorNotificaciones = 0;
                //let contador = 0;
                c.push('<div class="HeaderNotification" id-notificacion="' + id + '">');
                c.push('<div>');
                c.push('<i id="arrow' + id + '"  class="notify-icon-arrow fa fa-chevron-left header-notification-arrow"></i>');
                c.push('<b>' + tipo + '</b>&nbsp;&nbsp;');
                //c.push('<span ">' + nlista + '</span>&nbsp;');
                c.push('<span ">' + cantNotificacionesVisibles + '</span>&nbsp;');
                c.push('</div></div>');
                if (tipo == 'LEADS') {
                    c.push('<div id="notificacion_div_' + id + '" class="DetailNotification">');
                    for (var i = 0; i < nlista; i++) {
                        columna = filas[i].split('¦');
                        if (((isAdmin || isSupervisor) && columna[0] == 'ADMINAPI')
                            || ((isAsesor || isSupervisor) && columna[9] == $global.user.coduser && columna[9] != '') 
                            || isAdmin) {
                            contadorNotificaciones++;
                            c.push('<div class="DIV_Notificacion" style="padding:10px 5px;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-left:15px;">');
                            c.push('<div class="DIV_Lead_Notification" id-lead="' + columna[7] + '">');
                            c.push('<b><span class="spanFormat overflowHidden"> Se ');
                            c.push(((isAsesor || isSupervisor) && columna[9] == $global.user.coduser ? "te asignó " : "registró") + ' un lead ' + (isAsesor ? "registrado " : "") + ' desde la ' + (columna[0] == "ADMINAPI" ? "API" : "app") + '</span ></b> <br />');
                            c.push('<span class="spanFormat overflowHidden" style="color:#34495E ;"> ' + columna[1] + ', ' + columna[2] + ' de ' + columna[3] + ', ' + columna[4] + ' a las ' + columna[5] + '</span><br/>');
                            c.push('<span class="spanFormat overflowHidden" style="font-size: 10px;color:#808B96;"> Se registro el lead con DNI: ' + columna[6] + '</span ><br />');
                            c.push('</div>');
                            //c.push('<span class="checkNotification">');
                            c.push($scope.getNotificationIcon('', 'LEAD', columna[8], tipo));
                            //c.push('</span>');
                            c.push('</div>');
                        }
                    }
                    c.push('</div>');
                    if (contadorNotificaciones > 0) c.push('<hr style="margin:0px 15px;border: 0px;border-top:2px solid #eee;" />');

                    if (contadorNotificaciones == 0) arrHeaderOcultos.push(id);
                }
                else if (tipo == 'RECORDATORIOS') {
                    c.push('<div id="notificacion_div_' + id + '" class="DetailNotification">');
                    for (var i = 0; i < nlista; i++) {
                        columna = filas[i].split('¦');
                        if (/*isAdmin || isSupervisor ||*/ isAsesor && $global.user.coduser == columna[1]) {
                            contadorNotificaciones++;
                            c.push('<div class="DIV_Notificacion" style="padding:5px 5px;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-left:15px;">');
                            c.push('<div>');
                            c.push('<span class="spanFormat wrapText"> ' + columna[3] + ' al lead ' + columna[5] + ' a las horas ' + columna[2] + '</span > <br />');
                            c.push('<span class="spanFormat"> ' + columna[6] + '</span > <br />');
                            c.push('<span class="spanFormat"> ' + columna[7] + '</span > <br />');
                            c.push('</div>');
                            c.push($scope.getNotificationIcon('', 'LEAD', columna[8], tipo));
                            c.push('</div>');
                        }
                    }
                    c.push('</div>');
                    //c.push('<hr style="margin:0px 15px;border: 0px;border-top:2px solid #eee;" />');
                    if (contadorNotificaciones > 0) c.push('<hr style="margin:0px 15px;border: 0px;border-top:2px solid #eee;" />');

                    if (contadorNotificaciones == 0) arrHeaderOcultos.push(id);

                }

                else if (tipo == 'LEADS POR CONTACTAR') {
                    c.push('<div id="notificacion_div_' + id + '" class="DetailNotification">');
                    for (var i = 0; i < nlista; i++) {
                        columna = filas[i].split('¦');
                        //if (((isAdmin || isSupervisor) && columna[0] == 'ADMINAPI') || (isAsesor && columna[9] == $global.user.coduser && columna[9] != '')) {
                        if ((isAdmin || isSupervisor)  || (isAsesor && columna[9] == $global.user.coduser && columna[9] != '')) {
                            contadorNotificaciones++;
                            c.push('<div class="DIV_Notificacion" style="padding:10px 5px;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-left:15px;">');
                            c.push('<div class="DIV_Lead_Notification" id-lead="' + columna[7] + '">');
                            c.push('<b><span class="spanFormat overflowHidden"> Se ' + (isAsesor ? "te asignó " : "registró") + ' un lead ' + (isAsesor ? "registrado " : "") + ' desde la ' + (columna[0] == "ADMINAPI" ? "API" : "app") + '</span ></b> <br />');
                            c.push('<span class="spanFormat overflowHidden" style="color:#34495E ;"> ' + columna[1] + ', ' + columna[2] + ' de ' + columna[3] + ', ' + columna[4] + ' a las ' + columna[5] + '</span><br/>');
                            c.push('<span class="spanFormat overflowHidden" style="font-size: 10px;color:#808B96;"> Se registro el lead con DNI: ' + columna[6] + '</span ><br />');
                            c.push('</div>');
                            //c.push('<span class="checkNotification">');
                            c.push($scope.getNotificationIcon('', 'LEAD', columna[8], tipo));
                            //c.push('</span>');
                            c.push('</div>');
                        }
                    }
                    c.push('</div>');
                    if (contadorNotificaciones > 0) c.push('<hr style="margin:0px 15px;border: 0px;border-top:2px solid #eee;" />');

                    if (contadorNotificaciones == 0) arrHeaderOcultos.push(id);
                }


                else if (tipo == 'LEADS REASIGNADOS') {
                    c.push('<div id="notificacion_div_' + id + '" class="DetailNotification">');
                    for (var i = 0; i < nlista; i++) {
                        columna = filas[i].split('¦');
                        //if (((isAdmin || isSupervisor) && columna[0] == 'ADMINAPI') || (isAsesor && columna[9] == $global.user.coduser && columna[9] != '')) {
                        if ((isAdmin || isSupervisor) || (isAsesor && columna[9] == $global.user.coduser && columna[9] != '')) {
                            contadorNotificaciones++;
                            c.push('<div class="DIV_Notificacion" style="padding:10px 5px;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-left:15px;">');
                            c.push('<div class="DIV_Lead_Notification" id-lead="' + columna[7] + '">');
                            c.push('<b><span class="spanFormat overflowHidden"> Se ' + (isAsesor ? "te reasignó " : "reasignó") + ' un lead ' + (isAsesor ? "registrado " : "") + ' desde la ' + (columna[0] == "ADMINAPI" ? "API" : "app") + '</span ></b> <br />');
                            c.push('<span class="spanFormat overflowHidden" style="color:#34495E ;"> ' + columna[1] + ', ' + columna[2] + ' de ' + columna[3] + ', ' + columna[4] + ' a las ' + columna[5] + '</span><br/>');
                            c.push('<span class="spanFormat overflowHidden" style="font-size: 10px;color:#808B96;"> Se registro el lead con DNI: ' + columna[6] + '</span ><br />');
                            c.push('</div>');
                            //c.push('<span class="checkNotification">');
                            c.push($scope.getNotificationIcon('', 'LEAD', columna[8], tipo));
                            //c.push('</span>');
                            c.push('</div>');
                        }
                    }
                    c.push('</div>');
                    if (contadorNotificaciones > 0) c.push('<hr style="margin:0px 15px;border: 0px;border-top:2px solid #eee;" />');

                    if (contadorNotificaciones == 0) arrHeaderOcultos.push(id);
                }

            }
            return c.join('');
        };

        $scope.getNotificationIcon = function (state = '', type = '', idNotificacion = '', tipoNotificacion = '') {
            let html = '';
            let backgroundColor = "";
            let icon = "";

            /*
             Notificacion
             GP - Gestión de pago
             GC - Gestión de codigo
             CC - Carta de Compromiso
             EI - Empresas incobrables
             */
            if (type == 'GP' || type == 'GC') {
                switch (state) {
                    case '1':
                        backgroundColor = '#9a9a9a';
                        icon = '<i class="fa fa-minus"></i>';
                        break;
                    case '3':
                        backgroundColor = '#9a9a9a';
                        icon = '<i class="fa fa-bell"></i>';
                        break;
                    case '4':
                        backgroundColor = '#9a9a9a';
                        icon = '<i class="fa fa-check"></i>';
                        break;
                    case '5':
                        backgroundColor = '#9a9a9a';
                        icon += '<svg focusable="false" viewBox="0 0 512 512" color="#FFFFFF" style="width: 16px; height: 16px; margin: 3%;">';
                        icon += '<path fill="currentColor" d="M334.89 121.63l43.72-71.89C392.77 28.47 377.53 0 352 0H160.15c-25.56 0-40.8 28.5-26.61 49.76l43.57 71.88C-9.27 240.59.08 392.36.08 412c0 55.23 49.11 100 109.68 100h292.5c60.58 0 109.68-44.77 109.68-100 0-19.28 8.28-172-177.05-290.37zM160.15 32H352l-49.13 80h-93.73zM480 412c0 37.49-34.85 68-77.69 68H109.76c-42.84 0-77.69-30.51-77.69-68v-3.36c-.93-59.86 20-173 168.91-264.64h110.1C459.64 235.46 480.76 348.94 480 409zM285.61 310.74l-49-14.54c-5.66-1.62-9.57-7.22-9.57-13.68 0-7.86 5.76-14.21 12.84-14.21h30.57a26.78 26.78 0 0 1 13.93 4 8.92 8.92 0 0 0 11-.75l12.73-12.17a8.54 8.54 0 0 0-.65-13 63.12 63.12 0 0 0-34.17-12.17v-17.6a8.68 8.68 0 0 0-8.7-8.62H247.2a8.69 8.69 0 0 0-8.71 8.62v17.44c-25.79.75-46.46 22.19-46.46 48.57 0 21.54 14.14 40.71 34.38 46.74l49 14.54c5.66 1.61 9.58 7.21 9.58 13.67 0 7.87-5.77 14.22-12.84 14.22h-30.61a26.72 26.72 0 0 1-13.93-4 8.92 8.92 0 0 0-11 .76l-12.84 12.06a8.55 8.55 0 0 0 .65 13 63.2 63.2 0 0 0 34.17 12.17v17.55a8.69 8.69 0 0 0 8.71 8.62h17.41a8.69 8.69 0 0 0 8.7-8.62V406c25.68-.64 46.46-22.18 46.57-48.56.02-21.5-14.13-40.67-34.37-46.7z"></path>';
                        icon += ' </svg>';
                        break;
                    case '2':
                    case '6':
                        backgroundColor = '#9a9a9a';
                        icon = '<i class="fa fa-eye"></i>';
                        break;
                    case '7':
                        backgroundColor = '#9a9a9a';
                        icon += '<svg focusable="false" viewBox="0 0 512 512" color="#FFFFFF" style="width: 16px; height: 16px; margin: 3%;">';
                        icon += '<path fill="currentColor" d="M334.89 121.63l43.72-71.89C392.77 28.47 377.53 0 352 0H160.15c-25.56 0-40.8 28.5-26.61 49.76l43.57 71.88C-9.27 240.59.08 392.36.08 412c0 55.23 49.11 100 109.68 100h292.5c60.58 0 109.68-44.77 109.68-100 0-19.28 8.28-172-177.05-290.37zM160.15 32H352l-49.13 80h-93.73zM480 412c0 37.49-34.85 68-77.69 68H109.76c-42.84 0-77.69-30.51-77.69-68v-3.36c-.93-59.86 20-173 168.91-264.64h110.1C459.64 235.46 480.76 348.94 480 409zM285.61 310.74l-49-14.54c-5.66-1.62-9.57-7.22-9.57-13.68 0-7.86 5.76-14.21 12.84-14.21h30.57a26.78 26.78 0 0 1 13.93 4 8.92 8.92 0 0 0 11-.75l12.73-12.17a8.54 8.54 0 0 0-.65-13 63.12 63.12 0 0 0-34.17-12.17v-17.6a8.68 8.68 0 0 0-8.7-8.62H247.2a8.69 8.69 0 0 0-8.71 8.62v17.44c-25.79.75-46.46 22.19-46.46 48.57 0 21.54 14.14 40.71 34.38 46.74l49 14.54c5.66 1.61 9.58 7.21 9.58 13.67 0 7.87-5.77 14.22-12.84 14.22h-30.61a26.72 26.72 0 0 1-13.93-4 8.92 8.92 0 0 0-11 .76l-12.84 12.06a8.55 8.55 0 0 0 .65 13 63.2 63.2 0 0 0 34.17 12.17v17.55a8.69 8.69 0 0 0 8.71 8.62h17.41a8.69 8.69 0 0 0 8.7-8.62V406c25.68-.64 46.46-22.18 46.57-48.56.02-21.5-14.13-40.67-34.37-46.7z"></path > ';
                        icon += ' </svg>';
                        break;
                }
                html += '<div class="estado icon-border" style="background-color: ' + backgroundColor + ';">' + icon + '</div>';
            } else if (type == 'CC' || type == 'LEAD') {
                html += '<span class="checkNotification" title="Marcar como leído" id-notificacion = "' + idNotificacion + '" tipo = "' + tipoNotificacion + '">';
                html += '<svg fill="currentColor" aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" focusable="false"><path d="M10 3a7 7 0 100 14 7 7 0 000-14zm-8 7a8 8 0 1116 0 8 8 0 01-16 0z" fill="currentColor"></path></svg>';
                html += '<svg class="checkBox-hover" fill="currentColor" aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" focusable="false"><path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 100 14 7 7 0 000-14zm3.36 4.65c.17.17.2.44.06.63l-.06.07-4 4a.5.5 0 01-.64.07l-.07-.06-2-2a.5.5 0 01.63-.77l.07.06L9 11.3l3.65-3.65c.2-.2.51-.2.7 0z" fill="currentColor"></path></svg>';
                html += '</span>';
            }

            return html;


        }

        $scope.connectSocketServer = function () {
            //let ipWebSocket = 'wss://dev.natcodeeperu.net:9002';
            $global.user.conexionSocket = new WebSocket($config.IpWebSocket + '?' + $config.token);
            $global.user.conexionSocket.onopen = function (event) {
                if (socketConnectionState.classList.contains('failed')) socketConnectionState.classList.remove('failed')
                socketConnectionState.classList.add('succesful');
            }
            $global.user.conexionSocket.onclose = function (event) {
                if (socketConnectionState.classList.contains('succesful')) socketConnectionState.classList.remove('succesful')
                socketConnectionState.classList.add('failed');
            }
            $global.user.conexionSocket.onerror = function (event) {
                if (socketConnectionState.classList.contains('succesful')) socketConnectionState.classList.remove('succesful')
                socketConnectionState.classList.add('failed');
            }
            $global.user.conexionSocket.onmessage = function (event) {
                let data = event.data.split('±');
                let tipo = data[0];
                let info = data[1];
                if (tipo == "NOTIFICACIONES") {
                    $scope.listarNotificaciones();
                }
                else if (tipo == "RECORDATORIOS") {
                    arrRecordatorios = info.split('¬');
                    let interval_id = window.setInterval(function () { }, 0);
                    for (let i = 0; i <= interval_id; i++) {
                        clearInterval(i);
                    }
                    $scope.iniciarConteoRecordatorio();
                }

            }
        };

        $scope.ListarLeads = function (idLead) {
            let request = [{
                TOKEN: $config.token
            }, {
                DATA: idLead
            }, {
                RF: 'F'
            }]

            $service.LeadsLST(request, function (result) {
                if ($fnValidarServicios(result)) {
                    let arrData = result.data.split('¯');
                    //module.goSubPage('Campana', 'view-Main')
                    module.goSubPage("LeadsCUD", 'view-Main', {
                        frmLeads: {
                            idLead: idLead,
                            DATA: arrData,
                            CUD: 'V',
                            Pantalla: 'Main'
                        }
                    });
                    //$$modal('MDL_LeadsCUD').show();
                } else {
                    $alertbox.show($msg.error.server, "E");
                }
            });
        };

        $scope.marcarComoLeido = function (idNotificacion, proceso = '', rf) {
            let request = [{
                TOKEN: $config.token
            }, {
                VAR00: idNotificacion,
            }, {
                PROCESO: proceso
            }, {
                CUD: 'U'
            }, {
                RF: rf
            }]

            $service.NotificacionLeida(request, function (d) {
                if ($fnValidarServicios(d)) {
                    $scope.listarNotificaciones();
                    let GET_HEADER_NOTIFICACION_DIVS = document.getElementsByClassName('HeaderNotification');
                    if (GET_HEADER_NOTIFICACION_DIVS.length > 0) {

                        let id = this.getAttribute('id-notificacion');
                        if (document.getElementById('notificacion_div_' + id).classList.contains('fade-in')) {
                            document.getElementById('notificacion_div_' + id).classList.remove('fade-in');
                        } else {
                            document.getElementById('notificacion_div_' + id).classList.add('fade-in');
                        }
                        document.getElementById('arrow' + id).classList.toggle('rotate-90');

                    } else {
                        document.getElementById('notificacion_div_' + id).classList.add('fade-in');
                    }
                    //$alertbox()
                }
            });
        };
        $scope.fnEvRecordatorioLeido = function () {
            $$modal('mdl_RECORDATORIO').hide();
        }

    };

    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
});