# 项目介绍

小程序专用扩展功能项目


## 打包

npm run buid

### demo

用微信开发者工具导入选择小程序导入demo文件夹


## 扩展功能

1、Page 页面编写新规范

```
// Page 页面编写新规范
Page({
    // 代码混入
    mixins:[page_mixin],
    // 计算属性
    computed:{
        valueA:function(){
            return this.data.a + 100
        },
        storeA:function(){
            return this._store.a
        }
    },
    // 监听数据
    watch:{
        a:function(n,o){
            console.log(`新设置的值 ${n}`)
            console.log(`原来的值 ${o}`)
        }
    },
    // 自定义方法统一编写位置
    methods:{
        handle_tap(e,{data,detail}){
            console.log(`标签中所有 data-x 的值都在这里` ,data)
            console.log(`触发标签的原始事件` ,e)
        }
    },
    // 外部写小程序原生的page生命周期函数
})
```
2、Page 页面扩展功能
```
1、可以通过 AppData 查看组件的内部数据

需要条件:组件对象添加 name 属性
Component({
    name:"component_name"
})

可以通过对象 this.data.com_data 对象链访问对应组件的内部值 但是不推荐

2、新增共享的全局属性 store
使用方式：
this._store.key
this.$store.commit('key',value)
tips:全局属性用于页面渲染，可以配合 computed 完成。

3、新增代码混入，mixins
mixins 内部写法与页面对象一致即可

4、新增计算属性 computed

5、新增自定义方法统一编写位置 methods

6、监听组件抛出事件和执行方法 this.$on('event',function(data)=>{})

7、新增请求方法(支持promise) await this.$axios.post({api,data,headers,dataType,callback,loading})

8、支持全局的多语言切换 支持页面渲染
this.$i18n.setLocal(language)
页面上使用
{{_t.key}}
```
3、Component 组件写法与原生基本无异

4、Component 组件扩展功能
```
1、新增自定义方法统一编写位置 methods

2、新增代码混入，mixins
mixins 内部写法与组件对象一致即可

4、新增计算属性 computed

5、抛出事件（只能被直接上级 $on 监听） this.$emit('event',data)。

6、监听组件抛出事件和执行方法 this.$on('event',function(data)=>{})

7、新增请求方法(支持promise) await this.$axios.post({api,data,headers,dataType,callback,loading})

8、新增共享的全局属性 store
使用方式：
this._store.key
this.$store.commit('key',value)
tips:全局属性用于页面渲染，可以配合 computed 完成。
```


## 引入方式

require('./haijack.js')

## 使用工具

const Haijack = wx.haijack

new Haijack()

## 扩展工具

1、全局仓库

const Store = wx.Store

const store = new Store()

注意 Store 的属性配置来源于 app 对象,初始化时请添加 store 属性
```
App({
  store: {
    state: {
      haha: "你好呀1",
    },
    getters: {},
    mutations: {},
    actions: {},
  }
})
```

2、请求

const Axios = wx.Axios

const axios = new Axios({baseUrl,timeout,headers,apiMap})

baseUrl 是全局请求自动添加的头部地址

注意：当请求地址是带有http(s)开头，则不使用baseUrl

timeout 是全局请求的超时时间 默认 5000ms

headers 是全局请求的请求头属性

注意：每个请求都可以设置请求头，且具体请求的headers优先级更高

apiMap 是全局请求的请求映射

用于简写接口字符串
```
// apiMap 范例
export default {
    apiA:'/pc/user/info', // 使用 baseUrl
    apiB:'https://www.baidu.com', // 请求到指定的服务
}
```

3、扩展对象结合到全局使用

new Haijack({store,axios})

4、如果有自定义的 util 工具库

new Haijack({util})

页面和组件都可以通过 this.$util 调用工具库

5、如果有配置文件 config 

new Haijack({config})

页面和组件都可以通过 this._config 获取全局属性


```
util 里面的方法 

函数防抖 设定时间内多次事件一次相应
methods:{
    handler:wx.debounce(function(e,{data,detail}){
        this.data[key]
    },time)
}

函数节流 函数每隔一段时间触发一次
methods:{
    handler:wx.throttle(function(e,{data,detail}){
        this.data[key]
    },time)
}

```


