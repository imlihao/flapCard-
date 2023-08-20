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
    BULLET = 2,
    /**
    * 
    */
    FIRE = 2,
    /**
    * 
    */
    BAG = 3
}

export type EffectPair = [E_CardEffectType, number];