"use strict";var __importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.run=exports.permission=exports.options=void 0;const discord_js_1=require("discord.js"),builders_1=require("@discordjs/builders"),Util_1=__importDefault(require("../util/Util"));exports.options=(new builders_1.SlashCommandBuilder).setName("eval").setDescription("Evaluate JavaScript.").addStringOption((e=>e.setName("script").setDescription("Script that'd be ran.").setRequired(!0))).toJSON(),exports.permission=4;const run=async interaction=>{await interaction.deferReply();try{const Util=Util_1.default,gdb=Util.database.guild(interaction.guild.id);let evaled=await eval(interaction.options.getString("script"));if("string"!=typeof evaled&&(evaled=require("util").inspect(evaled)),evaled.length>=2e3)return await interaction.editReply("✅");await interaction.editReply({content:`\`\`\`js\n${evaled}\n\`\`\``,components:[(new discord_js_1.MessageActionRow).setComponents([(new discord_js_1.MessageButton).setCustomId("reply:delete").setStyle("DANGER").setEmoji("🗑")])]})}catch(e){let t;t="string"==typeof e?e.replace(/`/g,"`"+String.fromCharCode(8203)):e,await interaction.editReply({content:`\`\`\`fix\n${t}\n\`\`\``,components:[(new discord_js_1.MessageActionRow).setComponents([(new discord_js_1.MessageButton).setCustomId("reply:delete").setStyle("DANGER").setEmoji("🗑")])]})}};exports.run=run;