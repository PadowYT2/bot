"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.run=exports.permission=exports.options=void 0;const builders_1=require("@discordjs/builders");exports.options=(new builders_1.SlashCommandBuilder).setName("mute").setDescription("Замьютить участника.").addUserOption((e=>e.setName("member").setDescription("Участник, которому надо выдать мьют.").setRequired(!0))).addStringOption((e=>e.setName("time").setDescription("Время, на которое участнику надо выдать мьют.").setRequired(!0))).addStringOption((e=>e.setName("reason").setDescription("Причина выдачи мьюта."))).toJSON(),exports.permission=1;const constants_1=require("../constants/"),resolvers_1=require("../constants/resolvers"),run=async e=>{const t=e.options.getMember("member"),r=e.options.getString("time"),s=e.options.getString("reason"),n=(0,resolvers_1.parseTime)(r);if(!e.guild.me.permissions.has("MODERATE_MEMBERS"))return await e.reply({content:"❌ У меня нет прав на модерирование участников.",ephemeral:!0});if(!t.moderatable)return await e.reply({content:"❌ Я не могу модерировать этого участника.",ephemeral:!0});if(!n||n>24192e5)return await e.reply({content:"❌ Некорректное время.",ephemeral:!0});if((0,constants_1.getPermissionLevel)(t)>=(0,constants_1.getPermissionLevel)(e.member))return await e.reply({content:"❌ Вы не можете замьютить этого участника.",ephemeral:!0});await t.disableCommunicationUntil(Date.now()+n,e.user.tag+(s?`: ${s}`:"")).then((async t=>{await e.reply({content:`✅ ${t.user} был успешно замьючен.`,allowedMentions:{parse:[]}})})).catch((async t=>{console.error(t),await e.reply({content:"❌ Произошла ошибка.",ephemeral:!0})}))};exports.run=run;