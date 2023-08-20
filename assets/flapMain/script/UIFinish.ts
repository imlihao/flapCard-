// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIFinish extends cc.Component {

    @property(cc.Label)
    Finish: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    onFinish(finishStr) {
        this.Finish.string = finishStr;
        this.node.active = true;
    }

    nextLevel() {
        cc.director.loadScene("GLoading", () => {
            console.log("load game scene");
        });
    }

    // update (dt) {}
}
