// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CardPairSumCnt, E_CardEffectType, EffectPair } from "./Defines";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GCardConfig extends cc.Component {

    @property([cc.SpriteFrame])
    Farts: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    Beans: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    Fan: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    Bag: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    NONECard: cc.SpriteFrame = null;

    @property([cc.Integer])
    FartCounOrder1: number[] = [];

    @property([cc.Integer])
    BeanCntOrder2: number[] = [];

    @property(cc.Integer)
    FanCntOrder3: number = 0;

    @property(cc.Integer)
    BagCntOrder4: number = 0;

    @property(cc.Integer)
    NONECardCnt: number = 0;


    private effectMap: Map<Number, EffectPair>;
    onStart() {
        this.effectMap = new Map<Number, EffectPair>();
        let id = 1;
        for (let i = 0; i < this.FartCounOrder1.length; i++) {
            let fartCnt = this.FartCounOrder1[i];
            while (fartCnt > 0) {
                this.effectMap.set(id, [E_CardEffectType.FART, i + 1]);
                id++;
                --fartCnt;
            }
        }
        for (let i = 0; i < this.BeanCntOrder2.length; i++) {
            let beanCnt = this.BeanCntOrder2[i];
            while (beanCnt > 0) {
                this.effectMap.set(id, [E_CardEffectType.BEAN, i + 1]);
                id++;
                --beanCnt;
            }
        }
        for (let i = 0; i < this.FanCntOrder3; i++) {
            this.effectMap.set(id, [E_CardEffectType.FAN, 0]);
            id++;
        }
        for (let i = 0; i < this.BagCntOrder4; i++) {
            this.effectMap.set(id, [E_CardEffectType.BAG, 0]);
            id++;
        }
        for (let i = id; i <= CardPairSumCnt; i++) {
            this.effectMap.set(id, [E_CardEffectType.NONE, 0]);
            id++;
        }
    }

    /**
     * 这张卡的附带的效果
     */
    public getCardEffect(cardId: number): [E_CardEffectType, number] {
        return this.effectMap.get(cardId);
        // return [E_CardEffectType.NONE, 0];
    }

    public getCardSprById(cardId: number): cc.SpriteFrame {
        let Effect = this.effectMap.get(cardId);
        return this.getCardSprByEffect(Effect);
    }

    public getCardSprByEffect(effECT: [E_CardEffectType, number]): cc.SpriteFrame {
        switch (effECT[0]) {
            case E_CardEffectType.FART: {
                return this.Farts[effECT[1] - 1];
            } break;
            case E_CardEffectType.BEAN: {
                return this.Beans[effECT[1] - 1];
            } break;
            case E_CardEffectType.FAN: {
                return this.Fan;
            } break;
            case E_CardEffectType.BAG: {
                return this.Bag;
            } break;
                return this.NONECard;
        }
    }
}
