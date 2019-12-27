class VCom {
    //构造函数
    constructor(parentNodeId, com) {
        this.parentDom = document.getElementById(parentNodeId);
        this.$ref = {}
        this.initData(com.data());
        this.initMethods(com.methods);
        this.vDom = this._domStrToVDom(com.nsrc);
        this.recursiveVDom();

    }

    /**
     * 监听dom的交互事件
     * 例如input控件的input事件
     * @param vDom
     */
    addDomListener(vDom) {
        if (vDom.type === "input") {
            vDom.dom.addEventListener("input", (e) => {
                let vkey = vDom.props["w-model"];
                if (vkey) {
                    this[vkey] = e.target.value;
                }
            })
        }
    }

    /**
     * 监听data变化
     * w-model
     * @param key 监听的key值
     * @param cb  回调
     */
    addDataListener(key, cb) {
        let that = this;
        if (!that["_" + key])
            that["_" + key] = "";
        if (!this.dataListeners)
            this.dataListeners = {}; // key :[cb,cb ...]
        if (!this.dataListeners[key])
            this.dataListeners[key] = [];
        this.dataListeners[key].push(cb);
        Object.defineProperty(that, key, {
            get: function () {
                return that["_" + key];
            },
            set: function (val) {
                if (that["_" + key] !== val) {
                    that["_" + key] = val;
                    that[key] = val;
                    setTimeout(() => {
                        for (let i in that.dataListeners[key]) {
                            that.dataListeners[key][i](val);
                        }
                    }, 0);
                }
            }
        })
    }

    //组装data
    initData(data) {
        if (!data || data.length <= 0) return;
        for (let i in data) {
            this[i] = data[i];
        }
    }

    //组装methods
    initMethods(methods) {
        if (!methods || methods.length <= 0) return;
        for (let i in methods) {
            this[i] = methods[i];
        }
    }

    //根据虚拟dom生成真实dom
    vDomToDom(vDom) {
        if (!this._wifOfVDom(vDom)) {
            //从dom树中删除节点
            if (vDom.dom) {
                vDom.dom.parentNode.removeChild(vDom.dom);
                delete (vDom.dom);
            }
            return;
        }
        //创建节点，并添加到dom树,如果dom树中已存在，do nothing
        if (vDom.dom) return;
        let dom = document.createElement(vDom.type);
        for (let i in vDom.props) {
            if (i === "w-model") {
                let objstr = vDom.props[i]
                dom.setAttribute("value", this[objstr]);
                this.addDataListener(objstr, (val) => {
                    dom.value = val;
                });
                continue;
            }
            if (i === "w-click") {
                let handler = this[vDom.props[i]].bind(this);
                dom.addEventListener("click", handler);
                continue;
            }
            if (i === "ref") {
                this.$ref[vDom.props[i]] = dom;
                continue;
            }
            if (i === "w-if") {
                if (!this[vDom.props["w-if"]]) {
                    continue;
                }
            }
            dom.setAttribute(i, vDom.props[i],)
        }
        if (vDom.hasOwnProperty("innerValue")) {
            dom.innerHTML = vDom["innerValue"];
        }
        if (vDom.hasOwnProperty("innerObj")) {
            let objstr = vDom["innerObj"]
            dom.innerHTML = this[objstr];
            this.addDataListener(objstr, (val) => {
                dom.innerHTML = val;
            });
        }
        vDom.dom = dom;
        this.addDomListener(vDom);
        // 在父节点中添加或删除
        if (vDom.parent && vDom.parent.dom) {
            vDom.parent.dom.append(vDom.dom);
        } else {
            // 根节点
            this.parentDom && this.parentDom.appendChild(this.vDom.dom);
        }

    }

    //递归虚拟dom
    recursiveVDom(vDom) {
        if (!vDom) vDom = this.vDom;
        this.vDomToDom(vDom);
        //递归遍历子节点
        for (let i in vDom.children) {
            let child = vDom.children[i];
            this.recursiveVDom(child)
        }
    }


    /**
     * 检查是否需要创建dom
     * @param vDom
     * @returns {boolean|*}
     */
    _wifOfVDom(vDom) {
        if (this.hasOwnProperty(vDom.props["w-if"])) {
            // add listener
            this.addDataListener(vDom.props["w-if"], (val) => {
                this.recursiveVDom(vDom)
            });
            return this[vDom.props["w-if"]];
        }
        return true;

    }

    //将数据转成json格式
    _domStrToVDom(str) {
        if (!str) return "";
        let xmlDoc = (new DOMParser()).parseFromString(str, "application/xml");
        return this._domObjToVDom(null, xmlDoc.documentElement);
    }

    _domObjToVDom(parent, dom) {
        if (!dom) return null;
        let obj = {}
        obj.parent = parent;
        obj.type = dom.nodeName;
        obj.nodeType = dom.nodeType;
        if (dom.hasAttributes) {
            let props = {};
            for (let i = 0; i < dom.attributes.length; i++) {
                let att = dom.attributes.item(i);
                props[att.nodeName] = att.nodeValue;
            }
            obj.props = props;
        }
        if (dom.childNodes && dom.childNodes.length > 0) {
            let children = [];
            for (let i = 0; i < dom.childNodes.length; i++) {
                let child = dom.childNodes.item(i);
                if (child.nodeType === 3) {
                    if (child.nodeValue.indexOf("{") === -1) {
                        obj.innerValue = child.nodeValue;
                    } else {
                        obj.innerObj = child.nodeValue.replace("{", "").replace("}", "");
                    }
                    continue;
                }
                children.push(this._domObjToVDom(obj, child))
            }
            obj.children = children;
        }
        return obj;
    }
}

export default VCom;
