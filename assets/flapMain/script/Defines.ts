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


export enum E_ANIMATION_Player {
    idle = 0,
    fart = 1,
    bean = 2,
    fan = 3,
    bag = 4,
}

export enum E_ANIMATION_Fart {
    normal = 0,
    firstFart = 1,
    SecondFartBlocked = 2,
    SecondFartReturned = 3,
    SecondFartHitted = 4,
}