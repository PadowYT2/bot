import { ContextMenuCommandBuilder } from "discord.js";
import { ApplicationCommandType } from "discord-api-types/v10";

export const options = new ContextMenuCommandBuilder()
    .setName("unwtf")
    .setDMPermission(false)
    .setType(ApplicationCommandType.Message)
    .toJSON();

import { ContextMenuCommandInteraction } from "discord.js";

export const run = async (interaction: ContextMenuCommandInteraction) => {
    if (interaction.commandType !== ApplicationCommandType.Message) return;

    const message = await interaction.channel.messages.fetch(interaction.targetId);

    // replace english keyboard layout with cyrillic one
    const text = message.content
        .replace(/q/g, "й")
        .replace(/w/g, "ц")
        .replace(/e/g, "у")
        .replace(/r/g, "к")
        .replace(/t/g, "е")
        .replace(/y/g, "н")
        .replace(/u/g, "г")
        .replace(/i/g, "ш")
        .replace(/o/g, "щ")
        .replace(/p/g, "з")
        .replace(/\[/g, "х")
        .replace(/\]/g, "ъ")
        .replace(/a/g, "ф")
        .replace(/s/g, "ы")
        .replace(/d/g, "в")
        .replace(/f/g, "а")
        .replace(/g/g, "п")
        .replace(/h/g, "р")
        .replace(/j/g, "о")
        .replace(/k/g, "л")
        .replace(/l/g, "д")
        .replace(/;/g, "ж")
        .replace(/"/g, "э")
        .replace(/z/g, "я")
        .replace(/x/g, "ч")
        .replace(/c/g, "с")
        .replace(/v/g, "м")
        .replace(/b/g, "и")
        .replace(/n/g, "т")
        .replace(/m/g, "ь")
        .replace(/,/g, "б")
        .replace(/\./g, "ю")
        .replace(/\//g, ".")

        .replace(/Q/g, "Й")
        .replace(/W/g, "Ц")
        .replace(/E/g, "У")
        .replace(/R/g, "К")
        .replace(/T/g, "Е")
        .replace(/Y/g, "Н")
        .replace(/U/g, "Г")
        .replace(/I/g, "Ш")
        .replace(/O/g, "Щ")
        .replace(/P/g, "З")
        .replace(/\[/g, "Х")
        .replace(/\]/g, "Ъ")
        .replace(/A/g, "Ф")
        .replace(/S/g, "Ы")
        .replace(/D/g, "В")
        .replace(/F/g, "А")
        .replace(/G/g, "П")
        .replace(/H/g, "Р")
        .replace(/J/g, "О")
        .replace(/K/g, "Л")
        .replace(/L/g, "Д")
        .replace(/;/g, "Ж")
        .replace(/"/g, "Э")
        .replace(/Z/g, "Я")
        .replace(/X/g, "Ч")
        .replace(/C/g, "С")
        .replace(/V/g, "М")
        .replace(/B/g, "И")
        .replace(/N/g, "Т")
        .replace(/M/g, "Ь")
        .replace(/\</g, "Б")
        .replace(/\>/g, "Ю")
        .replace(/\?/g, ".");

    await interaction.reply(text);
};