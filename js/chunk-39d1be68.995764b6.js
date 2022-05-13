(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-39d1be68"],{"091a":function(t,e,n){},"25f0":function(t,e,n){"use strict";var i=n("e330"),r=n("5e77").PROPER,s=n("6eeb"),a=n("825a"),o=n("3a9b"),c=n("577e"),u=n("d039"),h=n("ad6d"),f="toString",l=RegExp.prototype,d=l[f],p=i(h),v=u((function(){return"/a/b"!=d.call({source:"a",flags:"b"})})),g=r&&d.name!=f;(v||g)&&s(RegExp.prototype,f,(function(){var t=a(this),e=c(t.source),n=t.flags,i=c(void 0===n&&o(l,t)&&!("flags"in l)?p(t):n);return"/"+e+"/"+i}),{unsafe:!0})},"2ca0":function(t,e,n){"use strict";var i=n("23e7"),r=n("e330"),s=n("06cf").f,a=n("50c4"),o=n("577e"),c=n("5a34"),u=n("1d80"),h=n("ab13"),f=n("c430"),l=r("".startsWith),d=r("".slice),p=Math.min,v=h("startsWith"),g=!f&&!v&&!!function(){var t=s(String.prototype,"startsWith");return t&&!t.writable}();i({target:"String",proto:!0,forced:!g&&!v},{startsWith:function(t){var e=o(u(this));c(t);var n=a(p(arguments.length>1?arguments[1]:void 0,e.length)),i=o(t);return l?l(e,i,n):d(e,n,n+i.length)===i}})},7807:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("Generic",{attrs:{item:t.item},scopedSlots:t._u([{key:"indicator",fn:function(){return[n("div",{staticClass:"notifs"},[t.activity>0?n("strong",{staticClass:"notif activity",attrs:{title:"Activity"}},[t._v(" "+t._s(t.activity)+" ")]):t._e(),t.warnings>0?n("strong",{staticClass:"notif warnings",attrs:{title:"Warning"}},[t._v(" "+t._s(t.warnings)+" ")]):t._e(),t.errors>0?n("strong",{staticClass:"notif errors",attrs:{title:"Error"}},[t._v(" "+t._s(t.errors)+" ")]):t._e(),t.serverError?n("strong",{staticClass:"notif errors",attrs:{title:"Connection error to Radarr API, check url and apikey in config.yml"}},[t._v("?")]):t._e()])]},proxy:!0}])})},r=[],s=(n("99af"),n("c55c")),a=n("fd6b"),o="/api/v3",c="/api",u={name:"Radarr",mixins:[s["a"]],props:{item:Object},components:{Generic:a["default"]},data:function(){return{activity:null,warnings:null,errors:null,serverError:!1}},created:function(){this.fetchConfig()},computed:{apiPath:function(){return this.item.legacyApi?c:o}},methods:{fetchConfig:function(){var t=this;this.fetch("".concat(this.apiPath,"/health?apikey=").concat(this.item.apikey)).then((function(e){t.warnings=0,t.errors=0;for(var n=0;n<e.length;n++)"warning"==e[n].type?t.warnings++:"error"==e[n].type&&t.errors++})).catch((function(e){console.error(e),t.serverError=!0})),this.fetch("".concat(this.apiPath,"/queue?apikey=").concat(this.item.apikey)).then((function(e){if(t.activity=0,t.item.legacyApi)for(var n=0;n<e.length;n++)e[n].movie&&t.activity++;else t.activity=e.totalRecords})).catch((function(e){console.error(e),t.serverError=!0}))}}},h=u,f=(n("9b14"),n("2877")),l=Object(f["a"])(h,i,r,!1,null,"3b5d03e8",null);e["default"]=l.exports},"8a79":function(t,e,n){"use strict";var i=n("23e7"),r=n("e330"),s=n("06cf").f,a=n("50c4"),o=n("577e"),c=n("5a34"),u=n("1d80"),h=n("ab13"),f=n("c430"),l=r("".endsWith),d=r("".slice),p=Math.min,v=h("endsWith"),g=!f&&!v&&!!function(){var t=s(String.prototype,"endsWith");return t&&!t.writable}();i({target:"String",proto:!0,forced:!g&&!v},{endsWith:function(t){var e=o(u(this));c(t);var n=arguments.length>1?arguments[1]:void 0,i=e.length,r=void 0===n?i:p(a(n),i),s=o(t);return l?l(e,s,r):d(e,r-s.length,r)===s}})},"9b14":function(t,e,n){"use strict";n("091a")},c55c:function(t,e,n){"use strict";n("8a79"),n("fb6a"),n("d3b7"),n("25f0"),n("2ca0"),n("99af");e["a"]={props:{proxy:Object},created:function(){this.endpoint=this.item.endpoint||this.item.url,this.endpoint.endsWith("/")&&(this.endpoint=this.endpoint.slice(0,-1))},methods:{fetch:function(t){function e(e,n){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}((function(t,e){var n,i=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],r={};null!==(n=this.proxy)&&void 0!==n&&n.useCredentials&&(r.credentials="include"),void 0!==this.item.useCredentials&&(r.credentials=!0===this.item.useCredentials?"include":"omit"),r=Object.assign(r,e),t.startsWith("/")&&(t=t.slice(1));var s=this.endpoint;return t&&(s="".concat(this.endpoint,"/").concat(t)),fetch(s,r).then((function(t){if(!t.ok)throw new Error("Not 2xx response");return i?t.json():t}))}))}}}}]);
//# sourceMappingURL=chunk-39d1be68.995764b6.js.map