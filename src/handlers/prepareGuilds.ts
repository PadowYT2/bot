const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
import { deleteMessage } from "./utils";
import prettyms from "pretty-ms";
import { Guild, Message, TextChannel } from "discord.js";
import db from "../database/";

export = async (guild: Guild) => {
    const gdb = await db.guild(guild.id);
    const { channel: channelId, message: messageId } = gdb.get();
    let alert: Message | null;

    try {
        const channel = guild.channels.cache.get(channelId);
        if (channel instanceof TextChannel) {
            let messages = await channel.messages.fetch({ limit: 100, after: messageId });
            if (messages.size) {
                alert = await channel.send("💢 Идёт подготовка канала.").catch(() => null);

                const defaultPermissions = channel.permissionOverwrites.cache.get(guild.roles.everyone.id) || { allow: new Set(), deny: new Set() };
                let oldPermission = null;
                if (defaultPermissions.allow.has("SEND_MESSAGES")) oldPermission = true;
                else if (defaultPermissions.deny.has("SEND_MESSAGES")) oldPermission = false;
                if (oldPermission) await channel.permissionOverwrites.edit(guild.roles.everyone, { SEND_MESSAGES: false }).catch(() => null);

                let processing = true, fail = false;
                let preparationStart = Date.now();
                while (processing && !fail) {
                    messages = messages.filter((m) => m.id != alert.id && m.id != messageId);
                    if (!messages.size) processing = false;
                    else {
                        await channel.bulkDelete(messages).catch(() => fail = true);
                        await alert?.edit(`💢 Идёт подготовка канала. **\`[${prettyms(Date.now() - preparationStart)}]\`**`).catch(() => null);
                    };
                    if (processing && !fail) {
                        messages = await channel.messages.fetch({ limit: 100, after: messageId }).catch(() => { fail = true; return null; });
                        if (messages.filter((m) => m.id != alert.id).size) await sleep(3500);
                    };
                };

                if (oldPermission) await channel.permissionOverwrites.edit(guild.roles.everyone, { SEND_MESSAGES: oldPermission }).catch(() => null);
                if (fail) await alert?.edit("❌ Что-то пошло не так при подготовке канала.").catch(() => null);
                else await alert?.edit(`🔰 Канал готов! **\`[${prettyms(Date.now() - preparationStart)}]\`**`)
                    .then(() => setTimeout(() => deleteMessage(alert), 10 * 1000))
                    .catch(() => null);
            };
        };
    } catch (e) {
        console.log(e);
        alert?.edit("❌ Что-то пошло не так при подготовке канала.")
            .then(() => setTimeout(() => deleteMessage(alert), 10 * 1000))
            .catch(() => null);
    };
};