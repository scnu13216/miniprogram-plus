
const haijack = require('./haijack')
const Axios = require('./axios')
const Store = require('./store')
const I18n = require('./i18n')

wx.haijack = haijack
wx.Axios = Axios
wx.Store = Store
wx.I18n = I18n

const style = 'color:#8c9a82;font-weight:bold;font-size:12px;font-style:oblique;'
// console.log(`%c haijack.js power by lwf`,style)
console.log(`%c learn more about haijack.js at https://github.com/scnu13216/miniprogram-plus`,style)