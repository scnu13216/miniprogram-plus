
const haijack = require('./haijack')
const Axios = require('./axios')
const Store = require('./store')

wx.haijack = haijack
wx.Axios = Axios
wx.Store = Store

export default {
    haijack, Axios, Store
}