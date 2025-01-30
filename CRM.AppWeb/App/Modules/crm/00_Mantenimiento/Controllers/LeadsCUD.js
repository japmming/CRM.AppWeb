define([$appName, "LeadsCUD", ["INTERES", "CANAL", "LIST_USUARIO_SOLI", "LIST_USUARIO_ASESOR_SUPERVISOR", "EVENTO",
    "CAMPANIA", "UBIGEO", "COMENTARIO_ESTADO", "COMENTARIO_ACCION", "RECORDATORIO_AVISO", "RECORDATORIO_ACCION",
    "ESTADO", "ACCION", "PAISES"]],
    function (module, namespace, args) {
        "use strict";
        var service = function ($service, $http) {

            $service.asociadoGetRuc = function (item, callback) {
                return $http({
                    url: "Generic/GetRUC",
                    data: item,
                    method: "post",
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
            $service.LeadsCUD = function (item, callback) {
                return $http({
                    url: "Leads/CUD",
                    data: item,
                    method: "post",
                    callback: callback
                });
            };
            $service.ComentarioCUD = function (item, callback) {
                return $http({
                    url: "Leads/ComentarioCUD",
                    data: item,
                    method: "post",
                    callback: callback
                });
            };


        };

        var controller = function ($scope, $service) {
            let arrControles = ['txt¦CreadoPor', 'txt¦DNI', 'txt¦Nombres', 'txt¦Apellidos', 'txt¦Edad', 'cbo¦Departamento', 'txt¦Formulario', 'txt¦TlfCelular',
                'txt¦Correo', 'cbo¦Interes', 'txt¦Modalidad', 'cbo¦Campania', 'cbo¦Evento', 'cbo¦Canal', 'cbo¦AsignarA', 'cbo¦Asistio', 'txt¦Estado', 'cbo¦Pais',
                'txt¦DESC_PAIS', 'txt¦RUC', 'txt¦RSocial', 'txt¦Fecha', 'lbl¦ESTADO', 'lbl¦CONDICION','txt¦hraRegistro'];
            let FechaActual = new Date();
            let FLG_RECORDATORIO = false;
            let arrControlesComentario = ['txt¦fchComentario', 'cbo¦ComentarioEstado', 'cbo¦ComentarioAccion', 'txt¦ComentarioNota',
                'chk¦ProgramRecordatorio', 'txt¦fchRecordatorio', 'txt¦hraRecordatorio', 'cbo¦RecordatorioAvisarme', 'cbo¦RecordatorioAccion', 'txt¦RecordatorioComentario'];
            let dataComentarios = [];
            let IDLEAD = '';
            let CUD = '';
            var veriRucAsoci = '';
            let listaVerificacion = [];
            $scope.init = function () {
                $scope.configurarControles();
                $scope.cargarCombos();
                $scope.cargarDatos();
                $scope.configurarEventos();
            };

            $scope.configurarControles = function () {
                $$grid('grd_VerificarDNI').create({
                    //           0           1           2               3             4       5      6           7           8          9         10       
                    headers: ['Campaña', 'Evento', 'Fecha de Ingreso', 'Asignado a', 'Edad', 'DNI', 'Nombre', 'Apellidos', 'Correo', 'Telefono', 'Estado'],
                    properties: ['campana', 'evento', 'fch_ingreso', 'asignado', 'edad', 'dni', 'nombre', 'apellidos', 'correo', 'telefono', 'estadoLead'],
                    typesData: ['S', 'S', 'S_C', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
                    typesFilter: ['I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I'],
                    sortHeader: [true, true, true, true, true, true, true, true, true, true, true],
                    showColumns: [true, true, true, true, true, true, true, true, true, true, true],
                    widthsPx: [140, 140, 100, 120, 65, 85, 110, 110, 140, 80, 80],
                    indexs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    headerStyle: $controls.grid.headerStyle,
                    data: [],
                    filterPosition: '',
                    generalFilter: false,
                    entriesPage: 15,
                    rangePage: 5,
                    btnNew: false,
                    btnRefresh: true,
                    btnExportExcel: true,
                    btnDelete: false,
                    btnEdit: false,
                    filterPosition: 'UP',
                    separator: '¦',
                    fnBtnNew: '',
                    fnBtnEdit: '',
                    fnBtnDelete: '',
                    fnBtnDeleteMultiple: '',
                    fnBtnRefresh: 'listarVerificacionDNI',
                    fnRowEvent: '',
                    fnExtensions: ['', '', '', '', '', '', '', '', '', '', ''],
                    namespace: namespace
                });


                $$modal('MDL_LeadsCUD_Comentario').create({
                    Width: 'md',
                    Title: 'Agregar comentario',
                    ButtonNames: ['Aceptar', 'Cancelar'],
                    ButtonClass: ['btn-save-ico', 'btn-cancel-ico'],
                    FnActions: ['fnEvMDLLeadsCUD_AgregarComentario_Aceptar', 'fnEvMDLLeadsCUD_AgregarComentario_Cancelar'],
                    Namespace: namespace
                });

                $$modal('mdl_Verificar_DNI').create({
                    WithScrollY: true,
                    Width: 'md',
                    Title: 'Listado Leads',
                    ButtonNames: ['Cancelar'],
                    ButtonClass: ['btn-cancel-ico'],
                    FnActions: ['fnEvMdlVerificarDNICancelar'],
                    Namespace: namespace
                });


            };

            $scope.cargarCombos = function () {
                let LST_ASIGNADOS = [];
                if (args) {
                    if (args.frmLeads) {
                        if (args.frmLeads.CUD == 'V') {
                            LST_ASIGNADOS = $global.lists.LIST_USUARIO_SOLI;
                        } else {
                            LST_ASIGNADOS = $global.lists.LIST_USUARIO_ASESOR_SUPERVISOR;
                        }
                    } else {
                        LST_ASIGNADOS = $global.lists.LIST_USUARIO_ASESOR_SUPERVISOR;
                    }
                }
                let arrAsistio = ["0¦Sí", "1¦No", "2¦No aplica"];
                $fnSetCombo({
                    controlId: 'cbo_MDL_LeadsCUD_Asistio',
                    data: arrAsistio,
                    type: 'S',
                    separator: '¦'
                });
                $fnSetCombo({
                    controlId: 'cbo_MDL_LeadsCUD_Canal',
                    data: $global.lists.CANAL,
                    type: 'S',
                    separator: '¦'
                });
                $fnSetCombo({
                    controlId: 'cbo_MDL_LeadsCUD_Interes',
                    data: $global.lists.INTERES,
                    type: 'S',
                    separator: '¦'
                });
                $fnSetCombo({
                    controlId: 'cbo_MDL_LeadsCUD_AsignarA',
                    data: LST_ASIGNADOS,
                    type: 'S',
                    separator: '¦'
                });
                $fnSetCombo({
                    controlId: 'cbo_MDL_LeadsCUD_Campania',
                    data: $global.lists.CAMPANIA,
                    type: 'S',
                    separator: '¦'
                });
                $fnSetCombo({
                    controlId: 'cbo_MDL_LeadsCUD_ComentarioEstado',
                    data: $global.lists.ESTADO,
                    type: 'S',
                    separator: '¦'
                });
                $fnSetCombo({
                    controlId: 'cbo_MDL_LeadsCUD_ComentarioAccion',
                    data: $global.lists.ACCION,
                    type: 'S',
                    separator: '¦'
                });
                $fnSetCombo({
                    controlId: 'cbo_MDL_LeadsCUD_RecordatorioAvisarme',
                    data: $global.lists.RECORDATORIO_AVISO,
                    type: 'S',
                    separator: '¦'
                });
                $fnSetCombo({
                    controlId: 'cbo_MDL_LeadsCUD_RecordatorioAccion',
                    data: $global.lists.RECORDATORIO_ACCION,
                    type: 'S',
                    separator: '¦'
                });
                let arrDepartamentos = [];
                let column = [];
                for (let i = 0; i < $global.lists.UBIGEO.length; i++) {
                    column = $global.lists.UBIGEO[i].split('¦');
                    if (column[0].length == 2) arrDepartamentos.push($global.lists.UBIGEO[i])
                }
                //console.log(arrDepartamentos);
                $fnSetCombo({
                    controlId: 'cbo_MDL_LeadsCUD_Departamento',
                    data: arrDepartamentos,
                    type: 'S',
                    separator: '¦'
                });


                $fnSetCombo({
                    controlId: 'cbo_MDL_LeadsCUD_Pais',
                    data: $global.lists.PAISES,
                    type: 'S',
                    separator: '¦'
                });
            };

            $scope.cargarDatos = function () {
                $fnValidarCampos({
                    containers: ['frmLeadsLST', 'FRM_MDL_LeadsCUD']
                });
                let FechaActual = new Date();
                let ctrl = '';
                var horaActual = FechaActual.getHours().toString().padStart(2, '0');
                var minutoActual = FechaActual.getMinutes().toString().padStart(2, '0');
                var segundoActual = FechaActual.getSeconds().toString().padStart(2, '0');

                txt_MDL_LeadsCUD_fchComentario.dateValue = $frConvertToDateString(FechaActual);
                txt_MDL_LeadsCUD_fchRecordatorio.datevalue = $frConvertToDateString(FechaActual);
                txt_MDL_LeadsCUD_Fecha.dateValue = $frConvertToDateString(FechaActual);

                txt_MDL_LeadsCUD_hraRegistro.value = (horaActual + ":" + minutoActual + ":" + segundoActual);
                //console.log("Hora actual: " + horaActual + ":" + minutoActual + ":" + segundoActual)
                
                
                
                //if ($global.user.coduser == 'ADMIN') btn_MDL_LeadsCUD_GuardarComentario.style.display = 'none';
                if (args) {
                    if (args.frmLeads) {
                        CUD = args.frmLeads.CUD;
                        if (args.frmLeads.CUD == 'C') {
                            //var FechaActual = new Date();
                            btn_MDL_LeadsCUD_GuardarComentario.style.display = 'none';
                            divContenedorComentarios.style.display = 'none';
                            btn_MDL_LeadsCUD_Volver.style.display = 'none';


                            btn_MDL_LeadsCUD_Guardar.style.display = 'block';
                            btn_MDL_LeadsCUD_Cancelar.style.display = 'block';

                            txt_MDL_LeadsCUD_CreadoPor.value = $global.user.name;
                            cbo_MDL_LeadsCUD_ComentarioEstado.selectedIndex = 1;
                            txt_MDL_LeadsCUD_Estado.value = cbo_MDL_LeadsCUD_ComentarioEstado.options[cbo_MDL_LeadsCUD_ComentarioEstado.selectedIndex].text;

                            if (!$global.usuarioAdmin) {
                                cbo_MDL_LeadsCUD_AsignarA.value = $global.user.coduser;
                                /*cbo_MDL_LeadsCUD_AsignarA.setAttribute('disabled', 'disabled');*/
                            } else {
                                cbo_MDL_LeadsCUD_AsignarA.selectedIndex = 0;
                            }
                        } else if (args.frmLeads.CUD == 'U' || args.frmLeads.CUD == 'V') {
                            div_MDL_LeadsCUD_CreadoPor.style.visibility = args.frmLeads.CUD == 'U' ? '' : 'hidden';
                            div_MDL_LeadsCUD_Estado.style.visibility = args.frmLeads.CUD == 'U' ? 'hidden' : '';
                            divContenedorComentarios.style.display = args.frmLeads.CUD == 'U' ? 'none' : 'block';
                            document.getElementById('div_form').style.display = 'block';

                            btn_MDL_LeadsCUD_Guardar.style.display = args.frmLeads.CUD == 'U' ? 'block' : 'none';
                            btn_MDL_LeadsCUD_Cancelar.style.display = args.frmLeads.CUD == 'U' ? 'block' : 'none';

                            //btn_MDL_LeadsCUD_Guardar.style.display = args.frmLeads.CUD == 'V' ? 'none' : '';
                            //btn_MDL_LeadsCUD_Cancelar.style.display = args.frmLeads.CUD == 'V' ? 'none' : '';
                           
                            btn_MDL_LeadsCUD_Volver.style.display = args.frmLeads.CUD == 'V' ? 'block' : 'none';
                            btn_MDL_LeadsCUD_GuardarComentario.style.display = args.frmLeads.CUD == 'V' ? 'block' : 'none';


                            let arrData = args.frmLeads.DATA;
                            
                            let dataLead = arrData[0].split('¦');
                            dataComentarios = arrData[1].split('¬');
                            
                            $scope.ListarComentarios();
                            
                            let column = [];
                            for (let i = 0; i < arrControles.length; i++) {
                                column = arrControles[i].split('¦');
                                if (column[1] == 'Evento') $scope.ListarComboEventos(dataLead[11], dataLead[12], args.frmLeads.CUD == 'U' ? false : true);
                                else if (column[1] == 'Departamento') {
                                    var ubigeo = dataLead[i];
                                    $scope.mostrarUbigeo(ubigeo, 'cbo_MDL_LeadsCUD_Departamento', 'cbo_MDL_LeadsCUD_Provincia', 'cbo_MDL_LeadsCUD_Distrito', args.frmLeads.CUD == 'U' ? false : true);
                                } else if (column[0] == 'lbl') {
                                    ctrl = column[0] + '_MDL_LeadsCUD_' + column[1];
                                    if (dataLead[i] != '') {
                                        document.getElementById(ctrl).innerHTML = dataLead[i];
                                        if (dataLead[i] === 'ACTIVO' || dataLead[i] === 'HABIDO') {
                                            document.getElementById(ctrl).className = 'label label-success';
                                        } else {
                                            document.getElementById(ctrl).className = 'label label-danger';
                                        }
                                    }
                                } else {
                                    ctrl = column[0] + '_MDL_LeadsCUD_' + column[1];
                                    document.getElementById(ctrl).value = dataLead[i];
                                    if (column[0] == 'txt' && args.frmLeads.CUD == 'V') document.getElementById(ctrl).disabled = true;
                                    if (column[0] == 'cbo' && args.frmLeads.CUD == 'V') document.getElementById(ctrl).disabled = true;
                                    ctrl = '';
                                }
                            }
                            //if (!$global.usuarioAdmin) {
                            //    cbo_MDL_LeadsCUD_AsignarA.value = $global.user.coduser;
                            //} else {
                            //    cbo_MDL_LeadsCUD_AsignarA.selectedIndex = 0;
                            //}



                            //if ($global.usuarioAsesor) {
                            //    cbo_MDL_LeadsCUD_AsignarA.value = $global.user.coduser;
                            //    cbo_MDL_LeadsCUD_AsignarA.setAttribute('disabled', 'disabled');
                            //}
                            
                        }
                        IDLEAD = args.frmLeads.idLead;
                    } else {
                        if (args.ParametroMenu._Pramatro == 'nuevo') {
                            btn_MDL_LeadsCUD_GuardarComentario.style.display = 'none';
                            divContenedorComentarios.style.display = 'none';
                            btn_MDL_LeadsCUD_Volver.style.display = 'none';

                            btn_MDL_LeadsCUD_Cancelar.style.display = 'block';
                            btn_MDL_LeadsCUD_Guardar.style.display = 'block';


                            txt_MDL_LeadsCUD_CreadoPor.value = $global.user.name;
                            cbo_MDL_LeadsCUD_ComentarioEstado.selectedIndex = 1;
                            txt_MDL_LeadsCUD_Estado.value = cbo_MDL_LeadsCUD_ComentarioEstado.options[cbo_MDL_LeadsCUD_ComentarioEstado.selectedIndex].text;

                            if (!$global.usuarioAdmin) {
                                cbo_MDL_LeadsCUD_AsignarA.value = $global.user.coduser;
                                /*cbo_MDL_LeadsCUD_AsignarA.setAttribute('disabled', 'disabled');*/
                            } else {
                                cbo_MDL_LeadsCUD_AsignarA.selectedIndex = 0;
                            }
                        }
                        
                        btn_MDL_LeadsCUD_GuardarComentario.style.display = 'none';
                        divContenedorComentarios.style.display = 'none';
                        btn_MDL_LeadsCUD_Cancelar.style.display = 'none';
                        txt_MDL_LeadsCUD_CreadoPor.value = $global.user.name;
                        cbo_MDL_LeadsCUD_ComentarioEstado.selectedIndex = 1;
                        txt_MDL_LeadsCUD_Estado.value = cbo_MDL_LeadsCUD_ComentarioEstado.options[cbo_MDL_LeadsCUD_ComentarioEstado.selectedIndex].text;
                        
                        
                       
                    }


                }

                //if (!$global.usuarioAdmin && $global.usuarioAsesor ) {
                //    div_MDL_LeadsCUD_CHK_Recordatorio.style.display = 'block';
                //}

                if ($global.usuarioAdmin) {
                    div_MDL_LeadsCUD_CHK_Recordatorio.style.display = 'none';
                }

                if (cbo_MDL_LeadsCUD_Pais.value != '165') {
                    document.getElementById('DIV_DEP').style.display = 'none'
                    document.getElementById('DIV_PROV').style.display = 'none'
                    document.getElementById('DIV_DIS').style.display = 'none'
                    document.getElementById('DIV_DEP').style.value = '00'
                    document.getElementById('DIV_PROV').style.value = '00'
                    document.getElementById('DIV_DIS').style.value = '00'
                    document.getElementById('DIV_DESC_PAIS').style.display = 'block'
                }        

            };

            $scope.mostrarUbigeo = function (ubigeo, cboDepartamento, cboProvincia, cboDistrito, FLG_READONLY = false) {
                document.getElementById(cboDepartamento).value = ubigeo.substring(0, 2);
                var obj = {
                    controlId: cboProvincia,
                    data: $global.lists.UBIGEO.filter(d => d.split('¦')[0].length === 4 && d.split('¦')[0].substring(0, 2) === ubigeo.substring(0, 2)),
                    type: 'S',
                    separator: '¦'
                };
                $fnSetCombo(obj);
                document.getElementById(cboProvincia).value = ubigeo.substring(0, 4);
                obj = {
                    controlId: cboDistrito,
                    data: $global.lists.UBIGEO.filter(d => d.split('¦')[0].length === 6 && d.split('¦')[0].substring(0, 4) === ubigeo.substring(0, 4)),
                    type: 'S',
                    separator: '¦'
                };
                $fnSetCombo(obj);
                document.getElementById(cboDistrito).value = ubigeo;
                if (FLG_READONLY) {
                    document.getElementById(cboDepartamento).disabled = FLG_READONLY;
                    document.getElementById(cboProvincia).disabled = FLG_READONLY;
                    document.getElementById(cboDistrito).disabled = FLG_READONLY;
                }

            };

            $scope.listarVerificacionDNI = function () {
                var request = [{
                    token: $config.token,
                }, {
                    DNI: txt_MDL_LeadsCUD_DNI.value,
                    TLF: '',
                    ID_LEAD: IDLEAD
                }, {
                    RF: 'V'
                }];
                $service.LeadsLST(request, function (d) {
                    if (d.success) {
                        if (d.data != '') {

                            listaVerificacion = d.data.split('¬');
                            $$grid('grd_VerificarDNI').setData(listaVerificacion);
                            $$modal('mdl_Verificar_DNI').show();


                        } else {
                            $alertbox.show('No se encontraron registros', "E", 4);
                        }

                    }
                });

            };
            $scope.listarVerificacionTLF = function () {
                var request = [{
                    token: $config.token,
                }, {
                    DNI: '',
                    TLF: txt_MDL_LeadsCUD_TlfCelular.value,
                    ID_LEAD: IDLEAD
                }, {
                    RF: 'V'
                }];
                $service.LeadsLST(request, function (d) {
                    if (d.success) {
                        if (d.data != '') {

                            listaVerificacion = d.data.split('¬');
                            $$grid('grd_VerificarDNI').setData(listaVerificacion);
                            $$modal('mdl_Verificar_DNI').show();


                        } else {
                            $alertbox.show('No se encontraron registros', "E", 4);
                        }

                    }
                });

            };

            $scope.configurarEventos = function () {
                btn_MDL_LeadsCUD_DNI.addEventListener("click", function () {
                    if (txt_MDL_LeadsCUD_DNI.value != '') {
                        if (txt_MDL_LeadsCUD_DNI.value.length == 8) {
                            listaVerificacion = [];
                            $scope.listarVerificacionDNI();


                        } else {
                            $alertbox.show('DNI Invalido', "E", 4);
                        }
                    } else {
                        $alertbox.show('Completar el campo DNI', "E", 4);
                    }


                });

                btn_MDL_LeadsCUD_TLF.addEventListener("click", function () {
                    if (txt_MDL_LeadsCUD_TlfCelular.value != '') {
                        if (txt_MDL_LeadsCUD_TlfCelular.value.length == 9) {
                            listaVerificacion = [];
                            $scope.listarVerificacionTLF();


                        } else {
                            $alertbox.show('Telefono Invalido', "E", 4);
                        }
                    } else {
                        $alertbox.show('Completar el campo Telefono', "E", 4);
                    }


                });

                btn_MDL_LeadsCUD_Cancelar.onclick = function () {
                    if (args.frmLeads.Pantalla == 'Main') {
                        module.goSubPage("Leads", 'view-Main', { frmLeads: { Data: '' } });
                    }
                    else $jt["Leads"].ocultarModal_CUD();
                };

                btn_MDL_LeadsCUD_Volver.onclick = function () {
                    if (args.frmLeads.Pantalla == 'Main') {
                        module.goSubPage("Leads", 'view-Main', { frmLeads: { Data: '' } });
                    }
                    else $jt["Leads"].ocultarModal_CUD();
                   
                };

                btn_MDL_LeadsCUD_Guardar.onclick = function () {  

                    $scope.GuardarLead();
                    
                    //if ($scope.GuardarLead()) {
                    //    if (args.frmLeads.Pantalla == 'Main') {
                    //        module.goSubPage("Leads", 'view-Main', { frmLeads: { Data: '' } });
                    //    }
                    //    else $jt["Leads"].ocultarModal_CUD();
                    //};
       
                };

                btn_MDL_LeadsCUD_GuardarComentario.onclick = function () {
                    $$modal('MDL_LeadsCUD_Comentario').show();
                }

                cbo_MDL_LeadsCUD_Campania.onchange = function () {
                    let idCampania = cbo_MDL_LeadsCUD_Campania.value;
                    $scope.ListarComboEventos(idCampania);
                };

                chk_MDL_LeadsCUD_ProgramRecordatorio.addEventListener("change", function () {
                    if (chk_MDL_LeadsCUD_ProgramRecordatorio.checked) {
                        DIV_MDL_LeadsCUD_ProgramRecordatorio.classList.add('alt');
                        div_MDL_LeadsCUD_Recordatorio.style.display = 'block';
                        txt_MDL_LeadsCUD_fchRecordatorio.classList.add('required');
                        txt_MDL_LeadsCUD_hraRecordatorio.classList.add('required');
                        cbo_MDL_LeadsCUD_RecordatorioAvisarme.classList.add('required');
                        cbo_MDL_LeadsCUD_RecordatorioAccion.classList.add('required');
                    } else {
                        DIV_MDL_LeadsCUD_ProgramRecordatorio.classList.remove('alt');
                        div_MDL_LeadsCUD_Recordatorio.style.display = 'none';
                        txt_MDL_LeadsCUD_fchRecordatorio.classList.remove('required');
                        txt_MDL_LeadsCUD_hraRecordatorio.classList.remove('required');
                        cbo_MDL_LeadsCUD_RecordatorioAvisarme.classList.remove('required');
                        cbo_MDL_LeadsCUD_RecordatorioAccion.classList.remove('required');
                    }
                });

                cbo_MDL_LeadsCUD_Departamento.addEventListener('change', function () {
                    var dpto = cbo_MDL_LeadsCUD_Departamento.value;
                    $fnSetCombo({
                        controlId: 'cbo_MDL_LeadsCUD_Provincia',
                        data: $global.lists.UBIGEO.filter(d => d.split('¦')[0].length === 4 && dpto === d.split('¦')[0].substring(0, 2)),
                        type: 'S',
                        description: '',
                    });
                });

                cbo_MDL_LeadsCUD_Provincia.addEventListener('change', function () {
                    var dpto = cbo_MDL_LeadsCUD_Provincia.value;
                    $fnSetCombo({
                        controlId: 'cbo_MDL_LeadsCUD_Distrito',
                        data: $global.lists.UBIGEO.filter(d => d.split('¦')[0].length === 6 && dpto === d.split('¦')[0].substring(0, 4)),
                        type: 'S',
                        description: '',
                    });
                });

                cbo_MDL_LeadsCUD_Pais.addEventListener('change', function () {
                    var pais = cbo_MDL_LeadsCUD_Pais.value;
                    //console.log(pais);
                    if (pais == '165') {
                        document.getElementById('DIV_DEP').style.display = 'block'
                        document.getElementById('DIV_DIS').style.display = 'block'
                        document.getElementById('DIV_PROV').style.display = 'block'
                        document.getElementById('DIV_DEP').style.value = '00'
                        document.getElementById('DIV_PROV').style.value = '00'
                        document.getElementById('DIV_DIS').style.value = '00'
                        document.getElementById('txt_MDL_LeadsCUD_DESC_PAIS').value = ''
                        document.getElementById('DIV_DESC_PAIS').style.display = 'none'

                    } else {
                        document.getElementById('DIV_DEP').style.display = 'none'
                        document.getElementById('DIV_PROV').style.display = 'none'
                        document.getElementById('DIV_DIS').style.display = 'none'
                        document.getElementById('DIV_DEP').style.value = '00'
                        document.getElementById('DIV_PROV').style.value = '00'
                        document.getElementById('DIV_DIS').style.value = '00'
                        document.getElementById('txt_MDL_LeadsCUD_DESC_PAIS').value = ''
                        document.getElementById('DIV_DESC_PAIS').style.display = 'block'
                    }
                });

                txt_MDL_LeadsCUD_RUC.addEventListener('blur', function () {
                    if (txt_MDL_LeadsCUD_RUC.value.length > 0) {
                        var RucValido = $fnValidaRUC(txt_MDL_LeadsCUD_RUC.value);
                        if (RucValido) {
                            if (veriRucAsoci !== txt_MDL_LeadsCUD_RUC.value.trim()) {
                                veriRucAsoci = txt_MDL_LeadsCUD_RUC.value.trim();
                                $scope.buscarRUC();
                            }
                        } else {
                            txt_MDL_LeadsCUD_RUC.focus();
                            $alert.show('Ingresar R.U.C. Valido.', 'E');
                        }
                    }
                });

                
            }

            $scope.GuardarLead = function () {        
                let item = {
                    containers: ['frmLeadsLST']
                };
                
                if ($fnValidarForm(item).resultado == 0) {
                    let request = [{
                        TOKEN: $config.token
                    }, {
                        VAR01: txt_MDL_LeadsCUD_DNI.value,
                        VAR02: txt_MDL_LeadsCUD_Nombres.value,
                        VAR03: txt_MDL_LeadsCUD_Apellidos.value,
                        VAR04: txt_MDL_LeadsCUD_Edad.value,
                        VAR05: cbo_MDL_LeadsCUD_Distrito.value,
                        VAR06: txt_MDL_LeadsCUD_TlfCelular.value,
                        VAR07: txt_MDL_LeadsCUD_Correo.value,
                        VAR08: cbo_MDL_LeadsCUD_Interes.value,
                        VAR09: txt_MDL_LeadsCUD_Modalidad.value,
                        VAR10: cbo_MDL_LeadsCUD_Campania.value,
                        VAR11: cbo_MDL_LeadsCUD_Evento.value,
                        VAR12: cbo_MDL_LeadsCUD_Canal.value,
                        VAR13: cbo_MDL_LeadsCUD_AsignarA.value,
                        VAR14: cbo_MDL_LeadsCUD_Asistio.value,
                        VAR15: $global.user.coduser,
                        VAR16: '#IP_CLIENTE#',
                        VAR17: (CUD == 'C' || CUD == '') ? '' : IDLEAD,
                        VAR18: txt_MDL_LeadsCUD_Fecha.dateValue,//$formatDateStandar(txt_MDL_LeadsCUD_Fecha.value),
                        VAR19: cbo_MDL_LeadsCUD_Pais.value,
                        VAR20: txt_MDL_LeadsCUD_DESC_PAIS.value,
                        VAR21: txt_MDL_LeadsCUD_RSocial.value,
                        VAR22: txt_MDL_LeadsCUD_RUC.value,
                        VAR23: txt_MDL_LeadsCUD_hraRegistro.value
                    }, {
                        RF: CUD == '' ? 'C' : CUD //isNewLead ? 'C' : 'U'
                    }];
                    $service.LeadsCUD(request, function (d) {
                        if (d.success && d.data != '') {                            
                            if (d.data == 'OK') {
                                $alertbox.show('Lead ' + (CUD == 'C' || CUD == '') ? 'registrado' : 'editado' + ' exitosamente', 'S', 4);
                                $global.user.conexionSocket.send('NOTIFICACIONES¯');
                                $scope.LimpiarControles();
                                if (CUD != '') {
                                    if (args.frmLeads.Pantalla == 'Main') {
                                        module.goSubPage("Leads", 'view-Main', { frmLeads: { Data: '' } });
                                    } else {
                                        $jt['Leads'].ocultarModal_CUD();
                                        $jt['Leads'].fnListarGRDLead();
                                    }
                                }
                            } else {
                                $alertbox.show($msg.error.server, "E");
                            }
                        } else {
                            $alertbox.show($msg.error.server, "E");
                        }
                    });
                } else {
                    $alert.show('Validar Campos', 'E');
                }
            }

            $scope.ListarComboEventos = function (idCampania = '', idEvento = '', FLG_READONLY = false) {
                let arrEventos = [];
                if (idCampania != '') {
                    let column = [];
                    for (let i = 0; i < $global.lists.EVENTO.length; i++) {
                        column = $global.lists.EVENTO[i].split('¦');
                        if (column[1] == idCampania) arrEventos.push(column[0] + '¦' + column[2]);
                    }
                }
                $fnSetCombo({
                    controlId: 'cbo_MDL_LeadsCUD_Evento',
                    data: idCampania != '' ? arrEventos : [],
                    type: 'S',
                    separator: '¦'
                });

                if (idEvento != '') cbo_MDL_LeadsCUD_Evento.value = idEvento;
                if (FLG_READONLY) cbo_MDL_LeadsCUD_Evento.disabled = FLG_READONLY;
            }


            $scope.RequestAgregarComentario = function () {
                let hoy = new Date();
                let hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
                let fechaHora = txt_MDL_LeadsCUD_fchRecordatorio.value + ' ' + hora//$formatDateStandar(txt_MDL_LeadsCUD_fchRecordatorio.value) + ' ' + hora;

                let request = [{
                    TOKEN: $config.token
                }, {
                    VAR01: IDLEAD,
                    VAR02: fechaHora,
                    VAR03: cbo_MDL_LeadsCUD_ComentarioEstado.value,
                    VAR04: cbo_MDL_LeadsCUD_ComentarioAccion.value,
                    VAR05: txt_MDL_LeadsCUD_ComentarioNota.value,
                    VAR06: FLG_RECORDATORIO ? '1' : '0',
                    VAR07: FLG_RECORDATORIO ? txt_MDL_LeadsCUD_fchRecordatorio.value : '',//$formatDateStandar(txt_MDL_LeadsCUD_fchRecordatorio.value) : '',
                    VAR08: FLG_RECORDATORIO ? txt_MDL_LeadsCUD_hraRecordatorio.value : '',
                    VAR09: FLG_RECORDATORIO ? cbo_MDL_LeadsCUD_RecordatorioAvisarme.value : '',
                    VAR10: FLG_RECORDATORIO ? cbo_MDL_LeadsCUD_RecordatorioAccion.value : '',
                    VAR11: FLG_RECORDATORIO ? txt_MDL_LeadsCUD_RecordatorioComentario.value : '',
                    VAR12: $global.user.coduser,
                    VAR13: '#IP_CLIENTE#',
                }, {
                    CUD: 'C'
                }]
                $service.ComentarioCUD(request, function (d) {
                    if (d.success && d.data != '') {
                        let dato = d.data.split('¯');
                        if (dato[0] == 'OK') {
                            let comentario = [];
                            comentario.push($global.user.name);
                            comentario.push(fechaHora);
                            comentario.push(cbo_MDL_LeadsCUD_ComentarioAccion.options[cbo_MDL_LeadsCUD_ComentarioAccion.selectedIndex].text);
                            comentario.push(cbo_MDL_LeadsCUD_ComentarioEstado.options[cbo_MDL_LeadsCUD_ComentarioEstado.selectedIndex].text);
                            comentario.push(txt_MDL_LeadsCUD_ComentarioNota.value);
                            $scope.ListarComentarios(comentario.join('¦'));
                            txt_MDL_LeadsCUD_Estado.value = cbo_MDL_LeadsCUD_ComentarioEstado.options[cbo_MDL_LeadsCUD_ComentarioEstado.selectedIndex].text;
                            $alertbox.show('Comentario agregado exitosamente', 'S', 4);
                            if (args.frmLeads.Pantalla != 'Main') {
                                $jt['Leads'].FnGuardarEstadoComentario(IDLEAD, cbo_MDL_LeadsCUD_ComentarioEstado.options[cbo_MDL_LeadsCUD_ComentarioEstado.selectedIndex].text, args.frmLeads.Pantalla);
                            }
                            $scope.fnEvMDLLeadsCUD_AgregarComentario_Cancelar();
                            $global.user.conexionSocket.send('NOTIFICACIONES' + (FLG_RECORDATORIO ? '¬RECORDATORIOS' : '') + '¯' + (FLG_RECORDATORIO ? dato[1] : ''));
                        } else {
                            $alertbox.show($msg.error.server, 'E');
                        }
                    } else {
                        $alertbox.show($msg.error.server, 'E');
                    }

                });
            }

            $scope.fnEvMDLLeadsCUD_AgregarComentario_Aceptar = function () {

                var tiempo = txt_MDL_LeadsCUD_hraRecordatorio.value.split(':');
                var hora = tiempo[0];
                let item = {
                    containers: ['FRM_MDL_LeadsCUD']
                }


                if ($fnValidarForm(item).resultado == 0) {
                    if ($fnValidarFechaMin(txt_MDL_LeadsCUD_fchComentario.dateValue, $frConvertToDateString(FechaActual)) == true) {
                        FLG_RECORDATORIO = chk_MDL_LeadsCUD_ProgramRecordatorio.checked;
                        if (FLG_RECORDATORIO) {


                            if (hora > 8 && hora < 18) {
                                $scope.RequestAgregarComentario();
                            }
                            else {
                                $dialog.confirm("¿La hora esta fuera del horario de trabajo, esta de acuerdo con la hora seleccionada? ", "Nota", "Q", function (d) {
                                    if (d == true) {
                                        if ($fnValidarForm(item).resultado == 0) {
                                            $scope.RequestAgregarComentario();
                                        } else {
                                            $alert.show('Completar los campos.', 'E');
                                        }
                                    }
                                })
                            }
                        }
                        else {
                            $scope.RequestAgregarComentario();
                        }
                    } else {
                        $alertbox.show("La fecha final no puede ser menor a la fecha de hoy ", "E", 4);
                    }
                } else {
                    $alert.show('Completar los campos.', 'E');
                }

            }

            $scope.LimpiarModalComentario = function () {
                let fechaActual = new Date();
                let column = [];
                let ctrl = '';
                for (let i = 0; i < arrControlesComentario.length; i++) {
                    column = arrControlesComentario[i].split('¦');
                    ctrl = column[0] + '_MDL_LeadsCUD_' + column[1];
                    if (column[1].substring(0, 3) == 'fch') document.getElementById(ctrl).value = $frConvertToDateString(fechaActual);
                    else {
                        if (column[0] == 'chk') {
                            document.getElementById(ctrl).checked = false;
                            document.getElementById('DIV_MDL_LeadsCUD_ProgramRecordatorio').classList.remove('alt');
                            document.getElementById('div_MDL_LeadsCUD_Recordatorio').style.display = 'none';
                        }
                        else document.getElementById(ctrl).value = '';
                    }
                    ctrl = '';
                }
            }

            $scope.fnEvMDLLeadsCUD_AgregarComentario_Cancelar = function () {
                $scope.LimpiarModalComentario();
                $$modal('MDL_LeadsCUD_Comentario').hide();
            }

            $scope.ListarComentarios = function (Comentario = '') {
                if (Comentario != '') dataComentarios.unshift(Comentario);
                let div = [];
                let column = [];
                if (dataComentarios.length > 0 && dataComentarios[0] != '') {
                    div.push('<div>');
                    div.push('<ul>');
                    for (let i = 0; i < dataComentarios.length; i++) {
                        column = dataComentarios[i].split('¦')
                        if (column != '') {
                            div.push('<li>');
                            div.push('<div>');
                            if (i > 0);

                            div.push('<div >');

                            div.push('<span>' + column[1] + ' - </span>');
                            div.push('<b>' + column[0] + '  </b>');
                            div.push('<span>realizó </span> <b> " ' + column[2] + ' "</b> <span>y cambio el estado a </span> <b>" ' + column[3] + ' "</b>');

                            div.push('</div>');

                            div.push('<br/>');

                            div.push('<div style=" word-wrap: break-word; margin-left:30px;">');
                            div.push('<i ><b>Notas: </b><span> ' + column[4] + '</span></i>');
                            div.push('</div>')

                            div.push('<br/>');

                            div.push('</div>');
                            div.push('</li>');
                        }
                    }
                    div.push('</ul>');
                    div.push('</div>');
                } else if (dataComentarios.length > 1 && dataComentarios[1] == '') {
                    dataComentarios.splice(1, 1);
                    div.push('<div>');
                    div.push('<ul>');
                    for (let i = 0; i < dataComentarios.length; i++) {
                        column = dataComentarios[i].split('¦')
                        if (column != '') {
                            div.push('<li>');
                            div.push('<div>');
                            if (i > 0);

                            div.push('<div >');

                            div.push('<span>' + column[1] + ' - </span>');
                            div.push('<b>' + column[0] + '  </b>');
                            div.push('<span>realizó </span> <b> " ' + column[2] + ' "</b> <span>y cambio el estado a </span> <b>" ' + column[3] + ' "</b>');

                            div.push('</div>');

                            div.push('<br/>');

                            div.push('<div style=" word-wrap: break-word; margin-left:30px;">');
                            div.push('<i ><b>Notas: </b><span> ' + column[4] + '</span></i>');
                            div.push('</div>')

                            div.push('<br/>');

                            div.push('</div>');
                            div.push('</li>');
                        }
                    }
                    div.push('</ul>');
                    div.push('</div>');
                } else {
                    div.push('<span>Este lead aun no tiene comentarios.</span>')
                }

                div_MDL_LeadsCUD_Comentarios.innerHTML = div.join('');
            }

            $scope.fnEvMdlVerificarDNICancelar = function () {
                $$modal('mdl_Verificar_DNI').hide();

            }

            $scope.LimpiarControles = function () {
                txt_MDL_LeadsCUD_DNI.value = '';
                txt_MDL_LeadsCUD_Nombres.value = '';
                txt_MDL_LeadsCUD_Apellidos.value = '';
                txt_MDL_LeadsCUD_Edad.value = '';
                cbo_MDL_LeadsCUD_Departamento.value = '';
                txt_MDL_LeadsCUD_TlfCelular.value = '';
                txt_MDL_LeadsCUD_Correo.value = '';
                cbo_MDL_LeadsCUD_Interes.value = '';
                txt_MDL_LeadsCUD_Modalidad.value = '';
                cbo_MDL_LeadsCUD_Campania.value = '';
                cbo_MDL_LeadsCUD_Evento.value = '';
                cbo_MDL_LeadsCUD_Canal.value = '';
                cbo_MDL_LeadsCUD_AsignarA.value = '';
                cbo_MDL_LeadsCUD_Asistio.value = '';
            };
            //#region
            //#$scope.iniciarConteoRecordatorio = function () {
            //    let primeraNotificacion = $global.user.arrRecordatorios[0].split('¦');
            //    let tiempo = primeraNotificacion[2];
            //    hiloPrincipal_Not = setTimeout(function () { $scope.mostrarAlertaRecordatorio(); }, tiempo);
            //}
            //$scope.mostrarAlertaRecordatorio = function () {
            //    let notificacion = $global.user.arrRecordatorios[0].split('¦');
            //    let tiempoAnterior = notificacion[2] * 1;
            //    $alertbox.show('Recordatorio: ' + notificacion[3], 'S', 8);
            //    $global.user.arrRecordatorios.shift();
            //    //contadorNotificaciones++;
            //    clearInterval(hiloPrincipal_Not);
            //    if ($global.user.arrRecordatorios.length > 0 && $global.user.arrRecordatorios[0] != '') {
            //        notificacion = $global.user.arrRecordatorios[0].split('¦');
            //        let nuevoTiempo = tiempoAnterior - (notificacion[2] * 1);
            //        hiloSecundario_Not = setTimeout(function () { $scope.mostrarAlertaRecordatorio(); }, nuevoTiempo);
            //    } else {
            //        clearInterval(hiloSecundario_Not);
            //    }
            //#}

            //$scope.buscarRUC = function () {
            //    var request = [{
            //        ruc: txt_MDL_LeadsCUD_RUC.value
            //    }];
            //    $service.asociadoGetRuc(request, function (d) {
            //        if (d.success) {
            //            if (d.data != "") {
            //                var fields = d.data.split('¦');
            //                txt_MDL_LeadsCUD_RSocial.value = fields[0];

            //                lbl_MDL_LeadsCUD_ESTADO.innerHTML = fields[3];

            //                if (fields[3] === 'ACTIVO') {
            //                    lbl_MDL_LeadsCUD_ESTADO.className = 'label label-success';
            //                } else {
            //                    lbl_MDL_LeadsCUD_ESTADO.className = 'label label-danger';
            //                }

            //                lbl_MDL_LeadsCUD_CONDICION.innerHTML = fields[4];

            //                if (fields[4] === 'HABIDO') {
            //                    lbl_MDL_LeadsCUD_CONDICION.className = 'label label-success';
            //                } else {
            //                    lbl_MDL_LeadsCUD_CONDICION.className = 'label label-danger';
            //                }

            //            }
            //        }
            //    });
            //};
            //#endregion
        };

        controller.$inject = ["$scope", "$service"];
        module.controller(namespace, controller, service);
    });