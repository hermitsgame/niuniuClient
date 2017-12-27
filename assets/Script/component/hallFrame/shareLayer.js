var confige = require("confige");
cc.Class({
    extends: cc.Component,

    properties: {
        parent:{
            default:null,
            type:cc.Node
        },
        isInit:false,
    },

    onLoad: function () {

    },

    onInit:function(){
        this.shareBtn1 = this.node.getChildByName("btnShareSession").getComponent("cc.Button");
        this.shareBtn2 = this.node.getChildByName("btnShareTimeline").getComponent("cc.Button");

        this.label1 = this.node.getChildByName("label1").getComponent("cc.Label");
        //共邀请好友：0人
        this.label2 = this.node.getChildByName("label2").getComponent("cc.Label");
        //已获得奖励：0房卡

        this.isInit = true;
    },

    onBtnWXShare:function(event, customEventData){
        cc.log("fuck weixin share!!!!!!!!");
        this.shareBtn1.interactable = false;
        this.shareBtn2.interactable = false;
        var index = parseInt(customEventData);
        var appShareUrl = confige.sharePlus.replace('UNIONID', confige.userInfo.unionid);
        if(index == 0){
            cc.log("分享给好友");
            if(confige.curUsePlatform == 1)
            {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "WXShare", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V", confige.shareTitlePlus, confige.shareDesPlus, appShareUrl, 0);
            }else if(confige.curUsePlatform == 2){
                jsb.reflection.callStaticMethod("JSCallOC", "WXShareTitle:andDes:andUrl:andType:",confige.shareTitlePlus, confige.shareDesPlus, appShareUrl, 0);
            }
        }else if(index == 1){
            cc.log("分享到朋友圈");
            if(confige.curUsePlatform == 1)
            {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JSCallJAVA", "WXShare", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V", confige.shareTitlePlus, confige.shareDesPlus, appShareUrl, 1);
            }else if(confige.curUsePlatform == 2){
                jsb.reflection.callStaticMethod("JSCallOC", "WXShareTitle:andDes:andUrl:andType:",confige.shareTitlePlus, confige.shareDesPlus, appShareUrl, 1);
            }
        }
        if(confige.curUsePlatform == 3)
        {
            var curShareURL = confige.h5ShareUrlNew.replace('ROOMNUM', '0');
            if(confige.h5InviteCode != "0")
            {
                curShareURL += "&invite_code=" + confige.h5InviteCode;
            }
            // //选择图片单个图片
            // wx.chooseImage({
            //   count: 1, // 默认9
            //   sizeType: ['original'],
            //   sourceType: ['album', 'camera'],
            //   success: function (res) {
            //     var localId= res.localIds[0];
            //     $('#localId').text(localId);
            //     //选择图片成功，上传到微信服务器
            //     wx.uploadImage({
            //       localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
            //       isShowProgressTips: 1, // 默认为1，显示进度提示
            //       success: function (res) {
            //         var serverId = res.serverId; // 返回图片的服务器端ID
            //         $('#serverId').text(serverId);
            //       }
            //     });
            //   }
            // });
            // wx.ready(function(res) {
                console.log("H5分享给好友");
                wx.onMenuShareAppMessage({
                    title: confige.shareTitle,
                    desc: confige.shareDes,
                    link: curShareURL,
                    imgUrl: confige.h5ShareIco,
                    trigger: function(res) {},
                    success: function(res) {},
                    cancel: function(res) {},
                    fail: function(res) {}
                });
                console.log("H5分享到朋友圈2222222");
                wx.onMenuShareTimeline({
                    title: confige.shareTitle,
                    desc: confige.shareDes,
                    link: curShareURL,
                    imgUrl: confige.h5ShareIco,
                    trigger: function(res) {},
                    success: function(res) {},
                    cancel: function(res) {},
                    fail: function(res) {}
                });
            // });            
            this.shareBtn1.interactable = true;
            this.shareBtn2.interactable = true;

            this.parent.h5ShareNode.active = true;
            this.parent.h5ShareNode.stopAllActions();
            this.parent.h5ShareNode.opacity = 255;
            var deactiveCall = cc.callFunc(function () {
                this.parent.h5ShareNode.active = false;
            },this);  
            this.parent.h5ShareNode.runAction(cc.sequence(cc.delayTime(2),cc.fadeOut(1),deactiveCall));
        }
        this.node.active = false;
        cc.log("weixin share call end");
    },

    showOrHideShareLayer:function(event, customEventData){
        var index = parseInt(customEventData);
        if(index == 0)
            this.node.active = false;
        else if(index == 1)
            this.node.active = true;
    },

    showLayer:function(){
        if(this.isInit == false)
            this.onInit();
        this.check_inviteData();
        this.node.active = true;
    },

    hideLayer:function(){
        this.label1.string = "";
        this.label2.string = "";
        this.node.active = false;
    },

    check_inviteData:function(){
        var self = this;
        var xmlHttp = this.createXMLHttpRequest();
        var httpCallback = function(){
            if (xmlHttp.readyState==4)
            {// 4 = "loaded"
                if (xmlHttp.status==200)
                {// 200 = OK
                    var curReturn = JSON.parse(xmlHttp.responseText);
                    console.log(curReturn);
                    if(curReturn.invite_num)
                        self.label1.string = "共邀请好友：" + curReturn.invite_num + "人";
                    else
                        self.label1.string = "共邀请好友：0人";
                    if(curReturn.diamond)
                        self.label2.string = "已获得奖励：" + curReturn.diamond + "房卡";
                    else
                        self.label2.string = "已获得奖励：0房卡";
                }
            }
            
        };

        this.scheduleOnce(function() {
            var url = "http://pay.5d8d.com/niu_admin.php/api/getInviteInfo?game_uid="+confige.userInfo.playerId;
            console.log("url====="+ url);
            xmlHttp.onreadystatechange = httpCallback;
            xmlHttp.open("GET", url, true);// 异步处理返回   
            xmlHttp.setRequestHeader("Content-Type",  
                    "application/x-www-form-urlencoded;");  
            xmlHttp.send();
        }, 0.1);
    },

    createXMLHttpRequest:function() {  
        var xmlHttp;  
        if (window.XMLHttpRequest) {  
            xmlHttp = new XMLHttpRequest();  
            if (xmlHttp.overrideMimeType)  
                xmlHttp.overrideMimeType('text/xml');  
        } else if (window.ActiveXObject) {  
            try {  
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");  
            } catch (e) {  
                try {  
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");  
                } catch (e) {  
                }  
            }  
        } 
        return xmlHttp;  
    },
});
