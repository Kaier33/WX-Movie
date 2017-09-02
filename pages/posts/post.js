var postsData = require("../../data/posts-data.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      datas: postsData.postList
    });
  },
  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },
  
  onSwiperTap: function (event) {
    // target 和 currentTarger
    // target指的是当前点击的组件, currentTarger指的是事件捕获的组件
    // target 这里的指的是image , 而 currentTartget指的是swiper
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  }

})