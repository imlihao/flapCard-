/**
 * 处理游戏的主要逻辑
 * 翻牌的逻辑
 * 上面的子弹（馒头）
 * 
 * 有两种翻牌模式
 * ai
 * 联网
 * 
 */

import { E_CardStatus } from "./Defines";
import GComCard from "./GComCard";
import { shuffleArray } from "./MathUtil";
import player from "./Player";
import PlayerData from "./PlayerData";
import { LogUtil } from "./logUtil";

const { ccclass, property } = cc._decorator;

/**
 * 管理card的状态
 *  -- 处理flap
 *  -- 更新card状态
 * 
 * 管理游戏状态
 *  -- score变化
 *  -- 胜负
 */
@ccclass
export default class GameManager extends cc.Component {

    static inst: GameManager = null;

    @property(cc.Integer)
    maxPair: number = 0;

    @property(cc.Prefab)
    cardPfb: cc.Prefab = null;
    
    @property(cc.Node)
    cardContainer:cc.Node;

    @property(player)
    shibaInuA:player;

    @property(player)
    shibaInuB:player;

    private idArr: number[];

    private cardNodes: cc.Node[];

    private curMovingPlayer: "shibaInuA" | "shibaInuB";

    public switchPlayer() {
        if (this.curMovingPlayer == "shibaInuA") {
            this.curMovingPlayer = "shibaInuB";
        } else {
            this.curMovingPlayer = "shibaInuA";
        }
        LogUtil.logRed("switchPlayer",this.curMovingPlayer);
    }

    start() {
        console.log("GameDataRegistered");
        GameManager.inst = this;
        this.initData();
    }

    /**
     * 生成card的id和顺序
     * @param maxPair 
     */
    public generateIds(maxPair: number) {
        const arr = new Array<number>(maxPair * 2);
        for (let i = 0; i < maxPair; ++i) {
            arr[i] = 1000 + i;
            arr[i + maxPair] = 1000 + i;
        }
        LogUtil.log("generate ids:" + arr.toString());
        //乱序
        this.idArr = shuffleArray<number>(arr);
        LogUtil.log("after shuffleArray:" + arr.toString());
    }

    initData() {
        //初始化拍组
        this.generateIds(this.maxPair);

        this.cardNodes = [];
        for (let i = 0; i < this.idArr.length; ++i) {
            let cardNode = cc.instantiate(this.cardPfb);
            cardNode.getComponent(GComCard).initData(this.idArr[i], i);
            LogUtil.log("instantiate card: " + i + " __ " + this.idArr[i]);
            this.cardNodes.push(cardNode);
            this.cardContainer.addChild(cardNode);
        }

        
        //初始化角色

    }

    depatureCardId:number[] = [];
    depatureIdxs:number[] = [];
    
    lastFlapCard:GComCard;
    
    onCardClk(idx: number, id: number) {
        if(!this.lastFlapCard){
           this.lastFlapCard =  this.cardNodes[idx].getComponent(GComCard);
           this.lastFlapCard.changeStatus(E_CardStatus.tempDisplay);
        }else{
            if(this.lastFlapCard.cardId == id){
                this.lastFlapCard.changeStatus(E_CardStatus.depature);
                this.cardNodes[idx].getComponent(GComCard).changeStatus(E_CardStatus.depature);
                this.depatureCardId.push(this.lastFlapCard.cardId);
                this.depatureIdxs.push(this.lastFlapCard.idx);
            }else{
                this.lastFlapCard.changeStatus(E_CardStatus.hidden);
                this.cardNodes[idx].getComponent(GComCard).changeStatus(E_CardStatus.hidden);
            }
        }
    }

    // update (dt) {}
}
