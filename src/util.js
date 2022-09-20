
/**
 *  函数防抖 设定时间内多次事件一次相应
 *
 * @param {Function} fn
 * @param {number} wait
 * @returns
 */
function debounce(fn, wait) {
    let timer;
    return function () {
        var context = this;
        var args = arguments;
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, wait);
    };
}

/**
 * 函数节流 函数每隔一段时间触发一次
 *
 * @param {Function} fn
 * @param {number} gap
 * @returns
 */
function throttle(fn, gap) {
    let begin = Date.now();
    return function () {
        let now = Date.now();
        if (now - gap > begin) {
            begin = now;
            var context = this;
            var args = arguments;
            fn.apply(context, args);
        }
    };
}



function deepClone(obj, hash = new WeakMap()) {
    if (obj === null || obj === undefined) {
        return obj
    }
    if (obj instanceof Date) {
        return new Date(obj)
    }
    if (obj instanceof RegExp) {
        return new RegExp(obj)
    }
    if (typeof obj !== 'object') {
        // 包括 string , number , function , boolean , Symbol
        return obj
    }
    if (hash.get(obj)) return hash.get(obj);

    if (obj instanceof Map) {
        let cloneObj = deepClone(Object.fromEntries(obj), hash)
        let cloneMap = new Map()
        for (let key in cloneObj) {
            if (cloneObj.hasOwnProperty(key)) {
                cloneMap.set(key, cloneObj[key])
            }
        }
        return cloneMap
    }
    else if (obj instanceof Set) {
        let cloneObj = deepClone(Array.from(obj), hash)
        let cloneSet = new Set()
        for (let key in cloneObj) {
            if (cloneObj.hasOwnProperty(key)) {
                cloneSet.add(cloneObj[key])
            }
        }
        return cloneSet
    } else {
        // object array 
        let cloneObj = new obj.constructor()
        hash.set(obj, cloneObj)
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloneObj[key] = deepClone(obj[key], hash)
            }
        }
        return cloneObj
    }
}

// let el = await this.$util.querySelector('#id').rect().context().fields().node().scrollOffset().exec()
// let el = await this.$util.querySelectorAll('.class').rect().context().fields().node().scrollOffset().exec()
// wx.throttle = throttle
// wx.debounce = debounce

module.exports = {
    debounce,
    throttle,
    deepClone
}