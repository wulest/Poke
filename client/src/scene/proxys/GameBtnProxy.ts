/**
 * 控制卡牌显示等规则
 * Created by Administrator on 2015/12/19.
 */
module scene {
    import ChatInst = windowui.ChatInst;
    export class GameBtnProxy implements IInit, IRelease {
        public static STATE_HideAll: number = 0;
        public static STATE_Qiangdizhu: number = 1;
        public static STATE_Playing: number = 2;
        public static STATE_Ready: number = 3;

        private _state: number = 0;

        private _gameScene: egret.Sprite = null;
        private _setting: SButton = null;
        private _autoing: SButton = null;
        private _exiting: SButton = null;

        private _talking: SButton = null;
        private _prompt: SButton = null;
        //private _prompTips:egret.Bitmap=null;
        private _ready: SButton = null;
        private _callNo: SButton = null;
        private _call1: SButton = null;
        private _call2: SButton = null;
        private _call3: SButton = null;
        private _sendNo: SButton = null;
        private _sendReset: SButton = null;
        private _sendPromt: SButton = null;
        private _sendCard: SButton = null;

        private _currentDownSprite: egret.Sprite = null;   //当前拖动容器
        private _callSprite: egret.Sprite = null;      //叫分按钮容器;
        private _playSprite: egret.Sprite = null;      //玩游戏按钮
        private _readySprite: egret.Sprite = null;     //准备按钮
        private _touchStart: egret.Point = null;
        private _objStart: egret.Point = null;

        private _myCardProxy: MyCardProxy = null;
        public constructor() {

        }

        public get State(): number {
            return this._state;
        }
        public SetCardProxy(mcp: MyCardProxy): void {
            this._myCardProxy = mcp;
        }
        public Init(gs: egret.Sprite): void {
            this._gameScene = gs;

            /**
             * btn_setting
             */
            this._setting = new SButton("btn_setting");
            LayerMgr.TopUI.addChild(this._setting);
            this._setting.x = 338;
            this._setting.y = 17;

            /**
             * btn_roomauto
             */
            this._autoing = new SButton("btn_roomauto");
            LayerMgr.TopUI.addChild(this._autoing);
            this._autoing.x = 517;
            this._autoing.y = 17;

            /**
             * btn_roomout
             */
            this._exiting = new SButton("btn_roomout");
            LayerMgr.TopUI.addChild(this._exiting);
            this._exiting.x = 583;
            this._exiting.y = 17;

            /**
             * btn_chat
             */
            this._talking = new SButton("ui_chat_btn");
            this._gameScene.addChild(this._talking);
            this._talking.x = 10;
            this._talking.y = 1055;

            /**
             * robot
             */
            this._prompt = new SButton("ui_robot");
          //  this._gameScene.addChild(this._prompt);
            this._prompt.ClickScale = false;
            this._prompt.x = 0;
            this._prompt.y = 632;
            
            /**
             * 初始化确认等按钮
             */
            this.setBtnSprite();

            this._exiting.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
            this._autoing.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
            this._setting.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
            this._talking.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
            this._prompt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

            // 注册返回按键事件
            document.addEventListener("plusready", function () {
                // 注册返回按键事件
                window["plus"].key.addEventListener('backbutton', function () {
                    // 事件处理
                    window["plus"].nativeUI.confirm("退出程序？", function (event) {
                        if (event.index) {
                            window["plus"].runtime.quit();
                        }
                    }, null, ["取消", "确定"]);
                }, false);
            });
            //            var tthis = this;
            //            document.onkeydown = function(event) {
            //                var e = event || window.event || arguments.callee.caller.arguments[0];
            //                if(e && e.keyCode == 13) { // enter 键
            //                    NetMgr.Instance.SendMsg(enums.NetEnum.CLIENT_2_GAME_AUTO,{ isauto: true });
            //                }
            //            };
        }
        //设置托管
        public SetPlayerAuto(tableid: number, isauto: boolean): void {
            if (tableid != 3) {
                return;
            }
            this._prompt.visible = isauto;
            this._prompt.touchEnabled = isauto;
        }

        // 设置一些按钮样式
        //打牌
        public Playing(isnew: boolean): void {
            this._state = GameBtnProxy.STATE_Playing;
            this._readySprite.visible = false;
            this._callSprite.visible = false;

            this._playSprite.visible = true;//iscanshow;
            this._sendNo.visible = true;
            this._sendCard.visible = true;

            // 不出
            this._sendNo.touchEnabled = true;
            this._sendNo.SetBit("btn_buchu");

            // 提示
            this._sendPromt.touchEnabled = true;
            this._sendPromt.SetBit("btn_tishi");

            // 出牌
            this._sendCard.touchEnabled = false;
            this._sendCard.SetBit("btn_chupai");

            // 不出牌,灰色按钮
            if (isnew) {
                this._sendNo.SetBit("btn_buchu_no");
                this._sendNo.touchEnabled = false;
            }
        }

        // 修改一些按钮可点击状态
        //可以出牌
        public PlayingShow(isshow: boolean): void {
            if (isshow) {
                this._sendCard.SetBit("btn_chupai");
                this._sendCard.touchEnabled = true;
            }
            else {
                this._sendCard.SetBit("btn_chupai_no");
                this._sendCard.touchEnabled = false;
            }
        }

        //叫地主
        public CallLandOwner(nowscore: number): void {
            this._state = GameBtnProxy.STATE_Qiangdizhu;
            this._readySprite.visible = false;
            this._callSprite.visible = true;
            egret.log("展示抢地主的图标")
            this._playSprite.visible = false;
            this._call1.touchEnabled = true;
            this._call2.touchEnabled = true;
            this._call3.touchEnabled = true;
            this._callNo.touchEnabled = true;

            this._call1.alpha = 1;
            this._call2.alpha = 1;
            this._call3.alpha = 1;
            this._callNo.alpha = 1;
            if (nowscore == 1) {
                this._call1.touchEnabled = false;
                this._call1.alpha = 0.3
            }
            else if (nowscore == 2) {
                this._call1.touchEnabled = false;
                this._call1.alpha = 0.3
                this._call2.touchEnabled = false;
                this._call2.alpha = 0.3
            }
        }
        //全部隐藏
        public HideAll(): void {
            this._state = GameBtnProxy.STATE_HideAll;
            this._readySprite.visible = false;
            this._callSprite.visible = false;
            this._playSprite.visible = false;
        }
        //进入房间
        public RoomIn(): void {
            this._state = GameBtnProxy.STATE_Ready;
            this._readySprite.visible = true;
            this._callSprite.visible = false;
            this._playSprite.visible = false;
            if (SceneMgr.Instance.GetCurrentProxy() instanceof sceneproxy.GameSceneProxy) {
                var dp: data.Player = (<sceneproxy.GameSceneProxy>(SceneMgr.Instance.GetCurrentProxy())).GetMainPlayer();
                if (dp && dp.IsReady) {
                    this._readySprite.visible = false;
                }
            }
        }

        private setBtnSprite(): void {
            this._callSprite = new egret.Sprite();      //叫分按钮容器;
            this._callSprite.touchChildren = true;
            this._callSprite.touchEnabled = true;
            this._callSprite.x = 0;
            this._callSprite.y = 550;

            this._playSprite = new egret.Sprite();      //玩游戏按钮
            this._playSprite.touchChildren = true;
            this._playSprite.touchEnabled = true;
            this._playSprite.x = 0;
            this._playSprite.y = 550;

            this._readySprite = new egret.Sprite();     //准备按钮this.//
            this._readySprite.touchChildren = true;
            this._readySprite.touchEnabled = true;
            this._readySprite.x = 255;
            this._readySprite.y = 650;

            this._gameScene.addChild(this._callSprite);
            this._gameScene.addChild(this._playSprite);
            this._gameScene.addChild(this._readySprite);

            this._readySprite.visible = true;
            this._callSprite.visible = false;
            this._playSprite.visible = false;

            this._ready = new SButton("btn_zhunbei", null, "");
            this._readySprite.addChild(this._ready);
            this._ready.SetTxt(40, 0xffffff);
            this._ready.x = 4;//0;//4;
            this._ready.y = 20;//0;//20;

            /**
             * 叫地主时的按钮分布
             */
            // 不叫0分
            this._callNo = new SButton("btn_bujiao", null, "");
            this._callSprite.addChild(this._callNo);
            this._callNo.x = 20;
            this._callNo.y = 0;

            // 1分
            this._call1 = new SButton("btn_yifen", null, "");
            this._callSprite.addChild(this._call1);
            this._call1.x = 224;
            this._call1.y = 0;

            // 2分
            this._call2 = new SButton("btn_erfen", null, "");
            this._callSprite.addChild(this._call2);
            this._call2.x = 360;
            this._call2.y = 0;

            // 3分
            this._call3 = new SButton("btn_sanfen", null, "");
            this._callSprite.addChild(this._call3);
            this._call3.x = 495;
            this._call3.y = 0;


            /**
             * 重复定义???
             */
            this._sendNo = new SButton("btn_buchu", null, "");
            this._playSprite.addChild(this._sendNo);
            this._sendNo.x = 20;
            this._sendNo.y = 0;

            this._sendReset = new SButton("btn_chongxuan", null, "");
            this._playSprite.addChild(this._sendReset);
            this._sendReset.x = 224;
            this._sendReset.y = 0;

            this._sendPromt = new SButton("btn_tishi", null, "");
            this._playSprite.addChild(this._sendPromt);
            this._sendPromt.x = 360;
            this._sendPromt.y = 0;

            this._sendCard = new SButton("btn_chupai", null, "");
            this._playSprite.addChild(this._sendCard);
            this._sendCard.x = 495;
            this._sendCard.y = 0;

            this._sendReset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this, false);
            this._sendCard.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this, false);
            this._sendPromt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this, false);
            this._sendNo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this, false);
            this._call3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this, false);
            this._call2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this, false);
            this._call1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this, false);
            this._callNo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this, false);
            this._ready.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this, false);
        }



        // 没有调用
        private onToouchBegin(e: egret.TouchEvent): void {
            this._touchStart = new egret.Point();
            this._objStart = new egret.Point();
            this._touchStart.x = e.stageX;
            this._touchStart.y = e.stageY;
            this._objStart.x = e.currentTarget.x;
            this._objStart.y = e.currentTarget.y;
            this._currentDownSprite = e.currentTarget;
        }

        // 没有调用
        private onToouchMove(e: egret.TouchEvent): void {
            if (e.currentTarget != this._currentDownSprite) {
                return;
            }
            var cx: number = e.stageX;
            var cy: number = e.stageY;
            var bx: number = cx - this._touchStart.x;
            var by: number = cy - this._touchStart.y;
            e.currentTarget.x = this._objStart.x + bx;
            e.currentTarget.y = this._objStart.y + by;

            if (e.currentTarget.x > 366) {
                e.currentTarget.x = 366;
            }
            if (e.currentTarget.x < 0) {
                e.currentTarget.x = 0;
            }

            if (e.currentTarget.y < 0) {
                e.currentTarget.y = 0;
            }

            if (e.currentTarget.y > (Config.StageHeight - e.currentTarget.height)) {
                e.currentTarget.y = (Config.StageHeight - e.currentTarget.height);
            }
            this._currentDownSprite.touchChildren = false;
        }

        // 没有调用
        private onToouchEnd(e: egret.TouchEvent): void {
            if (e.currentTarget != this._currentDownSprite) {
                return;
            }
            var cx: number = e.stageX;
            var cy: number = e.stageY;
            var bx: number = cx - this._touchStart.x;
            var by: number = cy - this._touchStart.y;
            e.currentTarget.x = this._objStart.x + bx;
            e.currentTarget.y = this._objStart.y + by;
            this._touchStart = null;
            this._objStart = null;

            if (e.currentTarget.x > 366) {
                e.currentTarget.x = 366;
            }
            if (e.currentTarget.x < 0) {
                e.currentTarget.x = 0;
            }

            if (e.currentTarget.y < 0) {
                e.currentTarget.y = 0;
            }

            if (e.currentTarget.y > (Config.StageHeight - e.currentTarget.height)) {
                e.currentTarget.y = (Config.StageHeight - e.currentTarget.height);
            }
            this._currentDownSprite.touchChildren = true;
            this._currentDownSprite = null;

        }

        private onTap(e: egret.TouchEvent): void {
            if (e.currentTarget == this._setting) {
                windowui.SettingInst.Instance.Show();
            }
            if (e.currentTarget == this._autoing && this._prompt.visible == false) {
                NetMgr.Instance.SendMsg(enums.NetEnum.CLIENT_2_GAME_AUTO, { isauto: true });
            }
            if (e.currentTarget == this._prompt) {
                NetMgr.Instance.SendMsg(enums.NetEnum.CLIENT_2_GAME_AUTO, { isauto: false });
            }
            if (e.currentTarget == this._exiting) {
                // var status = PokesData.engine.leaveRoom("china No 1");
                egret.log("发送离开房间消息成功");
                NetMgr.Instance.SendMsg(enums.NetEnum.CLIENT_2_GAME_REQ_EXIT, {});
            }
            else if (e.currentTarget == this._talking) {
                windowui.ChatInst.Instance.Show();
            }
            else if (e.currentTarget == this._ready) {
                //准备注释掉原来的逻辑
                var event = {
                    action:enums.NetEnum.CLIENT_2_GAME_READY
                };
                var data = JSON.stringify(event);
                PokesData.engine.sendEventEx(2, data, 0,[]);
                // NetMgr.Instance.SendMsg(enums.NetEnum.CLIENT_2_GAME_READY, {});
            }
            // 出牌
            else if (e.currentTarget == this._sendCard) {
                var cardArr: Array<number> = this._myCardProxy.GetWillShowList();
                if (cardArr == null) {
                    trace("牌类型出错");
                    return;
                }
                var obj: any = {};
                obj.type = enums.NetEnum.CLIENT_2_GAME_SHOWCARD;
                obj.value = { cardlist: cardArr };
                var data1:any = PokesData.engine.sendEvent(JSON.stringify(obj));
                egret.log("出牌的消息发送是"+data1.result);
                NetMgr.Instance.SendMsg(enums.NetEnum.CLIENT_2_GAME_SHOWCARD, { cardlist: cardArr });
                // this.HideAll();
            }
            else if (e.currentTarget == this._sendPromt) {
                //NetMgr.Instance.SendMsg(enums.NetEnum.CLIENT_2_GAME_READY,{});
                var hasbigger: boolean = this._myCardProxy.getHasBigger();
                if (!hasbigger) {
                    NetMgr.Instance.SendMsg(enums.NetEnum.CLIENT_2_GAME_SHOWCARD, { cardlist: [] });
                }
                else {
                    var hascar: boolean = this._myCardProxy.Prompt(false, true);
                    this._myCardProxy.SetBtnVisible();
                }
            }
            else if (e.currentTarget == this._sendReset) {
                this._myCardProxy.Reset();
            }
            //不出牌
            else if (e.currentTarget == this._sendNo) {
                // var event1 = {                    
                //     action: enums.NetEnum.GAME_2_CLIENT_TURNPLAY,
                //     socore:0  };
                // var data = JSON.stringify(event1);
                // PokesData.engine.sendEventEx(2, data, 0,[]);
                var obj: any = {};
                obj.type = enums.NetEnum.CLIENT_2_GAME_SHOWCARD;
                obj.value = { cardlist: [] };
                var data1:any = PokesData.engine.sendEvent(JSON.stringify(obj));
                egret.log("出牌的消息发送是"+data1.result);
                NetMgr.Instance.SendMsg(enums.NetEnum.CLIENT_2_GAME_SHOWCARD, { cardlist: [] });
            }
            else if (e.currentTarget == this._call3) {
                var event1 = {                    
                    action: enums.NetEnum.GAME_2_CLIENT_TURNCALLLAND,
                    score:3 };
                var data = JSON.stringify(event1);
                PokesData.engine.sendEventEx(2, data, 0,[]);
                // NetMgr.Instance.SendMsg(enums.NetEnum.CLIENT_2_GAME_CALLLANDOWNER, { score: 3 });
                this.HideAll();
            }
            else if (e.currentTarget == this._call2) {
                var event1 = {                    
                    action: enums.NetEnum.GAME_2_CLIENT_TURNCALLLAND,
                    score:2 };
                var data = JSON.stringify(event1);
                PokesData.engine.sendEventEx(2, data, 0,[]);
                // PokesData.engine.sendEvent("score: 2");
                // NetMgr.Instance.SendMsg(enums.NetEnum.CLIENT_2_GAME_CALLLANDOWNER, { score: 2 });
                this.HideAll();
            }
            else if (e.currentTarget == this._call1) {
                var event1 = {                    
                    action: enums.NetEnum.GAME_2_CLIENT_TURNCALLLAND,
                    score:1 };
                var data = JSON.stringify(event1);
                PokesData.engine.sendEventEx(2, data, 0,[]);
                // PokesData.engine.sendEvent("score: 1");
                // NetMgr.Instance.SendMsg(enums.NetEnum.CLIENT_2_GAME_CALLLANDOWNER, { score: 1 });
                this.HideAll();
            }
            else if (e.currentTarget == this._callNo) {
                var event1 = {                    
                    action: enums.NetEnum.GAME_2_CLIENT_TURNCALLLAND,
                    score:0};
                var data = JSON.stringify(event1);
                PokesData.engine.sendEventEx(2, data, 0,[]);
                // PokesData.engine.sendFrameEvent("score: 0");
                // NetMgr.Instance.SendMsg(enums.NetEnum.CLIENT_2_GAME_CALLLANDOWNER, { score: 0 });
                this.HideAll();
            }
        }

        public Release(): void {
            this._gameScene.removeChildren();
            this._gameScene = null;
        }
    }
}
