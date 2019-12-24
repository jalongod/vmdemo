let vKey = 0;

//虚拟dom节点的数据结构
function vNode(type,props,...children) {
    return {
        dom:null,
        type,
        props:{
            ...props,
            "v-key":++vKey
        },
        children:{
            ...children
        }
    }
}

//根据虚拟dom生成真实dom
function toRealDom(vNode) {
    let dom = document.createElement(vNode.type);
    for (let i in vNode.props) {
        dom.setAttribute(i,vNode.props[i])
    }
    for (let i in vNode.children) {
        dom.appendChild(toRealDom(vNode.children[i]))
    }

    vNode.dom=dom;
    return dom;
}


function mount(parent,vNode){
    return parent.appendChild(toRealDom(vNode))
}

var vRoot = vNode("div",{"id":"root-div-id","class":"root-class","v-text":""})
const app = document.getElementById('app');
mount(app,vRoot,null)
