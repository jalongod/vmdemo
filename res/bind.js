// 双向绑定demo
var obj = {}
Object.defineProperty(obj,"txt",{
    get:function() {
        return obj;
    },
    set:function(val){
        document.getElementById("txtInput").value = val;
        document.getElementById("txtShow").innerHTML = val;
    }
})
function onInputChange(){
    obj.txt = document.getElementById("txtInput").value
};
function onClickClear(e) {
    obj.txt = ""
}
