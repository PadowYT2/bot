"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.options = void 0;
const builders_1 = require("@discordjs/builders");
exports.options = new builders_1.SlashCommandBuilder()
    .setName("info")
    .setDescription("Посмотреть информацию о боте.")
    .toJSON();
exports.permission = 0;
const os_1 = __importDefault(require("os"));
const platform = `${os_1.default.type()} (${os_1.default.release()})`;
const discord_js_1 = require("discord.js");
let guilds = 0, users = 0, shardCount = 0, memory = 0, memoryUsage = "0MB", memoryGlobal = 0, memoryUsageGlobal = "0MB", nextUpdate = Date.now();
async function run(interaction) {
    if (nextUpdate < Date.now()) {
        nextUpdate = Date.now() + 10 * 1000;
        guilds = await interaction.client.shard.broadcastEval((bot) => bot.guilds.cache.size).then((res) => res.reduce((prev, val) => prev + val, 0));
        users = await interaction.client.shard.broadcastEval((bot) => bot.guilds.cache.map((g) => g.memberCount).reduce((a, b) => a + b)).then((res) => res.reduce((prev, val) => prev + val, 0));
        shardCount = interaction.client.shard.count;
        const { rss, heapUsed } = process.memoryUsage();
        memoryGlobal = rss / 1024 / 1024;
        if (memoryGlobal >= 1024)
            memoryUsageGlobal = (memoryGlobal / 1024).toFixed(2) + "GB";
        else
            memoryUsageGlobal = memoryGlobal.toFixed(2) + "MB";
        memory = heapUsed / 1024 / 1024;
        if (memory >= 1024)
            memoryUsage = (memory / 1024).toFixed(2) + "GB";
        else
            memoryUsage = memory.toFixed(2) + "MB";
    }
    ;
    await interaction.reply({
        embeds: [{
                title: `Информация о ${interaction.client.user.tag}`,
                fields: [{
                        name: "💠 Хост",
                        value: [
                            `**ОС**: \`${platform}\``,
                            `**Библиотека**: \`discord.js v${discord_js_1.version}\``,
                            `**Исп. ОЗУ**: \`${memoryUsageGlobal}\``
                        ].join("\n"),
                        inline: true
                    }, {
                        name: "🌀 Статистика",
                        value: [
                            `**Кол-во серверов**: \`${guilds}\``,
                            `**Кол-во юзеров**: \`${users}\``,
                            `**Кол-во шардов**: \`${shardCount}\``
                        ].join("\n"),
                        inline: true
                    }, {
                        name: `🔷 Этот шард (${interaction.guild.shard.id})`,
                        value: [
                            `**Кол-во серверов**: \`${interaction.client.guilds.cache.size}\``,
                            `**Кол-во юзеров**: \`${interaction.client.guilds.cache.map((g) => g.memberCount).reduce((a, b) => a + b)}\``,
                            `**Исп. ОЗУ**: \`${memoryUsage}\``
                        ].join("\n"),
                        inline: true
                    }, {
                        name: "🌐 Ссылки",
                        value: [
                            `[📥 Пригласить бота](${[
                                "https://discord.com/oauth2/authorize",
                                `?client_id=${interaction.client.user.id}`,
                                "&scope=bot%20applications.commands",
                                "&permissions=1375450033182"
                            ].join("")})`,
                            "[📡 Сервер поддержки](https://discord.gg/AaS4dwVHyA)"
                        ].join("\n")
                    }]
            }]
    });
}
exports.run = run;
;
