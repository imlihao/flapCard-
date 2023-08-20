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
import { E_CardEffectType, E_CardStatus, GameDifines, GameType } from "./Defines";
import GCardConfig from "./GCardConfig";
import GComCard from "./GComCard";
import { shuffleArray } from "./MathUtil";
import player from "./Player";
import PlayerData from "./PlayerData";
import { LogUtil } from "./logUtil";
import AiCom from "./AICom";

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

    @property(cc.Label)
    debug: cc.Label = null;

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
    config: GCardConfig = null;

    @property(AiCom)
    AICom: AiCom = null;

    @property(cc.Integer)
    roundMaxTimeInSec: number = 0;

    public curRoundLeftTimeInSec: number;

    isStart: boolean = false;

    private idArr: number[];

    private cardNodes: cc.Node[];

    private curMovingPlayer: "shibaInuA" | "shibaInuB";

    depatureCardId: number[] = [];

    depatureIdxs: number[] = [];

    lastFlapCard: GComCard;

    inComeFlapCard: GComCard;

    private lockClk: boolean;

    public WhoAmI: "shibaInuA" | "shibaInuB";

    public WhoIsAi: "shibaInuA" | "shibaInuB";

    public WhoIsMyOpponent: "shibaInuA" | "shibaInuB";


    public get isClkLocked() {
        return this.lockClk || !this.isStart;
    }

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
        this.isStart = false;
        console.log("GameDataRegistered");
        GameManager.inst = this;
        this.initData();
    }

    canIClk(isAi: boolean = false) {
        if (GameDifines.gameType == GameType.Self) {
            return true;
        } else if (GameDifines.gameType == GameType.Ai) {
            if (isAi) {
                return this.curMovingPlayer == this.WhoIsAi;
            } else {
                return this.curMovingPlayer == this.WhoAmI;
            }
        } else {
            return this.curMovingPlayer == this.WhoIsAi;
        }
    }

    initData() {
        this.shibaInuA.name = "shibaInuA";
        this.shibaInuB.name = "shibaInuB";
        if (GameDifines.gameType == GameType.Self) {
            console.error("对手是自己");
        } else if (GameDifines.gameType == GameType.Ai) {
            console.error("对手是AI");
            this.AICom.node.active = true;
            this.AICom.gameMgr = this;
            let ran = Math.random();
            // if (ran > 0.5) {
            this.WhoAmI = "shibaInuA";
            this.WhoIsAi = "shibaInuB";
            this.WhoIsMyOpponent = "shibaInuB";
            // } else {
            //     this.WhoAmI = "shibaInuA";
            //     this.WhoIsAi = "shibaInuB";
            //     this.WhoIsMyOpponent = "shibaInuB";
            // }
            console.log("WhoAmI", this.WhoAmI);
            console.log("WhoIsAi", this.WhoIsAi);
        }

        //初始化拍组
        this.generateIds(this.maxPair);
        this.cardNodes = [];
        for (let i = 0; i < this.idArr.length; ++i) {
            let cardNode = cc.instantiate(this.cardPfb);
            cardNode.getComponent(GComCard).initData(this.idArr[i], i);
            // LogUtil.log("instantiate card: " + i + " __ " + this.idArr[i]);
            this.cardNodes.push(cardNode);
            this.cardContainer.addChild(cardNode);
        }
        this.curMovingPlayer = "shibaInuA";
        this.startGame();
    }

    /**
     * 生成card的id和顺序
     * @param maxPair 
     */
    public generateIds(maxPair: number) {
        const arr = new Array<number>(maxPair * 2);
        for (let i = 0; i < maxPair; ++i) {
            arr[i] = i + 1;
            arr[i + maxPair] = i + 1;
        }
        LogUtil.log("generate ids:" + arr.toString());
        //乱序
        this.idArr = shuffleArray<number>(arr);
        LogUtil.log("after shuffleArray:" + arr.toString());
    }

    public startGame() {
        //初始化角色
        this.lockClk = false;
        this.isStart = true;
        this.curRoundLeftTimeInSec = this.roundMaxTimeInSec;
        if (GameDifines.gameType == GameType.Ai) {
            if (this.curMovingPlayer == this.WhoIsAi) {
                this.AICom.AiMove();
            }
        }
    }

    /**
     * 当前所有可以点击的卡片
     * @returns 
     */
    public getAllCanFlapCard(): GComCard[] {
        let canFlapCards: GComCard[] = [];
        for (let i = 0; i < this.cardNodes.length; ++i) {
            let card = this.cardNodes[i].getComponent(GComCard);
            if (card.status == E_CardStatus.hidden) {
                canFlapCards.push(card);
            }
        }
        if (canFlapCards.length == 0) {
            return null;
        }
        return canFlapCards;
    }

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
            await this.SettleRound();
            await this.changeRound();
        }
        this.lockClk = false;
    }

    async onCardSame() {
        if (this.lastFlapCard.card_compareStr == this.inComeFlapCard.card_compareStr) {
            this.lastFlapCard.changeStatus(E_CardStatus.depature);
            this.inComeFlapCard.changeStatus(E_CardStatus.depature);
            this.depatureCardId.push(this.lastFlapCard.cardId);
            this.depatureIdxs.push(this.lastFlapCard.idx);

            const [cardEffec, param] = this.config.getCardEffect(this.inComeFlapCard.cardId);
            LogUtil.log(`${this.curMovingPlayer}: card:${this.inComeFlapCard.cardId},Effect:${E_CardEffectType[cardEffec]},${param}`)
            const curPlayer = this.getCurPlayer();
            switch (cardEffec) {
                case E_CardEffectType.BEAN: {
                    await curPlayer.onFart(param);
                } break;
                case E_CardEffectType.FART: {
                    await curPlayer.onFart(param);
                } break;
                case E_CardEffectType.BAG: {
                    await curPlayer.onGetFan();
                }
                case E_CardEffectType.FAN: {
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
        const otherFiringCnt = otherPlayer.firingCnt;
        if (otherFiringCnt > 0) {
            if (curPlayer.fanCnt > 0) {
                //这里会有动画同步问题？
                await Promise.all([
                    otherPlayer.onFartFinshed(),
                    curPlayer.onUseFan(otherFiringCnt)]);
            } else if (curPlayer.bagCnt > 0) {
                await Promise.all([
                    otherPlayer.onFartFinshed(),
                    curPlayer.onUseBag()]);
            } else {
                await Promise.all([
                    otherPlayer.onFartFinshed(),
                    curPlayer.onDamage(otherFiringCnt)]);
            }
        } else {
            if (curPlayer.fanCnt > 0) {
                await curPlayer.onWasteFan();
            }
            if (curPlayer.bagCnt > 0) {
                await curPlayer.onWasteBag();
            }
        }
    }

    async FinishGame(winner: player, loser: player) {
        this.isStart = false;
        console.error(`${winner.name}赢了`);
        console.error(`${loser.name}输掉了了比赛`);
        cc.director.loadScene("GLoading", () => {
            console.log("load game scene");
        });
        //TODO: 动画
    }

    async changeRound() {
        if (this.shibaInuA.curHp <= 0 || this.shibaInuB.curHp <= 0) {
            let winner = this.shibaInuA.curHp > 0 ? this.shibaInuA : this.shibaInuB;
            let loser = this.shibaInuA.curHp > 0 ? this.shibaInuB : this.shibaInuA;
            await this.FinishGame(winner, loser);
        } else {
            await Deferred.wait(400).promise;
            this.switchPlayer();
        }
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
        this.curRoundLeftTimeInSec = this.roundMaxTimeInSec;
        if (GameDifines.gameType == GameType.Ai) {
            if (this.curMovingPlayer == this.WhoIsAi) {
                this.AICom.AiMove();
            }
        }
    }

    protected update(dt: number): void {
        if (this.isStart) {
            this.curRoundLeftTimeInSec -= dt;
            if (this.curRoundLeftTimeInSec < 0) {
                this.switchPlayer();
            }
        }

        if (this.debug) {
            if (GameDifines.gameType == GameType.Self) {
                this.debug.string = `
自己对自己
当前回合：${this.curMovingPlayer}
                `
            } else if (GameDifines.gameType == GameType.Ai) {
                let isAi = this.curMovingPlayer == this.WhoIsAi;
                this.debug.string = `
自己对AI
当前回合：${isAi ? "AI" : "我"}
                `
            } else {
                this.debug.string = `
未知
                `
            }
            this.debug.string += `当前回合剩余时间：${this.curRoundLeftTimeInSec.toFixed(2)}`;
        }
    }
}
