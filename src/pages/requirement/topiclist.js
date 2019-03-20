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
    page: 0,
    area: ["全部", "未分类", "数码", "化妆品", "其他"],
    areaIndex: 0,
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    this.updateTopics(0, '', this.data.areaIndex);
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    this.updateTopics(0, '', this.data.areaIndex);
  },
  inputTyping: function (e) {
    if (util.trimStr(e.detail.value) != "") {
      this.setData({
        inputVal: util.trimStr(e.detail.value)
      });
      this.searchBy(util.trimStr(e.detail.value));
    } else {
      this.clearInput();
    }
  },
  searchBy: function (keyword) {
    this.updateTopics(0, keyword, this.data.areaIndex);
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
      this.updateTopics(this.data.type, this.data.page);
    }
  },
  updateTopics: function (tp, kw = '', page = 0) {
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
    this.updateTopics([13, 12, 11, 10], [0, 0, 0, 0]);
  },
  onLoad: function(options) {
    var that = this;
    
    /*var list1 = this.updateTopics(10);
    var list2 = this.updateTopics(11);
    var list3 = this.updateTopics(12);
    var list4 = this.updateTopics(13);
    //var list = this.data.list1.concat(list2);
    var list =[];
    console.log(list1)*/

    wx.setNavigationBarTitle({
      title: "需求"//options.title
    });
    that.setData({
      //title: options.title,
      //title:"需求",
      //type: options.type,
      
     
    });
    this.updateTopics([13, 12, 11, 10], [0, 0, 0, 0])
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
    this.updateTopics(this.data.type);
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