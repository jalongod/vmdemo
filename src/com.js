const node = `<div id="com" testa="testa">
<input type="text" id="com-input" v-model="ivalue" oninput="onInputChange()"/>
<p id="com-show">{{ivalue}}</p>
<input type="button" value="clear" id="com-button" vclick="onClickClear"/>
</div>`;

export default {
    src:node.replace(/[\r\n]/g,""),
    data(){
      return {
          ivalue:"1",
      };
    },
    methods:{
        onClickClear(){
            alert("clicked clear");
        }
    }
};
