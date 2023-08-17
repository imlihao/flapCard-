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
        //TODO:动画
    }

    /**
     * @param dHp 
     */
    async onDamage(dHp: number) {
        this.curHp -= dHp;
        //TODO:同步生命动画
    }

    async onGetFan() {
        //TODO: 播放拿出风扇的动画
        this.fanCnt = 1;
    }

    async onUseFan() {
        //TODO: 播放拿出风扇的动画
        this.fanCnt = 1;
    }

    async onGetBag() {
        //TODO: 播放拿出塑料袋的动画
        this.bagCnt = 1;
    }

    async onFire(cnt: number): Promise<boolean> {
        let legalCnt = Math.min(cnt, this.curbullet);
        if (legalCnt > 0) {
            LogUtil.log("fireBullet");
            this.firingCnt = legalCnt;
            let sta = this.getComponent(cc.Animation).play("放屁");
            await Deferred.wait(sta.duration * 1000).promise;
            return true;
        } else {
            return false;
        }
    }

    update(dt) {
        if (this.debuglabel) {
            let text = `
            hp:${this.curHp}/${this.maxHp};
            bullet:${this.curbullet}/${this.maxBullet};
            `;
            this.debuglabel.string = text;
        }
    }
}
