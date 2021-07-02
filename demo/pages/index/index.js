// index.js
// 获取应用实例
const index_mixins = require('./index_mixin.js');

Page({
  data: {
    foo: 'bar',
    helloType: 't1'
  },
  mixins: [index_mixins],
  onLoad() {
    this.$on('from_demo', (data) => {
      this.setData({
        foo: data.foo
      })
    })
  },
  onShow() {
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
      let userInfo = await wx.getUserProfile({
        lang: 'zh_CN',
        desc: '用于在界面展示用户头像和昵称'
      })
      console.log(userInfo)
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
      let res = await this._axios.get({
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
    handle_changeHelloType(){
      this.setData({
        helloType:'t2'
      })
    },
  },


})