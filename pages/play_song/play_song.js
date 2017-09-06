var util = require("../../utils/util.js")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baroff:false,  //是否拖拽进度条
    imgoff:false,  //播放状态
    duration:0,
    currentPosition:0,
    totalmin:0,
    currentmin:0,
    width:0,
    timer:null,
    timer1:null
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this;
    var key = app.globalData.key;
    var songlist = app.globalData.songlist;
    if (songlist[key].data){
      var songinfo = songlist[key].data;  //排行榜数据
    }else{
      var songinfo = songlist[key];   //搜索结果数据
    }
    // console.log(app.globalData)
    // console.log(songinfo)
    this.setData({
      songinfo: songinfo,
      imgPath: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songinfo.albummid + '.jpg'
    })

    wx.getSystemInfo({        // 获取屏幕宽度
      success: function (res) {
        that.setData({
          screenWidth: res.screenWidth
        })
      }
    })

    this.aotuPlayMusic(); //播放音乐
    this.interval();
    this.getLyric();
    
    // console.log(songinfo)

  },
  //进度条定时器
  //总时长    当前的时间
  //进度条的宽度  =  当前的时间  /  总时长  * 100
  //快进 后退
interval:function(){
  var that = this;
  var key = app.globalData.key;
  var songlist = app.globalData.songlist;
  clearTimeout(that.data.timer1)
  that.data.timer1=setInterval(function () {
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        // console.log(this)
        that.setData({
          duration: res.duration,     //总时长（单位：s）
          endsec: res.duration % 60,  //停止秒
          endmin: parseInt(res.duration / 60 % 60),  //停止分
          currentPosition: res.currentPosition % 60,  //当前秒
          currentmin: parseInt(res.currentPosition / 60 % 60), //当前分
          // width: res.currentPosition / res.duration * 100 + "%" //进度条的宽度
        })
        if (!that.data.baroff) {
          that.setData({
            //进度条的宽度
            width: res.currentPosition / res.duration * 100 + "%"
          })
        }
      }
    })
    // 跳下一首歌
    if (parseInt(that.data.width) >= 100) {
      clearTimeout(that.data.timer)
      that.data.timer = setTimeout(function () {
        key++;
        app.globalData.key = key;
        // console.log(key)
        if (songlist[key].data) {
          var songinfo = songlist[key].data;   //排行榜数据
        } else {
          var songinfo = songlist[key];   //搜索结果数据
        }
        // 刷新数据
        // console.log(songinfo)
        that.setData({
          songinfo: songinfo,
          imgPath: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songinfo.albummid + '.jpg'
        })
        that.aotuPlayMusic();
      }, 1001)  //一定要大于外面定时器的时间（1000），不然会执行2次
      // console.log(5)
      that.aotuPlayMusic();
    }
    // console.log(6)
  }, 1000)
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
    return false;
  },

  //1. 拖拽 bindouchstart bindtouchmove bindouchend
  //只改变进度条宽度
  // 2.获取bar的原点  x = ev.touches[0].clientX - bar.offsetLeft
  // 3.页面初始化后获取bar的长度  barlength  = 屏幕宽度 - bar.offsetLeft*2
  // 4.手指松开改变音乐进度和时间
  // 接口：wx.seekBackgroundAudio({
  //     position: 30  //秒
  //   })  
  //  当前的时间  = 手指移动的距离 / bar宽度 * 总时长

  // 点击事件
  bindtap:function(ev){
    // console.log(5)
    var baroffsetLeft = ev.currentTarget.offsetLeft;
    var x = ev.touches[0].clientX - baroffsetLeft;
    var barlength = this.data.screenWidth - ev.currentTarget.offsetLeft * 2;
    var w = x / barlength * 100;   //宽度百分比
    this.setData({
      width: parseInt(w) + "%",
    })
    wx.seekBackgroundAudio({
      position: parseInt(w / 100 * this.data.duration)
    })
  },
//  拖拽
  bartouchstart:function(ev){
    var baroff = !this.data.baroff;
    var baroffsetLeft = ev.currentTarget.offsetLeft;
    this.setData({
        baroff: baroff,
        baroffsetLeft: baroffsetLeft
    })
  },
 
  bartouchmove: function (ev) {
      var baroffsetLeft = this.data.baroffsetLeft;
      var x = ev.touches[0].clientX - baroffsetLeft;
      var barlength = this.data.screenWidth - baroffsetLeft * 2;
      var w = x / barlength * 100;
      w >= 100 ? w = 100 : w;
      w <= 0 ? w = 0 : w;
      this.setData({
        width: parseInt(w) + "%"
      })
  },
  bartouchend:function() {
      var baroff = !this.data.baroff;
      var w = parseInt(this.data.width);
      // console.log(w)
      this.setData({
        baroff: baroff
      })
      wx.seekBackgroundAudio({
        position: parseInt(w / 100 * this.data.duration)
      })
  },
  // 歌词
  // 1.获取歌词
  // 2.转换格式
  // 3.储存歌词
  getLyric:function(){
    var that = this;
    var songid = this.data.songinfo.songid;
    util.getLyric(songid, function(data){
      console.log(data)
      var lyric = data.showapi_res_body.lyric;
      // lyric = that.reconvert(lyric);
      // lyric = that.parseLyric(lyric);
      for (var i = 0; i < lyric.length - 1; i++) {
        lyric[i].endTime = lyric[i + 1].time;
      }
      lyric[lyric.length - 1].endTime = that.data.duration;

      that.setData({
        lyric: lyric
      });
    })  
  },
  // 转换歌词
  reconvert:function(lyric){

  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.stopBackgroundAudio() //停止音乐播放
  },
  downLoadMusic:function(){
    var songmid = this.data.songinfo.songmid;
    wx.downloadFile({
      url: 'http://ws.stream.qqmusic.qq.com/C100' + songmid + '.m4a?fromtag=38',
      success: function (res) {
        // console.log(res);
        var tempFilePath = res.tempFilePath;
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function (res) {
            var savedFilePath = res.savedFilePath
          }
        })
      }
    })
  }

})
