var util = require("../../utils/util.js");
var app = getApp();
Page({
  
//页面的初始数据 
  data: {
    navlist: ["推荐", "排行榜", "搜索"],
    navcur: 0,
    startSearchOff:false,
    searchform:false,
    searchlist: [],    //搜索结果列表
    searchid:1,
    timer:null,        //搜索下拉过滤
    timer1:null,
    loglist:[]         //曾经输入的值

  },

//生命周期函数--监听页面加载 
  onLoad: function () {
    var that = this;
    
    //获取搜索缓存
    wx.getStorage({
      key: 'gg',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          loglist: res.data
        })
      }
    })

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

    util.getHotKey(function(data){  //搜索热词
      // console.log(data)
      that.setData({
        special_key: data.data.special_key, 
        special_url: data.data.special_url,
        hotkey:data.data.hotkey.slice(0,9)
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

// ----------------------- 推荐----------------------------
  // 电台点击事件
  bindRadio: function (ev){
    var radioid = ev.currentTarget.dataset.radioid;
    util.radioSong(radioid,function (data){
      // console.log(data)
      // 格式化
      var songlist = [];
      for (var i = 0; i < data.data.length; i++){
        var obj = {};
        obj.albummid = data.data[i].album.mid;
        obj.albumname = data.data[i].album.name;
        obj.singer = data.data[i].singer;
        obj.songmid = data.data[i].mid;
        obj.songid = data.data[i].id;
        obj.songname = data.data[i].name;
        songlist[i] = obj;
      }
      // console.log(songlist)
      // 储存数据
      app.globalData.key = 0;
      app.globalData.songlist = songlist;
    })
    //，如没加定时器，不知道怎么回事，手机第一次点击会没数据
    clearTimeout(this.data.timer1);
    this.data.timer1 = setTimeout(function(){
      wx.navigateTo({
        url: '../play_song/play_song?id=' + 0
      })
    },1000)
  },

// 热门歌单点击事件
  bindHotSongList:function(ev){
    var id = ev.currentTarget.dataset.idhh;
    wx.navigateTo({
      url: '../hot_song_list/hot_song_list?id=' + id
    })
  },

// --------------------- 排行榜 ---------------------------
// 排行榜点击事件
  OpenTopListDetail: function(ev){
    var id = ev.currentTarget.dataset.id;
    // console.log(id)
    wx.navigateTo({
      url: '../top_song_list/top_song_list?id=' + id
    })
  },


// ------------------ 搜索 ------------------------
//搜索框点击事件
  startSearch:function(){
    this.setData({
      searchform: true
    })
  },
  // 取消点击事件
  cancelEvent:function(){
    this.setData({
      startSearchOff: false,
      searchform:false,
      searchkey:""
    })
  },

  // 捕获输入框value值
  bindKeyInput: function (ev) {
    this.setData({
      searchkey: ev.detail.value
    })
  },
  //  搜索结果(回车)
  searchResult:function(){
    var searchkey = this.data.searchkey.replace(/\s+/g, ""); //去空格
    this.setData({
      searchid: 1      //每次提交必须将searchid归位
    })
    if (searchkey.length != 0){
      this.setStorage();
      this.searchBack();
    }
  },
  searchBack:function(){
    // console.log(5)
    var that = this;
    var val = this.data.searchkey;
    var searchid = this.data.searchid;
    var searchlist = [];
    util.searchResult(val,searchid,function(data){
      // console.log(data)
      if (searchid!=1){
        searchlist = that.data.searchlist.concat(data.data.song.list);
      }else{
        searchlist = data.data.song.list;
      }
  
      that.setData({
        searchlist: searchlist,
        startSearchOff:true      
      })
        // console.log(that.data.searchlist)
    })
  },
  setStorage() {
    // console.log(5)
    var content = this.data.searchkey;
    var loglist = this.data.loglist;
    var index = loglist.indexOf(content);
    // console.log(index)  
    index >= 0 ? loglist.splice(index, 1) : "";  //删除之前已存在的相同的记录
    loglist.unshift(content);    //添加新的记录
    loglist = loglist.slice(0,7);  //截取前面7个数据
    wx.setStorage({
      key: "gg",
      data: loglist
    })
    this.setData({
      loglist: loglist
    })
  },
  //打开播放页面
  resultDetail:function(ev){
    var key = ev.currentTarget.dataset.resultid;
    // 储存数据
    app.globalData.key = key;
    app.globalData.songlist = this.data.searchlist;
    wx.navigateTo({
      url: '../play_song/play_song',
    })
  },
//上拉到底部加载
  scrolltolower:function(){
    // console.log(1)
    var that = this ;
    clearTimeout(this.data.timer);
    this.data.timer = setTimeout(function(){  //避免出现多次下拉效果
      // console.log(1)
      that.setData({
        searchid: that.data.searchid + 1,        
      })
      that.searchBack();
    },100)
  },
  // 删除该条记录点击事件
  removeThisLog:function(ev){
    var index = ev.currentTarget.dataset.logid;
    var loglist = this.data.loglist;
    loglist.splice(index,1);
    // console.log(loglist)
    wx.setStorage({
      key: 'gg',
      data: loglist
    })
    this.setData({
      loglist: loglist
    })
  },
  // 清除所有记录
  removeAllLogs:function(){
    var loglist = this.data.logllist;
    loglist = [];
    wx.setStorage({
      key: 'gg',
      data: loglist
    })
    this.setData({
      loglist:loglist
    })
  },
  // 搜索记录点击事件
  tapThisLog:function(ev){
    var index = ev.currentTarget.dataset.logid;
    var searchkey = this.data.loglist[index];
    this.setData({
      searchkey: searchkey
    })
    this.searchResult();
  },
  // 热门搜索热词点击事件 ( 红色 ) 
  bindSpecialkey: function () {
    var searchkey = this.data.special_key;
    this.setData({
      searchkey: searchkey,
      searchform: true
    })
    this.searchResult();
  },
  // 热门搜索热词点击事件（无色）
  bindHotKey: function (ev){
    var index = ev.currentTarget.dataset.hkid;
    var searchkey = this.data.hotkey[index].k;
    this.setData({
      searchkey: searchkey,
      searchform: true
    })
    this.searchResult();
  }



})