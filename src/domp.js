
//从xml中获取节点内容

function domObjToJsonObj(dom){
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
            children.push(domObjToJsonObj(child))
        }
        obj.children=children;
    }
    return obj;
}

//将数据转成json格式
function domStrToJsonObject(str){
    if (!str) return "";
    let xmlDoc=(new DOMParser()).parseFromString(str,"application/xml");
    return domObjToJsonObj(xmlDoc.documentElement);
}


export default domStrToJsonObject;
