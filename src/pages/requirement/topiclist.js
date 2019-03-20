// pages/requirement/index.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    searchResult: [],
    canloadmore: false,
    area: ["全部", "物品需求", "代购", "拼单", "交友"],
    areaIndex: 0,
    type: [10, 11, 12, 13],
    page: 0,
  },
  bindPickerChange: function(e) {
    if (e.detail.value == 0) {
      this.setData({
        areaIndex: e.detail.value,
        type: [10, 11, 12, 13],
        page: 0,
      })
    } else {
      this.setData({
        areaIndex: e.detail.value,
        type: Number(e.detail.value) + Number(9),
        page:0
      })
    }
    this.updateTopics(this.data.page, '', this.data.type);
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    this.updateTopics(this.data.page,'', this.data.type);
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
    this.updateTopics(this.data.page,'', this.data.type);
  },
  inputTyping: function(e) {
    if (util.trimStr(e.detail.value) != "") {
      this.setData({
        inputVal: util.trimStr(e.detail.value)
      });
      this.searchBy(util.trimStr(e.detail.value));
    } else {
      this.clearInput();
    }
  },
  searchBy: function(keyword) {
    this.updateTopics(this.data.page, keyword, this.data.type);
  },

  btnBackSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail);
    app.postFormId(e.detail.formId);
    wx.switchTab({
      url: '/pages/requirement/index',
    })
  },
  btnCreateSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail);
    app.postFormId(e.detail.formId);
    this.btnCreate();
  },
  btnCreate: function() {
    var that = this;
    if (!app.globalData.userInfo) {
      console.log(app.globalData.userInfo);
      app.authorizeCheck("scope.userInfo");
      return;
    }
    wx.showToast({
      title: '',
      icon: 'laoding',
      mask: true
    });
    wx.navigateTo({
      url: '/pages/requirement/create?type=' + that.data.type,
    });
    return;
    // wx.getClipboardData({
    //   success: function (res) {
    //     var str=res.data;
    //     if (str.indexOf("http")>=0){
    //       wx.showModal({
    //         title: '',
    //         content: '你是否想要转发剪贴板中的网页？' + '\r\n' + str,
    //         success:function(res){
    //           // wx.setClipboardData({
    //           //   data: '',
    //           // });
    //           if(res.confirm){
    //             wx.navigateTo({
    //               url: '/pages/requirement/createwithurl?type=' + that.data.type+'&url='+escape(str),
    //             })
    //           }else{
    //             wx.navigateTo({
    //               url: '/pages/requirement/create?type=' + that.data.type,
    //             });
    //           }
    //         }
    //       })
    //     }else{
    //       wx.navigateTo({
    //         url: '/pages/requirement/create?type=' + that.data.type,
    //       });
    //     }
    //   },
    //   fail:function(){
    //     console.log("no clipdata");
    //   }
    // });
  },

  btnLoadMore: function() {
    if (this.data.canloadmore) {
      this.data.page += 1;
      this.updateTopics(this.data.page,'', this.data.type);
    }
  },
  updateTopics: function(page = 0, kw = '', tp) {
    var that = this;
    wx.request({
      url: app.ServerUrl() + '/api/topiclist.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        type: tp,
        page: page,
        keyword: kw,
        token: app.globalData.token
      },
      complete: function() {
        wx.stopPullDownRefresh();
      },
      success: function(res) {
        if (parseInt(res.data.err) == 0) {
          var newlist = res.data.result;

          for (var i = 0; i < newlist.length; i++) {
            for (var item in newlist[i].pics) {
              newlist[i].pics[item] = app.CDNUrl() + "/upload/" + newlist[i].pics[item] + ".jpg";
            }
          }

          var list = [];
          if (page <= 0) {
            list = newlist;
          } else {
            list = newlist;
          }

          for (var i = 0; i < list.length; i++) {

            list[i].timedistance = util.getTimeDistance(list[i].createdate);
            list[i].authorInfo.lastlogindistance = util.getTimeDistance(list[i].authorInfo.lastlogin);
            list[i].index = i;
          }

          that.setData({
            list: list,
            page: page,
            canloadmore: newlist.length >= 9
          });
        }
        //

      }

    });

  },


  refresh: function() {
    this.updateTopics(this.data.page,'',this.data.type);
  },
  onLoad: function(options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: "需求" 
    });
    this.updateTopics(this.data.page, '', this.data.type)
    //this.updateTopics(this.data.type);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.updateTopics(this.data.page, '', this.data.type);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    return {
      title: that.data.title + "——" + app.getAppName(),
      path: '/pages/requirement/topiclist?type=' + that.data.type,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})