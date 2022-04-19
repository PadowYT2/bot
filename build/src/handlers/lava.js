"use strict";var __importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};const erela_js_1=require("erela.js"),erela_js_spotify_1=__importDefault(require("erela.js-spotify")),config_1=__importDefault(require("../../config")),{lava:{nodes:nodes,spotify:{clientID:clientID,clientSecret:clientSecret}}}=config_1.default,bot_1=require("../bot");module.exports=e=>new erela_js_1.Manager({nodes:nodes,plugins:[new erela_js_spotify_1.default({clientID:clientID,clientSecret:clientSecret})],defaultSearchPlatform:"youtube",send(t,n){e.guilds.cache.get(t)?.shard.send(n)}}).on("trackError",((t,{title:n},r)=>{e.channels.cache.get(t.textChannel)?.send(`An error occured when trying to play \`${n}\`: ${r.exception?.cause||r.error}`).catch((()=>null))})).on("trackStuck",((t,{title:n},r)=>{e.channels.cache.get(t.textChannel)?.send(`\`${n}\` got stuck.`).catch((()=>null))})).on("nodeConnect",(({options:e})=>console.log(`${bot_1.shard} Lava ${e.host}:${e.port} connected.`))).on("nodeError",(({options:e},t)=>console.log(`${bot_1.shard} Lava ${e.host}:${e.port} had an error: ${t.message}`))).on("trackStart",(async(t,n)=>{const r=e.channels.cache.get(t.voiceChannel),c=e.channels.cache.get(t.textChannel);if(!r?.members.filter((t=>t.user.id!=e.user.id)).size)return t.destroy(),c?.send("Все участники покинули голосовой канал. Останавливаю плеер.").catch((()=>null));c?.send(`Играю:\n\`${n.title}\``).catch((()=>null))})).on("queueEnd",(async t=>{e.channels.cache.get(t.textChannel)?.send("Очередь пуста. Останавливаю плеер.").catch((()=>null)),t.destroy()})).init(e.user.id);