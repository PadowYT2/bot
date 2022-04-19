"use strict";var __importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.run=exports.permission=exports.options=void 0;const builders_1=require("@discordjs/builders"),database_1=__importDefault(require("../database"));exports.options=(new builders_1.SlashCommandBuilder).setName("unmute").setDescription("Размьютить участника.").addUserOption((e=>e.setName("member").setDescription("Участник, у которого надо снять мьют.").setRequired(!0))).toJSON(),exports.permission=1;const run=async e=>{const t=await database_1.default.guild(e.guild.id),r=await database_1.default.settings(e.guild.id),s=e.guild.roles.cache.get(r.get().muteRole),a=e.options.getMember("member"),i=e.options.getUser("member");return s?e.guild.me.permissions.has("MANAGE_ROLES")&&a.manageable?e.guild.me.roles.highest.rawPosition<=s.rawPosition?await e.reply({content:"❌ Роль мьюта находится выше моей.",ephemeral:!0}):a.roles.cache.has(s.id)?void await a.roles.remove(s).then((async()=>{t.removeFromObject("mutes",a.user.id),await e.reply({content:`✅ ${i} был успешно размьючен.`})})).catch((async t=>{console.error(t),await e.reply({content:"❌ Произошла ошибка.",ephemeral:!0})})):await e.reply({content:"❌ Этот участник не замьючен.",ephemeral:!0}):await e.reply({content:"❌ У меня нет прав на изменение ролей.",ephemeral:!0}):await e.reply({content:"❌ Не удалось найти роль мьюта.",ephemeral:!0})};exports.run=run;