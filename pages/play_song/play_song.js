var util = require("../../utils/util.js")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baroff:false,  //是否拖拽进度条
    imgoff:false,  //播放状态
    listoff: false,        //是否打开歌词列表
    weixinoff:false,      //二维码弹窗
    duration:0,
    currentsec:0,   //当前秒
    totalmin:0,
    currentmin: 0,    //当前分
    width:0,               //进度条宽度
    timer: null,           //歌曲跳转
    timer1: null,          //歌词滚动定时器
    timer2:null,            //歌词滚动定时器
    timer3: null            //歌曲滑动跳转过滤
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
    // console.log(songinfo)
    this.setData({
      key: key,
      songlist: songlist,
      listScrollTop:42*(key-2),      //列表滚动到固定位置
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
    this.getLyric(); 
    this.interval();
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
    clearInterval(that.data.timer1);
    that.data.timer1 = setInterval(function () {
      wx.getBackgroundAudioPlayerState({
        success: function (res) {
          that.setData({
            duration: res.duration,     //总时长（单位：s）
            currentPosition: res.currentPosition,  //当前时长（s）
            endsec: res.duration % 60,  //停止秒
            endmin: parseInt(res.duration / 60 % 60),  //停止分
            currentsec: res.currentPosition % 60,  //当前秒
            currentmin: parseInt(res.currentPosition / 60 % 60), //当前分
            // width: res.currentPosition / res.duration * 100 + "%" //进度条的宽度
          })
          if (!that.data.baroff) {
            that.setData({
              //进度条的宽度
              width: Math.ceil(res.currentPosition / res.duration * 100) + "%"
            })
          }
        },
      })
      // 跳下一首歌
      if (that.data.currentPosition / that.data.duration >= 0.999) {
        clearTimeout(that.data.timer)
        that.data.timer = setTimeout(function () {
          var key = app.globalData.key;
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
            key: key,
            listScrollTop: 42 * (key - 2),
            songinfo: songinfo,
            imgPath: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songinfo.albummid + '.jpg'
          })
          that.aotuPlayMusic();
          that.getLyric();
        }, 1100)  //一定要大于外面定时器的时间（1000），不然会执行2次
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
// ---------------------------  进度条 ----------------------

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
    var w = Math.ceil(x / barlength * 100);   //宽度百分比
    this.setData({
      width: w + "%",
    })
    wx.seekBackgroundAudio({
      position: Math.ceil(w / 100 * this.data.duration)
    })
  },
//进度条拖拽
  bartouchstart:function(ev){
    var baroffsetLeft = ev.currentTarget.offsetLeft;
    this.setData({
        baroff: true,
        baroffsetLeft: baroffsetLeft
    })
  },
  bartouchmove: function (ev) {
      var baroffsetLeft = this.data.baroffsetLeft;
      var x = ev.touches[0].clientX - baroffsetLeft;
      var barlength = this.data.screenWidth - baroffsetLeft * 2;
      var w = Math.ceil(x / barlength * 100);
      w >= 100 ? w = 100 : w;
      w <= 0 ? w = 0 : w;
      this.setData({
        width: w + "%"
      })
  },
  bartouchend:function() {
      var w = parseInt(this.data.width);
      // console.log(w)
      this.setData({
        baroff: false
      })
      wx.seekBackgroundAudio({
        position: Math.ceil(w / 100 * this.data.duration)
      })
  },
  //---------------------- 歌词  --------------------------
  // 1.获取歌词
  // 2.转换格式
  // 3.储存歌词
  getLyric:function(){
    var that = this;
    var songid = this.data.songinfo.songid;
    util.getLyric(songid, function(data){
      // console.log(data)
      var lyric = data.showapi_res_body.lyric;
      lyric = that.reconvert(lyric);
      // console.log(lyric)
      lyric = that.parseLyric(lyric);
      // console.log(lyric)
      // 添加歌词开始时间
      for (var i = 0; i < lyric.length-1; i++) {
        lyric[i].endTime = lyric[i + 1].startTime;
      }
      lyric[lyric.length - 1].endTime = that.data.duration;

      that.setData({
        lyric: lyric
      });
      that.GCMove();
    })  
  },
  // 歌词格式转换
  reconvert: function (lyric) {
    // 其他歌词格式
    var str = lyric.replace(/(\\u)(\w{1,4})/gi, function ($0) {
      return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g, "$2")), 16)));
    });
    // 其他歌词格式
    str = lyric.replace(/(&#x)(\w{1,4});/gi, function ($0) {
      return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
    });
    // 当前格式
    str = lyric.replace(/(&#)(\d{1,6});/gi, function ($0) {
      return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
    });
    return str;
  },
  // 储存歌词文件上的时间
  parseLyric: function (lyric) {
    var lyrics = lyric.split("\n");
    var lrcArr = [];
    var lrcObj = {};
    for (var i = 0; i < lyrics.length; i++) {
      var timeReg = /\[\d*:\d*\.\d*\]/g;
      var timeRegExpArr = lyrics[i].match(timeReg);
      // console.log(timeRegExpArr)
      var clause = lyrics[i].replace(timeReg, '');
      if (!timeRegExpArr)
        continue;
      if (clause.length > 0) {
        var t = timeRegExpArr[0];
        var min = Number(String(t.match(/\[\d*/i)).slice(1)),
          sec = Number(String(t.match(/\:\d*\.\d*/i)).slice(1));
        var startTime = min * 60 + sec;
        lrcObj = {
          startTime: startTime-1,
          clause: clause
        }
        lrcArr.push(lrcObj);
        // console.log(lrcObj)
      }
    }
    return lrcArr;
  },
   /*歌词滚屏*/
  GCMove: function(){
    var that = this;
    clearInterval(this.data.timer2);
    this.data.timer2 = setInterval(function(){
      for(var i = 3; i < that.data.lyric.length; i++){
        if(that.data.currentPosition == that.data.lyric[i].time || that.data.currentPosition < that.data.lyric[i].endTime){
          if(that.data.flag == i){
            break;
          }
          that.setData({
            flag: i,
            scrollTop: 43 * (i-3),
          });
          break;
        } 
      };
    }, 300)
  },
  // ----------------------  列表弹窗 --------------------
  // 点击歌词列表
  openListBtn:function(){
    var listScrollTop = this.data.listScrollTop;
    this.setData({
      listoff:true,
      listScrollTop: listScrollTop
    })
  },
  // 关闭歌词列表
  closeListBtn: function () {
    this.setData({
      listoff: false
    })
  },
   // 歌词列表点击事件
  bindSong:function(ev){
    var key = ev.currentTarget.dataset.idss;
    var songlist = this.data.songlist
    var songinfo = songlist[key].data || songlist[key];
    app.globalData.key = key;
    this.setData({
      key: key,
      listScrollTop: 42 * (key - 2), 
      songinfo: songinfo,
      imgPath: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songinfo.albummid + '.jpg'
    })
    this.aotuPlayMusic();
    this.getLyric();
  },

  // -------------------------  歌词跳转  -----------------
  // 触摸移动开始
  startJump:function(ev){
    // console.log(ev)
    var startX = ev.touches[0].clientX;
    this.setData({
      startX: startX
    })
  },
  // 触摸移动时
  moveJump: function (ev) {
    var that = this;
    clearTimeout(this.data.timer3);
    this.data.timer3 = setTimeout(function(){   // 过滤
      var endX = ev.touches[0].clientX;
      that.setData({
        endX: endX
      })
    },100)
  },
  // 触摸移动结束
  endJump: function () {
    var startX = this.data.startX;
    var endX = this.data.endX;
    var dis = endX - startX;
    var screenWidth = this.data.screenWidth;
    var songlist = this.data.songlist
    var key = app.globalData.key;
    if (-dis > screenWidth / 2) {     //下一首
      key++;
      key >= songlist.length ? key = 0 : "";
      app.globalData.key = key;
      var songinfo = songlist[key].data || songlist[key];
      this.setData({
        key: key,
        listScrollTop: 42 * (key - 2), 
        songinfo: songinfo,
        imgPath: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songinfo.albummid + '.jpg'
      })
      this.aotuPlayMusic();
      this.getLyric();
    } else if (dis > screenWidth / 2) {   //上一首
      key--;
      key < 0 ? key = songlist.length - 1 : "";
      app.globalData.key = key;
      var songinfo = songlist[key].data || songlist[key];
      this.setData({
        key: key,
        listScrollTop: 42 * (key - 2), 
        songinfo: songinfo,
        imgPath: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + songinfo.albummid + '.jpg'
      })
      this.aotuPlayMusic();
      this.getLyric();
    }
  },
  // -------------------- 微信二维码 -----------------
  weixinOpen: function () {
    this.setData({
      weixinoff: true
    })
  },
  weixinClose: function () {
    this.setData({
      weixinoff: false
    })
  },

  /***      生命周期函数--监听页面卸载          */
  onUnload: function () {
    wx.stopBackgroundAudio() //停止音乐播放
  }

})
