// pages/requirement/index.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categorys: [],
    inputShowed: false,
    inputVal: "",
    searchResult: [],
    page: 0,
    canloadmore: false,
    area: ["全部", "未分类", "数码", "化妆品", "其他"],
    areaIndex: 0,
    categorys_new:[
      { 
        type: 11,
        title:"代购",
        subtitle:"",
        icon:"banner8.jpg"
      },
      {
        type: 12,
        title: "拼单",
        subtitle: "",
        icon: "banner8.jpg"
      },
      {
        type: 13,
        title: "交友",
        subtitle: "",
        icon: "banner8.jpg"
      }
  
    ]
  },
  updateCategorys: function () {
    var that = this;
    wx.request({
      url: app.ServerUrl() + '/api/topiccategorys.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        bv: app.getBuildVersion()
      },
      complete: function () {
        wx.stopPullDownRefresh();
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {

          that.setData({
            categorys: res.data.result
          });
        }
      }
    });
  },
tap:function(){
  
  console.log(categorys);
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.updateCategorys();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.updateCategorys();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: "学城生活——" + app.getAppName(),
      path: '/pages/requirement/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})