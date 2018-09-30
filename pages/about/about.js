// const douban = require('../../utils/doubanapi.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectAddress: 'https://github.com/wayne214/weather',
    github: 'https://github.com/wayne214',
    qq: '1032928762',
  },
  // 复制
  copy(e) {
    console.log('点击内容',e)
    let dataset = (e.currentTarget || {}).dataset || {}
    let title = dataset.title
    let content = dataset.content || ''
    // 复制到剪贴板上
    wx.setClipboardData({
      data: 'content',
      success() {
        wx.showToast({
          title: `已复制${title}`,
          duration: 2000,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})