define([$appName, //module
    "Inicio" //namespace
], function (module, namespace) {
    "use strict";
    var service = function ($service, $http) {
        
    };
    var controller = function ($scope, $service) {
        
        $scope.init = function () {
            $scope.cargarInicial();
            $scope.configurarLinks();
        };
        $scope.cargarInicial = function () {
            //////IMG_LOGO_HOME.src = $urlBase + "Resources/Images/home_logo.png";
            //IMG_LOGO_HOME2.src = $urlBase + "Resources/Images/home_logo2.png";
            //IMG_FOOTER.src = $urlBase + "Resources/Images/home_footer.png";
            //$$grid('grd_Inicio').create({
            //    title: 'Grilla Prueba',
            //    headers: ['', '', 'Id', 'Descripción', ''],
            //    properties: ['opc1', 'opc3', 'id', 'descripcion', 'opc2'],
            //    typesData: ['A', 'S', 'N', 'S', 'A'],
            //    typesFilter: ['', 'I', 'I', 'I', ''],
            //    sortHeader: [true, true, true, false, true],
            //    showColumns: [true, true, true, true, true],
            //    widths: [5, 5, 15, 60, 5],
            //    indexs: [0, 1, 2, 3, 4],
            //    headerStyle: $controls.grid.headerStyle,
            //    data: ['¦¦1¦HOLA 1¦', '¦¦2¦HOLA 2¦', '¦¦3¦HOLA 3¦', '¦¦4¦HOLA 4¦', '¦¦5¦HOLA 5¦', '¦¦6¦HOLA 6¦'],
            //    borderTop: false,
            //    btnNew: true,
            //    btnEdit: false,
            //    btnDelete: false,
            //    btnDeleteMultiple: true,
            //    filterPosition: 'UP',
            //    generalFilter: false,
            //    entriesPage: 5,
            //    rangePage: 5,
            //    separator: '¦',
            //    fnBtnNew: 'fnEvNuevoUsuario',
            //    fnBtnEdit: 'fnEvEditarUsuario',
            //    fnBtnDelete: 'fnEvDeleteUsuario',
            //    fnBtnDeleteMultiple: 'fnEvDeleteMultipleUsuario',
            //    fnExtensions: ['fnExEditarUsuario', '', '', '', 'fnExEliminarUsuario'],
            //    namespace: namespace
            //});



        };
        $scope.configurarLinks = function () {
            //LNK_DASHBOARD.onclick = function () {
            //    module.goSubPage('01_Dashboard', 'view-Main');
            //   /* module.goSubPage('01_Dashboard', 'view-Main', { viewLayout: { module: $global.moduleCurrent } });*/
            //};
            //LNK_HELP.onclick = function () {
            //    module.goSubPage('PreguntasFrecuentes', 'view-Main');
            //};
            //BTN_SolicitudGLN.onclick = function () {
            //    module.goSubPage('01_SolicitudGLN', 'view-Main');
            //};
        };
        $scope.fnExEditarUsuario = function (row, index) {
            return '';
        };
        $scope.fnExEliminarUsuario = function (row, index) {
            return '';
        };

    };
    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
});