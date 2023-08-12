
/**
 * 记录玩家的值
 */
export default class PlayerData {
    /**
     * 生命，为0时本局结束
     */
    hp:number

    bulletCount:number

    myFlapCardsIds:number[];

}

export function CreatePlayData(){
    return new PlayerData();
}