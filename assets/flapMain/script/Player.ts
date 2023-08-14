// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Deferred } from "./Deferred";
import { LogUtil } from "./logUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class player extends cc.Component {

    @property(cc.Label)
    debuglabel: cc.Label = null;

    @property(cc.Integer)
    maxHp: number = 0;

    @property(cc.Integer)
    curHp: number = 0;

    @property(cc.Integer)
    maxBullet: number = 0;

    @property(cc.Integer)
    curbullet: number = 0;

    @property(cc.Label)
    debug: cc.Label;

    @property([cc.Node])
    gas:cc.Node[] = [];

    public firingCnt:number = 0;
    public legalRound:number = 0;

    start() {
        if (this.curHp == 0) {
            this.curHp = this.maxHp;
        }

        if (this.maxBullet == 0) {
            this.maxBullet = this.maxHp;
        }
    }

    /**
     * 
     * @param addCnt 
     */
    async onAddHp(addCnt: number) {
        this.curbullet += addCnt;

    }

    async onFire(cnt: number):Promise<boolean>{
        let legalCnt = Math.min(cnt, this.curbullet);
        if (legalCnt > 0) {
            LogUtil.log("fireBullet");
            this.firingCnt = legalCnt;
            let sta = this.getComponent(cc.Animation).play("放屁");
            await Deferred.wait(sta.duration*1000).promise;
            return true;
        } else {
            return false;
        }
    }

    onFart(){
        for(let i = 0;i<this.firingCnt;++i){
            let target = this.gas[i];
            target.active = true;
            target.x = 112;
            cc.tween(target).delay(i*100).to(200,{x:412}).start();
        }
    }

    update(dt) {
        if (this.debuglabel) {
            let text = `
            hp:${this.curHp}/${this.maxHp};
            bullet:${this.curbullet}/${this.maxBullet};
            `;
            this.debuglabel.string = text;
        }
    }
}
