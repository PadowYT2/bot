"use strict";var __importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};const database_1=__importDefault(require("../database/"));function updatePresence(e){e.shard.broadcastEval((e=>e.guilds.cache.size)).then((t=>{const a=t.reduce(((e,t)=>e+t),0);e.user.setPresence({status:"idle",activities:[{type:"PLAYING",name:`400? -> | ${a} guilds`}]}),setTimeout((()=>updatePresence(e)),3e5)}))}function checkMutes(e){Promise.all(e.guilds.cache.map((async e=>{if(!e.available)return;const t=await database_1.default.guild(e.id),a=await database_1.default.settings(e.id),{muteRole:s}=a.get(),{mutes:c}=t.get(),i=Object.keys(c).filter((e=>-1!==c[e]&&c[e]<Date.now()));i.length&&await Promise.all(i.map((async a=>{const c=await e.members.fetch(a).catch((()=>null));if(c&&c.manageable&&e.me.permissions.has("MANAGE_ROLES"))return c.roles.cache.has(s)?void await c.roles.remove(s).then((()=>t.removeFromObject("mutes",a))).catch((()=>t.removeFromObject("mutes",a))):t.removeFromObject("mutes",a)})))}))).then((()=>setTimeout((()=>checkMutes(e)),5e3)))}function checkBans(e){Promise.all(e.guilds.cache.map((async e=>{if(!e.available)return;const t=await database_1.default.guild(e.id);let{bans:a}=t.get(),s=Object.keys(a).filter((e=>-1!==a[e]&&a[e]<Date.now()));s.length&&await Promise.all(s.map((async a=>{e.me.permissions.has("BAN_MEMBERS")&&await e.bans.remove(a).then((()=>t.removeFromObject("bans",a))).catch((()=>t.removeFromObject("bans",a)))})))}))).then((()=>setTimeout((()=>checkBans(e)),1e4)))}module.exports=e=>{updatePresence(e),checkMutes(e),checkBans(e)};