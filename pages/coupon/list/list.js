var zmjd = require("../../../libs/js/zmjd.js")
var util = require("../../../utils/util.js")
Page({
  data:{
    imgMode: "aspectFit",
    couponList:[]
  },
  onLoad:function(options){
    
    var _listDic = {"advID":0,"groupNo":0,"isvip":1};
    util.get('http://api.zmjiudian.com/api/coupon/GetSpeciallyCheapRoomCouponActivityList?advID=0&groupNo=0&isvip=1', _listDic, false, this.loadList);

  },
  loadList: function(res){
    this.setData({
        couponList:res.data.Items
    })
    this.update()
  },
  openDetail: function(){
    wx.navigateTo({ url: "../detail/detail" })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})