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
    FART = 2,
    /**
    * 
    */
    BAG = 3
}

/**
 * 卡片效果
 */
export type EffectPair = [E_CardEffectType, number];