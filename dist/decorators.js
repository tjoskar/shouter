"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _shouter=require("./shouter"),checkChannelAndRouteName=function(t,e){if(!t||!e)throw new Error("You must specify both channel and route")},triggerOnEvent=function(t,e){var n=arguments.length<=2||void 0===arguments[2]?!1:arguments[2];return checkChannelAndRouteName(t,e),function(r,u,o){var s=o.value;_shouter.shouter.on(t,e,s,r,n)}},shoutOnSet=function(t,e){return checkChannelAndRouteName(t,e),function(n,r,u){var o=u.set;u.set=function(){for(var n=arguments.length,r=Array(n),u=0;n>u;u++)r[u]=arguments[u];return _shouter.shouter.trigger.apply(_shouter.shouter,[t,e].concat(r)),o.call.apply(o,[this].concat(r))}}},shoutOnGet=function(t,e){return checkChannelAndRouteName(t,e),function(n,r,u){var o=u.get;u.get=function(){for(var n=arguments.length,r=Array(n),u=0;n>u;u++)r[u]=arguments[u];var s=o.call.apply(o,[this].concat(r));return _shouter.shouter.trigger(t,e,s),s}}};exports.triggerOnEvent=triggerOnEvent,exports.shoutOnSet=shoutOnSet,exports.shoutOnGet=shoutOnGet,exports["default"]={triggerOnEvent:triggerOnEvent,shoutOnSet:shoutOnSet,shoutOnGet:shoutOnGet};
//# sourceMappingURL=decorators.js.map
