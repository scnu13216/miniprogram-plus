const _util = require('./util')

let Local = {}

class i18n {
    component_stack
    _t
    constructor(local) {
        Local = local || false
        this.component_stack = {}

        let media_language = wx.getSystemInfoSync().language;
        let language = wx.getStorageSync('language')
        if (!language) {
            language = media_language
            wx.setStorageSync('language', media_language)
        }
        if (Local) {
            if (Local.hasOwnProperty(language)) {
                this._t = Local[language]
            } else {
                this._t = {}
            }
        } else {
            this._t = {}
        }
    }

    // 内部节流
    setLocale = _util.throttle(function (language) {
        if (Object.keys(Local).indexOf(language) > -1) {
            // 任意位置切换语言之后，全局都要切换
            wx.setStorageSync('language', language)
            for (const key in this.component_stack) {
                const component = this.component_stack[key]
                component.setData({
                    _t: Local[language]
                })
            }
        }
    }, 100)
}

module.exports = i18n