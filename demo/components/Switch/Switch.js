// components/Switch/Switch.js
Component({
    name: 'Switch',
    /**
     * 组件的属性列表
     */
    properties: {
        checked: null,
        disabled: Boolean,
        activeColor: String,
        inactiveColor: String,
        size: {
            type: String,
            value: '30rpx',
        },
        activeValue: {
            type: Boolean,
            value: true,
        },
        inactiveValue: {
            type: Boolean,
            value: false,
        },

    },

    /**
     * 组件的初始数据
     */
    data: {},


    // hijack 扩展 ； 计算属性
    computed: {
        style: function () {
            let activeColor = this.data.activeColor || "#3d7dfc";
            let inactiveColor = this.data.inactiveColor || "#ffffff";
            let fontSize = this.data.size
            let true_flag = this.data.activeValue || true
            if (this.data.checked == true_flag) {
                return `font-size:${fontSize};background:${activeColor}`;
            } else {
                return `font-size:${fontSize};background:${inactiveColor}`;
            }
        },
        status: function () {
            let true_flag = this.data.activeValue || true
            if (this.data.checked == true_flag) {
                return 'switch--on'
            } else {
                return ''
            }
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handle_click() {
            if(this.data.disabled){
                return 
            }
            let true_flag = this.data.activeValue || true
            let false_flag = this.data.inactiveValue || false
            let flag = {
                [true_flag]: false_flag,
                [false_flag]: true_flag
            }
            this.setData({
                checked: flag[this.data.checked]
            })
        }
    }
})