# CRM AppWeb (NATCODEE)

Sistema CRM web desarrollado para **NATCODEE*, construido sobre **ASP.NET MVC** y **.NET Framework 4.6.1**, con una interfaz de una sola página (SPA) basada en un framework frontend propio (`jtse`) en JavaScript/HTML.

La solución gestiona campañas, eventos, leads, comercialización y métricas comerciales, así como la administración de usuarios y permisos. Toda la lógica de negocio se ejecuta mediante *stored procedures* en SQL Server.

---

## Características principales

- **Autenticación múltiple**: usuario/contraseña o **Google OAuth 2.0**, con captura de geolocalización, navegador y sistema operativo del usuario.
- **Geolocalización de IP** para el registro de accesos (vía `ip-api.com`).
- **Gestión CRM**:
  - Campañas y asignación de usuarios asesores.
  - Eventos asociados a campañas.
  - Leads (creación, edición, eliminación y comentarios).
  - Tablas maestras: acción, estado, formulario, canal, interés.
  - Ejecutivos y comercialización.
  - Métricas comerciales y de eventos.
  - Reportes de leads por canal y por formulario.
- **Administración de seguridad**: usuarios, plantillas de correo y permisos por usuario/módulo.
- **Envío de correo** mediante SMTP o **AWS SES**, con plantillas HTML y recursos incrustados (imágenes, adjuntos).
- **Servicios externos**: cliente WCF del servicio **GS1 GPIR** (importación de ítems y parties con estándares GS1).
- **Exportación a Excel** desde las grillas y descarga de plantillas de carga.
- **Dashboard** con métricas e indicadores.
- Manejo de errores centralizado: las excepciones se serializan en archivos de log (`C:\GS1\Logs\CRM\`).

---

## Arquitectura y stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | ASP.NET MVC 4, C#, .NET Framework 4.6.1 |
| Frontend | HTML + JavaScript (SPA), framework propio `jtse`, loaders y bundles generados por plantillas T4 |
| Datos | SQL Server, mediante *stored procedures* (`dbo.CSV_*`) accedidos vía `DataSQL` |
| Email | SMTP (Gmail) y AWS SES (`AWSSDK.SimpleEmailV2`) |
| Documentos | `DocumentFormat.OpenXml` (Word), `iTextSharp` (PDF) |
| Otros | `Newtonsoft.Json`, `BouncyCastle`, `AWSSDK.Core`, `GS1Peru.Core` (paquete NuGet), SheetJS (`xlsx`) para Excel |

### Proyectos

- **`CRM.AppWeb`** — Proyecto web ASP.NET MVC. Vista única Razor (`Sistema/Inicio.cshtml`) que arranca la SPA.
- **`CRM.Core`** — Librería de clases con entidades y *helpers* reutilizables (acceso a BD, cifrado, correo, captcha, Active Directory, compresión, generación de textos, Word, etc.).

> Nota: aunque `CRM.Core` está presente en el repositorio, `CRM.AppWeb` referencia `GS1Peru.Core` mediante el paquete NuGet `GS1Peru.Core.1.0.0.1` (carpeta `packages/`).

### Flujo de trabajo (backend)

1. Los controladores MVC reciben en `data` los parámetros serializados con caracteres separadores (`¦`, `¬`, `¯`).
2. `BaseController.OnActionExecuting` aplica descifrado opcional (`Encrypt`) configurado por `_IsEncoded`.
3. `DataSQL.ExecuteCommand` ejecuta el *stored procedure* y devuelve un `StatusResponse` (éxito + datos).
4. `BaseController.Ok` empaqueta la respuesta, indicando éxito/error en el encabezado HTTP `StatusResponse`.

---

## Estructura del proyecto

```
CRM.AppWeb/
├── App/
│   ├── Modules/                     # Módulos SPA (controlador JS + vista HTML por pantalla)
│   │   ├── 00_General/              # Login, Layout, Inicio, Dashboard, ForgetPassword
│   │   ├── crm/                     # Módulos funcionales CRM
│   │   │   ├── 00_Mantenimiento/    # Campañas, Eventos, Leads, Tablas maestras
│   │   │   ├── 01_Transaccion/      # Comerciales
│   │   │   ├── 02_Consulta/         # Métricas y reportes de leads
│   │   │   ├── 03_Reporte/          # (reservado)
│   │   │   └── 04_Utilitario/       # Dashboard
│   │   └── Seguridad/               # Usuarios, Plantilla de correo, Permisos
│   ├── Support/                     # Bundles jtseScripts.min.js / jtseStyles.min.css + plantillas .tt
│   └── ...
├── App_Data/
│   ├── _Framework/                  # Framework frontend propio (JS + CSS de base y directivas)
│   ├── _Documents/                  # Documentación de estándares y librerías
│   └── ...
├── Controllers/
│   ├── Core/                        # BaseController, Seguridad, Sistema, Google OAuth
│   ├── Entities/                    # Entidades de correo (MailMessage, etc.)
│   └── Modules/                     # Controladores por módulo
├── Connected Services/GS1_GPIR/     # Proxy WCF del servicio GS1 GPIR
├── Resources/                       # Imágenes y plantillas de correo HTML
├── Views/                           # Vista Razor principal (Sistema/Inicio.cshtml)
├── App_Start/RouteConfig.cs         # Ruta por defecto: Sistema/Inicio
├── Web.config                       # Configuración (conexión BD, correo, keys, Google OAuth)
└── Global.asax.cs                   # Arranque (registro de rutas)

CRM.Core/
├── Entities/                        # entidades (enStartup, enEmail, enCaptcha, enLog, IP, Mail…)
├── Helpers/                         # DataSQL, Encrypt, Email, AWSEmailSevice, Captcha, …
└── Word/                            # Generación de documentos Word (Correspondencia)

packages/                            # Dependencias NuGet
CRM.AppWeb.sln                       # Solución de Visual Studio
```

---

## Módulos funcionales (SPA)

| Módulo | Pantallas |
|---|---|
| **General** | Login (usuario / Google), recuperación de contraseña, layout/menú, inicio, dashboard |
| **CRM · Mantenimiento** | Campañas (con asignación de asesores), Eventos, Leads (CRUD + comentarios), tablas maestras: Acción, Estado, Formulario, Canal, Interés |
| **CRM · Transacción** | Comerciales / ejecutivos |
| **CRM · Consulta** | Métricas comerciales, métricas de eventos, reporte de leads por canal y por formulario |
| **CRM · Utilitario** | Dashboard |
| **Seguridad · Mantenimiento** | Usuarios, Plantillas de correo |
| **Seguridad · Utilitario** | Permisos de usuario |

---

## Requisitos

- **Visual Studio 2019 o superior** (el `.sln` se creó con la versión 16) con la carga de trabajo de *Desarrollo web y ASP.NET*.
- **.NET Framework 4.6.1** (Developer Pack).
- **SQL Server** con la base de datos que contenga los *stored procedures* `CSV_*` y los menús/permisos del sistema.
- **IIS Express** (incluido con Visual Studio).
- **NuGet** para la restauración de paquetes.
- Directorios auxiliares, según `Web.config`:
  - `C:\GS1\Logs\CRM\` (logs de errores).
  - `C:\GS1\GS1_FILE_SERVER\` (archivos/plantillas, uso de la clave `FileServer`).

---

## Puesta en marcha

1. Clonar/abrir la solución `CRM.AppWeb.sln` en Visual Studio.
2. Restaurar los paquetes NuGet (`packages/` ya incluida en el repositorio).
3. Ajustar en `Web.config`:
   - **Conexión a BD** (`connectionStrings` / `_ConnectionBD_INTRA`).
   - Dirección de correo y credenciales SMTP/AWS (`_Email*`).
   - Credenciales de Google OAuth (`GoogleClientId`, `GoogleClientSecret`, `GoogleRedirectURL`).
   - Rutas de logs y file server (`_LogPath`, `FileServer`).
   - Modo de desarrollo/cifrado (`_IsDeveloper`, `_IsEncoded`).
4. Compilar la solución (Build).
5. Ejecutar con IIS Express (F5). La URL base por defecto es `https://localhost:44350/` y el punto de entrada es `/Sistema/Inicio`.

> ⚠️ El `Web.config` incluido contiene **credenciales en texto plano** (Base de datos, SMTP y Google). No debe publicarse. Se recomienda rotar esas credenciales y administrarlas por entorno (paquetes de transformación `Web.Debug.config` / `Web.Release.config`).

---

## Configuración relevante (Web.config)

| Clave | Descripción |
|---|---|
| `_ConnectionBD_INTRA` | Cadena de conexión SQL Server |
| `_TimeoutBD` | Timeout (ms) de las consultas |
| `_LogPath` / `_LogName` | Ruta y nombre del archivo de log de errores |
| `_IsEncoded` | Indica si el tráfico de datos se cifra (`Encrypt`) |
| `_IsDeveloper` | Modo desarrollador (sufijo "PRUEBA DEV", etc.) |
| `_VersionApp` | Versión de la aplicación (cache busting de los bundles) |
| `_IsDomainActiveDirectory` | Habilita/deshabilita validación contra Active Directory |
| `_EmailServer`, `_EmailPort`, `_EmailFrom`, `_EmailPassword`, `_EmailEnableSSL`, `_EmailEnableHTML` | Configuración SMTP |
| `_SentEmailAWS` | Usa AWS SES en lugar de SMTP |
| `FileServer` | Ruta raíz del servidor de archivos |
| `CodigoMenuUsuario` / `Cliente` / `Proveedor` | Códigos de menú raíz por perfil |
| `GoogleOAUTHURL`, `GoogleSCOPE`, `GoogleTYPE`, `GoogleClientId`, `GoogleClientSecret`, `GoogleRedirectURL` | Integración con Google OAuth |
| `_IpWebSocket` | URL del servicio WebSocket (notificaciones/correo) |

---

## Base de datos

- Todos los accesos se realizan mediante *stored procedures* (`dbo.CSV_*`) que reciben un parámetro `@lstParametros` con datos delimiterados (`¦`, `¬`, `¯`) y devuelven texto serializado.
- Ejemplos de procedimientos utilizados: `CSV_TOKEN_VALIDAR_SP`, `CSV_SYSMUSER01_LOGIN_SP`, `CSV_UserMenu_LIST_SP`, `CSV_LISTAS_GENERICAS_SP`, `CSV_LEADS_LST_SP`, `CSV_LEADS_CUD_SP`, `CSV_CAMPANA_CUD_SP` (según controladores), `CSV_SYSMUSER01_RECUPERA_LOGIN_SP`, etc.

---

## Frontend (framework `jtse`)

- **Punto de entrada**: `/Sistema/Inicio` devuelve la vista `Inicio.cshtml`, que inyecta la configuración de arranque (`enStartup`) cifrada en `ViewBag.Script` y carga los bundles.
- **Bundles**: `App/Support/jtseScripts.min.js` y `jtseStyles.min.js` se generan a partir de plantillas **T4** (`jtseScripts.tt` / `jtseStyles.tt`) que concatenan los archivos de `App_Data/_Framework/js/01_Base` y `02_Directives`. Para regenerarlos, ejecutar la plantilla en Visual Studio.
- **Patrón de módulo**: cada pantalla tiene un controlador JS + una vista HTML bajo `App/Modules/<Modulo>/...`.
  - `define([$appName, "NombreModulo", ...], function (module, namespace, args) {...})`
  - El controlador expone servicios (`$service`) y funciones `$scope.*` (convención `init`, `configurarControles`, `cargarDatos`, `configurarEventos`).
- Los controles (grillas, modales, tabs, datepickers, alertas, diálogos) se crean mediante utilidades globales (`$$grid`, `$$modal`, `$$tabs`, `$alert`, `$dialog`, `$fn*`).
- Los mensajes y textos de la interfaz están en español.

---

## Publicación (deploy)

- Existe un perfil de publicación **FolderProfile** en `Properties/PublishProfiles/FolderProfile.pubxml`.
- Al publicar en IIS, usar una aplicación con .NET 4.x y modo de canalización integrado (los *handlers* `ExtensionlessUrlHandler` ya están declarados en `Web.config`).
- La conexión HTTPS se fuerza desde `BaseController` (`[RequireHttps]`).

---

## Notas de desarrollo

- Convenciones de nomenclatura: nombres en español, separadores de datos `¦` (columnas), `¬` (filas) y `¯` (bloques/secciones).
- Los controladores expuestos al frontend usan el patrón `NombreAcción(string data)` y devuelven `Ok(response)`.
- Documentación de estándares para nuevas pantallas en `CRM.AppWeb/App_Data/_Documents/` (`_Estandar.txt`, `_View.txt`, `_Controller.txt`, `Lib_Table.txt`, `ChartJS.txt`, etc.).
- Las grillas soportan ordenamiento, filtro general, paginación y exportación a Excel.
