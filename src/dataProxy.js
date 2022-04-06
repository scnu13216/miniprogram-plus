// 代理 <-- 代理类
// 为了减少对底层的破坏
const proxyMyProxy = new Proxy(Proxy, {
    //拦截 new 操作符，生成 Proxy 实例的时候来拦截
    construct: function (target, argumentsList) {
        //result是new Proxy()生成的原本的实例
        argumentsList[0] ? "" : argumentsList[0] = {}
        const result = new target(...argumentsList);
        if (result[Symbol.toStringTag]) {
            return argumentsList[0];
        }
        //获取原本实例reslut的类型
        const originToStringTag = Object.prototype.toString.call(result).slice(1, -1).split(' ')[1]
        //改写result的[Symbol.toStringTag]属性，加上被代理的标志
        // result[Symbol.toStringTag] = 'Proxy-' + originToStringTag;
        return result;
    },
});


/** 
 * 数据代理
 * 
 * page 的 data 属性是不能被代理的
 * 
 *  */
class dataProxy {
    setAction;
    constructor(data, setAction) {
        this.setAction = setAction;
        this.createProxy(data);
    }

    createProxy(data, link) {
        if (!link) link = '';
        if (!data._proxy) {
            // 记录当前对象已被proxy代理，防止死循环
            data._proxy = true
            for (let k in data) {
                let type = isType(data)
                let next_link = type == 'array' ? `${link}[${k}]` : `${link}.${k}`
                if (['object', 'array'].includes(isType(data[k])) && data[k] != null && data[k] != undefined) {
                    if (link == '') {
                        // 根节点下的属性可以用这个监听
                        this.defineBasicReactive(data, k, data[k], next_link)
                    } else {
                        // 对于非根节点的对象内属性，要判断它本身是否为数组
                        type = isType(data[k])
                        if (type == 'array') {
                            this.defineBasicReactive(data, k, data[k], next_link)
                        } else {
                            this.defineObjectReactive(data, k, data[k], next_link);
                        }

                    }
                } else {
                    // 简单属性都用这个监听
                    if (k != '_proxy') {
                        this.defineBasicReactive(data, k, data[k], next_link)
                    }
                }
            }
        }
    }

    defineObjectReactive(obj, key, value, link) {
        // 递归
        link = link.replace(/^\./g, '');
        this.createProxy(value, `${link}`);
        obj[key] = new proxyMyProxy(value, {
            set: (target, property, val, receiver) => {
                // 获取旧数据

                let old_val = target[property]
                Reflect.set(target, property, val, receiver)
                let new_val = val

                if (property !== 'length' && property.toString() !== '_proxy') {
                    let property_link = `${link}.${property.toString()}`
                    this.setAction(property_link, new_val, old_val)
                    if (['object', 'array'].includes(isType(val))) {
                        this.defineObjectReactive(target, property.toString(), target[property.toString()], link + '.' + property.toString())
                    }
                }
                return true;
            }
        })
    }

    defineBasicReactive(obj, key, value, link) {
        link = link.replace(/^\./g, '');
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                return value
            },
            set: (newValue) => {
                if (value === newValue) return
                // 获取旧数据
                let old_val = value;
                let new_val = newValue;
                value = newValue

                this.setAction(link, new_val, old_val)

                // 停止 死循环
                if (['object', 'array'].includes(isType(value)) && !value._proxy) {
                    // 删除当前对象，取消监听
                    delete obj[key]
                    // 复制对象
                    obj[key] = newValue
                    // 生成对象的代理
                    if (isType(value) == 'array') {
                        this.defineBasicReactive(obj, key, obj[key], link)
                    }
                    if (isType(value) == 'object') {
                        this.defineObjectReactive(obj, key, obj[key], link)
                    }
                }
            }
        })
        // 对于对象是object属性时需要继续遍历属性完成代理
        if (['object', 'array'].includes(isType(value))) {
            this.createProxy(value, link)
        }
    }

}


const isType = obj => {
    var toString = Object.prototype.toString;
    var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    return map[toString.call(obj)];
};


module.exports = dataProxy