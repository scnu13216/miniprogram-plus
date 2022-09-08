// pages/paper-issue/index.js
/* const computedBehavior = require("miniprogram-computed").behavior; */
const app = getApp()
let data
// import {
//   paper
// } from '../../constances/paper.js';

const Single = "单项选择题"
const Multi = "多项选择题"
const Five = "配伍选择题"
const Complex = "综合分析题"

Page({
  /* behaviors: [computedBehavior], */
  /**
   * 页面的初始数据
   */
  data: {
    issueList: [],

    title: "药师仿真模拟考试",
    issueList: [],
    // swiper 控制变量
    lock: false,
    currentIssueArray: [],
    swiperIndex: 0, // 当前显示下标
    current: 0,
    duration: 300,
    showAnswerSheet: false,
    progress: 1,
    sum: 0,
    navHeight: 0,

    startTime: 0, // 开始时间
    endTime: 0, // 结束时间

    bottomBoxHeight: 0,
    typeMode: 'asking',

    swiperHeight: '90vh'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    data = this.data
    // this.setIssueList({
    //   list: paper.data.content,
    // })
    // 获取试题
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 计算属性
   */
  computed: {
    currentIssue: function()  {
      let currentIssue = this.data.currentIssueArray[this.data.swiperIndex]
      // 顺便计算一下当前的进度
      let progress = 1
      if (this.data.currentIssueArray.length > 0) {
        switch (currentIssue.issuesType) {
          case Multi:
          case Single: {
            progress = currentIssue.progressIndex
            break
          }
          case Complex:
          case Five: {
            progress = currentIssue.issue.issuse[0].progressIndex
            break
          }
        }
      } else {
        progress = 1
      }
      this.setData({
        progress
      })
      return currentIssue
    },
  },

  /**
   * 处理数据列表
   */
  setIssueList({
    list = [],
    key = 0,
    minute = 1,
    title = 'none'
  }) {
    // 真题
    data.key = key
    data.startTime = 0.1
    data.endTime = minute * 60 // 后台给的是分钟  要转成秒

    if (list.length == 0) {
      return
    }

    let issueList = list
    let index = 1
    issueList.forEach((v, i) => {
      switch (v.issuesType) {
        case Multi:
        case Single: {
          v.index = i // 这个是大题目下标 
          if (!v.hasOwnProperty('issueIndex')) {
            v.issueIndex = index // 这个是小题目下标
          }
          v.progressIndex = index
          index++
          break
        }
        case Five:
        case Complex: {
          v.index = i
          v.issue.issuse.forEach(v2 => {
            if (!v2.hasOwnProperty("issueIndex")) {
              v2.issueIndex = index
            }
            v2.progressIndex = index
            index++
          })
          break;
        }
      }
      if (this.data.typeMode == 'Analysis') {
        v.showAnswer = true
      }
    })

    data.issueList = issueList // 题目的数据主体
    this.setData({
      sum: index - 1,
      issueList: issueList
    }, () => {
      // 拿到初始展示的题目
      this.getCurrentIssueArray()
    })
  },

  /**
   * 处理当前展示的三条题目
   */
  getCurrentIssueArray(next) {
    // 获取当前应该显示三个题目
    // 三题以内不做复杂操作
    if (this.data.issueList.length <= 3) {
      this.setData({
        currentIssueArray: this.data.issueList
      })
      return
    }
    const loopIndex = (index) => {
      if (0 <= index && index <= this.data.issueList.length - 1) {
        return index
      } else {
        if (index < 0) {
          return this.data.issueList.length + index
        }
        if (index > this.data.issueList.length - 1) {
          return index % this.data.issueList.length
        }
      }
    }
    let arr = []
    if (next == undefined) {
      arr.push(this.data.issueList[0])
      arr.push(this.data.issueList[1])
      arr.push(this.data.issueList[loopIndex(-1)])
      this.setData({
        currentIssueArray: arr
      })


      return
    }
    // 三题以上处理
    // swiperIndex 上一次显示的swiper下标
    // next 是他的切换目标 
    // 情况如下  
    // swiperIndex = 0  next = 1 往前 | next = 2 往后
    // swiperIndex = 1  next = 2 往前 | next = 0 往后
    // swiperIndex = 2  next = 0 往前 | next = 1 往后
    if (this.data.swiperIndex == 0) {
      if (next == 1) {
        // 前进
        let staticIndex = this.data.currentIssueArray[1].index
        arr.push(this.data.issueList[loopIndex(staticIndex - 1)])
        arr.push(this.data.issueList[staticIndex])
        arr.push(this.data.issueList[loopIndex(staticIndex + 1)])
      }
      if (next == 2) {
        // 后退
        let staticIndex = this.data.currentIssueArray[2].index
        arr.push(this.data.issueList[loopIndex(staticIndex + 1)])
        arr.push(this.data.issueList[loopIndex(staticIndex - 1)])
        arr.push(this.data.issueList[staticIndex])
      }
    }
    if (this.data.swiperIndex == 1) {
      if (next == 2) {
        // 前进
        let staticIndex = this.data.currentIssueArray[2].index
        arr.push(this.data.issueList[loopIndex(staticIndex + 1)])
        arr.push(this.data.issueList[loopIndex(staticIndex - 1)])
        arr.push(this.data.issueList[staticIndex])
      }
      if (next == 0) {
        // 后退
        let staticIndex = this.data.currentIssueArray[0].index
        arr.push(this.data.issueList[staticIndex])
        arr.push(this.data.issueList[loopIndex(staticIndex + 1)])
        arr.push(this.data.issueList[loopIndex(staticIndex - 1)])
      }
    }
    if (this.data.swiperIndex == 2) {
      if (next == 0) {
        // 前进
        let staticIndex = this.data.currentIssueArray[0].index
        arr.push(this.data.issueList[staticIndex])
        arr.push(this.data.issueList[loopIndex(staticIndex + 1)])
        arr.push(this.data.issueList[loopIndex(staticIndex - 1)])
      }
      if (next == 1) {
        // 后退
        let staticIndex = this.data.currentIssueArray[1].index
        arr.push(this.data.issueList[loopIndex(staticIndex - 1)])
        arr.push(this.data.issueList[staticIndex])
        arr.push(this.data.issueList[loopIndex(staticIndex + 1)])
      }

    }
    setTimeout(() => {
      this.setData({
        currentIssueArray: arr,
        progress: ''
      })
    }, this.data.duration / 2)
  },

  /**
   * 滑动切换题目
   */
  handle_swiperChange(e) {
    if (data.lock) {
      return
    }
    data.lock = true
    this.setData({
      lock: true
    })
    this.getCurrentIssueArray(e.detail.current)
    setTimeout(() => {
      this.setData({
        lock: false,
        swiperIndex: e.detail.current
      })
    }, data.duration / 2)
  },
})