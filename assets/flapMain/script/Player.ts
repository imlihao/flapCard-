// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class player extends cc.Component {

    @property(cc.Label)
    debuglabel: cc.Label = null;

    @property(cc.Integer)
    maxHp:number = 0;

    @property(cc.Integer)
    curHp:number = 0;

    @property(cc.Integer)
    maxBullet:number = 0;

    @property(cc.Integer)
    curbullet:number = 0;
  
    
    start () {

    }

    // update (dt) {}
}
