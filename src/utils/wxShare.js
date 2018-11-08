// 微信分享
export function timeLineShare (option) {
    window.wx.ready(function () {
        window.wx.onMenuShareTimeline({
            title: option.title, // 分享标题
            link: option.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: option.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                option.success && option.success()
            },
            cancel: function () {
                option.cancel && option.cancel()
            }
        })
    })
}

// 朋友分享
export function shareAppMessage (option) {
    window.wx.ready(function () {
         window.wx.onMenuShareAppMessage({
            title: option.title, // 分享标题
            desc: option.desc, // 分享描述
            link: option.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: option.imgUrl, // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
                option.success && option.success()
            },
            cancel: function () {
                option.cancel && option.cancel()
            }
        })
    })
}

// 分享到QQ
export function shareQQ (option) {
    window.wx.ready(function () {
         window.wx.onMenuShareQQ({
            title: option.title, // 分享标题
            desc: option.desc, // 分享描述
            link: option.qqlink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: option.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                option.success && option.success()
            },
            cancel: function () {
                option.cancel && option.cancel()
            }
        })
    })
}

// 隐藏分享渠道按钮
export const hideMenuItems = (option) => {
    window.wx.ready(function () {
        window.wx.hideMenuItems({
            menuList:[
            'menuItem:share:weiboApp',
            'menuItem:share:QZone'
            ], // 隐藏按钮列表
            success: function () {
                console.log('隐藏')
            }
        })
    })
}

