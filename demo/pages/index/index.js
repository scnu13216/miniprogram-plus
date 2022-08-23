// index.js
// 获取应用实例
const index_mixins = require('./index_mixin.js');

Page({
  data: {
    foo: '你好呀1',
    helloType: 't1',
    obj: {
      a: {
        b: 123
      },
      c: 456,
      d: [1, 2, 3]
    },
    arr: [0],
  },
  mixins: [index_mixins],
  onLoad() {
    // this.setData({
    //   arr: [2,3]
    // })
    console.log(this)
    this.$on('from_demo', (data) => {
      this.setData({
        foo: data.foo,
        arr: [1, 2, 3]
      })
    })
  },
  onShow() {
  },
  watch: {
    helloType(n,o){
        console.log("helloType watch",n)  
    },
    // 'obj'(n, o) {
    //   console.log('obj 更新了 ', n)
    // },
    'obj': {
      handler(n, o) {
        console.log('obj 更新了 ',n,o)
      },
      deep: true
    },
    'foo2': 123,
    'abc': {
      deep: false,
    },
    'obj.a.b'(n, o) {
      // 支持
      console.log('obj.a.b 更新了 ', n)
    },
    'obj.d[0][0]'(n, o) {
      // 支持
      console.log('obj.d[0][0] 更新了 ', n)
    },
    'arr'(n, o) {
      // 支持
      console.log('arr 更新了')
    },
    'arr[0]'(n, o) {
        // 支持 但是前提是data里面的 arr 变量原始值已存在 0 号值
      console.log('arr[0] 更新了',n)
    },
    compute_foo(n,o){
        // 支持 监听 componentd 生成的变量 
        console.log("watch compute_foo",n)
    },
    haha(n){
        console.log("watch haha ",n)
    }
  },
  computed: {
    compute_foo: function () {
      if (this.data.foo == "你好呀1") {
        return '数据还没改变'
      } else {
        return '数据改变了！！！！'
      }
    },
    haha() {
      return this._store.haha
    },
    sayHello() {
      return this.data._t[this.data.helloType]
    }
  },

  methods: {
    async handle_change_data() {
      // let userInfo = await wx.getUserProfile({
      //   lang: 'zh_CN',
      //   desc: '用于在界面展示用户头像和昵称'
      // })
      // console.log(userInfo)
      // this.setData({
      //   [`obj.a.b`]: 123123
      // })
      this.setData({
        ['arr[0]']: 2
      })
    //   this.setData({
    //     [`obj.d[0]`]: [4, 5, 6]
    //   })
      // this.setData({
      //   [`obj`]: { c: 23333 }
      // })
      // this.data.obj = {
      //   a:12312
      // }
      // this.data.obj.a.b = 22222

    //   this.setData({
    //     helloType:{
    //         a:new Date().getTime()
    //     }
    //   })
    },
    async handle_change_data2() {
      this.setData({
        [`obj.d[0][0]`]: [4, 5, 6]
      })
    },
    handle_get_event_data(e, { data }) {
      wx.showToast({
        icon: "none",
        title: `${data.foo}`,
      })
    },
    handle_event_from_demo(e) {
      console.log("收到来自组件抛出事件的数据", e)
    },
    handle_changefoo() {
      this.setData({
        foo: "hah23"
      })
    },
    handle_commitHaha() {
      this.$store.commit('setHaha', '123hhhh 123123')
    },
    async handle_doRequest() {
      let res = await this.$axios.get({
        api: "https://tcc.taobao.com/cc/json/mobile_tel_segment.htm",
        headers: {
          'content-type': 'application/javascript;charset=GBK'
        },
        data: {
          tel: `17336132487`
        },
        loading: false
      })
      console.log(res)
    },
    handle_changeLanguage() {
      let language = wx.getStorageSync('language')
      if (language == 'zh_CN') {
        this.$i18n.setLocale('en_US')
      } else {
        this.$i18n.setLocale('zh_CN')
      }

    },
    handle_run_component_func1() {
      // 不是很建议这样做
      this._refs.demoComponent.component_func1()
    },
    handle_changeHelloType() {
      this.setData({
        helloType: 't2'
      })
    },
  },


})