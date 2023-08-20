//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Deferred } from "./Deferred";
import { E_ANIMATION_Fart } from "./Defines";

const { ccclass, property } = cc._decorator;

/**
 * 放屁
 *   -放屁动作（一段序列帧）
 *   -屁开始飞行（1 2 ）
 *   -屁命中（1 2 ）
 *   -屁反弹（1 2 ）
 *   -屁被阻挡（1 2 ）
 */
@ccclass
export default class AniStateFart extends cc.Component {

    @property(cc.Prefab)
    fartPfb: cc.Prefab = null;

    @property(cc.Animation)
    Fart: cc.Animation = null;

    fart1: cc.Node = null;

    fart2: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private fartCnt: number = 0;

    private mp: Map<E_ANIMATION_Fart, cc.Animation> = null;
    onStart() {
        this.Fart = cc.instantiate(this.fartPfb).getComponent(cc.Animation);
        this.Fart.node.parent = this.node;
        this.fart1 = this.Fart.node.getChildByName("fart1");
        this.fart2 = this.Fart.node.getChildByName("fart2");
    }

    private myState: E_ANIMATION_Fart = E_ANIMATION_Fart.normal;

    private makeNodeFitState() {
        this.fart1.active = this.fartCnt > 0;
        this.fart2.active = this.fartCnt > 1;
    }

    private backToIdle() {
        this.myState = E_ANIMATION_Fart.normal;
        this.makeNodeFitState();
    }

    async changeState(state: E_ANIMATION_Fart, fartCnt: number) {
        if (this.myState == state) {
            return;
        }
        this.fartCnt = fartCnt;
        if (this.myState != E_ANIMATION_Fart.normal) {
            this.myState = state;
            this.makeNodeFitState();
            if (this.myState == E_ANIMATION_Fart.firstFart) {
                let sta = this.Fart.play(this.Fart.getClips()[0].name);
                await Deferred.waitAnimationFinished(sta).promise;
            } else {
                let sta = this.Fart.play(this.Fart.getClips()[1].name);
                await Deferred.waitAnimationFinished(sta).promise;
            }
        }
        if (this.myState != E_ANIMATION_Fart.firstFart) {
            this.backToIdle();
        }
    }
}
