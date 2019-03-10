// pages/shop/goodsdetail.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    commentstr: '',
    commentplaceholder: '评论此话题',
    replyid: 0,
    replyprefix: '',
    canloadmore: false,
    page: 0,
    commentlist: []
  },
  btnPicPreview: function (e) {
    var that = this;
    var imgIndex = e.currentTarget.id.split("_")[1];
    var item = that.data.result;

    var pics = [];

    for (var i = 0; i < item.pics.length; i++) {
      pics.push(item.pics[i]);
    }

    wx.previewImage({
      current: pics[imgIndex],
      urls: pics,
    })
  },
  btnEdit: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ["删除"],
      success: function (res) {
        // if (res.tapIndex == 0) {
        //   that.flashTopic();
        // } else 
        if (res.tapIndex == 0) {
          that.deleteTopic();
        }
      }
    })
  },
  commentInput: function (e) {
    var that = this;

    var replyid = that.data.replyid;
    var replyprefix = that.data.replyprefix;
    var commentstr = e.detail.value;
    if (e.detail.value.indexOf(replyprefix) < 0) {
      replyid = 0;
      replyprefix = '';
      commentstr = '';
    }
    this.setData({
      replyid: replyid,
      replyprefix: replyprefix,
      commentstr: commentstr
    });
  },
  btnCommentAction: function (e) {
    var that = this;
    var commentId = e.currentTarget.id.substr(3, e.currentTarget.id.length);
    wx.showActionSheet({
      itemList: ["删除此评论"],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.request({
            url: app.ServerUrl() + '/api/delcomment.php',
            method: 'POST',
            header: {
              'Cookie': 'PHPSESSID=' + app.globalData.sessionid
            },
            data: {
              commentid: commentId,
              token: app.globalData.token
            },
            success: function (res) {
              wx.showToast({
                title: res.data.msg,
              });
              if (parseInt(res.data.err) == 0) {
                that.getTopicComments(0);
                that.data.result.commentcount = parseInt(that.data.result.commentcount) - 1;
                that.setData({
                  result: that.data.result
                });
              }
            }
          });
        }
      }
    })
  },
  btnReply: function (e) {
    var that = this;
    var index = e.currentTarget.id.substr(3, e.currentTarget.id.length);
    var item = that.data.commentlist[index];

    var replyprefix = "回复" + item.authorInfo.nickname + "：";
    var replyid = item.id;
    if (item.authorInfo.openid == app.globalData.userInfo.openid) {
      replyprefix = '';
      replyid = 0;
    }
    that.setData({
      replyid: replyid,
      replyprefix: replyprefix,
      commentstr: replyprefix
    });
  },
  btnPostComment: function () {
    var that = this;

    if (!app.globalData.userInfo.id) {
      console.log(app.globalData.userInfo);
      app.authorizeCheck("scope.userInfo");
      return;
    }

    var commentstr = this.data.commentstr;
    commentstr = commentstr.substr(commentstr.indexOf(that.data.replyprefix) + that.data.replyprefix.length, commentstr.length);
    if (util.trimStr(commentstr) == "") return;

    wx.showToast({
      title: '提交中',
      mask: true
    });
    wx.request({
      url: app.ServerUrl() + '/api/postcomment.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        articleid: that.data.topicid,
        replyid: that.data.replyid,
        text: commentstr,
        token: app.globalData.token
      },
      success: function (res) {
        wx.showToast({
          title: res.data.msg,
        });
        if (parseInt(res.data.err) == 0) {
          that.getTopicComments(0);
          that.data.result.commentcount = parseInt(that.data.result.commentcount) + 1;
          that.setData({
            result: that.data.result
          });
          // console.log(app.globalData.userInfo);

          // var commentItem = { id: res.data.result.commentid, authorInfo: app.globalData.userInfo, text: commentstr, createdate:new Date().getTime(), timedistance: "刚刚" };
          // if(that.data.replyid!=''){
          //   commentItem.reply = { authorInfo: { nickname: that.data.replyprefix.substring(2, that.data.replyprefix.length-1)}};
          // }
          // that.data.commentlist.unshift(commentItem);

          that.setData({
            commentstr: "",
            replyprefix: '',
            replyid: 0,
            // commentlist: that.data.commentlist
          });
        }
      }
    });
  },
  btnShowLocation: function (e) {
    var that = this;
    var item = that.data.result;
    var gps_arr = item.gps.split(",");
    wx.openLocation({
      latitude: parseFloat(gps_arr[0]),
      longitude: parseFloat(gps_arr[1]),
      name: item.gpsaddr,
      address: item.gpscity
    });
  },
  btnLikeAction: function (e) {
    var that = this;
    var item = that.data.result;

    if (!app.globalData.userInfo.id) {
      console.log(app.globalData.userInfo);
      app.authorizeCheck("scope.userInfo");
      return;
    }

    wx.showLoading({
      title: '请求中',
      mask: true
    });
    wx.request({
      url: app.ServerUrl() + '/api/likeaction.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        articleid: that.data.topicid,
        token: app.globalData.token
      },
      complete: function () {
        wx.hideLoading();
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          if (parseInt(res.data.result.action) == 0) {
            that.data.result.likecount = parseInt(that.data.result.likecount) - 1;
            that.data.result.isliked = false;
          } else {
            that.data.result.likecount = parseInt(that.data.result.likecount) + 1;
            that.data.result.isliked = true;
          }
          that.setData({
            result: that.data.result
          });
        }
      }
    });
  },
  flashTopic: function () {
    var that = this;
    wx.showModal({
      title: '',
      content: '将此内容置于首位，需消耗您50积分',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.ServerUrl() + '/api/flasharticle.php',
            method: 'POST',
            header: {
              'Cookie': 'PHPSESSID=' + app.globalData.sessionid
            },
            data: {
              articleid: that.data.topicid,
              token: app.globalData.token
            },
            success: function (res) {
              wx.showToast({
                title: res.data.msg,
              });
            }
          });
        }
      }
    })
  },
  deleteTopic: function () {
    var that = this;
    wx.request({
      url: app.ServerUrl() + '/api/delarticle.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        articleid: that.data.topicid,
        token: app.globalData.token
      },
      success: function (res) {
        wx.showModal({
          title: '',
          content: res.data.msg,
          showCancel: false,
          success: function (obj) {
            if (obj.confirm) {
              if (parseInt(res.data.err) == 0) {
                app.getPrevPage().refresh();
                wx.navigateBack({

                });
              }
            }
          }
        });
      }
    });
  },
  btnLoadMore: function () {
    if (this.data.canloadmore) {
      this.data.page += 1;
      this.getTopicComments(this.data.page);
    }
  },
  getTopicComments: function (page = 0) {
    var that = this;
    wx.request({
      url: app.ServerUrl() + '/api/commentlist.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        page: page,
        articleid: that.data.topicid
      },
      success: function (res) {
        wx.hideToast();
        if (parseInt(res.data.err) == 0) {
          var newlist = res.data.result;

          var list = [];
          if (page <= 0) {
            list = newlist;
          } else {
            list = that.data.commentlist.concat(newlist);
          }

          for (var i = 0; i < list.length; i++) {
            list[i].index = i;
            list[i].timedistance = util.getTimeDistance(list[i].createdate);
          }

          that.setData({
            commentlist: list,
            page: page,
            canloadmore: newlist.length >= 10
          });
        }
      }
    });
  },
  updateTopicDetail: function () {
    var that = this;
    wx.request({
      url: app.ServerUrl() + '/api/topicdetail.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        bv: app.getBuildVersion(),
        articleid: that.data.topicid
      },
      success: function (res) {
        wx.hideToast();

        if (parseInt(res.data.err) == 0) {
          var result = res.data.result;

          result.timedistance = util.getTimeDistance(result.createdate);

          for (var item in result.pics) {
            result.pics[item] = app.CDNUrl() + "/upload/" + result.pics[item] + ".jpg";
          }

          that.setData({
            result: result
          });

          that.getTopicComments();
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      topicid: options.topicid
    });
    this.updateTopicDetail();
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
      title: that.data.result.text,
      path: '/pages/requirement/detail?topicid=' + that.data.topicid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})