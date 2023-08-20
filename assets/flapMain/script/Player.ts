// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AniState from "./AniState";
import AniStateFart from "./AniStateFart";
import { Deferred } from "./Deferred";
import { E_ANIMATION_Fart, E_ANIMATION_Player } from "./Defines";
import { LogUtil } from "./logUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class player extends cc.Component {

    @property(cc.Label)
    debuglabel: cc.Label = null;

    @property(cc.Integer)
    maxHp: number = 0;

    @property(cc.Integer)
    curHp: number = 0;

    @property(cc.Integer)
    maxBullet: number = 0;

    @property(cc.Integer)
    curbullet: number = 0;

    @property(cc.Label)
    debug: cc.Label;

    @property([cc.Node])
    gas: cc.Node[] = [];

    @property(AniState)
    mainState: AniState = null;
    @property(AniStateFart)
    fartState: AniStateFart = null;


    public legalRound: number = 0;
    public firingCnt: number = 0;
    public bagCnt: number = 0;
    public fanCnt: number = 0;

    start() {
        if (this.curHp == 0) {
            this.curHp = this.maxHp;
        }

        if (this.maxBullet == 0) {
            this.maxBullet = this.maxHp;
        }
    }

    /**
     * 暂时不知道效果
     * @param addCnt 
     */
    async onAddHp(addCnt: number) {
        this.curHp += this.curHp;
    }

    /**
     * 
     * @param bullet 
     */
    async onAddBeans(bullet: number) {
        let realAdd = Math.max(this.maxBullet - this.curbullet, bullet);
        this.curbullet += realAdd;
        await this.mainState.changeState(E_ANIMATION_Player.bean, realAdd);
        await Deferred.wait(100).promise;
        //TODO:动画
    }

    /**
     * @param dHp 
     */
    async onDamage(dHp: number) {
        this.curHp -= dHp;
        await this.mainState.changeState(E_ANIMATION_Player.Hit, dHp);
        await Deferred.wait(100).promise;
        //TODO:同步生命动画
    }

    async onGetFan() {
        //TODO: 播放拿出风扇的动画
        this.fanCnt = 1;
        await Deferred.wait(400).promise;
    }

    async onUseFan(OtherFiringCnt: number) {
        //TODO: 播放拿出风扇的动画
        this.fanCnt = 0;
        await this.mainState.changeState(E_ANIMATION_Player.fan, 0);
        await Deferred.wait(100).promise;
        await this.onFart(OtherFiringCnt);
    }

    async onWasteFan() {
        this.fanCnt = 0;
    }

    async onGetBag() {
        //TODO: 播放拿出塑料袋的动画
        this.bagCnt = 1;
        await Deferred.wait(400).promise;
    }

    async onUseBag() {
        //TODO: 播放拿出塑料袋的动画
        this.bagCnt = 0;
        await this.mainState.changeState(E_ANIMATION_Player.bag, 0);
        await Deferred.wait(100).promise;
    }

    async onWasteBag() {
        this.bagCnt = 0;
    }

    async onFart(fartCnt: number): Promise<boolean> {
        let legalCnt = Math.min(fartCnt, this.curbullet);
        if (legalCnt > 0) {
            LogUtil.log("fireBullet");
            this.firingCnt = legalCnt;
            this.curbullet -= legalCnt;
            await this.mainState.changeState(E_ANIMATION_Player.fart, legalCnt);
            await this.fartState.changeState(E_ANIMATION_Fart.firstFart, legalCnt);
            await Deferred.wait(100).promise;
            return true;
        } else {
            //TODO: 子弹不足是否也要动画
            return false;
        }
    }

    async onFartFinshed() {
        let cnt = this.firingCnt;
        this.firingCnt = 0;
        await this.fartState.changeState(E_ANIMATION_Fart.SecondFartHitted, cnt);
        await Deferred.wait(100).promise;
    }

    update(dt) {
        if (this.debuglabel) {
            let text = `
生命:${this.curHp}/${this.maxHp}
黄豆:${this.curbullet}/${this.maxBullet}
风扇:${this.fanCnt}
塑料袋:${this.fanCnt}
FiringCnt:${this.firingCnt}`;
            this.debuglabel.string = text;
        }
    }
}
