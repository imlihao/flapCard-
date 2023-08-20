// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property } = cc._decorator;

@ccclass
export default class AiCom extends cc.Component {

    @property(cc.Integer)
    tinkingTimeInSec: number = 0.8;

    gameMgr: any = null;

    protected onEnable(): void {
        this.AILog("AI 启动");
    }

    public AiMove(): void {
        setTimeout(() => {
            this.doClk();
        }, this.tinkingTimeInSec * 1000);

        setTimeout(() => {
            this.doClk();
        }, this.tinkingTimeInSec * 1000 + 500);
    }

    public doClk(): void {
        //随机一个可以点击的卡片
        const canFlapCards = this.gameMgr.getAllCanFlapCard();
        if (canFlapCards.length <= 0) {
            this.AILog("没有可以点击的卡片");
            return;
        }
        let ran = Math.random();
        let idx = Math.floor(ran * canFlapCards.length);
        canFlapCards[idx].onCardClk(null, true);
        this.AILog("点击 位置：" + canFlapCards[idx].idx + "  卡片id：" + canFlapCards[idx].cardId + "  卡片类型：" + canFlapCards[idx].card_compareStr);
    }


    private AILog(...data: any[]) {
        console.log(`AI:::`, ...data);
    }
    // update (dt) {}
}
