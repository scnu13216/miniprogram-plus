// components/NavBar/NavBar.js
Component({
    name: "NavBar",
    /**
     * 组件的属性列表
     */
    properties: {
        title: {
            type: String,
            value: ""
        },
        mode: {
            type: String,
            value: "title"
        },
        back: {
            type: Boolean,
            value: true
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        navHeight: 80,
        navPadTop: 45,
        titleAlign: 'center'
    },

    lifetimes: {
        attached() {
            let media = wx.getSystemInfoSync()
            this.setData({
                navHeight: 40,
                navPadTop: media.statusBarHeight,
                titleAlign: media.system.toLowerCase().match(/ios/g) ? 'center' : 'left'
            })
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handle_back() {
            this._emit("nav_back")
        }
    }
})