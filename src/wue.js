
class Wue {
    constructor(parentNodeId,com) {
        this.data = com.data();
        this.methods = com.methods;
        this.src = com.nsrc;
        this.vDom = this.domStrToVDom(this.src);
        this.dom = this.toRealDom(this.vDom);
        this.parentDom = document.getElementById(parentNodeId);
        this.parentDom.appendChild(this.dom);
    }
    //根据虚拟dom生成真实dom
    toRealDom(vDom) {
        let dom = document.createElement(vDom.type);
        for (let i in vDom.props) {
            if (i === "v-model"){
                let objstr = vDom.props[i]
                dom.setAttribute("value",this.data[objstr]);
                continue;
            }
            dom.setAttribute(i,vDom.props[i])
        }
        if (vDom.hasOwnProperty("innerValue")){
            dom.innerHTML = vDom["innerValue"];
        }
        if (vDom.hasOwnProperty("innerObj")){
            let objstr = vDom["innerObj"]
            dom.innerHTML = this.data[objstr];
        }
        for (let i in vDom.children) {
            dom.appendChild(this.toRealDom(vDom.children[i]))
        }
        vDom.dom=dom;
        return dom;
    }


    //将数据转成json格式
    domStrToVDom(str){
        if (!str) return "";
        let xmlDoc=(new DOMParser()).parseFromString(str,"application/xml");
        return this._domObjToVDom(xmlDoc.documentElement);
    }

    _domObjToVDom(dom){
        if (!dom)return null;
        let obj = {}
        obj.type=dom.nodeName;
        obj.nodeType = dom.nodeType;
        if(dom.hasAttributes){
            let props={};
            for (let i = 0; i<dom.attributes.length; i++){
                let att = dom.attributes.item(i);
                props[att.nodeName]=att.nodeValue;
            }
            obj.props=props;
        }
        if (dom.childNodes&&dom.childNodes.length>0){
            let children=[];
            for (let i = 0; i<dom.childNodes.length; i++){
                let child = dom.childNodes.item(i);
                if (child.nodeType ===3 ){
                    if (child.nodeValue.indexOf("{")===-1)
                    {
                        obj.innerValue = child.nodeValue;
                    }else{
                        obj.innerObj = child.nodeValue.replace("{","").replace("}","");
                    }
                    continue;
                }
                children.push(this._domObjToVDom(child))
            }
            obj.children=children;
        }
        return obj;
    }
}

export default Wue;
