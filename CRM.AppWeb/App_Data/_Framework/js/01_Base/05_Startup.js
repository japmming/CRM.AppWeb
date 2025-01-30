//TODO: START CONFIG
window.onload = function () {
    var $initControls = function () {
        $loading = $$loading('_loading');
        $alert = $$alert('_alert');
        $tooltip = $$tooltip('_tooltip');
        //$birthday = $$birthday('_birthday')
        $loading.create();
        $alert.create();
        $dialog.create();
        $tooltip.createGeneral();
    };

    var $paths = function () {
        $app.setPage({ key: "ForgetPassword", base: $modules.general, controller: "@" });
        $app.setPage({ key: "LoginAccess", base: $modules.general, controller: "@" });

        $app.setPage({ key: "Layout", auth: 1, base: $modules.general, controller: "@" });
        $app.setPage({ key: "Inicio", auth: 1, base: $modules.general, controller: "@" });
        $app.setPage({ key: "Dashboard", auth: 1, base: $modules.general, controller: "@" });
        $app.setPage({ key: "EnEspera", auth: 1, base: $modules.general, controller: "@" });
        $app.setPage({ key: "01_Inicio", auth: 1, base: $modules.Asesoria, controller: "@" });
        $app.setPage({ key: "05_Inicio", auth: 1, base: $modules.Seguridad, controller: "@" });
        $app.setPage({ key: "01_Dashboard", auth: 1, base: $modules.Asesoria, controller: "@" });
        $app.setPage({ key: "05_Dashboard", auth: 1, base: $modules.Seguridad, controller: "@" });

        $app.setPage({ key: "02_PreguntasFrecuentes", auth: 1, base: $modules.Calidad, controller: "@" });
        $app.setPage({ key: "05_PreguntasFrecuentes", auth: 1, base: $modules.Seguridad, controller: "@" });


        /* CRM Mantenimiento */
        $app.setPage({ key: "01_Dashboard", auth: 1, base: $modules.crm_04, controller: "@" });
        $app.setPage({ key: "Eventos", auth: 1, base: $modules.crm_00, controller: "@" });
        $app.setPage({ key: "Campana", auth: 1, base: $modules.crm_00, controller: "@" });
        $app.setPage({ key: "Leads", auth: 1, base: $modules.crm_00, controller: "@" });
        $app.setPage({ key: "LeadsCUD", auth: 1, base: $modules.crm_00, controller: "@" });
        $app.setPage({ key: "Canal", auth: 1, base: $modules.crm_00_00, controller: "@" });
        $app.setPage({ key: "Interes", auth: 1, base: $modules.crm_00_00, controller: "@" });
        $app.setPage({ key: "Accion", auth: 1, base: $modules.crm_00_00, controller: "@" });
        $app.setPage({ key: "Estado", auth: 1, base: $modules.crm_00_00, controller: "@" });
        $app.setPage({ key: "Formulario", auth: 1, base: $modules.crm_00_00, controller: "@" });
        $app.setPage({ key: "Comerciales", auth: 1, base: $modules.crm_01, controller: "@" });
        $app.setPage({ key: "MetricasEventos", auth: 1, base: $modules.crm_02, controller: "@" });
        $app.setPage({ key: "MetricasComerciales", auth: 1, base: $modules.crm_02, controller: "@" });
        $app.setPage({ key: "ReporteLeadCanal", auth: 1, base: $modules.crm_02, controller: "@" });
        $app.setPage({ key: "ReporteLeadFormulario", auth: 1, base: $modules.crm_02, controller: "@" });
        /**/

        /*SEGURIDAD*/
        $app.setPage({ key: "UsuarioMante", auth: 1, base: $modules.seguridad_00, controller: "@" });
        $app.setPage({ key: "UsuarioPermiso", auth: 1, base: $modules.seguridad_04, controller: "@" });
        /**/
    };
    $initControls();
    //TODO: Cargar Módulos
    $app = $jtse.module($appName);
    //TODO: Cargar valores iniciales (Root y Versión)
    $app.setRoot();
    $urlBase = $app.getRoot();
    $paths();
    $app.init();
};
