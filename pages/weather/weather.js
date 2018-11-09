//logs.js
const utils = require('../../utils/util.js')
const messages = require('../../utils/messages.js')
const topnews = require('../../utils/topNews.js')
let bmap = require('../../lib/bmap-wx.js')
let globalData = getApp().globalData
let SYSTEMINFO = globalData.systeminfo

Page({
  data: {
    setting: {},
    bcgImg: '',
    searchImg: '/images/search.png',
    cityDatas: {},
    message: '',
    searchText: '',
    enableSearch: true,
    icons: ['/images/clothing.png', '/images/carwashing.png', '/images/pill.png', '/images/running.png', '/images/sun.png'],
    openSettingButtonShow: false,
    bcgImgAreaShow:false,
    bcgImgIndex: 0,
    bcgColor: '#2d2225',
    pos: {},
    // 是否已经弹出
    hasPopped: false,
    // 动画
    animationMain: {},
    animationOne: {},
    animationTwo: {},
    animationThree: {},
    // 是否切换了城市
    cityChanged: false,
    // 需要查询的城市
    searchCity: '',
    bcgImgList: [
      {
        src: '/images/beach-bird-birds-235787.jpg',
        topColor: '#393836'
      },
      {
        src: '/images/clouds-forest-idyllic-417102.jpg',
        topColor: '#0085e5'
      },
      {
        src: '/images/backlit-dawn-dusk-327466.jpg',
        topColor: '#2d2225'
      },
      {
        src: '/images/accomplishment-adventure-clear-sky-585825.jpg',
        topColor: '#004a89'
      },
      {
        src: '/images/fog-himalayas-landscape-38326.jpg',
        topColor: '#b8bab9'
      },
      {
        src: '/images/asphalt-blue-sky-clouds-490411.jpg',
        topColor: '#009ffe'
      },
      {
        src: '/images/aerial-climate-cold-296559.jpg',
        topColor: '#d6d1e6'
      },
      {
        src: '/images/beautiful-cold-dawn-547115.jpg',
        topColor: '#ffa5bc'
      }
    ],
    newsList: [],
  },
  onLoad: function () {
  },
  onPullDownRefresh(res) {
    this.init({})
  },
  // PM2.5指数
  calcPM(value) {
    if (value > 0 && value <= 50) {
      return {
        val: value,
        desc: '优',
        detail: '',
      }
    } else if (value > 50 && value <= 100) {
      return {
        val: value,
        desc: '良',
        detail: '',
      }
    } else if (value > 100 && value <= 150) {
      return {
        val: value,
        desc: '轻度污染',
        detail: '对敏感人群不健康',
      }
    } else if (value > 150 && value <= 200) {
      return {
        val: value,
        desc: '中度污染',
        detail: '不健康',
      }
    } else if (value > 200 && value <= 300) {
      return {
        val: value,
        desc: '重度污染',
        detail: '非常不健康',
      }
    } else if (value > 300 && value <= 500) {
      return {
        val: value,
        desc: '严重污染',
        detail: '有毒物',
      }
    } else if (value > 500) {
      return {
        val: value,
        desc: '爆表',
        detail: '能出来的都是条汉子',
      }
    }
  },
  // 成功回调
  success(data) {
    wx.stopPullDownRefresh()
    // console.log('百度地图数据', data);
    let now = new Date()
    //存下源数据
    data.updateTime = now.getTime()
    data.updateTimeFormat = utils.formatDate(now, "MM-dd hh:mm")
    let results = data.originalData.results[0] || {}
    data.pm = this.calcPM(results.pm25)
    // 实时温度
    data.temperature = `${results.weather_data[0].date.match(/\d+/g)[2]}`

    wx.setStorage({
      key: 'cityDatas',
      data: data,
    })
    this.setData({
      cityDatas: data
    })
  },
  // 点击搜索
  commitSearch (res) {
    let val = ((res.detail || {}).value || '').replace(/\s+/g, '')
    this.search(val)
  },
  // 搜索
  search(val) {
    console.log('search', val);
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    })
    if(val) {
      this.geocoder(val, (loc)=> {
        this.init({
          location: `${loc.lng},${loc.lat}`
        })
      })
    }
  },
  // 失败回调
  fail(res) {
    wx.stopPullDownRefresh()
    let errMsg = res.errMsg || ''
    if (errMsg.indexof('deny') !== -1 || errMsg.indexof('denied') !== -1) {
      wx.showToast({
        title: '需要开启地理位置权限',
        icon: 'none',
        duration: 2500,
        success: (res) => {
          if(this.canUseOpenSettingApi) {
            let timer = setTimeout(()=>{
              clearTimeout(timer)
              wx.openSetting({})
            }, 2500)
          } else {
            this.setData({
              openSettingButtonShow: true
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '网络不给力，请稍后重试',
        icon: 'none'
      })
    }
  },
  // 地址
  geocoder(address, success) {
    wx.request({
      url: getApp().setGeocodeUrl(address),
      success(res) {
        let data = res.data || {}
        if (!data.status) {
          let location = (data.result || {}).location || {}
          success && success(location)
        } else {
          wx.showToast({
            title: data.msg || '网络不给力，请稍后再试',
            icon: 'none',
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: res.errMsg || '网络不给力，请稍后重试',
          icon: 'none'
        })
      },
      complete: () => {
        this.setData({
          searchText: ''
        })
      }
    })
  },
  // wx.openSetting 要废弃，button open-type openSetting 2.0.7 后支持
  // 使用 wx.canIUse('openSetting') 都会返回 true，这里判断版本号区分
  canUseOpenSettingApi() {
    let systeminfo = getApp().globalData.systeminfo
    let SDKVersion = systeminfo.SDKVersion
    let version = utils.cmpVersion(SDKVersion, '2.0.7')
    if (version < 0) {
      return true
    } else {
      return false
    }
  },

  // 初始化
  init(params) {
    let BMap = new bmap.BMapWX({
      ak: globalData.ak
    })

    BMap.weather({
      location: params.location,
      fail: this.fail,
      success: this.success
    })
  },
  // 选择照片
  chooseBcg(e) {
    // console.log('选择的数据',e)
    let dataset = e.currentTarget.dataset
    let src = dataset.src
    let index = dataset.index
    this.setBcgImg(index)

    wx.setStorage({
      key: 'bcgImgIndex',
      data: index,
    })
  },
  // 设置照片
  setBcgImg(index) {
    if (index !== undefined) {
      this.setData({
        bcgImgIndex: index,
        bcgImg: this.data.bcgImgList[index].src,
        bcgColor: this.data.bcgImgList[index].topColor,
      })
      this.setNavigationBarColor()
      return
    }

    wx.getStorage({
      key: 'bcgImgIndex',
      success: (res)=> {
        let bcgImgIndex = res.data || 0
        this.setData({
          bcgImgIndex,
          bcgImg: this.data.bcgImgList[bcgImgIndex].src,
          bcgColor: this.data.bcgImgList[bcgImgIndex].topColor,
        })
        this.setNavigationBarColor()
      },
      fail: ()=> {
        this.setData({
          bcgImgIndex: 0,
          bcgImg: this.data.bcgImgList[0].src,
          bcgColor: this.data.bcgImgList[0].topColor,
        })
        this.setNavigationBarColor()
      }
    })
  },
  // 设置导航栏颜色
  setNavigationBarColor(color) {
    let bcgColor = color || this.data.bcgColor
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.data.bcgColor,
    })
  },
  // 显示设置背景区域
  showBcgImgArea() {
    this.setData({
      bcgImgAreaShow: true,
    })
  },
  // 隐藏设置背景区域
  hideBcgImgArea() {
    this.setData({
      bcgImgAreaShow: false,
    })
  },
  getCityDatas() {
    let cityDatas = wx.getStorage({
      key: 'cityDatas',
      success: (res) => {

        // console.log('城市', res)
        this.setData({
          cityDatas: res.data,
        })
      },
    })
  },

  initSetting(successfun) {
    wx.getStorage({
      key: 'setting',
      success: (res)=> {
        let setting = res.data || {}
        this.setData({
          setting,
        })

        successfun && successfun(setting)
      },
      fail: ()=> {
        this.setData({
          setting: {}
        })
      }
    })
  },
  checkUpdate(setting){
    if (!setting.forceUpdate || !wx.getUpdateManager) {
      return
    }

    let updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      console.error(res)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已下载完成，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  onShow: function() {
    this.setBcgImg()
    this.getCityDatas()
    this.setNavigationBarColor('#2d2225')
    this.initSetting((setting)=> {
      this.checkUpdate(setting)
    })
    if(!this.data.cityChanged) {
      this.init({})
    } else {
      this.search(this.data.searchCity)
      this.setData({
        cityChanged: false,
        searchCity: '',
      })
    }
    this.setData({
      message: messages.messages(),
    })
  },
  stopPageScroll() {
    return
  },
  // 手势移动
  menuMainMove(e) {
    if(this.data.hasPopped) {
      this.takeback()
      this.setData({
        hhasPopped: false
      })
    }
    let windowWidth = SYSTEMINFO.windowWidth
    let windowHeight = SYSTEMINFO.windowHeight
    let touches = e.touches[0]
    let clientX = touches.clientX
    let clientY = touches.clientY
    // 边界判断
    if (clientX > windowWidth - 40) {
      clientX = windowWidth - 40
    }
    if (clientX <= 90) {
      clientX = 90
    }
    if (clientY > windowHeight - 40 - 60) {
      clientY = windowHeight - 40 - 60
    }
    if (clientY <= 60) {
      clientY = 60
    }
    let pos = {
      left: clientX,
      top: clientY,
    } 

    this.setData({
      pos,
    })

  },
  // 打开城市
  openLocation() {
    this.openMenu()
    wx.navigateTo({
      url: '/pages/city/city',
    })
  },
  // 打开设置
  openSetting() {
    this.openMenu()
    wx.navigateTo({
      url: '/pages/setting/setting',
    })
  },
  // 打开关于
  openInfo() {
    this.openMenu()
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  openMenu() {
    if(!this.data.hasPopped) {
      this.popp()
      this.setData({
        hasPopped: true
      })
    }else{
      this.takeback()
      this.setData({
        hasPopped: false,
      })
    }
  },
  // 菜单弹出
  popp() {
    let animationMain = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationOne = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationTwo = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationThree = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    // 主菜单旋转180度
    animationMain.rotateZ(180).step()
    // 第一个向左上移动，并旋转360度
    animationOne.translate(-50, -60).rotateZ(360).opacity(1).step()
    // 第二个向左移动，并旋转360度
    animationTwo.translate(-90, 0).rotateZ(360).opacity(1).step()
    // 第三个向左下移动，并旋转360度
    animationThree.translate(-50, 60).rotateZ(360).opacity(1).step()
    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      animationTwo: animationTwo.export(),
      animationThree: animationThree.export(),
    })
  },
  // 菜单收回
  takeback() {
    let animationMain = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationOne = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationTwo = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationThree = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    animationMain.rotateZ(0).step();
    animationOne.translate(0, 0).rotateZ(0).opacity(0).step()
    animationTwo.translate(0, 0).rotateZ(0).opacity(0).step()
    animationThree.translate(0, 0).rotateZ(0).opacity(0).step()
    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      animationTwo: animationTwo.export(),
      animationThree: animationThree.export(),
    })
  },
  // 分享设置
  onShareAppMessage(res) {
    return {
      title: '清风天气',
      path: `/pages/weather/weather`,
      success() {},
      fail(e) {
        let errMsg = e.errMsg || ''
        // 对不是用户取消转发导致的失败进行提示
        let msg = '分享失败，可重新分享'
        if (errMsg.indexOf('cancel') !== -1) {
          msg = '取消分享'
        }
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      }
    }
  },
  onLoad: function (options) {
    topnews.topNews('top').then((data)=> {
      this.setData({
        newList: data.result.data
      })
    })
  },
  chatTopNews: function(item) {
    const index = item.currentTarget.dataset.index
    const newsdata = JSON.stringify(this.data.newList[index])
    wx.navigateTo({
      url: '/pages/news/news?newsdata=' + newsdata,
    })
  },
  onReachBottom: function() {
    console.log('bottom')
  },
  onPullDownRefresh: function() {
    console.log('refresh')
  }
})
