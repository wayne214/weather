//index.js
//获取应用实例
const app = getApp()
const douban = require('../../utils/doubanapi.js')

Page({
  data: {
    inTheaters: [],
    comingSoon: [],
    top250: [],
    inTheatersLoadding: true,
    comingSoonLoadding: true,
    top250Lodding: true
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  averageToStars: function (average) {
    let start = []
    for (let i = 0; i < 5; i++ , average -= 2) {
      if (average >= 2) {
        start[i] = 1
      } else if (average >= 1) {
        start[i] = 2
      } else {
        start[i] = 0
      }
    }

    return start
  },
  onLoad: function () {
    wx.showNavigationBarLoading()
    console.log('全局app', app)
    douban.find('in_theaters')
    .then(data => {
      wx.hideNavigationBarLoading()
      let subjects = data.subjects
      for(let subject of subjects) {
        let average = subject.rating.average
        subject.start = this.averageToStars(average)
        if (subject.title.length > 5)
          subject.title = subject.title.substring(0, 5) + "..."
      }
      this.setData({
        inTheaters: data.subjects,
        inTheatersLoadding: false
      })
    })
    .catch(err => {
      console.log(err)
    })
  },
  toDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  }
})
