var util = require("../../utils/util.js");
Page({
  
//页面的初始数据 
  data: {
    navlist: ["推荐", "排行榜", "搜索"],
    navcur: 0
  },

//生命周期函数--监听页面加载 
  onLoad: function () {
    var that = this;
    util.indexResult(function (data) {
      // console.log(data)
      that.setData({
        radioList: data.data.radioList,  //电台
        slider: data.data.slider,
        songList: data.data.songList
      })
    })

    util.topList(function (data) {
      // console.log(data)
      that.setData({
        topList: data.data.topList  //排行榜
      })
    })

  },

  //导航点击事件
  navtab: function (ev) {
    var index = ev.currentTarget.dataset.index;
    this.setData({
      navcur: index
    })
  },

// 排行榜点击事件
  OpenTopListDetail: function(ev){
    var id = ev.currentTarget.dataset.id;
    // console.log(id)
    wx.navigateTo({
      url: '../song_list/song_list?id=' + id
    })
  }


})