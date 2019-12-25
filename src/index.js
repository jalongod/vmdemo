import com from "./com";
import Wue from "./wue";

let vKey = 0;
//
// //虚拟dom节点的数据结构
// function vDom(type,props,...children) {
//     return {
//         dom:null,
//         type,
//         props:{
//             ...props,
//             "v-key":++vKey
//         },
//         children:children
//     }
// }

new Wue("app",com);
