Page({
    data: {
        //小程序总是会读取data对象来做数据绑定，这个动作我们称为动作A
        // 而这个动作A的执行，是在onLoad函数执行之后发生的
        placeholder: 233,
        hotInfo:{},
    },
    onLoad: function () {
        const that = this;
        that.setData({});
        wx.request({
            url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8%C2%ACice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=36&_=1520777874472',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data)
                that.setData({hotInfo:res.data})
            }
        })
    },

})