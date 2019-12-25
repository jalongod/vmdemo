const node = `<div id="com" testa="testa">
<input type="text" id="com-input" v-model="ivalue" />
<p id="com-show">{ivalue}</p>
<input type="button" value="clear" id="com-button" vclick="onClickClear"/></div>`;

export default {
    nsrc:node.replace(/[\r\n]/g,""),
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
        }
    }
};
// oninput="onInputChange()"
