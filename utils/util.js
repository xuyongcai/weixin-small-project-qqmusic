
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

module.exports = {
  indexResult: indexResult,  //首页的数据
  topList: topList,  //排行榜
  topListDetail: topListDetail  //排行榜详细
}
