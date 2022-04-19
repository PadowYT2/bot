"use strict";var __importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.run=exports.permission=exports.options=void 0;const builders_1=require("@discordjs/builders"),database_1=__importDefault(require("../database/"));exports.options=(new builders_1.SlashCommandBuilder).setName("settings").setDescription("Настройки бота на сервере.").addSubcommand((e=>e.setName("get").setDescription("Получить настройки сервера."))).addSubcommand((e=>e.setName("toggle").setDescription("Изменить значение найстройки.").addStringOption((e=>e.setName("setting").setDescription("Настройка, которую надо изменить.").setRequired(!0).setChoices([["Удаление сообщений замьюченых участников.","delMuted"],["Удаление закреплённых сообщений при очистке (/purge).","purgePinned"],["Временные голосовые каналы.","voices"],["Проверка сообщений на вредоносные ссылки.","detectScamLinks"]]))))).addSubcommand((e=>e.setName("muterole").setDescription("Установить роль мьюта.").addRoleOption((e=>e.setName("role").setDescription("Роль.").setRequired(!0))))).addSubcommand((e=>e.setName("setlobby").setDescription("Установить лобби для голосовых каналов.").addChannelOption((e=>e.setName("channel").setDescription("Канал-генератор, в который надо зайти для создания временного канала.").setRequired(!0).addChannelType(2))))).addSubcommand((e=>e.setName("counting").setDescription("Настройки модуля счёта.").addChannelOption((e=>e.setName("channel").setDescription("Текстовый канал в котором пользователи смогут считать циферки.").setRequired(!0).addChannelType(0))))).toJSON(),exports.permission=2;const run=async e=>{const t=e.options.getSubcommand(),n=await database_1.default.settings(e.guild.id),i=await database_1.default.guild(e.guild.id);if("get"==t)await e.reply({embeds:[{title:"Настройки "+e.guild.name,timestamp:Date.now(),fields:[{name:"Удаление закреплённых сообщений",value:n.get().purgePinned?"<:online:887393623845507082> **`Включено`**":"<:dnd:887393623786803270> **`Выключено`**",inline:!0},{name:"Удаление сообщений замьюченых участников",value:n.get().delMuted?"<:online:887393623845507082> **`Включено`**":"<:dnd:887393623786803270> **`Выключено`**",inline:!0},{name:"Роль мьюта",value:n.get().muteRole?`<@&${n.get().muteRole}>`:"**`Не установлена`**"},{name:"Временные голосовые каналы",value:n.get().voices.enabled?"<:online:887393623845507082> **`Включены`**":"<:dnd:887393623786803270> **`Выключены`**",inline:!0},{name:"Лобби-канал",value:n.get().voices.lobby?`<#${n.get().voices.lobby}>`:"**`Не установлен`**",inline:!0},{name:"Проверка сообщений на вредоносные ссылки.",value:n.get().detectScamLinks?"<:online:887393623845507082> **`Включено`**":"<:dnd:887393623786803270> **`Выключено`**",inline:!0}]}]});else if("toggle"==t){let t="";const i=e.options.getString("setting");"delMuted"==i?(n.get().delMuted?(n.set("delMuted",!1),t="**`Удаление сообщений замьюченых участников`** было выключено."):(n.set("delMuted",!0),t="**`Удаление сообщений замьюченых участников`** было включено."),await e.reply({content:t})):"purgePinned"==i?(n.get().purgePinned?(n.set("purgePinned",!1),t="**`Удаление закреплённых сообщений`** было выключено."):(n.set("purgePinned",!0),t="**`Удаление закреплённых сообщений`** было включено."),await e.reply({content:t})):"voices"==i?(n.get().voices.enabled?(n.setOnObject("voices","enabled",!1),t="**`Временные голосовые каналы`** были выключены."):(n.setOnObject("voices","enabled",!0),t="**`Временные голосовые каналы`** были включены."),await e.reply({content:t})):"detectScamLinks"==i&&(n.get().detectScamLinks?(n.set("detectScamLinks",!1),t="**`Проверка сообщений на вредоносные ссылки`** была выключена."):(n.set("detectScamLinks",!0),t="**`Проверка сообщений на вредоносные ссылки`** была включена."),await e.reply({content:t}))}else if("muterole"==t){const t=e.options.getRole("role");n.set("muteRole",t.id),await e.reply({content:"✅ Роль мьюта была установлена."+(e.guild.me.roles.highest.rawPosition<=t.rawPosition?"\n⚠️ Установленная роль находится выше моей. Имейте ввиду, что команда мьюта при таком условии **работать не будет**":"")})}else if("setlobby"==t){let t=e.options.getChannel("channel");n.setOnObject("voices","lobby",t.id),await e.reply({content:`✅ Лобби было установлено. (${t})`})}else if("counting"==t){let t=e.options.getChannel("channel");i.setMultiple({channel:t.id,count:0,user:"",message:`${parseInt(e.id)+1}`}),await e.reply({content:`✅ Канал счёта был установлен. (${t})`})}};exports.run=run;