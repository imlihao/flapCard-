// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Deferred } from "./Deferred";
import { E_ANIMATION_Player } from "./Defines";

const { ccclass, property } = cc._decorator;

/**
 * 用于记录动画状态
 * 动画的状态改变会播放指定的节点上的动画，async
 * 
 * 吃黄豆 1 2
 * 放屁
 *   -放屁动作（一段序列帧）
 *   -屁开始飞行（1 2 ）
 *   -屁命中（1 2 ）
 *   -屁反弹（1 2 ）
 *   -屁被阻挡（1 2 ）
 * 电风扇
 * 塑料带
 */
@ccclass
export default class AniState extends cc.Component {

    @property(cc.Prefab)
    fartPfb: cc.Prefab = null;

    @property(cc.Prefab)
    beanPfb: cc.Prefab = null;

    @property(cc.Prefab)
    FanPfb: cc.Prefab = null;

    @property(cc.Prefab)
    bagPfb: cc.Prefab = null;

    @property(cc.Prefab)
    idlePfb: cc.Prefab = null;


    @property(cc.Animation)
    fartNode: cc.Animation = null;

    @property(cc.Animation)
    beanNode: cc.Animation = null;

    @property(cc.Animation)
    Fan: cc.Animation = null;

    @property(cc.Animation)
    bag: cc.Animation = null;

    @property(cc.Animation)
    idle: cc.Animation = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private mp: Map<E_ANIMATION_Player, cc.Animation> = null;
    onStart() {
        this.fartNode = cc.instantiate(this.fartPfb).getComponent(cc.Animation);
        this.fartNode.node.parent = this.node;
        this.beanNode = cc.instantiate(this.beanPfb).getComponent(cc.Animation);
        this.beanNode.node.parent = this.node;
        this.Fan = cc.instantiate(this.FanPfb).getComponent(cc.Animation);
        this.Fan.node.parent = this.node;
        this.bag = cc.instantiate(this.bagPfb).getComponent(cc.Animation);
        this.bag.node.parent = this.node;
        this.idle = cc.instantiate(this.idlePfb).getComponent(cc.Animation);
        this.idle.node.parent = this.node;
        
        let map = this.mp = new Map<E_ANIMATION_Player, cc.Animation>();
        map.set(E_ANIMATION_Player.idle, this.idle);
        map.set(E_ANIMATION_Player.fart, this.fartNode);
        map.set(E_ANIMATION_Player.bean, this.beanNode);
        map.set(E_ANIMATION_Player.fan, this.Fan);
        map.set(E_ANIMATION_Player.bag, this.bag);
        map.forEach((ani) => {
            ani.node.active = false;
        })
        this.backToIdle();
    }

    private myState: E_ANIMATION_Player = E_ANIMATION_Player.idle;

    private makeNodeFitState() {
        this.mp.forEach((ani, k) => {
            ani.node.active = k == this.myState;
        })
    }

    private backToIdle() {
        this.myState = E_ANIMATION_Player.idle;
        this.makeNodeFitState();
        this.idle.play();
    }

    async changeState(state: E_ANIMATION_Player) {
        if (this.myState == state) {
            return;
        }
        if (this.myState != E_ANIMATION_Player.idle) {
            this.myState = state;
            this.makeNodeFitState();
            let targetSta = this.mp.get(this.myState);
            let sta = targetSta.play();
            await Deferred.waitAnimationFinished(sta);
        }
        this.backToIdle();
    }
}
