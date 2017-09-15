// hot_song_list.js
var util = require("../../utils/util.js");
var app = getApp()
Page({

  /** * 页面的初始数据 */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;   //链表传来的id
    var that = this;
    util.hotSongList(id,function(data){
      // console.log(data)
      // 化为单位为“万”的数，并取四舍五入取小数点后一位
      var visitnum = (data.cdlist[0].visitnum/10000).toFixed(1);
      that.setData({
        dissname: data.cdlist[0].dissname,
        album:data.cdlist[0].logo,          //专辑图片
        visitnum: visitnum,                  // 头部播放量
        headurl: data.cdlist[0].headurl,    // 头部小图片
        nickname: data.cdlist[0].nickname,   // 头部绰号
        songlist: data.cdlist[0].songlist,        //列表信息
        desc: data.cdlist[0].desc,     //歌单介绍
        songids: data.cdlist[0].songids      //歌单列表ids
      })
      // console.log(that.data.songlist)
    })
  },
  // 列表点击事件
  bindSong:function(ev){
    var index = ev.currentTarget.dataset.index;
    var songids = this.data.songids;
    // 储存数据
    app.globalData.key = index;
    util.hotSongListDetail(songids,function(data){
      // console.log(data)
      app.globalData.songlist = data.data;
    })
    wx.navigateTo({
      url: '../play_song/play_song?id=' + index
    })
  },
  // 播放全部
  bindPlayBtn:function(){
    // 储存数据
    app.globalData.key = 0;
    util.hotSongListDetail(function (data) {
      // console.log(data)
      app.globalData.songlist = data.data;
    })
    wx.navigateTo({
      url: '../play_song/play_song?id=' + 0
    })
  }

})