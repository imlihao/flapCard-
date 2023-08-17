// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { E_CardEffectType } from "./Defines";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GCardConfig extends cc.Component {



    @property(cc.SpriteFrame)
    Bullet1: cc.SpriteFrame;

    @property(cc.Integer)
    Bullet1MaxId: number;

    @property(cc.SpriteFrame)
    bullet2: cc.SpriteFrame;

    @property(cc.Integer)
    bullet2MaxId: number;

    @property(cc.SpriteFrame)
    Fan: cc.SpriteFrame;

    @property(cc.Integer)
    FanMaxId: number;

    @property(cc.SpriteFrame)
    NONECard: cc.SpriteFrame;

    @property(cc.Integer)
    NONECardMaxId: number;

    /**
     * 这张卡的附带的效果
     */
    public getCardEffect(cardId: number) {
        //暂时先根据id区分 TODO: 走配置
        if (cardId <= this.Bullet1MaxId) {
            return [E_CardEffectType.BULLET, 1];
        } else if (cardId <= this.bullet2MaxId) {
            return [E_CardEffectType.BULLET, 2];
        } else if (cardId <= this.FanMaxId) {
            return [E_CardEffectType.FAN, 0];
        } else {
            return [E_CardEffectType.NONE, 0];
        }
    }

    public getCardSprById(cardId: number): cc.SpriteFrame {
        if (cardId <= this.Bullet1MaxId) {
            return this.Bullet1;
        } else if (cardId <= this.bullet2MaxId) {
            return this.bullet2;
        } else if (cardId <= this.FanMaxId) {
            return this.Fan;
        } else {
            return this.NONECard;
        }
    }
}
