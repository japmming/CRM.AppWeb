define([$appName, //module
    "EnEspera" //namespace
], function (module, namespace) {
    "use strict";
    var service = function ($service, $http) {

    };
    var controller = function ($scope, $service) {
        $scope.init = function () {
            $scope.cargarInicial();
        };

        $scope.cargarInicial = function () {
            
        };
    };
    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
});