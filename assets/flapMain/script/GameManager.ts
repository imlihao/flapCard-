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

import { Deferred } from "./Deferred";
import { E_CardEffectType, E_CardStatus } from "./Defines";
import GCardConfig from "./GCardConfig";
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
    cardContainer: cc.Node;

    @property(player)
    shibaInuA: player;

    @property(player)
    shibaInuB: player;

    @property(cc.Node)
    shibaADis: cc.Node;

    @property(cc.Node)
    shibaBDis: cc.Node;

    @property(GCardConfig)
    config: GCardConfig;

    private idArr: number[];

    private cardNodes: cc.Node[];

    private curMovingPlayer: "shibaInuA" | "shibaInuB";

    public getCurPlayer(): player {
        if (this.curMovingPlayer == "shibaInuA") {
            return this.shibaInuA;
        } else {
            return this.shibaInuB;
        }
    }
    public getOtherPlayer(): player {
        if (this.curMovingPlayer == "shibaInuA") {
            return this.shibaInuB;
        } else {
            return this.shibaInuA;
        }
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
        this.lockClk = false;
    }

    depatureCardId: number[] = [];
    depatureIdxs: number[] = [];

    lastFlapCard: GComCard;
    inComeFlapCard: GComCard;
    lockClk: boolean;
    async onCardClk(idx: number, id: number) {
        this.lockClk = true;
        if (!this.lastFlapCard) {
            this.lastFlapCard = this.cardNodes[idx].getComponent(GComCard);
            this.lastFlapCard.changeStatus(E_CardStatus.tempDisplay);
        } else {
            let inComeCard = this.inComeFlapCard = this.cardNodes[idx].getComponent(GComCard);

            inComeCard.changeStatus(E_CardStatus.tempDisplay);
            await Deferred.wait(600).promise;
            await this.onCardSame();
            await this.changeRound();
        }
        this.lockClk = false;
    }

    async onCardSame() {
        if (this.lastFlapCard.cardId == this.inComeFlapCard.cardId) {
            this.lastFlapCard.changeStatus(E_CardStatus.depature);
            this.inComeFlapCard.changeStatus(E_CardStatus.depature);
            this.depatureCardId.push(this.lastFlapCard.cardId);
            this.depatureIdxs.push(this.lastFlapCard.idx);

            const [cardEffec, param] = this.config.getCardEffect(this.inComeFlapCard.cardId);
            LogUtil.log(`${this.curMovingPlayer}: card:${this.inComeFlapCard.cardId},Effect:${E_CardEffectType[cardEffec]},${param}`)
            const curPlayer = this.getCurPlayer();
            switch (cardEffec) {
                case E_CardEffectType.FAN: {
                    await curPlayer.onGetFan();
                } break;
                case E_CardEffectType.BULLET: {
                    await curPlayer.onFire(param);
                } break;
                case E_CardEffectType.BAG: {
                    await curPlayer.onGetFan();
                } break;
                case E_CardEffectType.NONE: {

                } break;
                default:
                    break;
            }

        } else {
            this.lastFlapCard.changeStatus(E_CardStatus.hidden);
            this.inComeFlapCard.changeStatus(E_CardStatus.hidden);
        }
        this.lastFlapCard = null;
        this.inComeFlapCard = null;
        await Deferred.wait(400).promise;
    }

    async SettleRound() {
        const curPlayer = this.getCurPlayer();
        const otherPlayer = this.getOtherPlayer();
        //处理子弹
        //播放子弹动画
        if (otherPlayer.firingCnt > 0) {

        }

        //处理风扇

    }

    async dealBullet() {
        await this.shibaInuA.onFire(2);
    }

    async dealFan() {

    }

    async changeRound() {
        this.switchPlayer();
    }

    public switchPlayer() {
        if (this.curMovingPlayer == "shibaInuA") {
            this.curMovingPlayer = "shibaInuB";
        } else {
            this.curMovingPlayer = "shibaInuA";
        }
        LogUtil.logRed("switchPlayer", this.curMovingPlayer);
        if (this.curMovingPlayer == "shibaInuA") {
            this.shibaADis.active = true;
            this.shibaBDis.active = false;
        } else {
            this.shibaADis.active = false;
            this.shibaBDis.active = true;
        }
    }
}
