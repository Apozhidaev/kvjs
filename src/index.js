
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

function processObjectProps({ keyValues, obj, scheme, prefix = '' }) {
    if (prefix) prefix += '.';
    for (let prop in scheme) {
        if (prop in obj) {
            let key = `${prefix}${scheme[prop].key}`;
            if (scheme[prop].type === 'object') {
                processObjectProps({
                    keyValues,
                    obj: obj[prop],
                    scheme: scheme[prop].scheme,
                    prefix: key
                })

            } else if (scheme[prop].type === 'array') {
                processArray({
                    keyValues,
                    arr: obj[prop],
                    item: scheme[prop].item,
                    prefix: key
                });
            } else {
                keyValues.push({
                    key,
                    value: stringifyValue(obj[prop], scheme[prop].type)
                });
            }
        }
    }
}

function processArray({ keyValues, arr, item, prefix = '' }) {
    let process;
    if (item.id && !item.scheme) {
        process = processArrayItem1;
    } else if (!item.id && item.scheme) {
        process = processArrayItem2;
    } else {
        process = processArrayItem3;
    }
    for (let i = 0; i < arr.length; i++) {
        process({
            keyValues,
            el: arr[i],
            item,
            prefix,
            i
        });
    }
}

function processArrayItem1({ keyValues, el, item, prefix = '' }) {
    if (prefix) prefix += '.';
    let key = `${prefix}${item.id.map(i => el[i.prop]).join(',')}`;
    keyValues.push({
        key,
        value: item.value
    });
}

function processArrayItem2({ keyValues, el, item, i, prefix = '' }) {
    if (prefix) prefix += '.';
    let key = `${prefix}${i}`;
    processObjectProps({
        keyValues,
        obj: el,
        scheme: item.scheme,
        prefix: key
    });
}

function processArrayItem3({ keyValues, el, item, prefix = '' }) {
    if (prefix) prefix += '.';
    let key = `${prefix}${item.id.map(i => el[i.prop]).join(',')}`;
    processObjectProps({
        keyValues,
        obj: el,
        scheme: item.scheme,
        prefix: key
    });
}

function processKey({ obj, keys, i, value, scheme, arrays, prefix = '' }) {
    let key = keys[i];
    prefix = prefix ? `${prefix}.${key}` : key;
    if (scheme[key].type === 'object') {
        if (!obj[scheme[key].prop]) {
            obj[scheme[key].prop] = {};
        }
        processKey({
            obj: obj[scheme[key].prop],
            keys,
            i: i + 1,
            value,
            scheme: scheme[key].scheme,
            arrays,
            prefix
        })
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
        let id = keys[i + 1];
        if (!arrays[prefix].values[id]) {
            arrays[prefix].values[id] = {};
        }
        if (scheme[key].item.scheme) {
            processKey({
                obj: arrays[prefix].values[id],
                keys,
                i: i + 2,
                value,
                scheme: scheme[key].item.scheme,
                arrays,
                prefix: `${prefix}.${id}`
            });
        }


    } else {
        obj[scheme[key].prop] = parseValue(value, scheme[key].type);
    }
}

function processKeyValue({ obj, keyValue, scheme, arrays }) {
    let keys = keyValue.key.split('.');
    processKey({ obj, keys, arrays, value: keyValue.value, i: 0, scheme });
}

function restoreArrays(arrays) {
    for (let key in arrays) {
        let item = arrays[key];
        for (let id in item.values) {
            let obj = item.values[id];
            item.arr.push(obj);
            if (item.id) {
                let idValues = id.split(',');
                for (let i = 0; i < item.id.length; i++) {
                    obj[item.id[i].prop] = parseValue(idValues[i], item.id[i].type);
                }
            }
        }
    }
}

function revertScheme(scheme) {
    let revertedScheme = {};
    for (let prop in scheme) {

        revertedScheme[scheme[prop].key] = {
            prop,
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
    let revertedItemScheme = {};
    revertedItemScheme.id = item.id;
    if (item.scheme) {
        revertedItemScheme.scheme = revertScheme(item.scheme);
    }
    return revertedItemScheme;
}

function createMapper(scheme) {

    let revertedScheme = revertScheme(scheme);

    function toObject(keyValues, obj = {}) {
        let arrays = {};
        for (let i = 0; i < keyValues.length; i++) {
            processKeyValue({ obj, keyValue: keyValues[i], scheme: revertedScheme, arrays })
        }
        restoreArrays(arrays);
        return obj;
    }

    function toKeyValues(obj, keyValues = []) {
        processObjectProps({ keyValues, obj, scheme });
        return keyValues;
    }


    return {
        toObject,
        toKeyValues
    }
}

function clearValues(keyValues) {
    for (let i = 0; i < keyValues.length; i++) {
        keyValues[i].value = null;
    }
    return keyValues;
}

function diff(source, target) {
    let res = [];

    let sourceMap = {};
    for (let i = 0; i < source.length; i++) {
        sourceMap[source[i].key] = source[i];
    }
    let targetMap = {};
    for (let i = 0; i < target.length; i++) {
        targetMap[target[i].key] = target[i];
    }

    for (let i = 0; i < source.length; i++) {
        if (!targetMap[source[i].key]) {
            res.push({
                key: source[i].key,
                value: null
            });
        }
    }
    for (let i = 0; i < target.length; i++) {
        if (!sourceMap[target[i].key]
            || sourceMap[target[i].key].value !== targetMap[target[i].key].value) {
            res.push(target[i]);
        }
    }
    return res;
}

module.exports.createMapper = createMapper;
module.exports.revertScheme = revertScheme;
module.exports.clearValues = clearValues;
module.exports.diff = diff;