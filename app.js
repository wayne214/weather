//app.js
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systeminfo = res
        this.globalData.isIPhoneX = /iphonex/gi.test(res.model.replace(/\s+/, ''))
      },
    })

    // 登录
  },
  globalData: {
    //是否保持常亮，离开小程序失效
    keepscreenon: false,
    systeminfo: {},
    isIPhoneX: false,
  }
})