App({
  onLaunch() {},
  globalData: {
    userInfo: null
  },
  store: {
    state: {
      haha: "你好呀1",
      isLogin: true,
      realUserInfo: {
        a:1
      },
      visitorInfo: {
        b:2
      }
    },
    getters: {
      userInfo(state) {
        if (state.isLogin) {
          return state.realUserInfo
        } else {
          return state.visitorInfo
        }
      }
    },
    mutations: {},
    actions: {},
  }
})

const local = require('./local/index.js')
// require('./haijack.js')
require('./src/main.js')
const haijack = wx.haijack
const Store = wx.Store
const Axios = wx.Axios
const I18n = wx.I18n
// 全局仓库
const store = new Store({
  ignoreKey: []
})

// 多语言支持
const i18n = new I18n(local)

// 请求对象
const axios = new Axios({
  debug: true
})
// 请求前拦截
axios.interceptors.request.use(config => {
  config.data.haha = store.getters.haha
  return config
})
// 请求后拦截
axios.interceptors.response.use(res => {
  return res
})

// 支持扩展工具方法
const util = require('./utils/util.js')

// 全局启用扩展脚本
new haijack({
  store,
  axios,
  util,
  i18n
})