/**
 * wue核心类
 */
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

    /**
     * 监听dom的交互事件
     * 例如input控件的input事件
     * @param vDom
     */
    addDomListener(vDom){
        if (vDom.type === "input"){
            vDom.dom.addEventListener("input",(e)=>{
                let vkey = vDom.props["v-model"];
                if (vkey){
                    this.data[vkey] = e.target.value;
                }
            })
        }
    }

    /**
     * 监听data变化
     * v-model
     * @param key
     * @param dom
     * @param cb
     */
    addDataListener(key,dom,cb){
        let that = this;
        if (!that.data["_"+key])
            that.data["_"+key]="";
        if (!that.data["key_listeners"])
            that.data["key_listeners"]=[]
        that.data["key_listeners"].push(cb);
        Object.defineProperty(that.data,key,{
            get:function() {
                return that.data["_"+key];
            },
            set:function(val){
                if (that.data["_" + key]!==val){
                    that.data["_" + key]=val;
                    that.data[key]=val;
                    setTimeout(()=>{
                        for (let i in that.data["key_listeners"]){
                            that.data["key_listeners"][i](dom,val);
                        }
                    },0);
                }
            }
        })
    }
    //根据虚拟dom生成真实dom
    toRealDom(vDom) {
        let dom = document.createElement(vDom.type);
        for (let i in vDom.props) {
            if (i === "v-model"){
                let objstr = vDom.props[i]
                dom.setAttribute("value",this.data[objstr]);
                this.addDataListener(objstr,dom,(dom1,val)=>{
                    // dom.setAttribute("value",val);
                    dom.value = val;
                });
                continue;
            }
            if (i==="vclick"){
                let handler = this.methods[vDom.props["vclick"]].bind(this.data);
                dom.addEventListener("click", handler);
                continue
            }
            dom.setAttribute(i,vDom.props[i],)
        }
        if (vDom.hasOwnProperty("innerValue")){
            dom.innerHTML = vDom["innerValue"];
        }
        if (vDom.hasOwnProperty("innerObj")){
            let objstr = vDom["innerObj"]
            dom.innerHTML = this.data[objstr];
            this.addDataListener(objstr,dom,(dom1,val)=>{
                dom.innerHTML = val;
            });
        }

        for (let i in vDom.children) {
            dom.appendChild(this.toRealDom(vDom.children[i]))
        }
        vDom.dom=dom;
        this.addDomListener(vDom);
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
