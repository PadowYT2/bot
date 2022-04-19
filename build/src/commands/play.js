"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.run=exports.permission=exports.options=void 0;const builders_1=require("@discordjs/builders");exports.options=(new builders_1.SlashCommandBuilder).setName("play").setDescription("Слушать музыку.").addStringOption((e=>e.setName("query").setDescription("Трек, который вы хотите послушать.").setRequired(!0))).toJSON(),exports.permission=0;const run=async e=>{const t=e.client,n=e.member;if(!n.voice.channel)return await e.reply({content:"❌ Вы должны находится в голосовом канале.",ephemeral:!0});if(e.guild.me.voice.channel&&n.voice.channel.id!==e.guild.me.voice.channel.id)return await e.reply({content:"❌ Вы должны находится в том же голосовом канале, что и я.",ephemeral:!0});await e.deferReply();const i=await t.manager.search(e.options.getString("query"),e.user);if(!i.tracks.length)return await e.editReply("❌ По вашему запросу не удалось ничего найти.");const r=t.manager.create({guild:e.guildId,voiceChannel:n.voice.channelId,textChannel:e.channelId,selfDeafen:!0});if("CONNECTED"!==r.state&&(r.connect(),r.setVolume(20)),r.queue.totalSize+1>25)return await e.editReply("❌ Размер очереди не может превышать 25 треков.");r.queue.add(i.tracks[0]),await e.editReply(`Трек добавлен в очередь:\n\`${i.tracks[0].title}\``),r.playing||r.paused||r.queue.size&&r.queue.totalSize!==i.tracks.length||r.play()};exports.run=run;