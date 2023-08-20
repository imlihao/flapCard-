// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GSprAni extends cc.Component {

    @property([cc.Sprite])
    sprArr: cc.Sprite[] = [];

    @property(cc.Float)
    frameTimeInSec: number;

    spr: cc.Sprite = null;

    // private curCnt = 0;
    // private playedCnt = 0;

    private curFrameIdx = -1;
    private frameLeftTimeInSec = 0;
    start() {
        this.spr = this.getComponent(cc.Sprite);
        this.spr.trim = false;
        this.spr.sizeMode = cc.Sprite.SizeMode.RAW;
        this.spr.spriteFrame = this.sprArr[0].spriteFrame;
        this.curFrameIdx = -1;
    }

    public get IsPlaying() {
        return this.curFrameIdx >= 0;
    }

    public set IsPlaying(bo: boolean) {
        if (bo == (this.curFrameIdx >= 0)) {
            return;
        }
        if (bo) {
            this.curFrameIdx = -1;
            this.spr.spriteFrame = this.sprArr[0].spriteFrame;
        } else {
            this.curFrameIdx = 0;
            this.spr.spriteFrame = this.sprArr[0].spriteFrame;
            this.frameLeftTimeInSec = this.frameTimeInSec;
        }
    }

    update(dt) {
        if (this.curFrameIdx < 0) {
            return;
        }
        this.frameLeftTimeInSec -= dt;
        if (this.frameLeftTimeInSec <= 0) {
            this.curFrameIdx++;
            if (this.curFrameIdx >= this.sprArr.length) {
                this.curFrameIdx = -1;
                this.spr.spriteFrame = this.sprArr[0].spriteFrame;
            }else{
                this.spr.spriteFrame = this.sprArr[this.curFrameIdx].spriteFrame;
                this.frameLeftTimeInSec = this.frameTimeInSec;
            }
        }   
    }
}
