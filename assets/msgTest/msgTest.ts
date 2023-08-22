// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { HttpClient } from "tsrpc-miniapp";
import { apiClient } from "../../tsrpcSrc/tsrpcHttp";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MsgTest extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;


    start () {
        apiClient.callApi("Send",{
            content: "123"
        }).then(v=>{
            v.res;
        })
    }

}
