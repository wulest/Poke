var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 发牌动画
 * Created by Administrator on 2015/12/19.
 */
var scene;
(function (scene) {
    var SendCardAniProxy = (function () {
        function SendCardAniProxy() {
            this._sendLayer = null; //发牌的那一堆
            this._cardLayer = null;
            this._player = null;
            this._cardVlist = null;
            this._gameScene = null;
            this._overfun = null;
            this._overThis = null;
            this._timer1 = null;
            this._mCard1 = null;
            this._mCard2 = null;
            this._mCard3 = null;
        }
        SendCardAniProxy.prototype.Init = function (gs) {
            this._gameScene = gs;
        };
        SendCardAniProxy.prototype.StartAni = function (player, overfun, thisObj) {
            this._overfun = overfun;
            this._overThis = thisObj;
            this._player = player;
            this._cardVlist = [];
            this._sendLayer = new egret.Sprite();
            this._cardLayer = new egret.Sprite();
            this._gameScene.addChild(this._cardLayer);
            this._cardLayer.x = 0;
            this._cardLayer.y = Config.StageHeight - scene.MyCardProxy.DOWNGAP - scene.Card.CARDHEIGHT * 2 - scene.MyCardProxy.VERCARGAP;
            this.sendCardAni();
        };
        //发牌
        SendCardAniProxy.prototype.sendCardAni = function () {
            //中间发牌
            this._cardLayer.addChild(this._sendLayer);
            var i = 0;
            for (i = 0; i < 3; i++) {
                var card = MandPool.getInsByParm(scene.Card, 0);
                this._sendLayer.addChild(card);
                card.x = 220 + i * 10;
                card.y = -300;
            }
            this._mCard1 = MandPool.getInsByParm(scene.Card, 0);
            this._cardLayer.addChild(this._mCard1);
            this._mCard1.x = 250;
            this._mCard1.y = -300;
            this._mCard2 = MandPool.getInsByParm(scene.Card, 0);
            this._cardLayer.addChild(this._mCard2);
            this._mCard2.x = 250;
            this._mCard2.y = -300;
            this._mCard3 = MandPool.getInsByParm(scene.Card, 0);
            this._cardLayer.addChild(this._mCard3);
            this._mCard3.x = 250;
            this._mCard3.y = -300;
            egret.Tween.get(this._mCard1, { loop: true }).wait(0).to({ x: 0 }, 300).to({ x: 250 }, 0).wait(400);
            egret.Tween.get(this._mCard2, { loop: true }).wait(200).to({ x: 500 }, 300).to({ x: 250 }, 0).wait(200);
            egret.Tween.get(this._mCard3, { loop: true }).wait(400).to({ y: 0 }, 300).to({ y: 370 }, 0).wait(0);
            SoundMgr.Instance.PlayEffect("card_send_mp3");
            this._timer1 = new egret.Timer(220, 17);
            this._timer1.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
            this._timer1.start();
        };
        SendCardAniProxy.prototype.onTimer = function (e) {
            var ccount = this._timer1.currentCount;
            if (ccount == this._timer1.repeatCount) {
                egret.Tween.removeTweens(this._mCard1);
                egret.Tween.removeTweens(this._mCard2);
                egret.Tween.removeTweens(this._mCard3);
                // http://developer.egret.com/cn/apidoc/index/name/egret.TimerEvent#TIMER
                this.setCard(this._player.CardArr);
                this._timer1.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
                this._timer1.stop();
                this._timer1 = null;
                this.showOwnerAni();
            }
            else {
                var arr = this._player.CardArr.slice(0, ccount);
                this.setCard(arr);
            }
        };
        SendCardAniProxy.prototype.showOwnerAni = function () {
            //if(this._mCard1.parent)
            //{
            //    this._mCard1.parent.removeChild(this._mCard1);
            //}
            //if(this._mCard2.parent)
            //{
            //    this._mCard2.parent.removeChild(this._mCard2);
            //}
            //if(this._mCard3.parent)
            //{
            //    this._mCard3.parent.removeChild(this._mCard3);
            //}
            this._sendLayer.removeChildren();
            if (this._sendLayer.parent) {
                this._sendLayer.parent.removeChild(this._sendLayer);
                this._sendLayer = null;
            }
            this._mCard1.x = 250;
            this._mCard1.y = -300;
            this._mCard2.x = 250;
            this._mCard2.y = -300;
            this._mCard3.x = 250;
            this._mCard3.y = -300;
            egret.Tween.get(this._mCard1).to({ x: 50 }, 300);
            egret.Tween.get(this._mCard2).to({ x: 450 }, 300);
            this._overfun.call(this._overThis);
            //egret.Tween.get(this._mCard3).to({y: 0}, 300).to({y: 370}, 0).wait(0);
        };
        SendCardAniProxy.prototype.setCard = function (cardlist) {
            var rlen = this._cardVlist.length;
            var ri = 0;
            for (ri = 0; ri < rlen; ri++) {
                var card = this._cardVlist[ri];
                card.Release();
            }
            this._cardVlist = [];
            var clist = cardlist;
            clist.sort(function (a, b) {
                if (a % 100 == b % 100) {
                    if (a > b) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                }
                else if (a % 100 > b % 100) {
                    return -1;
                }
                return 1;
            });
            var list = this.dividArr(cardlist);
            var list1 = list[0];
            var list2 = list[1];
            var len1 = list1.length;
            var len2 = list2.length;
            var dis = Config.StageWidth - scene.MyCardProxy.LEFTGAP - scene.MyCardProxy.RIGHTGAP - scene.Card.CARDWIDTH;
            var cy1 = 0; //Config.StageHeight-MyCardProxy.DOWNGAP-Card.CARDHEIGHT;
            var cy2 = cy1 + scene.MyCardProxy.VERCARGAP + scene.Card.CARDHEIGHT;
            var gap1 = dis / (len1 - 1);
            var gap2 = dis / (len2 - 1);
            var i = 0;
            if (gap1 > scene.MyCardProxy.HORCARGAP) {
                gap1 = scene.MyCardProxy.HORCARGAP;
            }
            if (gap2 > scene.MyCardProxy.HORCARGAP) {
                gap2 = scene.MyCardProxy.HORCARGAP;
            }
            var sx1 = (Config.StageWidth - (gap1 * (len1 - 1) + scene.Card.CARDWIDTH)) / 2;
            var sx2 = (Config.StageWidth - (gap2 * (len2 - 1) + scene.Card.CARDWIDTH)) / 2;
            for (i = 0; i < len1; i++) {
                var card = MandPool.getInsByParm(scene.Card, list1[i]);
                card.y = cy1;
                card.x = sx1 + i * gap1;
                this._cardLayer.addChild(card);
                this._cardVlist.push(card);
            }
            for (i = 0; i < len2; i++) {
                var card = MandPool.getInsByParm(scene.Card, list2[i]);
                card.y = cy2;
                card.x = sx2 + i * gap2;
                this._cardLayer.addChild(card);
                this._cardVlist.push(card);
            }
        };
        //划分为上下显示的两个数组
        SendCardAniProxy.prototype.dividArr = function (cardlist) {
            var arr1 = [];
            var arr2 = [];
            var len = this._player.CardNum;
            var i = 0;
            var cardvalue;
            //先分配到两个数组
            for (i = 0; i < 10; i++) {
                cardvalue = cardlist[i];
                if (cardvalue) {
                    arr1.push(cardvalue);
                }
            }
            for (i = 10; i < 20; i++) {
                cardvalue = cardlist[i];
                if (cardvalue) {
                    arr2.push(cardvalue);
                }
            }
            //检查第二个数组的第一个数字第一个数组中是否存在(同样数字应该在一列)
            var samevalue;
            if ((arr2[0])) {
                (arr2[0]).Value % 100;
            }
            var len1 = arr1.length;
            var len2 = arr2.length;
            var long = 0;
            if (samevalue) {
                for (i = len1 - 1; i >= 0; i--) {
                    if (samevalue == (arr1[i]).Value % 100) {
                        long++;
                        if (long + len2 < 10) {
                            arr2.unshift(arr1.pop());
                        }
                    }
                    else {
                        break;
                    }
                }
            }
            return [arr1, arr2];
        };
        //地主牌飞到指定位置
        SendCardAniProxy.prototype.Release = function (loctid) {
            if (loctid == 0) {
                this._gameScene.removeChildren();
                return;
            }
            var tx = 20; //500;20;
            var ty = 100; //100;700;
            if (loctid == 1) {
                tx = 40;
                ty = -520;
            }
            else if (loctid == 2) {
                tx = 500;
                ty = -520;
            }
            else if (loctid == 3) {
                tx = 250;
                ty = 0;
            }
            if (this._mCard3) {
                egret.Tween.get(this._mCard3).to({ x: tx, y: ty }, 500).call(function () {
                    this._gameScene.removeChildren();
                }, this);
            }
            if (this._mCard2) {
                egret.Tween.get(this._mCard2).to({ x: tx, y: ty }, 500).call(function () {
                    this._gameScene.removeChildren();
                }, this);
            }
            if (this._mCard1) {
                egret.Tween.get(this._mCard1).to({ x: tx, y: ty }, 500).call(function () {
                    this._gameScene.removeChildren();
                }, this);
            }
        };
        return SendCardAniProxy;
    }());
    scene.SendCardAniProxy = SendCardAniProxy;
    __reflect(SendCardAniProxy.prototype, "scene.SendCardAniProxy", ["IInit", "IRelease"]);
})(scene || (scene = {}));
//# sourceMappingURL=SendCardAniProxy.js.map