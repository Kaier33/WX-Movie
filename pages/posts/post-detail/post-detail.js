var postsData = require("../../../data/posts-data.js")
var app = getApp()
Page({
  data: {
    isPlayingMusic: false
  },
  onLoad: function (option) {
    var globalData = app.globalData
    var postId = option.id
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId]
    this.setData({
      postData: postData
    });

    var postsCollected = wx.getStorageSync("posts_collected")
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    }
    else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync("posts_collected", postsCollected)
    }
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMuisc: true
      })
    }
    this.setMusicMonitor()
  },
  // 事件
  onColletionTap: function (event) {
    this.getPostsCollectedSyc()
    // this.getPostsCollectedAsy()
  },
  onShareTap: function (event) {
    var itemList = [
      "分享到微信好友",
      "分享到朋友圈",
      "分享到微博",
      "分享到QQ"
    ]
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        // res.cancel 用户是不是点击的取消按钮
        // res.tapIndex 数组元素的序号 , 从0开始
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '噢噢噢噢噢噢噢',
        })
      }
    })
  },
  onMusicTap: function (event) {
    var currentPostId = this.data.currentPostId
    var postDataMusic = postsData.postList[currentPostId].music
    var isPlayingMusic = this.data.isPlayingMusic
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postDataMusic.url,
        title: postDataMusic.title,
        coverImgUrl: postDataMusic.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  },
  setMusicMonitor: function () {
    //点击播放图标和总控开关都会触发这个函数
    var that = this;
    wx.onBackgroundAudioPlay(function (event) {
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1];
      if (currentPage.data.currentPostId === that.data.currentPostId) {
        // 打开多个post-detail页面后，每个页面不会关闭，只会隐藏。通过页面栈拿到到
        // 当前页面的postid，只处理当前页面的音乐播放。
        if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
          // 播放当前页面音乐才改变图标
          that.setData({
            isPlayingMusic: true
          })
        }
        // if(app.globalData.g_currentMusicPostId == that.data.currentPostId )
        // app.globalData.g_currentMusicPostId = that.data.currentPostId;
      }
      app.globalData.g_isPlayingMusic = true;

    });
    wx.onBackgroundAudioPause(function () {
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1];
      if (currentPage.data.currentPostId === that.data.currentPostId) {
        if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
          that.setData({
            isPlayingMusic: false
          })
        }
      }
      app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicPostId = null;
    });
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicPostId = null;
    });
  },




  // 封装的函数

  showModal: function (postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: "收藏",
      content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected);
          // 更新数据绑定变量，从而实现切换图片
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },
  showToast: function (postsCollected, postCollected) {
    // 更新文章是否的缓存值
    wx.setStorageSync('posts_collected', postsCollected)
    // 更新数据的绑定
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000
    })
  },
  // 异步设置缓存
  getPostsCollectedAsy: function () {
    var that = this
    wx.getStorage({
      key: "posts_collected",
      success: function (res) {
        var postsCollected = res.data
        var postsCollected = wx.getStorageSync("posts_collected")
        var postCollected = postsCollected[that.data.currentPostId]
        // 收藏变成未收藏, 未收藏变成收藏
        postCollected = !postCollected
        postsCollected[that.data.currentPostId] = postCollected
        that.showToast(postsCollected, postCollected)
      }
    })
  },
  //同步设置缓存
  getPostsCollectedSyc: function () {
    var postsCollected = wx.getStorageSync("posts_collected")
    var postCollected = postsCollected[this.data.currentPostId]
    // 收藏变成未收藏, 未收藏变成收藏
    postCollected = !postCollected
    postsCollected[this.data.currentPostId] = postCollected
    this.showToast(postsCollected, postCollected)
  },


})