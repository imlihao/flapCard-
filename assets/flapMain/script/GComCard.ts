// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { E_CardStatus } from "./EnumDefines";
import { MessageCenter } from "./MessageCenter";

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

    private status: E_CardStatus;

    @property(cc.Integer)
    cardId: number = 0;

    idx: number = -1;

    public initData(cardId: number, idx: number) {
        this.cardId = cardId;
        this.idx = idx;
        this.initDisplayWithData();
    }

    /**
     * 根据id颜色展示
     */
    private initDisplayWithData() {

    }

    public changeStatus(newStat: E_CardStatus) {
        //如果状态需要改变的话，播放动画，改状态

    }

    private canCardhandleClk(): boolean {
        return true;
    }

    async onCardClk() {
        if (!this.canCardhandleClk()) {
            return;
        }
        MessageCenter.emit("LockAll", this.cardId);

        MessageCenter.emit("CardClk", this.cardId);
    }

    start() {

    }

    // update (dt) {}
}
