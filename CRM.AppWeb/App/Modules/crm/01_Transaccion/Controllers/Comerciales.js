define([$appName,
    "Comerciales"
], function (module, namespace, args) {
    "use strict ";
    var service = function ($service, $http) {
        $service.ComLista = function (item, callback) {
            return $http({
                url: "Comerciales/Listar",
                data: item,
                method: "post",
                callback: callback
            });
        };
    };

    var controller = function ($scope, $service) {

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
                typeData: "A",
                sortHeader: false,
                showColumn: false,
                width: 2,
                columnExport: false,
                fnExtension: "fnExEditarComercial"

            },
            {
                index: 1,
                header: "Tipo",
                propertie: "TIPO",
                typeFilter: "I",
                width: 20,

            },
            {
                index: 2,
                header: "Nombre",
                propertie: "NOM",
                typeFilter: "I",
                width: 20,

            },
            {
                index: 3,
                header: "E-mail",
                propertie: "MAIL",
                typeFilter: "I",
                width: 30,

            },
            {
                index: 4,
                header: "Leads",
                propertie: "LEAD",
                typeData: "A",
                typeFilter: "A",
                width: 10,
                fnExtension: "fnExVerLeads"

            },
            {
                index: 5,
                typeData: "A",
                sortHeader: false,
                showColumn: false,
                width: 2,
                columnExport: false,
                fnExtension: "fnExEliminarComercial"
            }
            ];
            _btnOptions = {
                btnid: [],
                names: [],
                icons: [],
                class: [],
                fnEvents: []
            };
        

            $$grid('grd_Comercial').create({
                columnProperties: _columnProperties,
                //headers: ['', 'Tipo', 'Nombre', 'E-mail', 'Leads', ''],
                //properties: ['', 'TIPO', 'NOM', 'MAIL', 'LEAD', ''],
                //typesData: ['A', 'S', 'S', 'S', 'A', 'A'],
                //typesFilter: ['', 'I', 'I', 'I', '', ''],
                //sortHeader: [false, true, true, true, true, false],
                //showColumns: [false, true, true, true, true, false],
                //widths: [3, 10, 15, 20, 5, 3],
                //indexs: [0, 1, 2, 3, 4, 5],
                headerStyle: $controls.grid.headerStyle,
                data: [],
                borderTop: false,
                btnNew: true,
                btnEdit: false,
                btnDelete: false,
                btnDeleteMultiple: false,
                btnRefresh: true,
                btnExportExcel: true,
                filterPosition: 'UP',
                generalFilter: true,
                entriesPage: 10,
                rangePage: 5,
                separator: '¦',
                fnBtnNew: '',
                fnBtnEdit: '',
                fnBtnDelete: 'fnExEliminarComercial',
                fnBtnDeleteMultiple: '',
                fnBtnRefresh: 'listarComercial',
                /*widthsPx: true,*/
                //fnExtensions: ['fnExEditarComercial', '', '', '', 'fnExVerLeads', 'fnExEliminarComercial'],
                namespace: namespace
            });


            $$modal('MDL_lista_leads_usuario').create({
                WithScrollY: true,
                FullScreen: true,
                Namespace: namespace
            });
        }

        $scope.cargarDatos = function () {
            $scope.listarComercial();
        }
        //listar
        $scope.listarComercial = function () {
            var request = [{
                token: $config.token,
            }, {
                CODUSER: ''
            }, {
                RF: 'R'
            }];
            $service.ComLista(request, function (d) {
                if (d.success) {
                    console.log(d);
                    var listas = d.data != '' ? d.data.split('¯') : [];
                    if (listas[0] != '') {
                        var listaUsuarios = listas[0] != '' ? listas[0].split('¬') : [];
                        $$grid('grd_Comercial').setData(listaUsuarios);
                    }
                }
            });
        };

        //editar
        $scope.fnExEditarComercial = function (row, index) {
            var c = [];
            c.push('<i class="');
            c.push('fa fa-pencil btn-grid-edit hand');
            c.push('" onclick="$jt[\'' + namespace + '\'].fnEvEditarCanal(\'');
            c.push(row.IDCANAL);
            c.push('\')"></i>');
            return c.join('');
        };

        //eliminar
        $scope.fnExEliminarComercial = function (row, index) {
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


        //ver leads

        $scope.fnExVerLeads = function (row, index) {
            var c = [];
            c.push('<div class="hand text-left" onclick="$jt[\'' + namespace + '\'].fnEvVerLeads(\'' + index + '\')">' + row.LEAD);
            //c.push('<i style="color: #62a8ea" class="fa fa-eye"></i> ' + row.NOM_USU);
            c.push('</div>');
            return c.join('');
        };

        $scope.fnEvVerLeads = function (index) {
            var fields = $jt['jtse-grid_' + 'grd_Comercial'].matrix[index];
            var NOMBRE = fields[2]
            module.goSubPage("Leads", 'VW-MDLLista_Leads_Usuario', {
                frmVerLeads: {
                    _idUser: NOMBRE,
                    
                }
            })
            $$modal('MDL_lista_leads_usuario').show();
        };
    }
    controller.$inject = ["$scope", "$service"];
    module.controller(namespace, controller, service);
})