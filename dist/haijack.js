(()=>{var t={344:t=>{let e="",n={},a={},o=5e3,i=[200];function s({api:t,data:i,header:s,dataType:c}){if(!t)return wx.showToast({title:"接口配置异常",icon:"none"}),console.warn("接口配置异常： 没有传api进来！"),!1;i&&"object"==typeof i||(i={}),s&&"object"==typeof s||(s={});let r={url:t,data:i,header:s,timeout:o,dataType:c};if(t.match(/^http(s?):\/\//g))r.isExLink=!0;else{if(!n.hasOwnProperty(t))return wx.showToast({title:"接口配置异常",icon:"none"}),console.warn(`接口配置异常： ${t} 没找到`),!1;r.url=n[t],r.url.match(/^http(s?):\/\//g)?r.isExLink=!0:(r.url=e+r.url,r.isExLink=!1)}return r.url.match(/^http(s?):\/\//g)?("function"==typeof this.interceptors.request&&(this.isExLink||(r=this.interceptors.request(r))),r.header={...a,...r.header},r):(wx.showToast({title:"接口异常",icon:"none"}),console.warn(`接口链接不正确: url ${r.url}`),!1)}function c(t,e){return"function"==typeof this.interceptors.response&&(t=this.interceptors.response(t,e)),t}t.exports=class{constructor({baseUrl:t,timeout:s,header:c,apiMap:r,ignoreCode:l}){e=t||e,a=c||a,o=s||o,n=r||n,i=l||i;let h={request:{use:t=>{let n=/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;if("function"==typeof t)h.request=a=>n.exec(e)[0]==n.exec(a.url)[0]?t(a):a;else if("object"==typeof t){let e={};for(const a in t){let o=n.exec(a)[0];e[o]=t[a]}h.request=t=>{let a=n.exec(t.url)[0];if(!e.hasOwnProperty(a))return t;if("function"==typeof e[a])try{return e[a](t)}catch(e){return console.error("前处理出错了  自己检查一下",e),t}}}}},response:{use:t=>{let n=/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;if("function"==typeof t)h.response=(a,o)=>n.exec(e)[0]==n.exec(o.url)[0]?t(a):a;else{let e={};for(const a in t){let o=n.exec(a)[0];e[o]=t[a]}h.response=(t,a)=>{let o=n.exec(a.url)[0];if(!e.hasOwnProperty(o))return t;if("function"==typeof e[o])try{return e[o](t)}catch(e){return console.log(e),t}}}}}};this.interceptors=h}post=async function({api:t,data:e,header:n,dataType:a="json",callback:o,loading:r=!0}){let l=s.call(this,{api:t,data:e,header:n}),h={},p={data:e,header:n,dataType:a,callback:o};if(!l)return!1;r&&wx.showLoading({title:"加载中",mask:!0}),p={data:e,header:n,dataType:a,callback:o,...l},h=await function(t){return new Promise(((e,n)=>{wx.request({...t,method:"POST",success:t=>{i.includes(t.statusCode)?e(t.data):(wx.showToast({title:"客官别急，网络掉线了！"}),n())},fail:t=>{try{wx.hideLoading()}catch(t){}wx.showToast({title:"客官别急，网络掉线了！"}),n()}})}))}(p);let m=c.call(this,h,p);try{wx.hideLoading()}catch(t){}return"function"==typeof o&&o(m),m};get=async function({api:t,data:e,header:n,dataType:a="json",callback:i,loading:r=!0}){let l=s.call(this,{api:t,data:e,header:n,dataType:a}),h={},p={data:e,header:n,dataType:a,callback:i};if(!l)return!1;r&&wx.showLoading({title:"加载中",mask:!0}),p={data:e,header:n,dataType:a,callback:i,...l},h=await function(t){return new Promise(((e,n)=>{wx.request({...t,method:"GET",timeout:o,success:t=>{e(t.data)},fail:t=>{console.error(t);try{wx.hideLoading()}catch(t){}n()}})}))}(p);let m=c.call(this,h,p);try{wx.hideLoading()}catch(t){}return"function"==typeof i&&i(m),m}}},826:t=>{Proxy=new Proxy(Proxy,{construct:function(t,e){!e[0]&&(e[0]={});const n=new t(...e);return n[Symbol.toStringTag]?e[0]:(Object.prototype.toString.call(n).slice(1,-1).split(" ")[1],n)}});const e=t=>({"[object Boolean]":"boolean","[object Number]":"number","[object String]":"string","[object Function]":"function","[object Array]":"array","[object Date]":"date","[object RegExp]":"regExp","[object Undefined]":"undefined","[object Null]":"null","[object Object]":"object"}[Object.prototype.toString.call(t)]);t.exports=class{setAction;constructor(t,e){this.setAction=e,this.createProxy(t)}createProxy(t,n){if(n||(n=""),!t._proxy){t._proxy=!0;for(let a in t){let o=e(t),i="array"==o?`${n}[${a}]`:`${n}.${a}`;["object","array"].includes(e(t[a]))&&null!=t[a]&&null!=t[a]?""==n?this.defineBasicReactive(t,a,t[a],i):(o=e(t[a]),"array"==o?this.defineBasicReactive(t,a,t[a],i):this.defineObjectReactive(t,a,t[a],i)):"_proxy"!=a&&this.defineBasicReactive(t,a,t[a],i)}}}defineObjectReactive(t,n,a,o){o=o.replace(/^\./g,""),this.createProxy(a,`${o}`),t[n]=new Proxy(a,{set:(t,n,a,i)=>{let s=t[n];Reflect.set(t,n,a,i);let c=a;if("length"!==n&&"_proxy"!==n.toString()){let i=`${o}.${n.toString()}`;this.setAction(i,c,s),["object","array"].includes(e(a))&&this.defineObjectReactive(t,n.toString(),t[n.toString()],o+"."+n.toString())}return!0}})}defineBasicReactive(t,n,a,o){o=o.replace(/^\./g,""),Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:()=>a,set:i=>{if(a===i)return;let s=a,c=i;a=i,this.setAction(o,c,s),["object","array"].includes(e(a))&&!a._proxy&&(delete t[n],t[n]=i,"array"==e(a)&&this.defineBasicReactive(t,n,t[n],o),"object"==e(a)&&this.defineObjectReactive(t,n,t[n],o))}}),["object","array"].includes(e(a))&&this.createProxy(a,o)}}},233:(t,e,n)=>{const a=n(826),o=n(891),i=Page,s=Component,c={},r={};let l={},h={},p={},m={},d={},u={};function f(){if(this._lisentEventActive={},this.$on=function(t,e){this._lisentEventActive[t]=e},"page"==this.type&&(l&&(this._store=l.getters||{},this.$store=l),h&&(this.$axios=h),m&&(this._config=m),this.$util=p,d&&(this.$i18n=d,this.setData({_t:d._t}))),"component"==this.type){l&&(this._store=l.getters||{},this.$store=l),h&&(this.$axios=h),m&&(this._config=m),this.$util=p;let t=this.selectOwnerComponent();this.$emit=function(e,n){t._lisentEventActive.hasOwnProperty(e)&&t._lisentEventActive[e].call(t,n)}}}function y(t){if(!t.hasOwnProperty("name"))return;let e=this.selectOwnerComponent(),n=`${e.__wxExparserNodeId__}#component_${t.name}`;this.component_count_key=n,r.hasOwnProperty(n)||(r[n]=0),this.component_path=`${n}${this.__wxExparserNodeId__}#`,e.hasOwnProperty("_refs")||(e._refs={}),1==r[n]&&e._refs[t.name].component_path==this.component_path||r[n]>1&&e._refs[t.name].findIndex((t=>t.component_path==this.component_path))>-1||(r[n]>0?1==r[n]?(e.setData({[`com_data.${t.name}`]:[e._refs[t.name].data,this.data]}),e._refs[t.name]=[e._refs[t.name],this]):(e._refs[t.name].push(this),e.data.com_data[t.name].push(this.data),e.setData({[`com_data.${t.name}`]:e.data.com_data[t.name]})):(e._refs[t.name]=this,e.setData({[`com_data.${t.name}`]:this.data})),r[n]++)}t.exports=class{constructor({store:t,axios:e,util:n,config:w,i18n:g,globalMixin:x}){var b;l=t||!1,h=e||!1,l&&(l.component_stack=c),p=Object.assign(o,n),m=w||!1,d=g||!1,d&&(d.component_stack=c),u=x||!1,function(){const t=getApp();l&&(t._store=l.getters||{},t.$store=l),h&&(t.$axios=h),m&&(t._config=m),t.$util=p}(),b=this,Page=t=>{t.haijack=b,t.hasOwnProperty("methods")||(t.methods={}),t.hasOwnProperty("computed")||(t.computed={}),t.hasOwnProperty("watch")||(t.watch={}),async function(t){if(u&&(t.hasOwnProperty("mixins")?t.mixins.unshift(u):t.mixins=[u]),t.hasOwnProperty("mixins")){let e={},n={},a={},o={};for(let i=0;i<t.mixins.length;i++)Object.assign(e,t.mixins[i].data?t.mixins[i].data:{}),Object.assign(n,t.mixins[i].methods?t.mixins[i].methods:{}),Object.assign(a,t.mixins[i].computed?t.mixins[i].computed:{}),Object.assign(o,t.mixins[i].watch?t.mixins[i].watch:{});Object.assign(e,t.data),Object.assign(n,t.methods),Object.assign(a,t.computed),Object.assign(o,t.watch),t.data=e,t.methods=n,t.computed=a,t.watch=o}else t.mixins=[]}(t),function(t){if(t.hasOwnProperty("watch")){t.deepWatchName=[];for(let e in t.watch)"object"==typeof t.watch[e]?"function"==typeof t.watch[e].handler?(t.watch[e]=t.watch[e].handler,t.deepWatchName.push(e)):delete t.watch[e]:"function"==typeof t.watch[e]||delete t.watch[e]}}(t),async function(t){Object.keys(t.methods).forEach((e=>{let n=t.methods[e];t.methods[e]=function(...t){1==t.length&&t[0].hasOwnProperty("type")?n.call(this,t[0],{data:t[0].currentTarget.dataset,detail:t[0].detail}):n.call(this,...t)}})),Object.assign(t,t.methods)}(t),async function(t){let e={},n=/(this.data.|this._store.)[\w|.|$]*/g;Object.keys(t.computed).forEach((a=>{if(t.data.hasOwnProperty(a))return console.warn(`有相同名字的属性 ${a},已在data中声明，无法用于计算属性`),void delete t.computed[a];t.computed[a].toString().replace(/\s+/g,"").match(n).map((t=>t.replace(/(this.data.|this._store.)/,"").match(/\w+/)[0])).forEach((t=>{e.hasOwnProperty(t)||(e[t]=[]),e[t].push(`_get_${a}`)})),t[`_get_${a}`]=function(){this.setData({[a]:t.computed[a].call(this)})}})),t.computed_obj=e}(t),async function(t){let e=t.onLoad;t.onLoad=async function(...n){this.component_path=this.__wxExparserNodeId__+"#",c[this.component_path]=this,this.type="page",f.call(this),t.hasOwnProperty("computed")&&Object.keys(t.computed).forEach((t=>{this[`_get_${t}`]()})),new a(this.data,((e,n,a)=>{if(t.watch){if(t.deepWatchName.length>0)for(let n=0;n<t.deepWatchName.length;n++)if(e.match(`^${t.deepWatchName[n]}.(.|\\[)`)){let i=e.replace(/\[/g,".").replace(/\]/g,"").split("."),s=t.deepWatchName[n].replace(/\[/g,".").replace(/\]/g).split("."),c=this.data;s.forEach((t=>{c=c[t]}));let r=JSON.parse(JSON.stringify(c));function o(t,e,n){return n.length==e?a:(t[i[e]]=o(t[i[e]],e+1,n),t)}r=o(r,s.length,i),t.watch[t.deepWatchName[n]].call(this,c,r)}t.watch[e]&&t.watch[e].call(this,n,a)}t.computed_obj.hasOwnProperty(e)&&t.computed_obj[e].forEach((t=>{this[t]()}))}));for(let t in this.data)"array"==(o=this.data[t],{"[object Boolean]":"boolean","[object Number]":"number","[object String]":"string","[object Function]":"function","[object Array]":"array","[object Date]":"date","[object RegExp]":"regExp","[object Undefined]":"undefined","[object Null]":"null","[object Object]":"object"}[Object.prototype.toString.call(o)])&&this.setData({[t]:this.data[t]});var o;for(let e=0;e<t.mixins.length;e++)t.mixins[e].onLoad&&await t.mixins[e].onLoad.call(this,...n);e&&e.call(this,...n)}}(t),async function(t){let e=t.onUnload;t.onUnload=async function(){delete c[this.component_path];for(let e=0;e<t.mixins.length;e++)t.mixins[e].onShow&&await t.mixins[e].onShow.call(this);e&&e.call(this)}}(t),async function(t){let e=t.onShow;t.onShow=async function(...n){wx.page=this;for(let e=0;e<t.mixins.length;e++)t.mixins[e].onShow&&await t.mixins[e].onShow.call(this);e&&e.call(this)}}(t),async function(t){let e=t.onHide;t.onHide=async function(){for(let e=0;e<t.mixins.length;e++)t.mixins[e].onHide&&await t.mixins[e].onHide.call(this);e&&e.call(this)}}(t),async function(t){let e=t.onReady;t.onReady=async function(){for(let e=0;e<t.mixins.length;e++)t.mixins[e].onReady&&await t.mixins[e].onReady.call(this);e&&e.call(this)}}(t),async function(t){let e=t.onPullDownRefresh;t.onPullDownRefresh=async function(){for(let e=0;e<t.mixins.length;e++)t.mixins[e].onPullDownRefresh&&await t.mixins[e].onPullDownRefresh.call(this);e&&e.call(this)}}(t),async function(t){let e=t.onReachBottom;t.onReachBottom=async function(){for(let e=0;e<t.mixins.length;e++)t.mixins[e].onReachBottom&&await t.mixins[e].onReachBottom.call(this);e&&e.call(this)}}(t),async function(t){let e=t.onShareAppMessage;t.onShareAppMessage=async function(){let n={};for(let e=0;e<t.mixins.length;e++)t.mixins[e].onShareAppMessage&&(n=await t.mixins[e].onShareAppMessage.call(this));return e&&(n=await e.call(this)),n}}(t),async function(t){let e=t.onShareTimeline;t.onShareTimeline=async function(){let n={};for(let e=0;e<t.mixins.length;e++)t.mixins[e].onShareTimeline&&(n=await t.mixins[e].onShareTimeline.call(this));return e&&(n=await e.call(this)),n}}(t),async function(t){let e=t.onAddToFavorites;t.onAddToFavorites=async function(){for(let e=0;e<t.mixins.length;e++)t.mixins[e].onAddToFavorites&&await t.mixins[e].onAddToFavorites.call(this);e&&e.call(this)}}(t),async function(t){let e=t.onPageScroll;t.onPageScroll=async function(){for(let e=0;e<t.mixins.length;e++)t.mixins[e].onPageScroll&&await t.mixins[e].onPageScroll.call(this);e&&e.call(this)}}(t),async function(t){let e=t.onResize;t.onResize=async function(){for(let e=0;e<t.mixins.length;e++)t.mixins[e].onResize&&await t.mixins[e].onResize.call(this);e&&e.call(this)}}(t),async function(t){let e=t.onTabItemTap;t.onTabItemTap=async function(){for(let e=0;e<t.mixins.length;e++)t.mixins[e].onTabItemTap&&await t.mixins[e].onTabItemTap.call(this);e&&e.call(this)}}(t),i(t)},Component=t=>{if(t.hasOwnProperty("name"))return"page"==t.mode||function(t){t.hasOwnProperty("methods")||(t.methods={}),t.hasOwnProperty("lifetimes")||(t.lifetimes={}),t.lifetimes.hasOwnProperty("attached")||(t.lifetimes.attached=function(){}),t.lifetimes.hasOwnProperty("detached")||(t.lifetimes.detached=function(){}),async function(t){if(u&&(t.hasOwnProperty("mixins")?t.mixins.unshift(u):t.mixins=[u]),t.hasOwnProperty("mixins")){let e={},n={},a={},o={};for(let i=0;i<t.mixins.length;i++)Object.assign(e,t.mixins[i].data?t.mixins[i].data:{}),Object.assign(n,t.mixins[i].methods?t.mixins[i].methods:{}),Object.assign(a,t.mixins[i].computed?t.mixins[i].computed:{}),Object.assign(o,t.mixins[i].watch?t.mixins[i].watch:{});Object.assign(e,t.data),Object.assign(n,t.methods),Object.assign(a,t.computed),Object.assign(o,t.watch),t.data=e,t.methods=n,t.computed=a,t.watch=o}else t.mixins=[]}(t),async function(t){Object.keys(t.methods).forEach((e=>{let n=t.methods[e];t.methods[e]=function(...t){1==t.length&&t[0].hasOwnProperty("type")?n.call(this,t[0],{data:t[0].currentTarget.dataset,detail:t[0].detail}):n.call(this,...t)}}))}(t),async function(t){let e={};if(t.hasOwnProperty("computed")){let n=/(this.data.|this._store.)[\w|.|\$]*/g;Object.keys(t.computed).forEach((a=>{(t.computed[a].toString().replace(/\s+/g,"").match(n)||[]).map((t=>t.replace(/(this.data.|this._store.)/,"").match(/(\w|\$)+/)[0])).forEach((t=>{e.hasOwnProperty(t)||(e[t]=[]),e[t].push(`_get_${a}`)})),t.methods[`_get_${a}`]=function(){this.setData({[a]:t.computed[a].call(this)})}}))}t.computed_obj=e}(t),async function(t){let e=t.lifetimes.attached;t.lifetimes.attached=async function(...n){try{y.call(this,t)}catch(t){console.log(t)}this.computed_obj=t.computed_obj,this.type="component",f.call(this),new a(this.data,((e,n,a)=>{t.watch&&t.watch[e]&&t.watch[e](n,a),t.computed_obj.hasOwnProperty(e)&&t.computed_obj[e].forEach((t=>{this[t]()}))})),t.hasOwnProperty("computed")&&Object.keys(t.computed).forEach((t=>{this[`_get_${t}`]()}));for(let e=0;e<t.mixins.length;e++)t.mixins[e].onLoad&&await t.mixins[e].onLoad.call(this,...n);c[this.component_path]=this,e&&e.call(this,...n)}}(t),async function(t){let e=t.lifetimes.detached;t.lifetimes.detached=function(){delete c[this.component_path],r[this.component_count_key]--,e&&e.call(this)}}(t)}(t),void s(t);s(t)}}getComplex_stack(){return c}}},940:(t,e,n)=>{const a=n(891);let o={};t.exports=class{component_stack;_t;constructor(t){o=t||!1,this.component_stack={};let e=wx.getSystemInfoSync().language,n=wx.getStorageSync("language");n||(n=e,wx.setStorageSync("language",e)),o&&o.hasOwnProperty(n)?this._t=o[n]:this._t={}}setLocale=a.throttle((function(t){if(Object.keys(o).indexOf(t)>-1){wx.setStorageSync("language",t);for(const e in this.component_stack){const n=this.component_stack[e];n.setData({_t:o[t]}),n.hasOwnProperty("computed_obj")&&n.computed_obj.hasOwnProperty("_t")&&n[n.computed_obj._t]()}}}),100)}},960:t=>{const e=getApp();String.prototype.firstUpperCase=function(){return this.replace(/\b(\w)(\w*)/g,(function(t,e,n){return e.toUpperCase()+n}))},t.exports=class{getters;component_stack;constructor(){this.component_stack={},this.getters=e.store.getters,function(){for(const t in e.store.state){let n=t;e.store.getters.hasOwnProperty(n)||(e.store.getters[n]=e.store.state[t]);let a=`set${String(t).firstUpperCase()}`;e.store.mutations.hasOwnProperty(a)||(e.store.mutations[a]=n=>(e.store.state[t]=n,e.store.getters[t]=n,t))}}()}commit(t,n){if(e.store.mutations.hasOwnProperty(t)){let a=e.store.mutations[t](n);for(const t in this.component_stack){const e=this.component_stack[t];e.hasOwnProperty("computed_obj")&&e.computed_obj.hasOwnProperty(a)&&e.computed_obj[a].forEach((t=>{e[t]()}))}}}dispatch(t){try{e.store.actions.hasOwnProperty(t)&&e.store.actions[t](this)}catch(t){console.error(t)}}}},891:t=>{function e(t,e){let n;return function(){var a=this,o=arguments;n&&(clearTimeout(n),n=null),n=setTimeout((function(){t.apply(a,o)}),e)}}function n(t,e){let n=Date.now();return function(){let a=Date.now();if(a-e>n){n=a;var o=this,i=arguments;t.apply(o,i)}}}wx.throttle=n,wx.debounce=e,t.exports={debounce:e,throttle:n}}},e={};function n(a){var o=e[a];if(void 0!==o)return o.exports;var i=e[a]={exports:{}};return t[a](i,i.exports,n),i.exports}(()=>{const t=n(233),e=n(344),a=n(960),o=n(940);wx.haijack=t,wx.Axios=e,wx.Store=a,wx.I18n=o;const i="color:#8c9a82;font-weight:bold;font-size:12px;font-style:oblique;";console.log("%c haijack.js power by lwf",i),console.log("%c learn more at https://github.com/scnu13216/miniprogram-plus",i)})()})();