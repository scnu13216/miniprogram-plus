(()=>{var t={344:t=>{let e="",n={},a={},o=5e3,i=[200],s=!1;function c({api:t,data:i,header:s,dataType:c,name:r}){if(!t)return wx.showToast({title:"接口配置异常",icon:"none"}),console.warn("接口配置异常： 没有传api进来！"),!1;i&&"object"==typeof i||(i={}),s&&"object"==typeof s||(s={});let l={url:t,data:i,header:s,timeout:o,dataType:c,name:r};if(t.match(/^http(s?):\/\//g))l.isExLink=!0;else{if(!n.hasOwnProperty(t))return wx.showToast({title:"接口配置异常",icon:"none"}),console.warn(`接口配置异常： ${t} 没找到`),!1;l.url=n[t],l.url.match(/^http(s?):\/\//g)?l.isExLink=!0:(l.url=e+l.url,l.isExLink=!1)}return l.url.match(/^http(s?):\/\//g)?("function"==typeof this.interceptors.request&&(this.isExLink||(l=this.interceptors.request(l))),l.header={...a,...l.header},l):(wx.showToast({title:"接口异常",icon:"none"}),console.warn(`接口链接不正确: url ${l.url}`),!1)}function r(t,e){return"function"==typeof this.interceptors.response&&(t=this.interceptors.response(t,e)),t}t.exports=class{constructor({baseUrl:t,timeout:c,header:r,apiMap:l,ignoreCode:h,debug:m}){e=t||e,a=r||a,o=c||o,n=l||n,i=h||i,s=Boolean(m);let d={request:{use:t=>{let n=/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;if("function"==typeof t)d.request=a=>{let o=e?n.exec(e)[0]:"",i=n.exec(a.url)[0];return""!=o&&o==i||""==o?t(a):a};else if("object"==typeof t){let e={};for(const a in t){let o=n.exec(a)[0];e[o]=t[a]}d.request=t=>{let a=n.exec(t.url)[0];if(!e.hasOwnProperty(a))return t;if("function"==typeof e[a])try{return e[a](t)}catch(e){return console.error("前处理出错了  自己检查一下",e),t}}}}},response:{use:t=>{let n=/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;if("function"==typeof t)d.response=(a,o)=>{let i=e?n.exec(e)[0]:"";return n.exec(o.url)[0],""!=i&&i==requestHost||""==i?t(a):a};else{let e={};for(const a in t){let o=n.exec(a)[0];e[o]=t[a]}d.response=(t,a)=>{let o=n.exec(a.url)[0];if(!e.hasOwnProperty(o))return t;if("function"==typeof e[o])try{return e[o](t)}catch(e){return console.log(e),t}}}}}};this.interceptors=d}post=async function({api:t,data:e,header:n,dataType:a="json",callback:o,loading:l=!0}){let h=c.call(this,{api:t,data:e,header:n}),m={},d={data:e,header:n,dataType:a,callback:o};if(!h)return!1;l&&wx.showLoading({title:"加载中",mask:!0}),d={data:e,header:n,dataType:a,callback:o,...h},s&&(console.info(`${d.url}`),console.info("↓↓↓↓↓↓↓ request begin ↓↓↓↓↓↓↓"),console.info(d)),m=await function(t){return new Promise(((e,n)=>{wx.request({...t,method:"POST",success:t=>{i.includes(t.statusCode)?e(t.data):(wx.showToast({title:"客官别急，网络掉线了！"}),n())},fail:t=>{try{wx.hideLoading()}catch(t){}wx.showToast({title:"客官别急，网络掉线了！"}),n()}})}))}(d),s&&(console.info(m),console.info("↑↑↑↑↑↑↑ response end ↑↑↑↑↑↑↑"),console.info(`${d.url}`));let p=r.call(this,m,d);try{wx.hideLoading()}catch(t){}return"function"==typeof o&&o(p),p};get=async function({api:t,data:e,header:n,dataType:a="json",callback:i,loading:l=!0}){let h=c.call(this,{api:t,data:e,header:n,dataType:a}),m={},d={data:e,header:n,dataType:a,callback:i};if(!h)return!1;l&&wx.showLoading({title:"加载中",mask:!0}),d={data:e,header:n,dataType:a,callback:i,...h},s&&(console.info(`${d.url}`),console.info("↓↓↓↓↓↓↓ request begin ↓↓↓↓↓↓↓"),console.info(d)),m=await function(t){return new Promise(((e,n)=>{wx.request({...t,method:"GET",timeout:o,success:t=>{e(t.data)},fail:t=>{console.error(t);try{wx.hideLoading()}catch(t){}n()}})}))}(d),s&&(console.info(m),console.info("↑↑↑↑↑↑↑ response end ↑↑↑↑↑↑↑"),console.info(`${d.url}`));let p=r.call(this,m,d);try{wx.hideLoading()}catch(t){}return"function"==typeof i&&i(p),p};uploadFile=async function({api:t,data:e,header:n,name:a="file",callback:i,loading:s=!0}){let l=c.call(this,{api:t,data:e,header:n,name:a}),h={data:e,header:n,name:a,callback:i};if(!l)return!1;s&&wx.showLoading({title:"加载中",mask:!0}),h={data:e,header:n,name:a,callback:i,...l,formData:l.data},await function(t){return new Promise(((e,n)=>{wx.uploadFile({...t,timeout:o,success:t=>{e(t.data)},fail:t=>{console.error(t);try{wx.hideLoading()}catch(t){}n()}})}))}(h);let m=r.call(this,{},h);try{wx.hideLoading()}catch(t){}return"function"==typeof i&&i(m),m};all=function(t){if(!t instanceof Array)throw new Error("你的组合请求不是一个数组");return Promise.all(t)}}},826:t=>{const e=new Proxy(Proxy,{construct:function(t,e){!e[0]&&(e[0]={});const n=new t(...e);return n[Symbol.toStringTag]?e[0]:(Object.prototype.toString.call(n).slice(1,-1).split(" ")[1],n)}}),n=t=>({"[object Boolean]":"boolean","[object Number]":"number","[object String]":"string","[object Function]":"function","[object Array]":"array","[object Date]":"date","[object RegExp]":"regExp","[object Undefined]":"undefined","[object Null]":"null","[object Object]":"object"}[Object.prototype.toString.call(t)]);t.exports=class{setAction;constructor(t,e){this.setAction=e,this.createProxy(t)}createProxy(t,e){if(e||(e=""),!t._proxy){t._proxy=!0;for(let a in t){let o=n(t),i="array"==o?`${e}[${a}]`:`${e}.${a}`;["object","array"].includes(n(t[a]))&&null!=t[a]&&null!=t[a]?""==e?this.defineBasicReactive(t,a,t[a],i):(o=n(t[a]),"array"==o?this.defineBasicReactive(t,a,t[a],i):this.defineObjectReactive(t,a,t[a],i)):"_proxy"!=a&&this.defineBasicReactive(t,a,t[a],i)}}}defineObjectReactive(t,a,o,i){i=i.replace(/^\./g,""),this.createProxy(o,`${i}`),t[a]=new e(o,{set:(t,e,a,o)=>{let s=t[e];Reflect.set(t,e,a,o);let c=a;if("length"!==e&&"_proxy"!==e.toString()){let o=`${i}.${e.toString()}`;this.setAction(o,c,s),["object","array"].includes(n(a))&&this.defineObjectReactive(t,e.toString(),t[e.toString()],i+"."+e.toString())}return!0}})}defineBasicReactive(t,e,a,o){o=o.replace(/^\./g,""),Object.defineProperty(t,e,{enumerable:!0,configurable:!0,get:()=>a,set:i=>{if(a===i)return;let s=a,c=i;a=i,this.setAction(o,c,s),["object","array"].includes(n(a))&&!a._proxy&&(delete t[e],t[e]=i,"array"==n(a)&&this.defineBasicReactive(t,e,t[e],o),"object"==n(a)&&this.defineObjectReactive(t,e,t[e],o))}}),["object","array"].includes(n(a))&&this.createProxy(a,o)}}},233:(t,e,n)=>{const a=n(826),o=n(891),i=Page,s=Component,c={},r={};let l={},h={},m={},d={},p={},f={};function u(){if(this._lisentEventActive={},this.$on=function(t,e){console.log(e),this._lisentEventActive[t]=e},this.$off=function(t,e){},"page"==this.type&&(l&&(this._store=l.getters||{},this.$store=l),h&&(this.$axios=h),d&&(this._config=d),this.$util=m,p&&(this.$i18n=p,this.setData({_t:p._t}))),"component"==this.type){l&&(this._store=l.getters||{},this.$store=l),h&&(this.$axios=h),d&&(this._config=d),this.$util=m;let t=this.selectOwnerComponent();this.$emit=function(e,n){t._lisentEventActive.hasOwnProperty(e)&&t._lisentEventActive[e].call(t,n)}}}function y(t){if(!t.hasOwnProperty("name"))return;let e=this.selectOwnerComponent(),n=`${e.__wxExparserNodeId__}#component_${t.name}`;this.component_count_key=n,r.hasOwnProperty(n)||(r[n]=0),this.component_path=`${n}${this.__wxExparserNodeId__}#`,this.data._com_id=this.component_path,e.hasOwnProperty("_refs")||(e._refs={}),1==r[n]&&e._refs[t.name].component_path==this.component_path||r[n]>1&&e._refs[t.name].findIndex((t=>t.component_path==this.component_path))>-1||(r[n]>0?1==r[n]?(e.setData({[`_com_data.${t.name}`]:[e._refs[t.name].data,this.data]}),e._refs[t.name]=[e._refs[t.name],this]):(e._refs[t.name].push(this),e.data._com_data[t.name].push(this.data),e.setData({[`_com_data.${t.name}`]:e.data._com_data[t.name]})):(e._refs[t.name]=this,e.setData({[`_com_data.${t.name}`]:this.data})),r[n]++)}function g(t){if(!t.hasOwnProperty("name"))return;let e=this.selectOwnerComponent();if(1==r[this.component_count_key])delete e._refs[t.name],e.setData({[`_com_data.${t.name}`]:void 0});else if(r[this.component_count_key]>1){let n=e._refs[t.name].findIndex((t=>t._com_id==this.data._com_id));e._refs[t.name].splice(n,1),1==e._refs[t.name].length&&(e._refs[t.name]=e._refs[t.name][0]);let a=e.data._com_data[t.name].findIndex((t=>t._com_id==this.data._com_id));e.data._com_data[t.name].splice(a,1),1==e.data._com_data[t.name].length&&(e.data._com_data[t.name]=e.data._com_data[t.name][0]),e.setData({[`_com_data.${t.name}`]:e.data._com_data[t.name]})}}t.exports=class{constructor({store:t,axios:e,util:n,config:w,i18n:x,globalMixin:_}){var b;l=t||!1,h=e||!1,l&&(l.component_stack=c),m=Object.assign(o,n),d=w||!1,p=x||!1,p&&(p.component_stack=c),f=_||!1,function(){const t=getApp();l&&(t._store=l.getters||{},t.$store=l),h&&(t.$axios=h),d&&(t._config=d),t.$util=m}(),b=this,Page=t=>{t.haijack=b,t.hasOwnProperty("methods")||(t.methods={}),t.hasOwnProperty("computed")||(t.computed={}),t.hasOwnProperty("watch")||(t.watch={}),async function(t){if(f&&(t.hasOwnProperty("mixins")?t.mixins.unshift(f):t.mixins=[f]),t.hasOwnProperty("mixins")){let e={},n={},a={},o={};for(let i=0;i<t.mixins.length;i++)Object.assign(e,t.mixins[i].data?t.mixins[i].data:{}),Object.assign(n,t.mixins[i].methods?t.mixins[i].methods:{}),Object.assign(a,t.mixins[i].computed?t.mixins[i].computed:{}),Object.assign(o,t.mixins[i].watch?t.mixins[i].watch:{});Object.assign(e,t.data),Object.assign(n,t.methods),Object.assign(a,t.computed),Object.assign(o,t.watch),t.data=e,t.methods=n,t.computed=a,t.watch=o}else t.mixins=[]}(t),function(t){if(t.hasOwnProperty("watch")){t.deepWatchName=[];for(let e in t.watch)"object"==typeof t.watch[e]?"function"==typeof t.watch[e].handler?(t.watch[e]=t.watch[e].handler,t.deepWatchName.push(e)):delete t.watch[e]:"function"==typeof t.watch[e]||delete t.watch[e]}}(t),async function(t){Object.keys(t.methods).forEach((e=>{let n=t.methods[e];t.methods[e]=function(...t){return 1==t.length&&t[0]&&t[0].hasOwnProperty("type")?n.call(this,t[0],{data:t[0].currentTarget.dataset,detail:t[0].detail}):n.call(this,...t)}})),Object.assign(t,t.methods)}(t),async function(t){let e={},n=/(this.data.|this._store.)[\w|.|$]*/g;Object.keys(t.computed).forEach((a=>{if(t.data.hasOwnProperty(a))return console.warn(`有相同名字的属性 ${a},已在data中声明，无法用于计算属性`),void delete t.computed[a];let o=(t.computed[a].toString().replace(/\s+/g,"").match(n)||[]).map((t=>t.replace(/(this.data.|this._store.)/,"").match(/\w+/)[0]));o.length&&o.forEach((t=>{e.hasOwnProperty(t)||(e[t]=[]),e[t].push(`_get_${a}`)})),t[`_get_${a}`]=function(){this.setData({[a]:t.computed[a].call(this)})}})),t.computed_obj=e}(t),async function(t){let e=t.onLoad;t.onLoad=async function(...n){this._query=n[0]||{},this.component_path=this.__wxExparserNodeId__+"#",c[this.component_path]=this,this.type="page",u.call(this),t.hasOwnProperty("computed")&&Object.keys(t.computed).forEach((t=>{this[`_get_${t}`]()})),new a(this.data,((e,n,a)=>{if(t.watch){if(t.deepWatchName.length>0)for(let n=0;n<t.deepWatchName.length;n++)if(e.match(`^${t.deepWatchName[n]}.(.|\\[)`)){let i=e.replace(/\[/g,".").replace(/\]/g,"").split("."),s=t.deepWatchName[n].replace(/\[/g,".").replace(/\]/g).split("."),c=this.data;s.forEach((t=>{c=c[t]}));let r=JSON.parse(JSON.stringify(c));function o(t,e,n){return n.length==e?a:(t[i[e]]=o(t[i[e]],e+1,n),t)}r=o(r,s.length,i),t.watch[t.deepWatchName[n]].call(this,c,r)}t.watch[e]&&t.watch[e].call(this,n,a)}t.computed_obj.hasOwnProperty(e)&&t.computed_obj[e].forEach((t=>{this[t]()}))}));for(let t in this.data)"array"==(o=this.data[t],{"[object Boolean]":"boolean","[object Number]":"number","[object String]":"string","[object Function]":"function","[object Array]":"array","[object Date]":"date","[object RegExp]":"regExp","[object Undefined]":"undefined","[object Null]":"null","[object Object]":"object"}[Object.prototype.toString.call(o)])&&this.setData({[t]:this.data[t]});var o;for(let e=0;e<t.mixins.length;e++)t.mixins[e].onLoad&&await t.mixins[e].onLoad.call(this,...n);e&&e.call(this,...n)}}(t),async function(t){let e=t.onUnload;t.onUnload=async function(){delete c[this.component_path],e&&e.call(this);for(let e=t.mixins.length-1;e>-1;e--)t.mixins[e].onUnload&&await t.mixins[e].onUnload.call(this)}}(t),async function(t){let e=t.onShow;t.onShow=async function(...n){wx.page=this;for(let e=0;e<t.mixins.length;e++)t.mixins[e].onShow&&await t.mixins[e].onShow.call(this);e&&e.call(this)}}(t),async function(t){let e=t.onHide;t.onHide=async function(){e&&e.call(this);for(let e=t.mixins.length-1;e>-1;e--)t.mixins[e].onHide&&await t.mixins[e].onHide.call(this)}}(t),async function(t){let e=t.onReady;t.onReady=async function(){for(let e=0;e<t.mixins.length;e++)t.mixins[e].onReady&&await t.mixins[e].onReady.call(this);e&&e.call(this)}}(t),async function(t){let e=t.onPullDownRefresh;t.onPullDownRefresh=async function(){for(let e=0;e<t.mixins.length;e++)t.mixins[e].onPullDownRefresh&&await t.mixins[e].onPullDownRefresh.call(this);e&&e.call(this)}}(t),async function(t){let e=t.onReachBottom;t.onReachBottom=async function(){for(let e=0;e<t.mixins.length;e++)t.mixins[e].onReachBottom&&await t.mixins[e].onReachBottom.call(this);e&&e.call(this)}}(t),async function(t){let e=t.onShareAppMessage;t.onShareAppMessage=async function(){let n={};for(let e=0;e<t.mixins.length;e++)t.mixins[e].onShareAppMessage&&(n=await t.mixins[e].onShareAppMessage.call(this));return e&&(n=await e.call(this)),n}}(t),async function(t){if("onShareTimeline"in t){let e=t.onShareTimeline;t.onShareTimeline=async function(){let n={};for(let e=0;e<t.mixins.length;e++)t.mixins[e].onShareTimeline&&(n=await t.mixins[e].onShareTimeline.call(this));return e&&(n=await e.call(this)),n}}}(t),async function(t){let e=t.onAddToFavorites;t.onAddToFavorites=async function(){for(let e=0;e<t.mixins.length;e++)t.mixins[e].onAddToFavorites&&await t.mixins[e].onAddToFavorites.call(this);e&&e.call(this)}}(t),async function(t){let e=t.onPageScroll;t.onPageScroll=async function(){for(let e=0;e<t.mixins.length;e++)t.mixins[e].onPageScroll&&await t.mixins[e].onPageScroll.call(this);e&&e.call(this)}}(t),async function(t){let e=t.onResize;t.onResize=async function(){for(let e=0;e<t.mixins.length;e++)t.mixins[e].onResize&&await t.mixins[e].onResize.call(this);e&&e.call(this)}}(t),async function(t){let e=t.onTabItemTap;t.onTabItemTap=async function(){for(let e=0;e<t.mixins.length;e++)t.mixins[e].onTabItemTap&&await t.mixins[e].onTabItemTap.call(this);e&&e.call(this)}}(t),i(t)},Component=t=>{if(t.hasOwnProperty("name"))return"page"==t.mode?void 0:(function(t){t.hasOwnProperty("methods")||(t.methods={}),t.hasOwnProperty("lifetimes")||(t.lifetimes={}),t.lifetimes.hasOwnProperty("created")||(t.lifetimes.created=function(){}),t.lifetimes.hasOwnProperty("attached")||(t.lifetimes.attached=function(){}),t.lifetimes.hasOwnProperty("ready")||(t.lifetimes.ready=function(){}),t.lifetimes.hasOwnProperty("moved")||(t.lifetimes.moved=function(){}),t.lifetimes.hasOwnProperty("detached")||(t.lifetimes.detached=function(){}),t.lifetimes.hasOwnProperty("error")||(t.lifetimes.error=function(){}),t.hasOwnProperty("pageLifetimes")||(t.pageLifetimes={}),t.pageLifetimes.hasOwnProperty("show")||(t.pageLifetimes.show=function(){}),t.pageLifetimes.hasOwnProperty("hide")||(t.pageLifetimes.hide=function(){}),t.pageLifetimes.hasOwnProperty("resize")||(t.pageLifetimes.resize=function(){}),async function(t){if(f&&(t.hasOwnProperty("mixins")?t.mixins.unshift(f):t.mixins=[f]),t.hasOwnProperty("mixins")){let e={},n={},a={},o={};for(let i=0;i<t.mixins.length;i++)Object.assign(e,t.mixins[i].data?t.mixins[i].data:{}),Object.assign(n,t.mixins[i].methods?t.mixins[i].methods:{}),Object.assign(a,t.mixins[i].computed?t.mixins[i].computed:{}),Object.assign(o,t.mixins[i].watch?t.mixins[i].watch:{});Object.assign(e,t.data),Object.assign(n,t.methods),Object.assign(a,t.computed),Object.assign(o,t.watch),t.data=e,t.methods=n,t.computed=a,t.watch=o}else t.mixins=[]}(t),async function(t){Object.keys(t.methods).forEach((e=>{let n=t.methods[e];t.methods[e]=function(...t){return 1==t.length&&t[0]&&t[0].hasOwnProperty("type")?n.call(this,t[0],{data:t[0].currentTarget.dataset,detail:t[0].detail}):n.call(this,...t)}}))}(t),async function(t){let e={};if(t.hasOwnProperty("computed")){let n=/(this.data.|this._store.)[\w|.|\$]*/g;Object.keys(t.computed).forEach((a=>{let o=(t.computed[a].toString().replace(/\s+/g,"").match(n)||[]).map((t=>t.replace(/(this.data.|this._store.)/,"").match(/(\w|\$)+/)[0]));o.length&&o.forEach((t=>{e.hasOwnProperty(t)||(e[t]=[]),e[t].push(`_get_${a}`)})),t.methods[`_get_${a}`]=function(){this.setData({[a]:t.computed[a].call(this)})}}))}t.computed_obj=e}(t),async function(t){let e=t.lifetimes.attached;t.lifetimes.attached=async function(...n){try{y.call(this,t)}catch(t){console.log(t)}this.computed_obj=t.computed_obj,this.type="component",u.call(this),new a(this.data,((e,n,a)=>{t.watch&&t.watch[e]&&t.watch[e].call(this,n,a),t.computed_obj.hasOwnProperty(e)&&t.computed_obj[e].forEach((t=>{this[t]()}))})),t.hasOwnProperty("computed")&&Object.keys(t.computed).forEach((t=>{this[`_get_${t}`]()}));for(let e=0;e<t.mixins.length;e++)t.mixins[e].onLoad&&await t.mixins[e].onLoad.call(this,...n);c[this.component_path]=this,e&&e.call(this,...n)}}(t),async function(t){let e=t.lifetimes.detached;t.lifetimes.detached=async function(){g.call(this,t),delete c[this.component_path],r[this.component_count_key]--,e&&e.call(this);for(let e=0;e<t.mixins.length;e++)t.mixins[e].onUnload&&await t.mixins[e].onUnload.call(this,...args)}}(t)}(t),void s(t));s(t)}}getComplex_stack(){return c}}},940:(t,e,n)=>{const a=n(891);let o={};t.exports=class{component_stack;_t;constructor(t){o=t||!1,this.component_stack={};let e=wx.getSystemInfoSync().language,n=wx.getStorageSync("language");n||(n=e,wx.setStorageSync("language",e)),o&&o.hasOwnProperty(n)?this._t=o[n]:this._t={}}setLocale=a.throttle((function(t){if(Object.keys(o).indexOf(t)>-1){wx.setStorageSync("language",t);for(const e in this.component_stack){const n=this.component_stack[e];n.setData({_t:o[t]}),n.hasOwnProperty("computed_obj")&&n.computed_obj.hasOwnProperty("_t")&&n[n.computed_obj._t]()}}}),100)}},960:t=>{const e=getApp();String.prototype.firstUpperCase=function(){return this.replace(/\b(\w)(\w*)/g,(function(t,e,n){return e.toUpperCase()+n}))},t.exports=class{getters;component_stack;ignoreKey;constructor({ignoreKey:t=[]}){this.component_stack={},this.getters=new Proxy(e.store.getters,{get:function(t,n,a){return"function"==typeof t[n]?t[n](e.store.state):t[n]}}),this.ignoreKey=t,function(t){let{keys:n}=wx.getStorageInfoSync();(Object.keys(e.store.state)||[]).forEach((a=>{t.includes(a)?wx.removeStorageSync(a):n.includes(a)?e.store.state[a]=wx.getStorageSync(a):wx.setStorageSync(a,e.store.state[a])}))}(t),function(){for(const t in e.store.state){let n=t;e.store.getters.hasOwnProperty(n)||(e.store.getters[n]=(e=>{if("object"!=typeof e[t])return e[t];try{return JSON.parse(JSON.stringify(e[t]))}catch(n){return e[t]}})(e.store.state));let a=`set${String(t).firstUpperCase()}`;e.store.mutations.hasOwnProperty(a)||(e.store.mutations[a]=n=>(e.store.state[t]=n,e.store.getters[t]=n,t))}}()}commit(t,n){if(e.store.mutations.hasOwnProperty(t)){let a=e.store.mutations[t](n);this.ignoreKey.includes(a)||wx.setStorageSync(a,n);for(const t in this.component_stack){const e=this.component_stack[t];e.hasOwnProperty("computed_obj")&&e.computed_obj.hasOwnProperty(a)&&e.computed_obj[a].forEach((t=>{e[t]()}))}}}dispatch(t){try{e.store.actions.hasOwnProperty(t)&&e.store.actions[t](this)}catch(t){console.error(t)}}}},891:t=>{function e(t,e){let n;return function(){var a=this,o=arguments;n&&(clearTimeout(n),n=null),n=setTimeout((function(){t.apply(a,o)}),e)}}function n(t,e){let n=Date.now();return function(){let a=Date.now();if(a-e>n){n=a;var o=this,i=arguments;t.apply(o,i)}}}wx.throttle=n,wx.debounce=e,t.exports={debounce:e,throttle:n}}},e={};function n(a){var o=e[a];if(void 0!==o)return o.exports;var i=e[a]={exports:{}};return t[a](i,i.exports,n),i.exports}(()=>{const t=n(233),e=n(344),a=n(960),o=n(940);wx.haijack=t,wx.Axios=e,wx.Store=a,wx.I18n=o,console.log("%c learn more about haijack.js at https://github.com/scnu13216/miniprogram-plus","color:#8c9a82;font-weight:bold;font-size:12px;font-style:oblique;")})()})();