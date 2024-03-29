// 重写新的劫持代码


const dataProxy = require('./newDataProxy')

const _util = require('./util')

// todo 源 page 对象
const originPage = Page
// todo 源 component 对象
const originComponent = Component
// todo 页面+组件栈 
const complex_stack = {}
const component_count = {}
// todo 全局 app 对象
// todo const miniprogram_app = getApp()

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
    Page = (options) => {

        options.haijack = haijack

        // todo ! 缺省值填充
        if (!options.hasOwnProperty('methods')) {
            options.methods = {}
        }

        if (!options.hasOwnProperty('computed')) {
            options.computed = {}
        }

        if (!options.hasOwnProperty('watch')) {
            options.watch = {}
        }



        page_inject_mixin(options)

        page_inject_watch(options)

        page_inject_methods(options)

        page_inject_computed(options)

        page_haijack_onLoad(options)

        page_haijack_onUnload(options)

        page_haijack_onShow(options)

        page_haijack_onHide(options)

        page_haijack_onReady(options)

        page_haijack_onPullDownRefresh(options)

        page_haijack_onReachBottom(options)

        page_haijack_onShareAppMessage(options)

        page_haijack_onShareTimeline(options)

        page_haijack_onAddToFavorites(options)

        page_haijack_onPageScroll(options)

        page_haijack_onResize(options)

        page_haijack_onTabItemTap(options)

        // todo 释放原生 Page 函数
        originPage(options)
    }
}

function page_inject_watch(options) {
    if (!options.hasOwnProperty('watch')) {
        return
    }
    options.deepWatchName = []
    for (let k in options.watch) {
        if (typeof options.watch[k] == 'object') {
            if (typeof options.watch[k].handler == 'function') {
                options.watch[k] = options.watch[k].handler
                options.deepWatchName.push(k)
            } else {
                delete options.watch[k]
            }
        }
        else if (typeof options.watch[k] == 'function') {
            // 是一个方法就行 不管了
        }
        else {
            delete options.watch[k]
        }
    }
}

async function page_inject_mixin(options) {
    // todo 全局混入
    if (GlobalMixin) {
        if (options.hasOwnProperty('mixins')) {
            options.mixins.unshift(GlobalMixin)
        } else {
            options.mixins = [GlobalMixin]
        }
    }
    // todo 扩展mixins属性 混入属性对象 data ， methods， computed，watch 。钩子函数在后面执行
    if (options.hasOwnProperty('mixins')) {
        let data = {};
        let methods = {};
        let computed = {};
        let watch = {};
        for (let i = 0; i < options.mixins.length; i++) {
            Object.assign(data, options.mixins[i].data ? options.mixins[i].data : {});
            Object.assign(methods, options.mixins[i].methods ? options.mixins[i].methods : {});
            Object.assign(computed, options.mixins[i].computed ? options.mixins[i].computed : {});
            Object.assign(watch, options.mixins[i].watch ? options.mixins[i].watch : {});
        }

        Object.assign(data, options.data)
        Object.assign(methods, options.methods)
        Object.assign(computed, options.computed)
        Object.assign(watch, options.watch)
        options.data = data
        options.methods = methods
        options.computed = computed
        options.watch = watch
    } else {
        options.mixins = []
    }
}

async function page_inject_methods(options) {
    // todo methods 里面写的是非周期函数
    Object.keys(options.methods).forEach(v => {
        let origin_func = options.methods[v]
        options.methods[v] = function (...arg) {
            // todo 这个认为是标签触发的事件
            if (arg.length == 1 && arg[0] && arg[0].hasOwnProperty('type')) {
                return origin_func.call(this,
                    arg[0],
                    {
                        data: arg[0].currentTarget.dataset,
                        detail: arg[0].detail
                    }
                );
            }
            // todo 除了标签触发的事件就是自定义方法，或者是自定义事件
            else {
                return origin_func.call(this, ...arg)
            }
        }
    })
    // todo 把 methods 的方法融合到 page 的 options 里面，等page构建的时候可以把这些方法创建出来
    Object.assign(options, options.methods)
}

async function page_inject_computed(options) {
    // todo 扩展page的计算属性
    let computed_obj = {}
    let value_reg = /(this.data.|this._store.)[\w|.|$]*/g
    Object.keys(options.computed).forEach(v => {
        if (options.data.hasOwnProperty(v)) {
            console.warn(`有相同名字的属性 ${v},已在data中声明，无法用于计算属性`)
            delete options.computed[v]
            return
        }
        let values = (options.computed[v].toString().replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '').replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '').match(value_reg) || []).map(v => v.replace(/(this.data.|this._store.)/, '').match(/\w+/)[0])
        if (values.length) {
            values.forEach(_v => {
                // todo 判断计算属性中是否已有涉及属性
                if (!computed_obj.hasOwnProperty(_v)) {
                    computed_obj[_v] = []
                }
                computed_obj[_v].push(`_get_${v}`)
            })
        }
        options[`_get_${v}`] = function () {
            this.setData({
                [v]: options.computed[v].call(this)
            })
        }
    })
    options.computed_obj = computed_obj
}

async function page_haijack_onLoad(options) {
    // todo 劫持 onload 方法。
    let origin_onLoad = options.onLoad
    options.onLoad = async function (...args) {
        this._query = args[0] || {}

        // todo 在加载页面onload之前执行
        this.component_path = this.__wxExparserNodeId__ + "#";
        // todo 载入栈
        complex_stack[this.component_path] = this;

        this.type = "page"
        extend_prototype.call(this)


        // todo 计算属性创建时机 在 数据监听之后
        if (options.hasOwnProperty('computed')) {
            Object.keys(options.computed).forEach(v => {
                this[`_get_${v}`]();
            })
        }

        // todo 开启数据监听
        this._data = dataProxy(this.data, {
            // root 就是 this.data 的指针
            set: (root, setDataPath, oldValue, newValue) => {
                let afterUpdated = []
                if (options.hasOwnProperty('watch')) {
                    // 当前级的 watch 处理
                    if (options.watch.hasOwnProperty(setDataPath)) {
                        if (typeof options.watch[setDataPath] === 'function') {
                            afterUpdated.push({
                                action: (newValue, oldValue) => {
                                    options.watch[setDataPath].call(this, newValue, oldValue)
                                },
                                newValue: newValue,
                                oldValue: oldValue
                            })
                        }
                    }
                    // 要处理深度监听的 watch 变量
                    for (let i = 0; i < options.deepWatchName.length; i++) {
                        if (setDataPath.includes(options.deepWatchName[i])) {
                            let deepName_ary = getPathAry(options.deepWatchName[i])
                            let deepOldValue = getObjectValue(root, deepName_ary)
                            let deepNewValue = getObjectValue(this._data, deepName_ary)
                            afterUpdated.push({
                                action: (newValue, oldValue) => {
                                    options.watch[options.deepWatchName[i]].call(this, newValue, oldValue)
                                },
                                newValue: deepNewValue,
                                oldValue: deepOldValue
                            })
                        }
                    }
                }

                afterUpdated.push({
                    action: () => {
                        if (options.computed_obj.hasOwnProperty(setDataPath)) {
                            options.computed_obj[setDataPath].forEach(v => {
                                this[v]()
                            })
                        }
                    }
                })
                console.log(afterUpdated)
                let setDataPath_ary = getPathAry(setDataPath)
                setObjectNewValue(root, setDataPath_ary, newValue)
                this.setData({
                    [setDataPath]: newValue
                })
                afterUpdated.forEach(v => {
                    try {
                        v.action.call(this,v.newValue,v.oldValue)
                    } catch (e) { }
                })

            }
        })

        // 由于数据监听0号是监听不到的，特意执行一次数组的赋值操作
        for (let k in this.data) {
            if (isType(this.data[k]) == 'array') {
                this.setData({
                    [k]: this.data[k]
                })
            }
        }



        // todo mixins 执行周期函数使用同步顺序执行
        for (let i = 0; i < options.mixins.length; i++) {
            options.mixins[i].onLoad && await options.mixins[i].onLoad.call(this, ...args)
        }

        // todo 前置扩充逻辑执行完成后再执行原来的 onLoad 方法
        origin_onLoad && origin_onLoad.call(this, ...args)
    }

}

async function page_haijack_onShow(options) {
    let origin_onShow = options.onShow
    options.onShow = async function (...args) {
        // let systemInfo = wx.getSystemInfoSync()
        // if (systemInfo == "devtools") {
        //     // todo 在开发者工具下运行，把当前页面整个对象暴露出去，方便调用各种方法
        //     wx.page = this
        // }
        // todo 在开发者工具下运行，把当前页面整个对象暴露出去，方便调用各种方法
        wx.page = this
        // todo mixins 执行周期函数使用同步顺序执行
        for (let i = 0; i < options.mixins.length; i++) {
            options.mixins[i].onShow && await options.mixins[i].onShow.call(this)
        }
        origin_onShow && origin_onShow.call(this)
    }
}

async function page_haijack_onHide(options) {
    let origian_onHide = options.onHide
    options.onHide = async function () {
        // todo mixins 执行周期函数使用同步顺序执行

        origian_onHide && origian_onHide.call(this)

        for (let i = options.mixins.length - 1; i > -1; i--) {
            options.mixins[i].onHide && await options.mixins[i].onHide.call(this)
        }
    }
}

async function page_haijack_onUnload(options) {
    let origian_onUnload = options.onUnload
    options.onUnload = async function () {
        // todo 释放栈
        delete complex_stack[this.component_path]

        origian_onUnload && origian_onUnload.call(this)
        // todo mixins 执行周期函数使用同步顺序执行
        for (let i = options.mixins.length - 1; i > -1; i--) {
            options.mixins[i].onUnload && await options.mixins[i].onUnload.call(this)
        }
    }
}

async function page_haijack_onReady(options) {
    let origian_onReady = options.onReady
    options.onReady = async function () {
        // todo mixins 执行周期函数使用同步顺序执行
        for (let i = 0; i < options.mixins.length; i++) {
            options.mixins[i].onReady && await options.mixins[i].onReady.call(this)
        }
        origian_onReady && origian_onReady.call(this)
    }
}

async function page_haijack_onPullDownRefresh(options) {
    let origian_onPullDownRefresh = options.onPullDownRefresh
    options.onPullDownRefresh = async function () {
        // todo mixins 执行周期函数使用同步顺序执行
        for (let i = 0; i < options.mixins.length; i++) {
            options.mixins[i].onPullDownRefresh && await options.mixins[i].onPullDownRefresh.call(this)
        }
        origian_onPullDownRefresh && origian_onPullDownRefresh.call(this)
    }
}

async function page_haijack_onReachBottom(options) {
    let origian_onReachBottom = options.onReachBottom
    options.onReachBottom = async function () {
        // todo mixins 执行周期函数使用同步顺序执行
        for (let i = 0; i < options.mixins.length; i++) {
            options.mixins[i].onReachBottom && await options.mixins[i].onReachBottom.call(this)
        }
        origian_onReachBottom && origian_onReachBottom.call(this)
    }
}

async function page_haijack_onShareAppMessage(options) {
    let origian_onShareAppMessage = options.onShareAppMessage
    options.onShareAppMessage = async function () {
        // todo mixins 执行周期函数使用同步顺序执行
        let shareInfo = {}
        for (let i = 0; i < options.mixins.length; i++) {
            options.mixins[i].onShareAppMessage && (shareInfo = await options.mixins[i].onShareAppMessage.call(this))
        }
        origian_onShareAppMessage && (shareInfo = await origian_onShareAppMessage.call(this))
        return shareInfo
    }
}

async function page_haijack_onShareTimeline(options) {
    if ("onShareTimeline" in options) {
        // 除非用户自己要触发分享朋友圈
        let origian_onShareTimeline = options.onShareTimeline
        options.onShareTimeline = async function () {
            // todo mixins 执行周期函数使用同步顺序执行
            let shareInfo = {}
            for (let i = 0; i < options.mixins.length; i++) {
                options.mixins[i].onShareTimeline && (shareInfo = await options.mixins[i].onShareTimeline.call(this))
            }
            origian_onShareTimeline && (shareInfo = await origian_onShareTimeline.call(this))
            return shareInfo
        }
    }

}

async function page_haijack_onAddToFavorites(options) {
    let origian_onAddToFavorites = options.onAddToFavorites
    options.onAddToFavorites = async function () {
        // todo mixins 执行周期函数使用同步顺序执行
        for (let i = 0; i < options.mixins.length; i++) {
            options.mixins[i].onAddToFavorites && await options.mixins[i].onAddToFavorites.call(this)
        }
        origian_onAddToFavorites && origian_onAddToFavorites.call(this)
    }
}

async function page_haijack_onPageScroll(options) {
    let origian_onPageScroll = options.onPageScroll
    options.onPageScroll = async function () {
        // todo mixins 执行周期函数使用同步顺序执行
        for (let i = 0; i < options.mixins.length; i++) {
            options.mixins[i].onPageScroll && await options.mixins[i].onPageScroll.call(this)
        }
        origian_onPageScroll && origian_onPageScroll.call(this)
    }
}

async function page_haijack_onResize(options) {
    let origian_onResize = options.onResize
    options.onResize = async function () {
        // todo mixins 执行周期函数使用同步顺序执行
        for (let i = 0; i < options.mixins.length; i++) {
            options.mixins[i].onResize && await options.mixins[i].onResize.call(this)
        }
        origian_onResize && origian_onResize.call(this)
    }
}

async function page_haijack_onTabItemTap(options) {
    let origian_onTabItemTap = options.onTabItemTap
    options.onTabItemTap = async function () {
        // todo mixins 执行周期函数使用同步顺序执行
        for (let i = 0; i < options.mixins.length; i++) {
            options.mixins[i].onTabItemTap && await options.mixins[i].onTabItemTap.call(this)
        }
        origian_onTabItemTap && origian_onTabItemTap.call(this)
    }
}


function HJ_Component() {
    Component = (options) => {
        if (!options.hasOwnProperty('name')) {
            originComponent(options)
            return
        }

        // ! 对 component 中的关键属性做缺省填充，否则后续操作会出现异常

        // ! component 可以直接进做为页面写，微信是开放了这个权限。not good！
        if (options.mode == 'page') {
            // whenComponentUseAsPage(options)
            // originComponent(options)
            return
        }
        else {
            // ! 这个才是常规的 component 的相关操作
            whenComponentUseAsComponent(options)
            originComponent(options)
            return
        }
    }
}


function whenComponentUseAsPage() {

}

function whenComponentUseAsComponent(options) {
    // todo 缺省值填充
    if (!options.hasOwnProperty('methods')) {
        options.methods = {}
    }
    // todo 缺省值填充
    if (!options.hasOwnProperty('lifetimes')) {
        options.lifetimes = {}
    }
    // todo 缺省值填充 在组件实例刚刚被创建时执行
    if (!options.lifetimes.hasOwnProperty('created')) {
        options.lifetimes.created = function () { }
    }
    // todo 缺省值填充 在组件实例进入页面节点树时执行
    if (!options.lifetimes.hasOwnProperty('attached')) {
        options.lifetimes.attached = function () { }
    }
    // todo 缺省值填充 在组件在视图层布局完成后执行
    if (!options.lifetimes.hasOwnProperty('ready')) {
        options.lifetimes.ready = function () { }
    }
    // todo 缺省值填充 moved
    if (!options.lifetimes.hasOwnProperty('moved')) {
        options.lifetimes.moved = function () { }
    }
    // todo 缺省值填充
    if (!options.lifetimes.hasOwnProperty('detached')) {
        options.lifetimes.detached = function () { }
    }
    // todo 缺省值填充
    if (!options.lifetimes.hasOwnProperty('error')) {
        options.lifetimes.error = function () { }
    }

    // todo 缺省值填充
    if (!options.hasOwnProperty('pageLifetimes')) {
        options.pageLifetimes = {}
    }
    // todo 缺省值填充 组件所在的页面被展示时执行
    if (!options.pageLifetimes.hasOwnProperty('show')) {
        options.pageLifetimes.show = function () { }
    }
    // todo 缺省值填充 组件所在的页面被隐藏时执行
    if (!options.pageLifetimes.hasOwnProperty('hide')) {
        options.pageLifetimes.hide = function () { }
    }
    // todo 缺省值填充 组件所在的页面尺寸变化时执行
    if (!options.pageLifetimes.hasOwnProperty('resize')) {
        options.pageLifetimes.resize = function () { }
    }


    component_inject_mixin(options)

    component_inject_methods(options)

    component_inject_computed(options)

    component_haijack_attached(options)

    // component_haijack_pageLife_attached(options)

    component_haijack_detached(options)
}

async function component_inject_mixin(options) {
    // todo 全局混入
    if (GlobalMixin) {
        if (options.hasOwnProperty('mixins')) {
            options.mixins.unshift(GlobalMixin)
        } else {
            options.mixins = [GlobalMixin]
        }
    }
    // todo 扩展mixins属性 混入属性对象 data ， methods， computed，watch 。钩子函数在后面执行
    if (options.hasOwnProperty('mixins')) {
        let data = {};
        let methods = {};
        let computed = {};
        let watch = {};
        for (let i = 0; i < options.mixins.length; i++) {
            Object.assign(data, options.mixins[i].data ? options.mixins[i].data : {});
            Object.assign(methods, options.mixins[i].methods ? options.mixins[i].methods : {});
            Object.assign(computed, options.mixins[i].computed ? options.mixins[i].computed : {});
            Object.assign(watch, options.mixins[i].watch ? options.mixins[i].watch : {});
        }

        Object.assign(data, options.data)
        Object.assign(methods, options.methods)
        Object.assign(computed, options.computed)
        Object.assign(watch, options.watch)
        options.data = data
        options.methods = methods
        options.computed = computed
        options.watch = watch
    } else {
        options.mixins = []
    }
}

async function component_inject_methods(options) {
    // todo methods 里面写的是非周期函数
    Object.keys(options.methods).forEach(v => {
        let origin_func = options.methods[v]
        options.methods[v] = function (...arg) {
            // todo 这个认为是标签触发的事件
            if (arg.length == 1 && arg[0] && arg[0].hasOwnProperty('type')) {
                return origin_func.call(this,
                    arg[0],
                    {
                        data: arg[0].currentTarget.dataset,
                        detail: arg[0].detail
                    }
                );
            }
            // todo 除了标签触发的事件就是自定义方法，或者是自定义事件
            else {
                return origin_func.call(this, ...arg)
            }
        }
    })
}

async function component_inject_computed(options) {
    // todo 扩展page的计算属性
    let computed_obj = {}
    if (options.hasOwnProperty('computed')) {
        let value_reg = /(this.data.|this._store.)[\w|.|\$]*/g
        Object.keys(options.computed).forEach(v => {
            // todo 垃圾小程序不支持数值试探语法
            let _match = options.computed[v].toString().replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '').replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '').match(value_reg) || []
            let values = _match.map(v => v.replace(/(this.data.|this._store.)/, '').match(/(\w|\$)+/)[0])
            if (values.length) {
                values.forEach(_v => {
                    // todo 判断计算属性中是否已有涉及属性
                    if (!computed_obj.hasOwnProperty(_v)) {
                        computed_obj[_v] = []
                    }
                    computed_obj[_v].push(`_get_${v}`)
                })
            }
            // todo 计算属性获取的方法载入 
            options.methods[`_get_${v}`] = function () {
                this.setData({
                    [v]: options.computed[v].call(this)
                })
            }
        })
    }
    options.computed_obj = computed_obj
}

async function component_haijack_attached(options) {
    let origin_lifetimes_attached = options.lifetimes.attached
    options.lifetimes.attached = async function (...args) {
        try {
            // todo 把当前组件对象加入到父页面（父组件）中
            pushComponentToRefs.call(this, options)
        } catch (error) {
            console.log(error)
        }
        this.computed_obj = options.computed_obj
        this.type = 'component'
        extend_prototype.call(this)
        // todo 扩展数据监听
        this._data = dataProxy(this.data, {
            set: (root, setDataPath, setDataPath_ary, oldValue, newValue) => {
                setObjectNewValue(root, setDataPath_ary, newValue)
                this.setData({
                    [setDataPath]: newValue
                })
                if (options.hasOwnProperty('watch')) {
                    if (options.watch.hasOwnProperty(setDataPath)) {
                        options.watch[setDataPath].call(this, oldValue, newValue)
                    }
                }
                if (options.computed_obj.hasOwnProperty(setDataPath)) {
                    options.computed_obj[setDataPath].forEach(v => {
                        this[v]()
                    })
                }
            }
        })

        // todo 扩展计算属性 注意计算属性不可以触发数据监听
        if (options.hasOwnProperty('computed')) {
            Object.keys(options.computed).forEach(v => {
                this[`_get_${v}`]()
            })
        }

        // todo mixins 执行周期函数使用同步顺序执行
        // ! 注： component 里面的 lifetimes.attached 视为等价于 page 里面的 onLoad
        for (let i = 0; i < options.mixins.length; i++) {
            options.mixins[i].onLoad && await options.mixins[i].onLoad.call(this, ...args)
        }

        // todo 加入栈
        complex_stack[this.component_path] = this

        origin_lifetimes_attached && origin_lifetimes_attached.call(this, ...args)
    }
}



async function component_haijack_detached(options) {
    let origin_detached = options.lifetimes.detached
    options.lifetimes.detached = async function () {

        // todo 释放父组件数据视图
        // todo 获取父组件
        removeComponentFromRefs.call(this, options)


        // todo 释放栈
        delete complex_stack[this.component_path]
        component_count[this.component_count_key]--

        origin_detached && origin_detached.call(this)

        // todo mixins 执行周期函数使用同步顺序执行
        // ! 注： component 里面的 lifetimes.detached 视为等价于 page 里面的 onUnload
        for (let i = 0; i < options.mixins.length; i++) {
            options.mixins[i].onUnload && await options.mixins[i].onUnload.call(this, ...args)
        }
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
        console.log(func)
        this._lisentEventActive[event_name] = func
    };
    this.$off = function (event_name, func) {

    }
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

function getPathAry(path) {
    return path.split('.').map(v => {
        if (v.includes('[')) {
            return v.replace(/\]/g, '').split('[')
        } else {
            return v
        }
    }).flat()
}
function setObjectNewValue(target, key_ary, newValue) {
    let current = target
    for (let i = 0; i < key_ary.length - 1; i++) {
        current = target[key_ary[i]]
    }
    current = newValue
}
function getObjectValue(target, key_ary) {
    let current = target
    for (let i = 0; i < key_ary.length; i++) {
        current = target[key_ary[i]]
    }
    return current
}


module.exports = haijack