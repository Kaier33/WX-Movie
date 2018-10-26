Page({
    data: {
        test: 'test'
    },
    onTap: function (event) {
        // wx.navigateTo({
        //     url:"../posts/post"
        // });

        wx.switchTab({
            url: "../movies/movies"
        });

    },
})