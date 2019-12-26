const node = `
<div id="com" testa="testa">
    <input ref="input" type="text" id="com-input" w-model="ivalue" />
    <p id="com-show">{ivalue}</p>
    <input type="button" value="clear" id="com-button" w-click="onClickClear"/>
    <input type="button" value="show" id="com-button" w-click="onClickShow"/>
</div>
`;

export default {
    nsrc:node.replace(/[\r\n]/g,"".replace(/>\s*</g,"")),
    data(){
      return {
          ivalue:"",
      };
    },
    methods:{
        onInputChange(){

        },
        onClickClear(){
            this.ivalue = "";
        },
        onClickShow(){
            console.log("输入框中的值为"+this.$ref.input.value);
        }
    }
};
// oninput="onInputChange()"
