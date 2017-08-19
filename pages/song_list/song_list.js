var util = require("../../utils/util.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    var that = this;
    var id = options.id;  //得到链表传来的id
    util.topListDetail(id,function (data) {
      // console.log(data)
      var color = data.color.toString(16);
      // console.log(color)
      if(color == 0){
        color = "000";
      }
      that.setData({
        bgcolor: color,
        topinfo: data.topinfo,
        update_time: data.update_time,
        songlist: data.songlist  //列表详细
      })
    })
  },

  play_song:function(ev){
    var key = ev.currentTarget.dataset.idgg;
    // 储存数据
    // console.log(this)
    app.globalData.key = key;
    app.globalData.songlist = this.data.songlist;
    // 跳转
    wx.navigateTo({
      url: '../play_song/play_song'
    })
  }



})