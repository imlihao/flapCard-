// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { E_CardStatus } from "./Defines";
import GameManager from "./GameManager";
import { MessageCenter } from "./MessageCenter";
import { LogUtil } from "./logUtil";

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

    async changeStatus(newStat: E_CardStatus,playAni = true) {
        //如果状态需要改变的话，播放动画，改状态
        if(newStat != this.status){
            if(playAni){
                if(newStat == E_CardStatus.tempDisplay){
                    let ani =   this.node.getComponent(cc.Animation).play("cardFlyOut");
                  }else if(this.status == E_CardStatus.tempDisplay && E_CardStatus.hidden){
                    this.node.getComponent(cc.Animation).play("cardFlyBack");
                  }else if(newStat == E_CardStatus.depature){
                    this.node.getComponent(cc.Animation).playAdditive("cardDissappear");
                  }
            } else {
                //TODO: 恢复卡片状态
            }
            
            this.status = newStat;
            
        }
        
    }

    private canCardhandleClk(): boolean {
        
        return true;
    }

    public onCardClk() {
        LogUtil.logBlue("clkssssss");
        MessageCenter.emit("LockAll", this.cardId);

        MessageCenter.emit("CardClk", this.cardId);

        
    }

    start() {
        console.log("sttss")
        this.node.on(cc.Node.EventType.TOUCH_END,this.onCardClk,this);
    }

    update (dt) {
        
    }
}
