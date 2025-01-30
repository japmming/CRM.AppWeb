define([$appName,
    "ForgetPassword"
], function (module, namespace, args) {
    "use strict";
    var service = function ($service, $http) {
        $service.validarLoginUsuario = function (data, callback) {
            return $http({
                url: "Seguridad/RecuperarUsuario",
                data: data,
                method: "post",
                callback: callback
            });
        };
    };

    var controller = function ($scope, $service) {
        var slide_cont = 0;

        $scope.init = function () {
            $scope.configurarBotones();
            $alertbox.create();
        };

        $scope.configurarBotones = function () {
            IMG_LOGO_HEADER.style.background = "url('" + $urlBase + "Resources/Images/ico_natcodee.png') no-repeat center left";

            document.getElementById("btn_Login").onclick = function () {
                module.goPage("LoginAccess");
            }
            document.getElementById("btn_EnviarSolicitud").onclick = function () {
                var msgs = $scope.validar();
                if (msgs == '') {
                    var txtCorreo = document.getElementById("txt_Correo").value;
                    var item = { data: 'PER¦' + txtCorreo };
                    $service.validarLoginUsuario(item, function (d) {
                        if (d.success) {
                            if (d.data != '') {
                                msgs = '';
                                var listas = d.data.split('¦');
                                if (listas[0] == 'OK') {
                                    msgs = '<li>Se ha enviado su usuario y clave al correo ingresado.</li>';
                                    msgs = '<ul style="list-style: none;margin: 0px;padding: 0px">' + msgs + '</ul>';                                                                        
                                    $alertbox.show(msgs, "S", 4);
                                    module.goPage("LoginAccess");
                                } else {
                                    msgs = '<li>' + listas[1] + '</li>';
                                    msgs = '<ul style="list-style: none;margin: 0px;padding: 0px">' + msgs + '</ul>';
                                    $alertbox.show(msgs,"S",4);
                                    document.getElementById("txt_Correo").focus();
                                }
                            }
                            else {
                                $alertbox.show("El usuario y/o contraseña son inválidos");
                                document.getElementById("txt_LOAC_Contrasena").value = '';
                            }
                        }
                        else $alertbox.show($msg.error.server);
                    });
                }
                else $alertbox.show(msgs);
            };
        };

        $scope.validar = function () {
            var msgs = '';
            var txt_Correo = document.getElementById('txt_Correo').value;
            if (txt_Correo == '') msgs += '<li>Ingresar correo</li>';
            if (msgs != '') msgs = '<ul style="list-style: none;margin: 0px;padding: 0px">' + msgs + '</ul>';
            return msgs;
        };

    };

    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
});
