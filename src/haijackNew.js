const _util = require('./util')

const is = require('is')

const miniprogramComputed = require('miniprogram-computed')

const computedBehavior = miniprogramComputed.behavior

// todo 源 page 对象
const originPage = Page
// todo 源 component 对象
const originComponent = Component

// todo 页面+组件栈 
const complex_stack = {}
const component_count = {}


let Store = {}
let Axios = {}
let Util = {}
let Config = {}
let I18n = {}
let GlobalMixin = {}
class haijack {
    constructor({ store, axios, util, config, i18n, globalMixin }) {
        // todo 初始化缺省标识
        Store = store || false
        Axios = axios || false
        if (Store) {
            Store.component_stack = complex_stack
        }
        Util = Object.assign(_util, util)
        Config = config || false
        I18n = i18n || false
        if (I18n) {
            I18n.component_stack = complex_stack
        }
        GlobalMixin = globalMixin || false
        HJ_App(this)
        HJ_Page(this)
        HJ_Component(this)
    }
    getComplex_stack() {
        return complex_stack
    }
}

function HJ_App() {
    const app = getApp()
    if (Store) {
        // todo _store 用于取值
        app._store = Store.getters || {}
        // todo $store 用于运算
        app.$store = Store
    }
    if (Axios) {
        // todo 请求
        app.$axios = Axios
    }
    if (Config) {
        // todo 配置
        app._config = Config
    }
    // todo 工具方法
    app.$util = Util

    return true
}


// todo 给 page 添加更多的方法
function HJ_Page(haijack) {
    // todo options 是创建页面后写的page内代码
    console.log("HJ_page")
    Page = (MyOptions) => {
        let options = {};
        // 检查`data`字段是否为函数
        if (is.fn(MyOptions.data)) {
            MyOptions.data = MyOptions.data();
        }
        MyOptions.data._store = {}
        // 字段映射
        mapKeys(MyOptions, options, {
            data: "data", // data
            onLoad: "onLoad", // create
            onReady: "onReady", // mounted
            onShow: "onShow", // activated
            behaviors: "behaviors", // mixins
            computed: "computed", // computed
            watch: "watch", // watch
            onHide: "onHide", // deactivated
            onUnload: "onUnload", // destroy
            // 此部分是原生的
            onReachBottom: "onReachBottom",
            onShareAppMessage: "onShareAppMessage",
            onShareTimeline: "onShareTimeline",
            onAddToFavorites: "onAddToFavorites",
            onPageScroll: "onPageScroll",
            onResize: "onResize",
        });
        // 扁平methods字段中的数据
        proxyMethods(MyOptions.methods, options);
        // 检查是否使用了`computed`或者`watch`字段
        proxyComputedAndWatch(MyOptions, options);
        // 监听 component/watch 里面是否使用了 store 的变量
        proxyForStore(MyOptions, options)
        // 重写`onLoad`生命周期函数，将页面地址的查询参数挂载到`this.$query`上
        proxyOnLoad(MyOptions, options);
        // 重写`onUnload`生命周期函数
        proxyOnUnload(MyOptions, options);
        originPage(options);
    }


}

function proxyOnLoad(MyOptions, options) {
    // 保存原有的onLoad函数
    let origin_onLoad = options.onLoad;
    options.onLoad = function (query) {
        // todo 在加载页面onload之前执行
        this.component_path = this.__wxExparserNodeId__ + "#";
        // todo 载入栈
        complex_stack[this.component_path] = this;
        // 挂载查询参数
        this.$query = query;
        // 挂载额外的功能
        this.type = "page"
        extend_prototype.call(this)
        // store 数据挂载
        this.setData({
            _store: this._store
        })
        if (is.fn(origin_onLoad)) {
            // 执行原有的onLoad函数
            origin_onLoad.call(this, query);
        }
    };
}

function proxyOnUnload(MyOptions, options) {
    // 保存原有的onLoad函数
    const origin_onUnLoad = options.onUnload;
    options.onUnload = function () {
        // todo 释放栈
        delete complex_stack[this.component_path]
        if (is.fn(origin_onUnLoad)) {
            // 执行原有的onLoad函数
            origin_onLoad.call(this, query);
        }
    }
}

// todo 给 component 添加更多的方法
function HJ_Component(haijack) {

}

// 为涉及到store的computed变量添加一些属性
function proxyForStore(MyOptions, options) {
    let value_reg = /(data._store.)[\w|.|$]*/g
    let store_computed_obj = {}
    if (options.hasOwnProperty('component')) {
        // 监听属性
        for (const key in options.component) {
            if (Object.hasOwnProperty.call(options.component, key)) {
                let values = (options.component[key].toString().replace(/\s+/g, '').match(value_reg) || []).map(v => v.replace(/(data._store.)/, '').match(/\w+/)[0])
                if (values.length) {
                    values.forEach(v => {
                        // todo 判断计算属性中是否已有涉及属性
                        if (!store_computed_obj.hasOwnProperty(v)) {
                            store_computed_obj[v] = []
                        }
                        store_computed_obj[v].push(key)
                    })
                }
            }
        }
    }
    options.store_computed_obj = store_computed_obj
}


function mapKeys(fromTarget, toTarget, map) {
    Object.keys(map).forEach((key) => {
        if (fromTarget[key]) {
            toTarget[map[key]] = fromTarget[key];
        }
    });
}

function proxyMethods(fromTarget, toTarget) {
    if (fromTarget) {
        Object.keys(fromTarget).forEach((key) => {
            toTarget[key] = fromTarget[key];
        });
    }
}

function proxyComputedAndWatch(MyOptions, options) {
    if (MyOptions.computed || MyOptions.watch) {
        options.behaviors = options.behaviors || [];
        // 如果使用到了`computed`或者`watch`，就需要添加对应的`behaviors`，否则无效
        options.behaviors.push(computedBehavior);
    }
}

/* 
    原型扩展

    $on 监听直属下级组件抛出的事件 
    使用方法 this._on(event_name,(data)=>{})

    $emit 向直属上级组件（页面）抛出事件
    使用方法 this._emit(event_name,data)

    _store 获取全局属性
    使用方法 this._store.[prototype]
    渲染页面可以通过计算属性完成
    computed:{
        [prototype](){
            return this._store.[prototype]
        }
    }

    $store 全局属性方法
    使用方法 this.$store.commit('set[Prototype]',value) 。 会触发页面渲染

    $axios 请求
    使用方法 await this.$axios.post({api,data})


*/
function extend_prototype() {
    // todo 保存当前开启的监听 会被子组件触发事件时调用
    this._lisentEventActive = {};
    this.$on = function (event_name, func) {
        this._lisentEventActive[event_name] = func
    };
    if (this.type == 'page') {
        if (Store) {
            // todo _store 用于取值
            this._store = Store.getters || {}
            // todo $store 用于运算
            this.$store = Store
        }
        if (Axios) {
            // todo 请求
            this.$axios = Axios
        }
        if (Config) {
            // todo 配置
            this._config = Config
        }
        // todo 工具方法
        this.$util = Util

        if (I18n) {
            // todo 国际化
            this.$i18n = I18n
            this.setData({
                _t: I18n._t
            })
        }
    }

    if (this.type == 'component') {
        if (Store) {
            // todo _store 用于取值
            this._store = Store.getters || {}
            // todo $store 用于运算
            this.$store = Store
        }
        if (Axios) {
            // todo 请求
            this.$axios = Axios
        }
        if (Config) {
            // todo 配置
            this._config = Config
        }
        // todo 工具方法
        this.$util = Util

        let parent = this.selectOwnerComponent();
        this.$emit = function (event_name, data) {
            if (parent._lisentEventActive.hasOwnProperty(event_name)) {
                parent._lisentEventActive[event_name].call(parent, data);
            }
        }
    }
}

/* 劫持这个组件，并在符合条件的情况下把这个组件数据加入到父组件的对象中 */
function pushComponentToRefs(options) {
    if (!options.hasOwnProperty('name')) {
        return
    }
    // todo 给父组件添加当前子组件对象

    // todo 获取父组件
    let parent = this.selectOwnerComponent();
    // todo 记录组件个数
    let component_count_key = `${parent.__wxExparserNodeId__}#component_${options.name}`
    this.component_count_key = component_count_key

    if (!component_count.hasOwnProperty(component_count_key)) {
        component_count[component_count_key] = 0
    }
    // todo 下一级会用到
    this.component_path = `${component_count_key}${this.__wxExparserNodeId__}#`
    this.data._com_id = this.component_path


    if (!parent.hasOwnProperty('_refs')) {
        parent._refs = {}
    }

    // todo 防止对象重复添加
    if (component_count[component_count_key] == 1 && parent._refs[options.name].component_path == this.component_path) {
        return
    }
    if (component_count[component_count_key] > 1 && parent._refs[options.name].findIndex(v => v.component_path == this.component_path) > -1) {
        return
    }



    // todo 判断是否首个组件
    if (component_count[component_count_key] > 0) {
        // todo 当前父组件已加载大于1个此组件，会变成数组对象
        // todo this._refs.[component_name][index] 访问第几个组件
        if (component_count[component_count_key] == 1) {
            parent.setData({
                [`_com_data.${options.name}`]: [parent._refs[options.name].data, this.data]
            })
            parent._refs[options.name] = [parent._refs[options.name], this];
        } else {
            parent._refs[options.name].push(this);
            parent.data._com_data[options.name].push(this.data)
            parent.setData({
                [`_com_data.${options.name}`]: parent.data._com_data[options.name]
            })
        }
    } else {
        // todo 首个组件 this._refs.[component_name] 可以访问
        parent._refs[options.name] = this

        parent.setData({
            [`_com_data.${options.name}`]: this.data
        })
    }
    // todo 记录个数
    component_count[component_count_key]++
}

function removeComponentFromRefs(options) {
    if (!options.hasOwnProperty('name')) {
        return
    }
    // todo 获取父组件
    let parent = this.selectOwnerComponent();
    if (component_count[this.component_count_key] == 1) {
        // 只有一个组件
        delete parent._refs[options.name]
        parent.setData({
            [`_com_data.${options.name}`]: undefined
        })
    }
    else if (component_count[this.component_count_key] > 1) {

        let component_index_0 = parent._refs[options.name].findIndex(v => { return v._com_id == this.data._com_id })
        parent._refs[options.name].splice(component_index_0, 1)
        if (parent._refs[options.name].length == 1) {
            parent._refs[options.name] = parent._refs[options.name][0]
        }

        let component_index_1 = parent.data._com_data[options.name].findIndex(v => { return v._com_id == this.data._com_id })
        parent.data._com_data[options.name].splice(component_index_1, 1)
        if (parent.data._com_data[options.name].length == 1) {
            parent.data._com_data[options.name] = parent.data._com_data[options.name][0]
        }


        parent.setData({
            [`_com_data.${options.name}`]: parent.data._com_data[options.name]
        })
    }

}




module.exports = haijack