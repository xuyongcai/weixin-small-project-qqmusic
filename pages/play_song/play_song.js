var util = require("../../utils/util.js")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgoff:false,  //播放状态
    duration:0,
    currentPosition:0,
    totalmin:0,
    currentmin:0,
    width:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var timer = null;
    var that = this;
    var key = app.globalData.key;
    var songlist = app.globalData.songlist;
    var songinfo = songlist[key].data;
    // console.log(app.globalData)
    // console.log(songinfo)
    this.setData({
      songinfo: songinfo,
      imgPath: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songinfo.albummid + '.jpg'
    })
    this.aotuPlayMusic(); //播放音乐
    // console.log(songinfo)
    


    //进度条
    //总时长    当前的时间
    //进度条的宽度  =  当前的时间  /  总时长  * 100
    //快进 后退
    setInterval(function(){
      wx.getBackgroundAudioPlayerState({
        success: function (res) {
          // console.log(this)
          that.setData({
            duration: res.duration % 60,     //总时长（单位：s）
            currentPosition: res.currentPosition % 60,  //当前秒
            totalmin: parseInt(res.duration / 60 % 60),  //总时间（分}
            currentmin: parseInt(res.currentPosition / 60 % 60), //当前分
            width: res.currentPosition / res.duration * 100 + "%" //进度条的宽度
          })
        }
      }) 
      if(parseFloat(that.data.width)>=100){
        // var key = app.globalData.key;
        app.globalData.key = key + 1;
        // clearInterval(timer);
        wx.redirectTo({
          url: '../play_song/play_song'
        })
      } 
    },1000)

  },

//播放，暂停点击事件
  playMusic:function(){
    var off = !this.data.imgoff;
    this.setData({
      imgoff:off
    });
    this.aotuPlayMusic();
  },
  //播放音乐
  aotuPlayMusic(){
    var songmid = this.data.songinfo.songmid;
    if(this.data.imgoff == false){
      wx.playBackgroundAudio({
        dataUrl: 'http://ws.stream.qqmusic.qq.com/C100' + songmid + '.m4a?fromtag=38'
      })
    }else{
      wx.pauseBackgroundAudio();
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.stopBackgroundAudio() //停止音乐播放
  },

})
