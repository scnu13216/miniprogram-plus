Component({
  name: "AlertBar",
  properties: {},

  data: {
    content: "",
    isAlert: false,
    showCancel: true,
    cancelText: "取消",
    confirmText: "确定",
    confirm: () => {},
    cancel: () => {},
  },

  lifetimes: {
    attached: function () {

    },
  },

  methods: {
    show(params) {
      console.log(params)
      let content = params.content;
      let isAlert = true;
      let showCancel = false;
      let cancelText = "取消"
      let confirmText = "确定"
      if (params.hasOwnProperty('cancel') && typeof params.cancel == 'function') {
        showCancel = true;
        this.data.cancel = params.cancel
      }
      showCancel = params.showCancel
      if (params.hasOwnProperty('cancelText') && typeof params.cancelText == 'string') {
        cancelText = params.cancelText
      }

      if (params.hasOwnProperty('confirmText') && typeof params.confirmText == 'string') {
        confirmText = params.confirmText
      }
      if (params.hasOwnProperty('confirm') && typeof params.confirm == 'function') {
        this.data.confirm = params.confirm
      }

      this.setData({
        content,
        isAlert,
        showCancel,
        cancelText,
        confirmText
      })
    },
    cancel() {
      try {
        this.data.cancel();
      } catch (error) {
        console.error(error)
      }

      this.setData({
        isAlert: false
      })
    },

    confirm() {
      try {
        this.data.confirm();
      } catch (error) {
        console.error(error)
      }
      this.setData({
        isAlert: false
      })
    },
  },
  // chooseNode() {
  //   let isChosen = !this.data.isChosen;
  //   this.setData({
  //     isChosen: isChosen
  //   })
  // },


})