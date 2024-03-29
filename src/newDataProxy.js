// 全新的 proxy 深度代理，支持无限级自动生成代理并添加自定义handler切面

// 目前只处理简单数据类型的代理。root 必须是个对象或者数组，否则返回原值
const util = require('./util')

function proxyObj(root, handler = { set() { }, get() { } }) {

    if (root === null || root === undefined) {
        return root
    }
    if (!['Object', 'Array'].includes(root.__proto__.constructor.name)) {
        return root
    }

    let _handler = {
        get(target, propKey, receiver) {
            // console.log('proxy get :', target, propKey, receiver)
            try {
                handler.get(arguments)
            } catch (error) {

            }

            return target[propKey]
        },
        set(target, propKey, value, receiver) {
            // console.log('proxy set :', target, propKey, value, receiver)
            // 固化旧值
            let oldValue = util.deepClone(target[propKey]) // 固化数据
            let oldRootData = util.deepClone(root) // 固化数据
            if (value === null || value === undefined) {
                target[propKey] = value
            }
            else if (!['Object', 'Array'].includes(value.__proto__.constructor.name)) {
                target[propKey] = value
            }
            else {
                target[propKey] = deepProxy(value, receiver.__path__, propKey, _handler)
            }
            let setDataPath = receiver.__path__.replace(/\$key/, propKey)
            try {
                handler.set(root, setDataPath, oldValue, value, newRoot, oldRootData)
            } catch (error) {

            }

            return true
        },
    }

    let newRoot = deepProxy(root, '$key', '', _handler)

    return newRoot

    function deepProxy(obj, lastPath = '', currentKey = '', handler = {}, hash = new WeakMap()) {
        if (obj === null || obj === undefined) {
            return obj
        }
        if (!['Object', 'Array'].includes(obj.__proto__.constructor.name)) {
            return obj
        }
        else {
            let cloneObj = new obj.constructor()
            hash.set(obj, cloneObj)
            if (cloneObj instanceof Array) {
                if (lastPath.includes('[$key]')) {
                    cloneObj.__path__ = lastPath.replace(/\$key/, `${currentKey}`) + '[$key]'
                } else {
                    cloneObj.__path__ = lastPath.replace(/\$key/, `${currentKey}[$key]`)
                }
            }
            else {
                if (lastPath.includes('[$key]')) {
                    cloneObj.__path__ = lastPath.replace(/\$key/, `${currentKey}`) + '.$key'
                } else {
                    cloneObj.__path__ = lastPath.replace(/\$key/, `${currentKey}.$key`)
                }

            }
            if (String(cloneObj.__path__).startsWith('.')) {
                cloneObj.__path__ = cloneObj.__path__.replace(/./i, '')
            }

            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloneObj[key] = deepProxy(obj[key], cloneObj.__path__, key, handler, hash)
                }
            }
            cloneObj = new Proxy(cloneObj, handler)
            return cloneObj
        }
    }
}


module.exports = proxyObj