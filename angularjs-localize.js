angular.module('services.localize', [])

/**
 * How to use:
 *  1. Include script files (this, h15n-module, language files).
 *  2. Inject 'localize' dependency in module.
 *  3. Inject '$h15nProvider' provider to use.
 *  4. Call [useLanguage] method to set language used in configure phase. Otherwise, browser language is default.
 *  5. Some of available methods: [switchLanguage], [translate], [getLanguage].
 *
 * [translate] method:
 *  Format: $h15n.translate('code', {paramName1:'value1', ..., paramNameN:'valueN'}, true/false, observer, 'observerAttr')
 *
 *  msgCode: message code in international message files.
 *  params: object contains parameters are included into international message files.
 *  isAnonymous: indicate [params] argument whether is anonymous name.
 *      true: if format of [params] argument: { 0: 'value1', 1: 'value2', ... }
 *      false/undefined: format of [params] argument: { paramName1: 'value1', ... }
 *  observer: (optional) object observers when messages file changes. Normally, is $scope variable.
 *  observerAttr: (optional) property of observer need to observer. Need if observer is present.
 *
 *  Example:
 *      $h15n.translate('greetings.hello', {name:'Beo Bu Bam', app:'LOCALIZE'}, null, $scope, "msg");
 */
    .provider('$h15n', function() {
        var language, browserLanguage, defaultLanguage = 'en';
        var pendingQueue = [];
        var i18nMessageObject;
        var i18nModule = 'h15n';
        var i18nLanguagePrefix = '$h15n-';

        var getInternationalMessage = function(msgCode) {
            var arTmp, currentObject = {};
            var dotToken = ".";
            if(msgCode == null || i18nMessageObject == null) {
                return "";
            }

            arTmp = msgCode.split(dotToken) || [];
            for(var i=0; i<arTmp.length; i++) {
                if(i === 0) {
                    currentObject = i18nMessageObject[arTmp[0]];
                } else {
                    currentObject = currentObject[arTmp[i]];
                }

                if(currentObject == null) {
                    break;
                }
            }

            if(currentObject == null ||
                currentObject instanceof Object) {
                return "";
            } else {
                return currentObject;
            }
        };

        var parseMessage = function(msgCode, params, isAnonymous) {
            var msg = getInternationalMessage(msgCode);

            var startIndex, endIndex, index = 0,
                length = msg.length, parts = [],
                tokenStart = "{{", tokenEnd = "}}",
                tokenStartLength = tokenStart.length,
                tokenEndLength = tokenEnd.length,
                paramIndex = 0, paramName = '',
                paramNameWithToken = '';

            if(params == null || params.length < 1) {
                return msg;
            }

            while(index < length) {
                if ( ((startIndex = msg.indexOf(tokenStart, index)) != -1) &&
                    ((endIndex = msg.indexOf(tokenEnd, startIndex + tokenStartLength)) != -1) ) {

                    if(index != startIndex) {
                        parts.push(msg.substring(index, startIndex));
                    }

                    paramName = msg.substring(startIndex + tokenStartLength, endIndex);
                    paramNameWithToken = tokenStart + paramName + tokenEnd;
                    if(isAnonymous) {
                        if(paramIndex >= params.length) {
                            parts.push(paramNameWithToken);
                        } else {
                            parts.push(params[paramIndex] || paramNameWithToken);
                        }
                    } else {
                        parts.push(params[paramName] || paramNameWithToken);
                    }

                    paramIndex++;
                    index = endIndex + tokenEndLength;
                } else {
                    if(index != length) {
                        parts.push(msg.substring(index));
                    }
                    index = length;
                }
            }
            return parts.join('');
        };

        var addToPendingQueue = function(msgCode, params, isAnonymous, observer, observerAttr) {
            pendingQueue.push({
                code: msgCode,
                params: params,
                isAnonymous: isAnonymous,
                observer: observer,
                observerAttr: observerAttr,
                update: function(parsedMsg) {
                    observer[observerAttr] = parsedMsg;
                }
            });
        };

        var updatePendingQueue = function() {
            for(var i=0; i<pendingQueue.length; i++) {
                var p = pendingQueue[i];
                p.update(parseMessage(p.code, p.params, p.isAnonymous) || p.code);
            }
        };

        return {
            useLanguage: function(lang) {
                language = lang;
            },

            $get: function($rootScope, $window) {
                var getBrowserLanguage = function() {
                    var browserLanguage, androidLanguage;
                    if ($window.navigator && $window.navigator.userAgent &&
                        (androidLanguage = $window.navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
                        // works for earlier version of Android (2.3.x)
                        browserLanguage = androidLanguage[1];
                    } else {
                        // works for iOS, Android 4.x and other devices
                        browserLanguage = $window.navigator.userLanguage || $window.navigator.language;
                    }
                    return browserLanguage;
                };

                var fixLanguage = function() {
                    if(language == null || language.length < 1) {
                        if(browserLanguage == null || browserLanguage.length < 1) {
                            browserLanguage = getBrowserLanguage();
                        }
                        language = browserLanguage;
                    }
                };

                return {
                    _getParameters: function(scope, paramString) {
                        var args = [], arTmp, cur, trackedObj = {}, splitArray;
                        var stringToken = "\"";
                        var charToken = "'";
                        var colonToken = ":";
                        var dotToken = ".";
                        if(paramString != null) {
                            arTmp = paramString.split(colonToken) || [];
                        }
                        for(var i=0; i<arTmp.length; i++) {
                            cur = arTmp[i].replace(/^\s+|\s+$/g, '');
                            if(cur.length > 0) {
                                if(cur.indexOf(stringToken) === 0 ||
                                    cur.indexOf(charToken) === 0) {
                                    if(cur.lastIndexOf(stringToken) === cur.length - 1 ||
                                        cur.lastIndexOf(charToken) === cur.length - 1) {
                                        args.push(cur.substring(1, cur.length - 1));
                                    } else {
                                        args.push(cur.substring(1, cur.length));
                                    }
                                } else {
                                    splitArray = cur.split(dotToken) || [];
                                    for(var index=0; index<splitArray.length; index++) {
                                        if(index === 0) {
                                            trackedObj = scope[splitArray[0]];
                                        } else {
                                            trackedObj = trackedObj[splitArray[index]];
                                        }

                                        if(trackedObj == null) {
                                            break;
                                        }
                                    }
                                    args.push(trackedObj || cur);
                                }
                            } else {
                                args.push('');
                            }
                        }
                        return args;
                    },

                    getLanguage: function() {
                        fixLanguage();
                        return language;
                    },

                    switchLanguage: function(lang) {
                        language = lang;
                        fixLanguage();
                        var injector = angular.injector([i18nModule]);
                        try {
                            i18nMessageObject = injector.get(i18nLanguagePrefix + language);
                        } catch(err) {
                            i18nMessageObject = injector.get(i18nLanguagePrefix + defaultLanguage);
                        }
                        updatePendingQueue();
                        $rootScope.$broadcast('switchLanguageSuccess');
                    },

                    translate: function(msgCode, params, isAnonymous, observer, observerAttr) {
                        if(i18nMessageObject == null) {
                            this.switchLanguage(language);
                        }

                        if(observer != null) {
                            addToPendingQueue(msgCode, params, isAnonymous, observer, observerAttr);
                            updatePendingQueue();
                        } else {
                            return parseMessage(msgCode, params, isAnonymous) || msgCode;
                        }

                        return "";
                    }
                };
            }
        };
    })

/**
 * Format: {{ 'code' | h15n: p1: 'p2': ...: 'pn' }}
 *
 *  code: message code in international message files.
 *      Code must be wrapped in single or double quotes.
 *      Code can include parameters with format: {{name}}.
 *
 *  pn: parameters in code.
 *      If pn in quotes, it's constant.
 *      If pn without quotes, its data got from [scope] variable of directive.
 *
 *  Example:
 *      <input placeholder="{{ 'greetings.hello' | h15n: name: 'LOCALIZE' }}">
 */
    .filter('h15n', function($h15n) {
        return function(input) {
            var args = [];
            if(arguments != null) {
                for(var i=1; i<arguments.length; i++) {
                    args.push(arguments[i]);
                }
            }
            return $h15n.translate(input, args, true);
        };
    })

/**
 *  Format: <h15n code="code" params="p1: 'p2': ...: 'pn'"></h15n>
 *
 *  code: message code in international message files.
 *      Code must be wrapped in single or double quotes.
 *      Code can include parameters with format: {{name}}.
 *
 *  pn: parameters in code.
 *      If pn in quotes, it's constant.
 *      If pn without quotes, its data got from [scope] variable of directive.
 *
 *  Example:
 *      <h15n code="greetings.hello" params="name: 'LOCALIZE'"></h15n>
 */
    .directive('h15n', function($h15n) {
        var dir = {
            restrict: 'E',

            update: function(scope, element, attrs) {
                element.text($h15n.translate(attrs.code,
                    $h15n._getParameters(scope, attrs.params), true));
            },

            link: function(scope, element, attrs) {
                scope.$on('switchLanguageSuccess', function() {
                    dir.update(scope, element, attrs);
                });

                dir.update(scope, element, attrs);
            }
        };
        return dir;
    })

/**
 *  Format: h15n="'code' | p1: 'p2': ...: 'pn' | attribute"
 *
 *  code: message code in international message files.
 *      Code must be wrapped in single or double quotes.
 *      Code can include parameters with format: {{name}}.
 *
 *  pn: parameters in code.
 *      If pn in quotes, it's constant.
 *      If pn without quotes, its data got from [scope] variable of directive.
 *
 *  attribute: (just only) name of attribute you want to insert into element.
 *
 *  Example:
 *      <h2 h15n="'greetings.hello'"></h2>
 *      <h2 h15n="'greetings.hello' | name: 'LOCALIZE'"></h2>
 *      <input h15n="'greetings.hello' | name: 'LOCALIZE' | placeholder">
 */
    .directive('h15n', function($h15n) {
        var dir = {
            restrict: 'A',

            update: function(scope, element, attrs) {
                var args = [], arTmp, cur;
                var code, att, valid;
                var pipeToken = "|";
                var stringToken = "\"";
                var charToken = "'";
                if(attrs.h15n != null) {
                    arTmp = attrs.h15n.split(pipeToken) || [];
                }
                for(var i=0; i<arTmp.length; i++) {
                    if(i > 2) {
                        break;
                    }
                    valid = true;

                    cur = arTmp[i].replace(/^\s+|\s+$/g, '');
                    switch (i) {
                        case 0:
                            if( (cur.indexOf(stringToken) === 0 ||
                                cur.indexOf(charToken) === 0) &&
                                (cur.lastIndexOf(stringToken) === cur.length - 1 ||
                                    cur.lastIndexOf(charToken) === cur.length - 1) ) {
                                code = cur.substring(1, cur.length - 1);
                            } else {
                                valid = false;
                            }
                            break;

                        case 1:
                            args = $h15n._getParameters(scope, cur);
                            break;

                        case 2:
                            att = cur;
                            break;
                    }

                    if(!valid) {
                        break;
                    }
                }

                var parsedMsg = $h15n.translate(code, args, true);
                if(arTmp.length < 3) {
                    element.text(parsedMsg);
                } else {
                    element.attr(att, parsedMsg);
                }
            },

            link: function(scope, element, attrs) {
                scope.$on('switchLanguageSuccess', function() {
                    dir.update(scope, element, attrs);
                });

                dir.update(scope, element, attrs);
            }
        };
        return dir;
    })
;
