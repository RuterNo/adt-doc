(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2ce48702"],{"25f0":function(t,n,e){"use strict";var i=e("e330"),r=e("5e77").PROPER,s=e("6eeb"),o=e("825a"),c=e("3a9b"),a=e("577e"),u=e("d039"),f=e("ad6d"),l="toString",d=RegExp.prototype,h=d[l],g=i(f),p=u((function(){return"/a/b"!=h.call({source:"a",flags:"b"})})),v=r&&h.name!=l;(p||v)&&s(RegExp.prototype,l,(function(){var t=o(this),n=a(t.source),e=t.flags,i=a(void 0===e&&c(d,t)&&!("flags"in d)?g(t):e);return"/"+n+"/"+i}),{unsafe:!0})},"2ca0":function(t,n,e){"use strict";var i=e("23e7"),r=e("e330"),s=e("06cf").f,o=e("50c4"),c=e("577e"),a=e("5a34"),u=e("1d80"),f=e("ab13"),l=e("c430"),d=r("".startsWith),h=r("".slice),g=Math.min,p=f("startsWith"),v=!l&&!p&&!!function(){var t=s(String.prototype,"startsWith");return t&&!t.writable}();i({target:"String",proto:!0,forced:!v&&!p},{startsWith:function(t){var n=c(u(this));a(t);var e=o(g(arguments.length>1?arguments[1]:void 0,n.length)),i=c(t);return d?d(n,i,e):h(n,e,e+i.length)===i}})},"8a79":function(t,n,e){"use strict";var i=e("23e7"),r=e("e330"),s=e("06cf").f,o=e("50c4"),c=e("577e"),a=e("5a34"),u=e("1d80"),f=e("ab13"),l=e("c430"),d=r("".endsWith),h=r("".slice),g=Math.min,p=f("endsWith"),v=!l&&!p&&!!function(){var t=s(String.prototype,"endsWith");return t&&!t.writable}();i({target:"String",proto:!0,forced:!v&&!p},{endsWith:function(t){var n=c(u(this));a(t);var e=arguments.length>1?arguments[1]:void 0,i=n.length,r=void 0===e?i:g(o(e),i),s=c(t);return d?d(n,s,r):h(n,r-s.length,r)===s}})},bb90:function(t,n,e){"use strict";e.r(n);var i=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("Generic",{attrs:{item:t.item},scopedSlots:t._u([{key:"indicator",fn:function(){return[e("div",{staticClass:"notifs"},[null!==t.config&&t.config.system.news.unread>0?e("strong",{staticClass:"notif news",attrs:{title:"News"}},[t._v(t._s(t.config.system.news.unread))]):t._e(),null!==t.config&&t.config.main.logs.numWarnings>0?e("strong",{staticClass:"notif warnings",attrs:{title:"Warning"}},[t._v(t._s(t.config.main.logs.numWarnings))]):t._e(),null!==t.config&&t.config.main.logs.numErrors>0?e("strong",{staticClass:"notif errors",attrs:{title:"Error"}},[t._v(t._s(t.config.main.logs.numErrors))]):t._e(),t.serverError?e("strong",{staticClass:"notif errors",attrs:{title:"Connection error to Medusa API, check url and apikey in config.yml"}},[t._v("?")]):t._e()])]},proxy:!0}])})},r=[],s=e("c55c"),o=e("fd6b"),c={name:"Medusa",mixins:[s["a"]],props:{item:Object},components:{Generic:o["default"]},data:function(){return{config:null,serverError:!1}},created:function(){this.fetchConfig()},methods:{fetchConfig:function(){var t=this;this.fetch("/api/v2/config",{headers:{"X-Api-Key":this.item.apikey}}).then((function(n){t.config=n})).catch((function(n){console.log(n),t.serverError=!0}))}}},a=c,u=(e("d293"),e("2877")),f=Object(u["a"])(a,i,r,!1,null,"0ff7f573",null);n["default"]=f.exports},c55c:function(t,n,e){"use strict";e("8a79"),e("fb6a"),e("d3b7"),e("25f0"),e("2ca0"),e("99af");n["a"]={props:{proxy:Object},created:function(){this.endpoint=this.item.endpoint||this.item.url,this.endpoint.endsWith("/")&&(this.endpoint=this.endpoint.slice(0,-1))},methods:{fetch:function(t){function n(n,e){return t.apply(this,arguments)}return n.toString=function(){return t.toString()},n}((function(t,n){var e,i=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],r={};null!==(e=this.proxy)&&void 0!==e&&e.useCredentials&&(r.credentials="include"),void 0!==this.item.useCredentials&&(r.credentials=!0===this.item.useCredentials?"include":"omit"),r=Object.assign(r,n),t.startsWith("/")&&(t=t.slice(1));var s=this.endpoint;return t&&(s="".concat(this.endpoint,"/").concat(t)),fetch(s,r).then((function(t){if(!t.ok)throw new Error("Not 2xx response");return i?t.json():t}))}))}}},d293:function(t,n,e){"use strict";e("d506")},d506:function(t,n,e){}}]);
//# sourceMappingURL=chunk-2ce48702.3ea74b19.js.map