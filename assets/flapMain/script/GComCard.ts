// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { E_CardEffectType, E_CardStatus, EffectPair } from "./Defines";
import GameManager from "./GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
/**
 * 初始化
 *  记录自己数据
 *  改变自己的显示
 * 
 * 当点击发生时
 *   判断条件
 *   请求被点击
 *   根据结果更新状态   
 */
export default class GComCard extends cc.Component {

    public status: E_CardStatus;

    @property(cc.Integer)
    cardId: number = 0;

    @property(cc.Sprite)
    cardFront: cc.Sprite;

    card_compareStr: string;

    idx: number = -1;

    @property(cc.Label)
    debug: cc.Label = null;

    public myEffect: EffectPair;

    public initData(cardId: number, idx: number) {
        this.cardId = cardId;
        this.idx = idx;
        this.initDisplayWithData();
        this.status = E_CardStatus.hidden;
    }

    /**
     * 根据id颜色展示
     */
    private initDisplayWithData() {
        let [tp, param] = this.myEffect = GameManager.inst.config.getCardEffect(this.cardId);
        this.cardFront.spriteFrame = GameManager.inst.config.getCardSprByEffect(this.myEffect);
        this.card_compareStr = E_CardEffectType[tp] + "_" + param;
        this.cardLog(`EFFECT:   ${this.card_compareStr}`);

    }

    public changeStatus(newStat: E_CardStatus, playAni = true) {
        //如果状态需要改变的话，播放动画，改状态
        if (newStat != this.status) {
            if (playAni) {
                if (newStat == E_CardStatus.tempDisplay) {
                    let ani = this.node.getComponent(cc.Animation).play("cardFlyBack");
                } else if (this.status == E_CardStatus.tempDisplay && newStat == E_CardStatus.hidden) {
                    this.node.getComponent(cc.Animation).play("cardFlyOut");
                } else if (newStat == E_CardStatus.depature) {
                    this.node.getComponent(cc.Animation).playAdditive("cardDisapper");
                }
            } else {
                //TODO: 恢复卡片状态
            }
            this.cardLog(`stat to${E_CardStatus[newStat]}`);
            this.status = newStat;
        }

    }

    public onCardClk(clkData, isAi: boolean = false) {
        if (this.status != E_CardStatus.hidden) {
            this.cardLog(`no hidden,no click`);
            return;
        }
        if (GameManager.inst.isClkLocked) {
            this.cardLog(`lockClk,no click`);
            return;
        }
        if (!GameManager.inst.canIClk(isAi === true)) {
            this.cardLog(`${isAi === true ? "AI" : "ME"} 当前不是我的回合, no click`);
            return;
        }
        GameManager.inst.onCardClk(this.idx, this.cardId);
    }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onCardClk, this);
    }

    update(dt) {
        if (this.debug) {
            this.debug.string = `
${this.card_compareStr}
${E_CardStatus[this.status]}`;
        }
    }

    private cardLog(...data: any[]) {
        console.log(`card: idx:${this.idx}, cardId:${this.cardId} `, ...data);
    }
}
