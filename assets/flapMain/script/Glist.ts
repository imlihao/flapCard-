// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GList extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property(cc.Integer)
    rows: number = 0;

    @property(cc.Integer)
    cols: number = 0;

    @property(cc.Integer)
    marginW: number = 0;

    @property(cc.Integer)
    marginH: number = 0;

    start() {

    }

    update(dt) {
        let children = this.node.children;
        if (children.length > 0) {
            const cols = this.cols;
            const rows = this.rows;
            const marginW = this.marginW;
            const marginH = this.marginH;
            const cellWidth = children[0].width;
            const cellHeight = children[0].height;
            children.forEach((child, index) => {
                const row = Math.floor(index / cols);
                const col = index % cols;

                const x = marginW + col * (cellWidth + marginW);
                const y = cellHeight + row * (cellHeight + cellHeight);
                child.x = x + cellWidth / 2;
                child.y = y + cellWidth / 2;
            });
        }
    }
}
