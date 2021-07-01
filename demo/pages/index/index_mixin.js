module.exports = {
    data: {
        fromMixin: 123
    },
    methods: {
        mixin_test() {
            this.data.fromMixin = 222
            console.log("methods from mixins ")
        }
    },
    watch: {
        "foo": function (n, o) {
          wx.showToast({
            icon: 'none',
            title: `监听到页面数据 foo: ${o} => ${n}`,
          })
        }
      },
    computed: {
        mixin_comfun: function () {
            if(this.data.fromMixin == 222){
                return "222_mixin"
            }else{
                return "222"
            }
        }
    },
    onLoad() {
        console.log("onLoad form mixins ")
    },
    onShow() {
        console.log("onShow from mixins ")
    }
}