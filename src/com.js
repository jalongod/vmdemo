const node = `
<div id="com" testa="testa">
    <input ref="input" type="text" id="com-input" w-model="ivalue" />
    <p w-if="showp" id="com-show">{ivalue}</p>
    <input type="button" value="clear" id="com-button" w-click="onClickClear"/>
    <input type="button" value="show" id="com-button" w-click="onClickShow"/>
    <input type="button" value="hide" id="com-button" w-click="onClickHide"/>
</div>
`;

export default {
    nsrc:node.replace(/[\r\n]/g,"".replace(/>\s*</g,"")),
    data(){
      return {
          ivalue:"",
          showp:false,
      };
    },
    methods:{
        onInputChange(){

        },
        onClickClear(){
            this.ivalue = "";
        },
        onClickShow(){
            this.showp = true;
            console.log("输入框中的值为"+this.$ref.input.value);
        },
        onClickHide(){
            this.showp = false;
        }
    }
};
// oninput="onInputChange()"
