let staticData = require('../../utils/staticData.js');
let utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    alternative: null,
    cities: [],
    // 需要显示的城市
    showItems: null,
    inputText: ''
  },
  //清空输入内容
  cancel() {
    this.setData({
      inputText: '',
      showItems: this.data.cities,
    })
  },
  // 输入筛选
  inputFilter(e) {
    let alternative = {}
    let cities = this.data.cities
    let value = e.detail.value.replace(/\s+/g, '')
    if (value.length) {
      for (let i in cities) {
        let items = cities[i]
        for (let j = 0, len = items.length; j < len; j++) {
          let item = items[j]
          if (item.name.indexOf(value) !== -1) {
            if (utils.isEmptyObject(alternative[i])) {
              alternative[i] = []
            }
            alternative[i].push(item)
          }
        }
      }
      if (utils.isEmptyObject(alternative)) {
        alternative = null
      }
      this.setData({
        alternative,
        showItems: alternative,
      })
    } else {
      this.setData({
        alternative: null,
        showItems: cities,
      })
    }
  },
  // 选择城市
  choose(e) {
    // console.log('选择的城市是：',e);
    let item = e.currentTarget.dataset.item
    let name = item.name
    let pages = getCurrentPages()
    // console.log('当前路由', pages)
    let len = pages.length
    let indexPage = pages[len - 2]
    console
    indexPage.setData({
      cityChanged: true,
      searchCity: name,
    })
    wx.navigateBack({})
  },
  getSortedAreaObj(areas) {
    areas = areas.sort((a, b) => {
      if(a.letter > b.letter) {
        return 1
      }

      if(a.letter < b.letter) {
        return -1
      }

      return 0
    })
    let obj = {}
    for (let i = 0, len = areas.length; i < len; i++) {
      let item = areas[i]
      delete item.districts
      let letter = item.letter
      if (!obj[letter]) {
        obj[letter] = []
      }
      obj[letter].push(item)
    }
    // 返回一个对象，直接用 wx:for 来遍历对象，index 为 key，item 为 value，item 是一个数组
    return obj

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cities = this.getSortedAreaObj(staticData.cities || [])
    console.log('数据', cities)
    this.setData({
      cities,
      showItems: cities
    })
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