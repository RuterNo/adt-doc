(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2e94844a"],{"132b":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("Generic",{attrs:{item:t.item},scopedSlots:t._u([{key:"content",fn:function(){return[n("p",{staticClass:"title is-4"},[t._v(t._s(t.item.name))]),n("p",{staticClass:"subtitle is-6"},[t.item.subtitle?[t._v(" "+t._s(t.item.subtitle)+" ")]:t.meal?[t._v(" Today: "+t._s(t.meal.name)+" ")]:t.stats?[t._v(" happily keeping "+t._s(t.stats.totalRecipes)+" recipes organized ")]:t._e()],2)]},proxy:!0}])})},r=[],s=n("1da1"),a=(n("96cf"),n("c55c")),c=n("fd6b"),o={name:"Mealie",mixins:[a["a"]],props:{item:Object},components:{Generic:c["default"]},data:function(){return{stats:null,meal:null}},created:function(){this.fetchStatus()},methods:{fetchStatus:function(){var t=Object(s["a"])(regeneratorRuntime.mark((function t(){var e;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e={Authorization:"Bearer "+this.item.apikey,Accept:"application/json"},null==this.item.subtitle){t.next=3;break}return t.abrupt("return");case 3:return t.next=5,this.fetch("/api/meal-plans/today/",{headers:e}).catch((function(t){return console.log(t)}));case 5:return this.meal=t.sent,t.next=8,this.fetch("/api/debug/statistics/",{headers:e}).catch((function(t){return console.log(t)}));case 8:this.stats=t.sent;case 9:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}()}},u=o,l=n("2877"),h=Object(l["a"])(u,i,r,!1,null,null,null);e["default"]=h.exports},"25f0":function(t,e,n){"use strict";var i=n("e330"),r=n("5e77").PROPER,s=n("6eeb"),a=n("825a"),c=n("3a9b"),o=n("577e"),u=n("d039"),l=n("ad6d"),h="toString",p=RegExp.prototype,f=p[h],d=i(l),m=u((function(){return"/a/b"!=f.call({source:"a",flags:"b"})})),g=r&&f.name!=h;(m||g)&&s(RegExp.prototype,h,(function(){var t=a(this),e=o(t.source),n=t.flags,i=o(void 0===n&&c(p,t)&&!("flags"in p)?d(t):n);return"/"+e+"/"+i}),{unsafe:!0})},"2ca0":function(t,e,n){"use strict";var i=n("23e7"),r=n("e330"),s=n("06cf").f,a=n("50c4"),c=n("577e"),o=n("5a34"),u=n("1d80"),l=n("ab13"),h=n("c430"),p=r("".startsWith),f=r("".slice),d=Math.min,m=l("startsWith"),g=!h&&!m&&!!function(){var t=s(String.prototype,"startsWith");return t&&!t.writable}();i({target:"String",proto:!0,forced:!g&&!m},{startsWith:function(t){var e=c(u(this));o(t);var n=a(d(arguments.length>1?arguments[1]:void 0,e.length)),i=c(t);return p?p(e,i,n):f(e,n,n+i.length)===i}})},"8a79":function(t,e,n){"use strict";var i=n("23e7"),r=n("e330"),s=n("06cf").f,a=n("50c4"),c=n("577e"),o=n("5a34"),u=n("1d80"),l=n("ab13"),h=n("c430"),p=r("".endsWith),f=r("".slice),d=Math.min,m=l("endsWith"),g=!h&&!m&&!!function(){var t=s(String.prototype,"endsWith");return t&&!t.writable}();i({target:"String",proto:!0,forced:!g&&!m},{endsWith:function(t){var e=c(u(this));o(t);var n=arguments.length>1?arguments[1]:void 0,i=e.length,r=void 0===n?i:d(a(n),i),s=c(t);return p?p(e,s,r):f(e,r-s.length,r)===s}})},c55c:function(t,e,n){"use strict";n("8a79"),n("fb6a"),n("d3b7"),n("25f0"),n("2ca0"),n("99af");e["a"]={props:{proxy:Object},created:function(){this.endpoint=this.item.endpoint||this.item.url,this.endpoint.endsWith("/")&&(this.endpoint=this.endpoint.slice(0,-1))},methods:{fetch:function(t){function e(e,n){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}((function(t,e){var n,i=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],r={};null!==(n=this.proxy)&&void 0!==n&&n.useCredentials&&(r.credentials="include"),void 0!==this.item.useCredentials&&(r.credentials=!0===this.item.useCredentials?"include":"omit"),r=Object.assign(r,e),t.startsWith("/")&&(t=t.slice(1));var s=this.endpoint;return t&&(s="".concat(this.endpoint,"/").concat(t)),fetch(s,r).then((function(t){if(!t.ok)throw new Error("Not 2xx response");return i?t.json():t}))}))}}}}]);
//# sourceMappingURL=chunk-2e94844a.b2dcd9a9.js.map