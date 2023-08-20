export enum E_CardStatus {
    hidden = 0,
    tempDisplay = 1,
    depature = 2,
}

export enum E_CardEffectType {
    NONE = 0,
    /**
     * 风扇
     */
    FAN = 1,
    /**
     * 
     */
    BEAN = 2,
    /**
    * 
    */
    FART = 3,
    /**
    * 
    */
    BAG = 4
}

/**
 * 卡片效果
 */
export type EffectPair = [E_CardEffectType, number];

export const CardPairSumCnt = 12;

export enum GameType {
    Self = 0,
    Ai = 1,
    Oppent = 1,
}

export class GameDifines {
    static gameType: GameType = GameType.Self;
};