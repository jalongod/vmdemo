

class VCom {
    constructor(com) {
        this.$ref = {}
        this.initData(com.data());
        this.initMethods(com.methods);
        this.vDom = this.domStrToVDom(com.nsrc);
        this.dom = this.toRealDom(this.vDom);
    }
    /**
     * 监听dom的交互事件
     * 例如input控件的input事件
     * @param vDom
     */
    addDomListener(vDom){
        if (vDom.type === "input"){
            vDom.dom.addEventListener("input",(e)=>{
                let vkey = vDom.props["w-model"];
                if (vkey){
                    this[vkey] = e.target.value;
                }
            })
        }
    }

    /**
     * 监听data变化
     * w-model
     * @param key
     * @param dom
     * @param cb
     */
    addDataListener(key,dom,cb){
        let that = this;
        if (!that["_"+key])
            that["_"+key]="";
        if (!that["key_listeners"])
            that["key_listeners"]=[]
        that["key_listeners"].push(cb);
        Object.defineProperty(that,key,{
            get:function() {
                return that["_"+key];
            },
            set:function(val){
                if (that["_" + key]!==val){
                    that["_" + key]=val;
                    that[key]=val;
                    setTimeout(()=>{
                        for (let i in that["key_listeners"]){
                            that["key_listeners"][i](dom,val);
                        }
                    },0);
                }
            }
        })
    }

    //组装data
    initData(data){
        if (!data || data.length<=0)return;
        for (let i in data) {
            this[i]=data[i];
        }
    }
    //组装methods
    initMethods(methods){
        if (!methods || methods.length<=0)return;
        for (let i in methods) {
            this[i]=methods[i];
        }
    }
    //根据虚拟dom生成真实dom
    toRealDom(vDom) {
        let dom = document.createElement(vDom.type);
        for (let i in vDom.props) {
            if (i === "w-model"){
                let objstr = vDom.props[i]
                dom.setAttribute("value",this[objstr]);
                this.addDataListener(objstr,dom,(dom1,val)=>{
                    // dom.setAttribute("value",val);
                    dom.value = val;
                });
                continue;
            }
            if (i ==="w-click"){
                let handler = this[vDom.props[i]].bind(this);
                dom.addEventListener("click", handler);
                continue
            }
            if (i === "ref"){
                this.$ref[vDom.props[i]] = dom;
                continue
            }
            dom.setAttribute(i,vDom.props[i],)
        }
        if (vDom.hasOwnProperty("innerValue")){
            dom.innerHTML = vDom["innerValue"];
        }
        if (vDom.hasOwnProperty("innerObj")){
            let objstr = vDom["innerObj"]
            dom.innerHTML = this[objstr];
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

export default VCom;
