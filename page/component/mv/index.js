var common = require('../../../utils/util.js');
var bsurl=require('../../../utils/bsurl.js');
var app=getApp();
Page({
    data: {
        main: {},
        tab: 0,
        rec: {},
        loading: true,
        offset: 0,
        limit: 20,
        recid: 0
    },
    onLoad: function (options) {
        var that = this
        wx.request({
            url:bsurl+'mv',
            data:{
                id:options.id,
                cookie:wx.getStorageSync('cookie')||''
            },
            success: function (res) {
                that.setData({
                    main: res.data.data,
                    recid: res.data.data.commentThreadId
                });
                wx.setNavigationBarTitle({
                    title: res.data.data.name
                })
            }
        })
    },
    tab: function (e) {
        var t = e.currentTarget.dataset.tab;
        this.setData({
            tab: t
        });
        var that = this;
        if (this.data.tab && this.data.rec.code!=200) {
            common.loadrec(app.globalData.cookie,this.data.offset, this.data.limit, this.data.recid, function (data) {
                that.setData({
                    loading: false,
                    rec: data,
                    offset: data.comments.length
                });
            },1)
        }
    },
    loadmore: function () {
        if (this.data.rec.more&&!this.data.loading) {
            var that = this;
            this.setData({
                loading:true
            })
            common.loadrec(app.globalData.cookie,this.data.offset, this.data.limit, this.data.recid, function (data) {
                var rec = that.data.rec;
                var offset = that.data.offset + data.comments.length
                data.comments = rec.comments.concat(data.comments);
                data.hotComments=rec.hotComments;
                that.setData({
                    loading: false,
                    rec: data,
                    offset: offset
                });
            },1)
        }
    }
})