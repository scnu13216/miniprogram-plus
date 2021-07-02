// 代理 <-- 代理类
Proxy = new Proxy(Proxy, {
    //拦截 new 操作符，生成 Proxy 实例的时候来拦截
    construct: function (target, argumentsList) {
        //result是new Proxy()生成的原本的实例
        argumentsList[0] ? "" : argumentsList[0] = {}
        const result = new target(...argumentsList);
        if(result[Symbol.toStringTag]){
            return argumentsList[0];
        }
        //获取原本实例reslut的类型
        const originToStringTag = Object.prototype.toString.call(result).slice(1, -1).split(' ')[1]
        //改写result的[Symbol.toStringTag]属性，加上被代理的标志
        result[Symbol.toStringTag] = 'Proxy-' + originToStringTag;
        return result;
    },
});


/* 数据代理 */
class dataProxy {
    setAction;
    constructor(data, setAction) {
        // this.data = data;
        this.setAction = setAction;
        this.createProxy(data);
        return data;
    }

    createProxy(data, link) {
        if (!link) link = '';
        if (String(data).toLocaleLowerCase() === '[object object]') {
            for (let k in data) {
                if (typeof data[k] === 'object') {
                    this.defineObjectReactive(data, k, data[k], `${link}.${k}`);
                } else {
                    // 只有根路径下的简单属性要这样监听
                    if (link == '') {
                        this.defineBasicReactive(data, k, data[k], `${link}.${k}`)
                    }
                }
            }
        }
    }

    defineObjectReactive(obj, key, value, link) {
        // 递归
        link = link.replace(/^\./g, '');
        this.createProxy(value, `${link}`);

        obj[key] = new Proxy(value, {
            set: (target, property, val, receiver) => {
                // 获取旧数据
                let old_val = target[property]
                Reflect.set(target, property, val, receiver)
                let new_val = val

                if (property !== 'length' && property.toString() !== 'Symbol(Symbol.toStringTag)') {

                    this.setAction(`${link}.${property.toString()}`, new_val, old_val)

                    if (typeof val == 'object') {
                        this.defineObjectReactive(target, property.toString(), target[property.toString()], link + '.' + property.toString())
                    }
                }
                return true;
            }
        })
    }

    defineBasicReactive(obj, key, value, link) {
        // console.log(link)
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
                if (typeof value == 'object' && String(value).toLocaleLowerCase() === '[object object]') {
                    // 删除当前对象，取消监听
                    delete obj[key]
                    // 复制对象
                    obj[key] = newValue
                    // 生成对象的代理
                    this.defineObjectReactive(obj, key, obj[key], link)
                }
            }
        })
    }

}


module.exports = dataProxy