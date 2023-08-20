// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Deferred } from "./Deferred";
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
     * 
     * @param addCnt 
     */
    async onAddHp(addCnt: number) {
        this.curHp += this.curHp;
    }

    /**
     * 
     * @param bullet 
     */
    async onAddBullet(bullet: number) {
        let realAdd = Math.max(this.maxBullet - this.curbullet, bullet);
        this.curbullet += realAdd;
        await Deferred.wait(400).promise;
        //TODO:动画
    }

    /**
     * @param dHp 
     */
    async onDamage(dHp: number) {
        this.curHp -= dHp;
        await Deferred.wait(400).promise;
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
        await Deferred.wait(400).promise;
        await this.onFire(OtherFiringCnt);
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
        await Deferred.wait(400).promise;
    }

    async onWasteBag() {
        this.bagCnt = 0;
    }

    async onFire(cnt: number): Promise<boolean> {
        let legalCnt = Math.min(cnt, this.curbullet);
        if (legalCnt > 0) {
            LogUtil.log("fireBullet");
            this.firingCnt = legalCnt;
            let sta = this.getComponent(cc.Animation).play("放屁");
            await Deferred.waitAnimationFinished(sta).promise;
            return true;
        } else {
            //TODO: 子弹不足是否也要动画
            return false;
        }
    }

    async onFireFinshed() {
        this.firingCnt = 0;
        await Deferred.wait(400).promise;
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
