
//首页
function indexResult(callback) {
  wx.request({
    url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg', 
    data: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
    },
    method: "GET",
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.statusCode == 200) {  //成功了
        callback(res.data);
        // console.log(res.data)
      }
    }
  })
}
// 电台歌单
function radioSong(radioid,callback) {
  wx.request({
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_radiosonglist.fcg',
    data: {
      labelid: radioid,    //重点
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf - 8',
      outCharset: 'utf - 8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      _: new Date().getTime()   //清缓存
    },
    method: "GET",
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.statusCode == 200) {  //成功了
        callback(res.data);
        // console.log(res.data)
      }
    }
  })
}
// 热门歌单
function hotSongList(id,callback) {
  wx.request({
    url: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
    data: {
      g_tk: 5381,
      uin: 0,
      format: "json",
      inCharset: "utf - 8",
      outCharset: "utf - 8",
      notice: 0,
      platform: "h5",
      needNewCode: 1,
      new_format: 1,
      pic: 500,
      disstid: id,   //重点
      type: 1,
      json: 1,
      utf8: 1,
      onlysong: 0,
      nosign: 1,
      _: new Date().getTime()   //清缓存
    },
    method: "GET",
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.statusCode == 200) {  //成功了
        callback(res.data);
        // console.log(res.data)
      }
    }
  })
}
//热门歌单歌曲列表
function hotSongListDetail(callback) {
  wx.request({
    url: 'https://shc.y.qq.com/splcloud/fcgi-bin/fcg_list_songinfo_cp.fcg',
    data: {
      utf8: 1,
      reqtype: 1,
      idlist: '4962990, 1889266,8292,476205,1672450,1248135,4029059,102654611,106291312,1032932,105838893,103048995,200363210,1293976,158265,1623105,464695,1293982,4902939,4801323,102183359,1229555,1889263,4963117,1025809,1889270,7227075,101786429,541016,103186250,4727668,2328883,1165143,104235392,5210275,8141370,7250913,4963126,2285645,315375,634343,105461750,1672447,1923061,7113428,776277,1462321,105807391,4962974,550763',
      g_tk:5381,
      uin:0,
      format:'json',
      inCharset:'utf-8',
      outCharset:' utf - 8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      _: new Date().getTime()   //清缓存
    },
    method: "GET",
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.statusCode == 200) {  //成功了
        callback(res.data);
        // console.log(res.data)
      }
    }
  })
}
// ----------------------------排行榜-----------------------
//排行榜
function topList(callback) {
  wx.request({
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
    data: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
    },
    method: "GET",
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.statusCode == 200) {  //成功了
        callback(res.data);
        // console.log(res.data)

      }
    }
  })
}

//排行榜详细
function topListDetail(id, callback){
  wx.request({
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
    data: {
      g_tk:5381,
      uin:0,
      format:'json',
      inCharset:'utf-8',
      outCharset:'utf-8',
      notice:0,
      platform:'h5',
      needNewCode:1,
      tpl: 3,
      page: 'detail',
      type: 'top',
      topid: id  //重点
    },
    method: "GET",
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.statusCode == 200) {  //成功了
        callback(res.data);
        // console.log(res.data)
    
      }
    }
  })
}

// --------------------------搜索--------------------
// 热门搜索关键字
function getHotKey(callback){
  wx.request({
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
    data:{
      g_tk: 5381,
      uin: 0,
      format: "json",
      inCharset: "utf - 8",
      outCharset: "utf - 8",
      notice: 0,
      platform: "h5",
      needNewCode: 1,
    },
    header: {
      'content-type': 'application/json'
    },
    success:function(res){
      if (res.statusCode == 200) {  //成功了
        callback(res.data);
        //console.log(res.data)
      }
    }
  })
}

// 搜索结果
function searchResult(val,index,callback) {
  wx.request({
    url: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
    data: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf - 8',
      outCharset: 'utf - 8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      w: val,
      zhidaqu: 1,
      catZhida: 1,
      t: 0,
      flag: 1,
      ie: 'utf - 8',
      sem: 1,
      aggr: 0,
      perpage: 20,
      n: 20,
      p: index,
      // remoteplace: txt.mqq.all,
      _: new Date().getTime(),    //清缓存
    },
    method: "GET",
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.statusCode == 200) {  //成功了
        callback(res.data);
        // console.log(res.data)
      }
    }
  })
}

/* 获取歌词*/
function getLyric(id, callback) {
  wx.request({
    url: 'https://route.showapi.com/213-2',
    data: {
      musicid: id,
      showapi_appid: '23654',
      showapi_timestamp: new Date().getTime(),
      showapi_sign: 'd23793312daf46ad88a06294772b7aac'
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  });
}


module.exports = {
  indexResult: indexResult,  //首页的数据
  topList: topList,  //排行榜
  topListDetail: topListDetail,  //排行榜详细
  getHotKey: getHotKey,    //热门搜索关键词
  searchResult: searchResult,    //搜索结果
  hotSongList: hotSongList,      //热门歌单
  hotSongListDetail: hotSongListDetail,   //热门歌单歌曲列表
  radioSong: radioSong,    //电台
  getLyric: getLyric         //歌词
  
}
