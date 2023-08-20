// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameDifines, GameType } from "./Defines";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GLoading extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;


    onStratAI() {
        GameDifines.gameType = GameType.Ai;
        this.loadGame();
    }

    onStratSelf() {
        GameDifines.gameType = GameType.Self;
        this.loadGame();
    }

    loadGame() {
        cc.director.loadScene("flapGameScene",()=>{
            console.log("load game scene");
        });
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}
}
