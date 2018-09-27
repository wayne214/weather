const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfoAuth: 0,
    userInfo: {},
    hasInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        console.log(res)
      },
    })

    wx.getSetting({
      success: res => {
        let userInfoAuth = res.authSetting['scope.userInfo']
        this.setData({
          userInfoAuth: userInfoAuth ? AUTHORIZED :
            (userInfoAuth === false) ? UNAUTHORIZED : UNPROMPTED
        })
        if(userInfoAuth) {
          wx.getUserInfo({
            success: (res) => {
              this.setData({
                userInfo: res.userInfo,
                hasInfo:true
              })
            }
          })
        }

      }
    })
  },

  onGotUserInfo(e) {
    console.log(e)
    if(e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasInfo: true,
        userInfoAuth: AUTHORIZED
      })
    }
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})