//TODO: FRAMEWORK JTSE
if (!("Promise" in window)) {
    $config.isIE = true; //$isIE = true;
}
//TODO: p = parametros[], m = método a ejecutar
define = function (p, m) {
    if (p.length > 0) {
        if (p[2]) {

            //var fnFiltrarListados = function (listado) {
            //    var nombresListas = Object.keys($global.lists);
            //    var nReg = nombresListas.length;
            //    var listadoFiltrado = [];
            //    for (var j = 0; j < listado.length; j++) {
            //        for (var i = 0; i < nReg; i++) {
            //            if ($global.lists[nombresListas[i]].length == 0 && nombresListas[i] == listado[j]) {
            //                listadoFiltrado.push(nombresListas[i]);
            //                break;
            //            }
            //        }
            //    }
            //    return listadoFiltrado;
            //};
            //var listadoFiltrado = fnFiltrarListados(p[2]);

            var listadoFiltrado = p[2];

            if (listadoFiltrado.length > 0) {
                $jtse.module(p[0]).http({
                    url: "Generic/Generic_ListasGenericas",
                    data: $config.token + '¯' + listadoFiltrado.join('¦'),
                    method: "post",
                    callback: function (d) {
                        if (d.success) {
                            if (d.data != '') {
                                var listas = d.data.split('¯');
                                var listado = listadoFiltrado.slice();
                                var nombresListas = Object.keys($global.lists);
                                var nReg = nombresListas.length;
                                for (var j = 0; j < listado.length; j++) {
                                    for (var i = 0; i < nReg; i++) {
                                        if (nombresListas[i] == listado[j] && listas[j].length > 0) { //$global.lists[nombresListas[i]].length == 0
                                            $global.lists[nombresListas[i]] = listas[j].split('¬');
                                            break;
                                        }
                                    }
                                }
                            }
                            m($jtse.module(p[0]), p[1], $jtse.module(p[0]).getArguments());
                        }
                    }
                });
            }
            else {
                m($jtse.module(p[0]), p[1], $jtse.module(p[0]).getArguments());
            }
        } else {
            m($jtse.module(p[0]), p[1], $jtse.module(p[0]).getArguments());
        }
    } else { m(); }
};
//TODO: BASE DEL FRAMEWORK
$jtse = function () {
    var modules = {};
    var $module = function (appName) {
        if (!modules[appName]) {
            modules[appName] = {};
            var rootHost = '', rootApp = '', rootVersion = '';
            var controllers = [], services = [], pages = [], directives = [], args = null;
            var $init = function () {
                var v = document.getElementById('_jsLoad');
                if (v) { v.outerHTML = ''; }
                v = document.getElementsByTagName('view-root');
                if (v) {
                    $goStartPage(v[0].getAttribute('key'));
                }
                else { $alert.show($msg.error.framework, 'E'); }
            };
            var $setRoot = function (obj) {
                _ = JSON.parse($encoding(decodeURI(_), true));
                rootHost = location.protocol + "//" + location.host + (_.root || '');
                rootApp = (_.rootApp || 'App/');
                rootVersion = (_.versionApp || '');
                $appVersion = rootVersion;
                $config.isEncoded = (_.isEncoded || false);
                $config.isDeveloper = (_.isDeveloper || false);
                $config.DeveloperTitle = (_.DeveloperTitle || '');
                $config.charLocked = (_.charLocked || '');
                $config.isAD = (_.isAD || false);
                $config.timeoutXHR = (_.timeoutXHR || 60) * 100000;
                $config.rucApp = (_.rucApp || '');
                $config.url_extra = (_.url_extra || '');
                $config.GoogleOAUTHURL = (_.GoogleOAUTHURL || '');
                $config.GoogleSCOPE = (_.GoogleSCOPE || '');
                $config.GoogleClientId = (_.GoogleClientId || '');
                $config.GoogleRedirectURL = (_.GoogleRedirectURL || '');
                $config.GoogleTYPE = (_.GoogleTYPE || '');
                $config.IpWebSocket = (_.IpWebSocket || '');
                _ = undefined;
            };
            var $getRoot = function () {
                return rootHost;
            };
            var $http = function (data) {
                data.method = data.method || 'GET';
                data.defaultUrl = data.defaultUrl == undefined ? true : data.defaultUrl;
                data.url = (data.defaultUrl ? rootHost : '') + data.url;
                data.headers = data.headers || [];
                data.responseType = data.responseType || 'text';
                data.contentType = data.contentType || '';
                data.data = data.data || '';
                data.separator = data.separator || '¦';
                data.listSeparator = data.listSeparator || '¯';
                data.isGetPost = data.isGetPost || false;
                data.queryString = data.queryString || '';
                data.isFormData = data.isFormData || false;
                data.formData = data.formData || {};
                data.formDataNative = data.formDataNative || '';
                data.enableLoading = data.enableLoading == undefined ? true : data.enableLoading;
                data.loadingText = data.loadingText || $config.loadingText;
                var xhr = new XMLHttpRequest();
                if (data.isGetPost) data.url += data.queryString;
                xhr.open(data.method, data.url);
                xhr.timeout = $config.timeoutXHR;
                if (data.headers.length > 0) {
                    for (var i = 0; i < data.headers.length; i++) {
                        xhr.setRequestHeader(data.headers[i].Name, data.headers[i].Value);
                    }
                }
                if (data.method.toUpperCase() == 'POST' && data.contentType == '' && !data.isFormData) {
                    //xhr.setRequestHeader('Content-Type', 'application/json');
                    if ($config.isEncoded) {
                        data.data = $encoding($jsonToString(data.data, data.Separator, data.ListSeparator));
                        //data.data = JSON.stringify({ data: $encoding($jsonToString(data.data, data.Separator, data.ListSeparator)) });
                    }
                    else {
                        data.data = $jsonToString(data.data, data.separator, data.listSeparator);
                        //data.data = JSON.stringify({ data: $jsonToString(data.data, data.separator, data.listSeparator) });
                    }
                }
                else if (data.method.toUpperCase() == 'POST' && data.contentType != '') {
                    xhr.setRequestHeader('Content-Type', data.contentType);
                }
                else if (data.method.toUpperCase() == 'POST' && data.isFormData) {
                    if (Object.keys(data.formData).length > 0) {
                        var frm = new FormData();
                        var props = Object.keys(data.formData);
                        for (var i = 0; i < props.length; i++) {
                            frm.append(props[i], data.formData[props[i]]);
                        }
                        data.data = frm;
                    }
                    else if (data.formDataNative != '') {
                        data.data = data.formDataNative;
                    }
                }
                else {
                    xhr.setRequestHeader('Content-Type', 'text/plain');
                }
                xhr.responseType = data.responseType;
                xhr.onload = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        if (data.enableLoading) { $loading.inactive(); }
                        if (data.url.indexOf('.html') > -1 || data.url.indexOf('.js') > -1 || data.url.indexOf('.css') > -1) {
                            data.callback(this.response);
                        }
                        else {
                            var d = {};
                            if ($config.isEncoded) {
                                d.data = $encoding(decodeURIComponent(this.response), true);
                            }
                            else {
                                d.data = this.response;
                            }
                            if (data.defaultUrl && !(xhr.responseType == 'blob')) {
                                /*var sr = xhr.getResponseHeader('StatusResponse');
                                if (sr != '') {
                                     d.success = JSON.parse(sr).success;
                                }
                                else {
                                    d.success = false;
                                }*/
                                d.success = true;
                            }
                            else {
                                d.success = true;
                            }

                            data.callback(d);
                        }
                    } else {
                        //console.clear();
                        $loading.inactive();
                        Exceptions(this.status);
                    }
                };
                xhr.ontimeout = function () {
                    if (data.enableLoading) { $loading.inactive(); }
                    $alert.show('Tiempo excedido', 'W');
                };
                if (data.enableLoading) { $loading.active(data.loadingText); }
                xhr.send(data.data);
            };
            var $goStartPage = function (key) {
                var page = findPage(key);
                if (page.view != "") {
                    if (history.state == null) {
                        var _pages = getStates();
                        if (_pages[0] != "") go(_pages);
                        else {
                            viewLoad({
                                url: rootApp + page.view,
                                callback: function (view) {
                                    if (view != '') {
                                        document.getElementsByTagName('view-root')[0].innerHTML = view;
                                        if (page.controller != "") {
                                            var scripts = document.getElementsByTagName('SCRIPT');
                                            for (var i = 0; i < scripts.length; i++) {
                                                if (scripts[i].getAttribute('key') != null) {
                                                    document.body.removeChild(scripts[i]);
                                                }
                                            }
                                            var tagScript = document.createElement('SCRIPT');
                                            tagScript.charset = 'utf-8';
                                            tagScript.setAttribute('key', page.key);
                                            tagScript.src = rootHost + rootApp + page.controller + (rootVersion != "" ? "?v=" + rootVersion : "");
                                            document.body.appendChild(tagScript);
                                        }
                                    }
                                }
                            });
                        }
                    }
                    else { goState(null); }
                }
                else { pageError(); }
            };
            var $controller = function (namespace, methodController, methodService) {
                $jt[namespace] = {};
                $s[namespace] = {};
                if (methodService) methodService($s[namespace], $http);
                if (!methodController.$inject) methodController($jt[namespace]);
                else {
                    methodController.$inject.forEach(function (inject, index) {
                        switch (inject) {
                            case "$scope":
                                methodController.$inject[index] = "$jt['" + namespace + "']";
                                break;
                            case "$service":
                                methodController.$inject[index] = "$s['" + namespace + "']";
                                break;
                            default:
                                methodController.$inject[index] = "$jt['" + inject + "']";
                        }
                    });
                    eval("methodController(" + methodController.$inject.join(",") + ")");
                    if ($jt[namespace].init) if (typeof $jt[namespace].init == "function") $jt[namespace].init();
                }
            };
            var $setPage = function (page) {
                pages.push({
                    key: page.key, auth: (page.auth !== undefined ? page.auth : 0), base: page.base,
                    controller: (page.controller !== undefined ? (page.controller != "@" ? page.base + "Controllers/" + page.controller + ".js" : page.base + "Controllers/" + page.key + ".js") : ""),
                    view: (page.view !== undefined ? page.base + "Views/" + page.view + ".html" : page.base + "Views/" + page.key + ".html"),
                    layout: (page.layout === undefined) ? 'Layout' : page.layout
                });
            };
            var $authenticate = function (key, typeState, viewName, parms) {
                var page = findPage(key);
                if (page.view != "") {
                    if (page.auth == 1) {
                        $http({
                            url: "Seguridad/IsAuthenticated",
                            data: getToken($appName),
                            method: 'post',
                            callback: function (d) {
                                if (d.success && d.data != '') {
                                    if (parms) args = parms;
                                    else args = null;
                                    switch (typeState) {
                                        case 0:
                                            goState(key);
                                            break;
                                        case 1:
                                            goSubState(key, viewName);
                                            break;
                                    }
                                }
                                else location.href = rootHost;
                            }
                        });
                    }
                    else {
                        if (parms) args = parms;
                        else args = null;
                        switch (typeState) {
                            case 0:
                                goState(key);
                                break;
                            case 1:
                                goSubState(key, viewName);
                                break;
                        }
                    }
                }
            };
            var goState = function (currentPage) {
                var _pages;
                resetRootSource();
                if (currentPage == null) {
                    _pages = getStates();
                    if (_pages[0] != "") go(_pages[0]);
                    else pageError();
                }
                else go(currentPage);
            };
            var goSubState = function (currentPage, viewName) {
                var page = findPage(currentPage);
                if (page.view != "") {
                    viewLoad({
                        url: rootApp + page.view + (rootVersion != "" ? "?v=" + rootVersion : ""),
                        callback: function (view) {
                            if (view != '') {
                                var vs = document.getElementsByTagName('view');
                                for (var i = 0; i < vs.length; i++) {
                                    if (vs[i].getAttribute('view-name') == viewName) {
                                        vs[i].setAttribute('key', page.key);
                                        vs[i].innerHTML = view;
                                        if (page.controller != '') {
                                            var tagScript;
                                            if (document.getElementById('Controller-' + viewName)) {
                                                tagScript = document.getElementById('Controller-' + viewName);
                                                document.body.removeChild(tagScript);
                                            }
                                            tagScript = document.createElement("SCRIPT");
                                            tagScript.id = 'Controller-' + viewName;
                                            tagScript.setAttribute('key', page.key);
                                            tagScript.charset = 'utf-8';
                                            tagScript.src = rootHost + rootApp + page.controller + (rootVersion != "" ? "?v=" + rootVersion : "");
                                            document.body.appendChild(tagScript);
                                        }
                                        if (history.state != null) {
                                            var histories = history.state.stateKey.split("/");
                                            if (histories[0].length > 0)
                                                history.pushState({ stateKey: histories[0] + "/" + currentPage }, currentPage, rootHost + "#/" + histories[0] + "/" + currentPage);
                                        }
                                        else {
                                            history.pushState({ stateKey: page.layout + "/" + currentPage }, currentPage, rootHost + "#/" + page.layout + "/" + currentPage);
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    });
                }
                else pageError();
            };
            var go = function (page) {
                var page = findPage(page);
                if (page.view != "") {
                    viewLoad({
                        url: rootApp + page.view + (rootVersion != "" ? "?v=" + rootVersion : ""),
                        callback: function (view) {
                            if (view != '') {
                                document.getElementsByTagName('view-root')[0].innerHTML = view;
                                if (page.controller != "") {
                                    var scripts = document.getElementsByTagName('SCRIPT');
                                    for (var i = 0; i < scripts.length; i++) {
                                        if (scripts[i].getAttribute('key') != null) {
                                            document.body.removeChild(scripts[i]);
                                        }
                                    }
                                    var tagScript = document.createElement('SCRIPT');
                                    tagScript.charset = 'utf-8';
                                    tagScript.setAttribute('key', page.key);
                                    tagScript.src = rootHost + rootApp + page.controller + (rootVersion != "" ? "?v=" + rootVersion : "");
                                    document.body.appendChild(tagScript);
                                }
                            }
                        }
                    });
                }
                else pageError();
            };
            var $jsonToString = function (obj, separator, listSeparator) {
                var c = [], l = [], s = '¦', ls = '¯', p, d = '';
                if (Array.isArray(obj)) {
                    obj.forEach(function (o1, i1) {
                        p = Object.keys(o1);
                        if (p.length > 0) {
                            p.forEach(function (o2, i2) {
                                c.push(o1[o2]);
                            });
                            l.push(c.join(separator || s));
                            c = [];
                        }
                    });
                    d = l.join(listSeparator || ls);
                }
                else if (typeof obj == 'object') {
                    p = Object.keys(obj);
                    if (p.length > 0) {
                        p.forEach(function (o, i) {
                            c.push(obj[o]);
                        });
                        d = c.join(separator || s);
                    }
                } else d = obj;
                return d;
            };
            var $setToken = function (name, value) {
                window.localStorage.setItem(name, value);
            };
            var getToken = function (name) {
                return window.localStorage.getItem(name);
            };
            var findPage = function (keyName) {
                var _page = { key: "", controller: "", view: "", auth: 0, layout: 'Layout' };
                pages.forEach(function (o, i) {
                    if (o.key == keyName) {
                        _page = o;
                        return _page;
                    }
                });
                return _page;
            };
            var getStates = function () {
                var _pages = '';
                var posUrl = location.href.indexOf("#/");
                if (posUrl > -1) _pages = location.href.substring(posUrl + 2);
                else {
                    document.getElementsByTagName('view-root')[0].innerHTML = '';
                    return [""];
                }
                return _pages.split("/");
            };
            var viewLoad = function (data) {
                return $http(data);
            };
            var pageError = function () {
                document.getElementsByTagName('view-root')[0].innerHTML = $msg.error.page;
            };
            var Exceptions = function (status) {
                switch (status) {
                    default:
                        $alert.show($msg.error.server, 'E');
                        break;
                }
            };
            var resetRootSource = function () {
                $jt = [], $s = [], $d = [];
                var v = document.getElementsByTagName('view-root');
                if (v) v[0].innerHTML = '';
                var scripts = document.getElementsByTagName('SCRIPT');
                for (var i = 0; i < scripts.length; i++) {
                    if (scripts[i].getAttribute('key')) {
                        document.body.removeChild(scripts[i]);
                    }
                }
            };
            var $encoding = function (data, reverse) {
                var e = function () {
                    for (var i = 0; i < n; i++) {
                        if (v) {
                            c.push(s(data.charCodeAt(i) + 1));
                            v = false;
                        } else {
                            c.push(s(data.charCodeAt(i) - 1));
                            v = true;
                        }
                    }
                };
                var n = data.length, v = !reverse, c = [], s = String.fromCharCode;
                e(); return c.join('');
            };
            modules[appName] = {
                init: $init,
                setRoot: function (o) {
                    $setRoot(o);
                },
                http: function (d) {
                    return $http(d);
                },
                goStartPage: function () {
                    $goStartPage();
                },
                controller: function (n, m, s) {
                    $controller(n, m, s);
                },
                setPage: function (p) {
                    $setPage(p);
                },
                goPage: function (key, parms) {
                    $authenticate(key, 0, null, parms);
                },
                goSubPage: function (key, view, parms) {
                    $authenticate(key, 1, view, parms);
                },
                getRoot: function () {
                    return $getRoot();
                },
                jsonToString: function (o, s, l) {
                    return $jsonToString(o, s, l);
                },
                setToken: function (n, v) {
                    $setToken(n, v);
                },
                getArguments: function () {
                    return args;
                },
                encode: function (d) {
                    return $encoding(d, true);
                },
                decode: function (d) {
                    return $encoding(d, false);
                },
            };
        }
        return modules[appName];
    };
    return {
        module: function (o) {
            return $module(o);
        }
    };
};

$jtse = $jtse();