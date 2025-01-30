define([$appName,
    "LoginAccess"
], function (module, namespace, args) {
    "use strict";
    var service = function ($service, $http) {
        $service.validarLoginUsuario = function (data, callback) {
            return $http({
                url: "Seguridad/ValidarLoginUsuario",
                data: data,
                method: "post",
                callback: callback
            });
        };

        $service.validarDatosLoginGoogle = function (data, callback) {
            return $http({
                url: "Seguridad/ValidarDatosLoginGoogle",
                data: data,
                method: "post",
                callback: callback
            });
        };

    };

    var controller = function ($scope, $service) {
        var latitud = "";
        var longitud = "";
        $scope.init = function () {
            $scope.configurarBotones();
            $scope.validarStatusLogin();
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(obtenerLocalizacion);
            }
        };

        $scope.configurarBotones = function () {
            $alertbox.create();
            document.getElementById("txt_LOAC_Usuario").focus();
            //document.getElementById("txt_LOAC_Usuario").value = "ADMIN";
            //document.getElementById("txt_LOAC_Contrasena").value = "@#GS1 peru";

            IMG_LOGO_HEADER.style.background = "url('" + $urlBase + "Resources/Images/ico_natcodee.png') no-repeat center left";

            $scope.enter = function (event) {
                if (event.which == 13 || event.keyCode == 13) {
                    document.getElementById("btn_LOAC_Ingresar").click();
                    event.preventDefault();
                }
            };

            //if ($config.isDeveloper) {
            //    BTN_LOAC_Contrasena.removeAttribute("style");
            //    BTN_LOAC_Contrasena.parentNode.removeAttribute("style");
            //    btn_LOAC_Ingresar_Google.parentNode.removeAttribute("style");
            //}

            addEventListener("keyup", $scope.enter);

            document.getElementById("forgetpassword").onclick = function () {
                module.goPage("ForgetPassword");
            };

            document.getElementById("btn_LOAC_Ingresar").onclick = function () {
                var mensaje = $scope.validar();
                if (mensaje == '') {

                    var ruc = $config.rucApp;
                    var txtUsuario = document.getElementById("txt_LOAC_Usuario").value;
                    var txtContrasena = document.getElementById("txt_LOAC_Contrasena").value;

                    var navegador = $scope.getBrowser();
                    var dispositivo = $fnIsMobileDevice() ? 'CELULAR' : 'COMPUTADORA';

                    let SO_Dispositivo = $scope.validarSO();
                    //alert(SO_Mobile);
                    var item = { data: module.decode("PER¦" + txtUsuario + "¦" + txtContrasena + "¦" + "#IP_CLIENTE#" + "¦" + latitud + "," + longitud + "¦" + navegador + "¦" + dispositivo + '¦' + SO_Dispositivo) };
                    $service.validarLoginUsuario(item, function (d) {
                        if (d.success) {
                            if (d.data != '') {
                                var listas = d.data.split('¯');
        
                                $fnSetStorage($appName, listas[0]);
                                $fnSetStorage($appName + '_Parameters', listas[1]);
                                //clearTimeout($scope.timeoutSlideShow);
                                removeEventListener("keyup", $scope.enter);
                                //module.goPage("Layout");
                                module.goPage("Layout");
                                //alert($urlBase);
                            }
                            else {
                                //alert('ERROR');
                                $alertbox.show("El usuario y/o contraseña son inválidos", 'E');
                                document.getElementById("txt_LOAC_Contrasena").value = '';
                            }
                        }
                        else $alertbox.show($msg.error.server);
                    });
                    //        break;
                    //}
                }
                else $alertbox.show(mensaje, 'E');
            };

            document.getElementById("btn_LOAC_Ingresar_Google").onclick = function () {
                var _url = $config.GoogleOAUTHURL + "scope=" + $config.GoogleSCOPE + "&client_id=" + $config.GoogleClientId + "&redirect_uri=" + $config.GoogleRedirectURL + "&response_type=" + $config.GoogleTYPE;
                window.open(_url, "_self");
                //var win = window.open(_url, "windowname1", 'width=800, height=600');
                //var pollTimer = window.setInterval(function () {
                //    try {
                //        console.log(win.document.URL);
                //        if (win.document.URL.indexOf(REDIRECT) != -1) {
                //            window.clearInterval(pollTimer);
                //            //var url = win.document.URL;
                //            //acToken = gup(url, 'access_token');
                //            //tokenType = gup(url, 'token_type');
                //            //expiresIn = gup(url, 'expires_in');

                //            win.close();

                //            module.goPage("Layout");
                //            //debugger;

                //        }
                //    }
                //    catch (e) {

                //    }
                //}, 500);


                //var ruc = $config.rucApp;
                //var txtUsuario = document.getElementById("txt_LOAC_Usuario").value;
                //var txtContrasena = document.getElementById("txt_LOAC_Contrasena").value;
                //var item = { data: 'PER¦' + txtUsuario + "¦" + txtContrasena + "¦" + "#IP_CLIENTE#" + "¦" + latitud + "," + longitud };
                //$service.validarLoginGoogle(item, function (d) {
                //    if (d.success) {
                //        console.log(d.data)

                //    }
                //    else $alertbox.show($msg.error.server);
                //});

            };

            BTN_LOAC_Contrasena.onclick = function () {
                if (document.getElementById('txt_LOAC_Contrasena').type == 'text') {
                    document.getElementById('txt_LOAC_Contrasena').type = 'password';
                    I_LOAC_Contrasena.className = 'fa fa-eye';
                } else {
                    document.getElementById('txt_LOAC_Contrasena').type = 'text';
                    I_LOAC_Contrasena.className = 'fa fa-eye-slash';
                }
            };
            //function gup(url, name) {
            //    namename = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            //    var regexS = "[\\#&]" + name + "=([^&#]*)";
            //    var regex = new RegExp(regexS);
            //    var results = regex.exec(url);
            //    if (results == null)
            //        return "";
            //    else
            //        return results[1];
            //}

        };

        $scope.validar = function () {
            var msgs = '';
            var txt_LO_Usuario = document.getElementById('txt_LOAC_Usuario').value;
            if (txt_LO_Usuario == '') msgs += '<li>Ingresar usuario</li>';
            var txt_LO_Contrasena = document.getElementById('txt_LOAC_Contrasena').value;
            if (txt_LO_Contrasena == '') msgs += '<li>Ingresar contraseña</li>';
            if (msgs != '') msgs = '<ul style="list-style: none;margin: 0px;padding: 0px">' + msgs + '</ul>';
            return msgs;
        };

        function obtenerLocalizacion(position) {
            latitud = position.coords.latitude;
            longitud = position.coords.longitude;
            console.log(latitud + "," + longitud);
        }

        $scope.validarStatusLogin = function () {
            var status = $fnGetQueryStringURL("status");
            var token = $fnGetQueryStringURL("token");
            var correo = $fnGetQueryStringURL("Email");
            var fecha = $fnGetQueryStringURL("fecha");
            if (status) {
                if (status.length > 0) {
                    $alertbox.show("Error en el proceso de login.", "E", 4);
                }
            } else {
                if (token && correo && fecha) {
                    var request = { data: token + "¦" + correo + "¦" + fecha + latitud + "," + longitud };
                    $service.validarDatosLoginGoogle(request, function (d) {
                        if (d.success) {
                            if (d.data != '') {
                                var listas = d.data.split('¯');
                                if (d.data == 'DENIED') {
                                    $alert.show("No tiene permitido el ingreso desde el extranjero");
                                } else if (d.data == 'ERROR_CORREO') {
                                    $alert.show("Correo no asociado a ejecutivo.");
                                } else if (d.data == 'ERROR_DATA') {
                                    $alert.show("Error en el proceso de login. Datos no coincidentes.");
                                }
                                else {
                                    $fnSetStorage($appName, listas[0]);
                                    $fnSetStorage($appName + '_Parameters', listas[1]);
                                    clearTimeout($scope.timeoutSlideShow);
                                    removeEventListener("keyup", $scope.enter);
                                    module.goPage("Layout");
                                }
                                //else {

                                //}
                            }
                            else {
                                $alertbox.show("El usuario y/o contraseña son inválidos");
                                location.href = $urlBase + '?status=failed';
                                //document.getElementById("txt_LOAC_Contrasena").value = '';
                            }
                        }
                        else $alertbox.show($msg.error.server);
                    });

                }
                else {
                    $fnRemoveStorage($appName);
                    $fnRemoveStorage($appName + '_Parameters');
                }
            }

            //var url_string = window.location.href;
            //var url = new URL(url_string);
            //var status = url.searchParams.get("status");
            //if (status != '' && status == 'failed') {
            //    $alertbox.show("Error en el proceso de login.", "E", 4);
            //}

        }


        $scope.getBrowser = function () {
            let browserName = (function (agent) {
                switch (true) {
                    case agent.indexOf("edge") > -1: return "MS Edge";
                    case agent.indexOf("edg/") > -1: return "Edge";
                    case agent.indexOf("opr") > -1 && !!window.opr: return "Opera";
                    case agent.indexOf("chrome") > -1 && !!window.chrome: return "Chrome";
                    case agent.indexOf("trident") > -1: return "MS IE";
                    case agent.indexOf("firefox") > -1: return "Mozilla Firefox";
                    case agent.indexOf("safari") > -1: return "Safari";
                    default: return "other";
                }
            })(window.navigator.userAgent.toLowerCase());

            return browserName.toUpperCase();
        }

        //$scope.isMobileDevice = function () {
        //    alert($fnIsMobileDevice() ? 'Celular' : 'PC');
        //};

        $scope.validarSO = function () {
            let OSName = '';

            if ($fnIsMobile.any()) {
                if ($fnIsMobile.Android()) {
                    OSName = 'Android';

                }
                if ($fnIsMobile.BlackBerry()) {
                    OSName = 'Blackberry';

                }
                if ($fnIsMobile.iOS()) {
                    OSName = 'IOS';

                }
                if ($fnIsMobile.Opera()) {
                    OSName = 'Opera';

                }
                if ($fnIsMobile.Windows()) {
                    OSName = 'Windows Mobile';

                }
            } else {
                if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
                if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
                if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
                if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";
            }

            return OSName;
        }

    };

    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
});
