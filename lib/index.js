module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function stringifyValue(value, type) {
    if (value === undefined || value === null || value === '') return null;
    switch (type) {
        case 'date':
            return value.toJSON();
        default:
            return value.toString();
    }
}

function parseValue(value, type) {
    switch (type) {
        case 'int':
            return parseInt(value);
        case 'float':
            return parseFloat(value);
        case 'bool':
            return value === 'true';
        case 'date':
            return new Date(value);
        default:
            return value;
    }
}

function processObjectProps(_ref) {
    var keyValues = _ref.keyValues,
        obj = _ref.obj,
        scheme = _ref.scheme,
        _ref$prefix = _ref.prefix,
        prefix = _ref$prefix === undefined ? '' : _ref$prefix;

    if (prefix) prefix += '.';
    for (var prop in scheme) {
        if (prop in obj) {
            var key = '' + prefix + scheme[prop].key;
            if (scheme[prop].type === 'object') {
                processObjectProps({
                    keyValues: keyValues,
                    obj: obj[prop],
                    scheme: scheme[prop].scheme,
                    prefix: key
                });
            } else if (scheme[prop].type === 'array') {
                processArray({
                    keyValues: keyValues,
                    arr: obj[prop],
                    item: scheme[prop].item,
                    prefix: key
                });
            } else {
                keyValues.push({
                    key: key,
                    value: stringifyValue(obj[prop], scheme[prop].type)
                });
            }
        }
    }
}

function processArray(_ref2) {
    var keyValues = _ref2.keyValues,
        arr = _ref2.arr,
        item = _ref2.item,
        _ref2$prefix = _ref2.prefix,
        prefix = _ref2$prefix === undefined ? '' : _ref2$prefix;

    var process = void 0;
    if (item.id && !item.scheme) {
        process = processArrayItem1;
    } else if (!item.id && item.scheme) {
        process = processArrayItem2;
    } else {
        process = processArrayItem3;
    }
    for (var i = 0; i < arr.length; i++) {
        process({
            keyValues: keyValues,
            el: arr[i],
            item: item,
            prefix: prefix,
            i: i
        });
    }
}

function processArrayItem1(_ref3) {
    var keyValues = _ref3.keyValues,
        el = _ref3.el,
        item = _ref3.item,
        _ref3$prefix = _ref3.prefix,
        prefix = _ref3$prefix === undefined ? '' : _ref3$prefix;

    if (prefix) prefix += '.';
    var key = '' + prefix + item.id.map(function (i) {
        return el[i.prop];
    }).join(',');
    keyValues.push({
        key: key,
        value: item.value
    });
}

function processArrayItem2(_ref4) {
    var keyValues = _ref4.keyValues,
        el = _ref4.el,
        item = _ref4.item,
        i = _ref4.i,
        _ref4$prefix = _ref4.prefix,
        prefix = _ref4$prefix === undefined ? '' : _ref4$prefix;

    if (prefix) prefix += '.';
    var key = '' + prefix + i;
    processObjectProps({
        keyValues: keyValues,
        obj: el,
        scheme: item.scheme,
        prefix: key
    });
}

function processArrayItem3(_ref5) {
    var keyValues = _ref5.keyValues,
        el = _ref5.el,
        item = _ref5.item,
        _ref5$prefix = _ref5.prefix,
        prefix = _ref5$prefix === undefined ? '' : _ref5$prefix;

    if (prefix) prefix += '.';
    var key = '' + prefix + item.id.map(function (i) {
        return el[i.prop];
    }).join(',');
    processObjectProps({
        keyValues: keyValues,
        obj: el,
        scheme: item.scheme,
        prefix: key
    });
}

function processKey(_ref6) {
    var obj = _ref6.obj,
        keys = _ref6.keys,
        i = _ref6.i,
        value = _ref6.value,
        scheme = _ref6.scheme,
        arrays = _ref6.arrays,
        _ref6$prefix = _ref6.prefix,
        prefix = _ref6$prefix === undefined ? '' : _ref6$prefix;

    var key = keys[i];
    prefix = prefix ? prefix + '.' + key : key;
    if (scheme[key].type === 'object') {
        if (!obj[scheme[key].prop]) {
            obj[scheme[key].prop] = {};
        }
        processKey({
            obj: obj[scheme[key].prop],
            keys: keys,
            i: i + 1,
            value: value,
            scheme: scheme[key].scheme,
            arrays: arrays,
            prefix: prefix
        });
    } else if (scheme[key].type === 'array') {
        if (!obj[scheme[key].prop]) {
            obj[scheme[key].prop] = [];
        }
        if (!arrays[prefix]) {
            arrays[prefix] = {
                arr: obj[scheme[key].prop],
                values: {},
                id: scheme[key].item.id
            };
        }
        var id = keys[i + 1];
        if (!arrays[prefix].values[id]) {
            arrays[prefix].values[id] = {};
        }
        if (scheme[key].item.scheme) {
            processKey({
                obj: arrays[prefix].values[id],
                keys: keys,
                i: i + 2,
                value: value,
                scheme: scheme[key].item.scheme,
                arrays: arrays,
                prefix: prefix + '.' + id
            });
        }
    } else {
        obj[scheme[key].prop] = parseValue(value, scheme[key].type);
    }
}

function processKeyValue(_ref7) {
    var obj = _ref7.obj,
        keyValue = _ref7.keyValue,
        scheme = _ref7.scheme,
        arrays = _ref7.arrays;

    var keys = keyValue.key.split('.');
    processKey({ obj: obj, keys: keys, arrays: arrays, value: keyValue.value, i: 0, scheme: scheme });
}

function restoreArrays(arrays) {
    for (var key in arrays) {
        var item = arrays[key];
        for (var id in item.values) {
            var obj = item.values[id];
            item.arr.push(obj);
            if (item.id) {
                var idValues = id.split(',');
                for (var i = 0; i < item.id.length; i++) {
                    obj[item.id[i].prop] = parseValue(idValues[i], item.id[i].type);
                }
            }
        }
    }
}

function revertScheme(scheme) {
    var revertedScheme = {};
    for (var prop in scheme) {

        revertedScheme[scheme[prop].key] = {
            prop: prop,
            type: scheme[prop].type
        };

        if (scheme[prop].type === 'object') {

            revertedScheme[scheme[prop].key].scheme = revertScheme(scheme[prop].scheme);
        } else if (scheme[prop].type === 'array') {

            revertedScheme[scheme[prop].key].item = revertItemScheme(scheme[prop].item);
        }
    }
    return revertedScheme;
}

function revertItemScheme(item) {
    var revertedItemScheme = {};
    revertedItemScheme.id = item.id;
    if (item.scheme) {
        revertedItemScheme.scheme = revertScheme(item.scheme);
    }
    return revertedItemScheme;
}

function createMapper(scheme) {

    var revertedScheme = revertScheme(scheme);

    function toObject(keyValues) {
        var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var arrays = {};
        for (var i = 0; i < keyValues.length; i++) {
            processKeyValue({ obj: obj, keyValue: keyValues[i], scheme: revertedScheme, arrays: arrays });
        }
        restoreArrays(arrays);
        return obj;
    }

    function toKeyValues(obj) {
        var keyValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        processObjectProps({ keyValues: keyValues, obj: obj, scheme: scheme });
        return keyValues;
    }

    return {
        toObject: toObject,
        toKeyValues: toKeyValues
    };
}

function clearValues(keyValues) {
    for (var i = 0; i < keyValues.length; i++) {
        keyValues[i].value = null;
    }
    return keyValues;
}

function diff(source, target) {
    var res = [];

    var sourceMap = {};
    for (var i = 0; i < source.length; i++) {
        sourceMap[source[i].key] = source[i];
    }
    var targetMap = {};
    for (var _i = 0; _i < target.length; _i++) {
        targetMap[target[_i].key] = target[_i];
    }

    for (var _i2 = 0; _i2 < source.length; _i2++) {
        if (!targetMap[source[_i2].key]) {
            res.push({
                key: source[_i2].key,
                value: null
            });
        }
    }
    for (var _i3 = 0; _i3 < target.length; _i3++) {
        if (!sourceMap[target[_i3].key] || sourceMap[target[_i3].key].value !== targetMap[target[_i3].key].value) {
            res.push(target[_i3]);
        }
    }
    return res;
}

module.exports.createMapper = createMapper;
module.exports.revertScheme = revertScheme;
module.exports.clearValues = clearValues;
module.exports.diff = diff;

/***/ })
/******/ ]);