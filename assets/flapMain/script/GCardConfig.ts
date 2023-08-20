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

    @property([cc.SpriteFrame])
    Farts: [cc.SpriteFrame];

    @property([cc.SpriteFrame])
    Beans: [cc.SpriteFrame] = null;

    @property(cc.SpriteFrame)
    Fan: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    Bag: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    NONECard: cc.SpriteFrame = null;

    @property([cc.Integer])
    FartCount: number[] = [];

    @property([cc.Integer])
    BeanCnt: number[] = [];

    @property(cc.Integer)
    FanCnt: number = 0;

    @property(cc.Integer)
    BagCnt: number = 0;

    @property(cc.Integer)
    NONECardCnt: number = 0;


    /**
     * 这张卡的附带的效果
     */
    public getCardEffect(cardId: number): [E_CardEffectType, number] {
        return [E_CardEffectType.NONE, 0];
    }

    public getCardSprById(cardId: number): cc.SpriteFrame {
        return this.NONECard;
    }

    public getCardSprByEffect(effECT: [E_CardEffectType, number]): cc.SpriteFrame {
        return this.NONECard;
    }
}
