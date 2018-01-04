var confige = require("confige");
cc.Class({
    extends: cc.Component,

    properties: {
        player_item:{
            default:null,
            type:cc.Node
        },
        parent:{
            default:null,
            type:cc.Node
        },
        isInit:false,
    },

    onLoad: function () {

    },

    onInit:function(){
        this.showCardFunc = -1;
        this.showCardFunc2 = -1;
        this.moveBeginPosX = -400;
        this.moveBeginPos1 = 390;
        this.moveDistance1 = -155;
        this.moveBeginPos2 = -900;
        this.moveDistance2 = 550;

        this.btnOpenCard = this.node.getChildByName("btnOpenCard");
        this.mask = this.node.getChildByName("mask");
        this.cardListNode = this.node.getChildByName("cardList");
        this.cardList = {};
        for(var i=0;i<5;i++){
            this.cardList[i] = this.cardListNode.getChildByName("card"+i);
            this.cardList[i].zIndex = 5-i;
        }
        this.curCardNum = 0;
        this.canMove = true;

        this.selectZ = 10;
        this.selectIndex = -1;
        this.selectOriPos = {x:0,y:0};
        this.moveOriPos = {x:0,y:0};

        this.resetCard();
        var self = this;
        var moveStart0 = function(touches){
            self.moveOriPos = {x:touches.getLocationX(),y:touches.getLocationY()};
            self.selectIndex = 0;
            self.selectOriPos = {x:self.cardList[self.selectIndex].x,y:self.cardList[self.selectIndex].y};
        };
        var moveStart1 = function(touches){
            self.moveOriPos = {x:touches.getLocationX(),y:touches.getLocationY()};
            self.selectIndex = 1;
            self.selectOriPos = {x:self.cardList[self.selectIndex].x,y:self.cardList[self.selectIndex].y};
        };
        var moveStart2 = function(touches){
            self.moveOriPos = {x:touches.getLocationX(),y:touches.getLocationY()};
            self.selectIndex = 2;
            self.selectOriPos = {x:self.cardList[self.selectIndex].x,y:self.cardList[self.selectIndex].y};
        };
        var moveStart3 = function(touches){
            self.moveOriPos = {x:touches.getLocationX(),y:touches.getLocationY()};
            self.selectIndex = 3;
            self.selectOriPos = {x:self.cardList[self.selectIndex].x,y:self.cardList[self.selectIndex].y};
        };
        var moveStart4 = function(touches){
            self.moveOriPos = {x:touches.getLocationX(),y:touches.getLocationY()};
            self.selectIndex = 4;
            self.selectOriPos = {x:self.cardList[self.selectIndex].x,y:self.cardList[self.selectIndex].y};
        };

        var touchMove = function(touches){
            if(self.selectIndex != -1 && self.canMove)
            {
                var newPosX = self.selectOriPos.x + (touches.getLocationX() - self.moveOriPos.x);
                var newPosY = self.selectOriPos.y + (touches.getLocationY() - self.moveOriPos.y);
                self.cardList[self.selectIndex].x = newPosX;
                self.cardList[self.selectIndex].y = newPosY;
            }
        };
        var touchEnd = function(touches){
            if(self.canMove)
                self.cancelMove();
        };
        var touchCancel = function(touches){
            if(self.canMove)
                self.cancelMove();
        };
        this.cardList[0].on(cc.Node.EventType.TOUCH_START, moveStart0, self);
        this.cardList[1].on(cc.Node.EventType.TOUCH_START, moveStart1, self);
        this.cardList[2].on(cc.Node.EventType.TOUCH_START, moveStart2, self);
        this.cardList[3].on(cc.Node.EventType.TOUCH_START, moveStart3, self);
        this.cardList[4].on(cc.Node.EventType.TOUCH_START, moveStart4, self);
        for(var i=0;i<5;i++)
        {
            this.cardList[i].on(cc.Node.EventType.TOUCH_MOVE, touchMove, self);
            this.cardList[i].on(cc.Node.EventType.TOUCH_END, touchEnd, self); 
            this.cardList[i].on(cc.Node.EventType.TOUCH_CANCEL, touchCancel, self);
        }
        
        this.isInit = true;
    },

    cancelMove:function(){
        this.selectIndex = -1;
        var checkDis = false;
        console.log("curCardNum====="+this.curCardNum);
        if(Math.abs(this.cardList[this.curCardNum-1].x-this.cardList[this.curCardNum-2].x)>50 || Math.abs(this.cardList[this.curCardNum-1].y-this.cardList[this.curCardNum-2].y)>50)
            checkDis = true;
        if(checkDis)
        {
            console.log("搓牌成功")
            if(this.canMove)
            {
                this.unschedule(this.showCardFunc2);
                this.btnOpenCard.active = false;
                this.showCardFunc2 = function(){
                    this.btnShowCardClick();
                };
                this.scheduleOnce(this.showCardFunc2,1);
            }
            this.canMove = false;
        }else{
            console.log("搓牌失败,距离再拉大一些");
        }
    },

    resetCard:function(){
        for(var i=0;i<5;i++)
        {
            this.cardList[i].stopAllActions();
            this.cardList[i].x = 0;
            this.cardList[i].y = -140;
            this.cardList[i].scale = 0.33;
            this.cardList[i].rotation = 0;
            this.cardList[i].active = false;
            this.cardList[i].zIndex = 5-i;
        }
        this.mask.stopAllActions();
        this.curCardNum = 0;
        this.curCardIndex = -1;
        this.canMove = true;
        this.selectZ = 10;
        this.mask.opacity = 0;
        this.btnOpenCard.active = true;
    },

    initCard:function(handCard){
        this.canMove = true;
        this.mask.runAction(cc.fadeTo(0.3,150));
        for(var i in handCard)
        {
            this.curCardNum++;
            this.cardList[i].active = true;
            var curCardIndex = handCard[i].num + handCard[i].type*13;
            this.cardList[i].getComponent("cc.Sprite").spriteFrame = confige.bigCardFrameMap[curCardIndex];
        }

        if(this.curCardNum == 5)
        {
            this.cardList[0].y = this.moveBeginPos1;
            this.cardList[1].y = this.moveBeginPos1;
            
            this.cardList[0].x = this.moveBeginPosX;
            this.cardList[1].x = this.moveBeginPosX+80;

            this.cardList[2].y = this.moveBeginPos2;
            this.cardList[3].y = this.moveBeginPos2;
            this.cardList[4].y = this.moveBeginPos2;

            this.cardList[2].scale = 1.5;
            this.cardList[3].scale = 1.5;
            this.cardList[4].scale = 1.5;
            // this.cardList[2].rotation = 4;
            // this.cardList[4].rotation = -4;

            this.cardList[0].runAction(this.getAction(0));
            this.cardList[1].runAction(this.getAction(0));
            this.cardList[2].runAction(cc.sequence(this.getAction(1),cc.rotateTo(0.2,4)));
            this.cardList[3].runAction(this.getAction(1));
            this.cardList[4].runAction(cc.sequence(this.getAction(1),cc.rotateTo(0.2,-4)));
        }
        if(this.curCardNum == 3)
        {
            this.cardList[0].y = this.moveBeginPos2;
            this.cardList[1].y = this.moveBeginPos2;
            this.cardList[2].y = this.moveBeginPos2;

            this.cardList[0].scale = 1.5;
            this.cardList[1].scale = 1.5;
            this.cardList[2].scale = 1.5;
            // this.cardList[0].rotation = 4;
            // this.cardList[2].rotation = -4;

            this.cardList[0].runAction(cc.sequence(this.getAction(1),cc.rotateTo(0.2,4)));
            this.cardList[1].runAction(this.getAction(1));
            this.cardList[2].runAction(cc.sequence(this.getAction(1),cc.rotateTo(0.2,-4)));
        }
    },

    btnShowCardClick:function(){
        this.canMove = false;
        this.unschedule(this.showCardFunc);
        this.btnOpenCard.active = false;
        for(var i=0;i<5;i++){
            this.cardList[i].stopAllActions();
            this.cardList[i].zIndex = i;
        }
        this.mask.stopAllActions();
        if(this.curCardNum == 5)
        {
            this.cardList[0].runAction(this.getAction(2));
            this.cardList[1].runAction(this.getAction(2));

            this.cardList[2].runAction(cc.sequence(this.getAction(3),cc.rotateTo(0.2,-20),cc.delayTime(0.2),this.getAction(4)));
            this.cardList[3].runAction(cc.sequence(this.getAction(3),cc.rotateTo(0.2,0),cc.delayTime(0.2),this.getAction(4)));
            this.cardList[4].runAction(cc.sequence(this.getAction(3),cc.rotateTo(0.2,20),cc.delayTime(0.2),this.getAction(4)));
            this.mask.runAction(cc.sequence(cc.delayTime(0.5),cc.fadeOut(0.75)));
        }
        if(this.curCardNum == 3)
        {
            this.cardList[0].runAction(cc.sequence(this.getAction(3),cc.rotateTo(0.2,-20),cc.delayTime(0.2),this.getAction(4)));
            this.cardList[1].runAction(cc.sequence(this.getAction(3),cc.rotateTo(0.2,0),cc.delayTime(0.2),this.getAction(4)));
            this.cardList[2].runAction(cc.sequence(this.getAction(3),cc.rotateTo(0.2,20),cc.delayTime(0.2),this.getAction(4)));
            this.mask.runAction(cc.sequence(cc.delayTime(0.5),cc.fadeOut(0.75)));
        }
        this.showCardFunc = function(){
            this.parent.btnShowCardOnMove();
        };
        this.scheduleOnce(this.showCardFunc,1.3);
    },

    showLayer:function(handCard){//moveType:0:5张牌,明3张;1:5张牌,明4张;2:3张牌,明2张;3:3张牌,明0张;
        if(this.isInit == false)
            this.onInit();
        this.unschedule(this.showCardFunc);
        this.unschedule(this.showCardFunc2);
        this.initCard(handCard);
        this.node.active = true;
    },

    hideLayer:function(){
        this.resetCard();
        this.node.active = false;
    },

    getAction:function(actionIndex){
        switch(actionIndex)
        {
            case 0:
            return cc.moveBy(0.5,cc.p(0,this.moveDistance1)).easing(cc.easeOut(2.2));
            break;
            case 1:
            return cc.moveBy(0.5,cc.p(0,this.moveDistance2)).easing(cc.easeOut(2.2));
            break;
            case 2:
            return cc.sequence(cc.delayTime(0.75),cc.moveBy(0.5,cc.p(0,-this.moveDistance1)).easing(cc.easeOut(2.2)));
            break;
            case 3:
            return cc.moveTo(0.3,cc.p(0,this.moveBeginPos2+this.moveDistance2));
            break;
            case 4:
            return cc.moveTo(0.5,cc.p(0,this.moveBeginPos2-50)).easing(cc.easeOut(2));
            break;
            default:
            break;
        }
    },
});
