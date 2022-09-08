// components/demoComponent/demoComponent.js
Component({
    name: "demoComponent",
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        foo: '组件内的数据'
    },

    computed: {
        compute_foo: function () {
            // if (this._store.haha == "你好呀1") {
            //     return '数据还没改变'
            // } else {
            //     return '数据改变了！！！！'
            // }
        },
    },

    watch:{
        foo(){
            console.log("foo 值变了")
        }
    },

    lifetimes:{
        attached(){
            console.log
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        component_func1() {
            wx.showToast({
                icon: 'none',
                title: '你调用了Componet里面的方法',
            })
        },
        handle_emit_event() {
            this.$emit('from_demo', {
                foo: this.data.foo
            })
        },
        onShow() {
            console.log("触发onShow")
        },
        handle_changefoo(){
            this.setData({
                foo:"hah1"
            })
        }
    }
})