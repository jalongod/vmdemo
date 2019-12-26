import VCom from "./vCom";
/**
 * wue核心类
 */
class Wue {
    constructor(parentNodeId,com) {
        let vcom = new VCom(com);
        this.parentDom = document.getElementById(parentNodeId);
        this.parentDom.appendChild(vcom.dom);
    }
}

export default Wue;
