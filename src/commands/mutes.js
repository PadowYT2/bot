module.exports = {
    name: "mutes",
    permissionRequired: 1,
    opts: [
        {
            name: "add",
            description: "Выдать мьют участнику.",
            type: 1,
            options: [
                {
                    name: "member",
                    description: "Участник, которому надо выдать мьют.",
                    type: 6,
                    required: true
                },
                {
                    name: "time",
                    description: "Время, на которое участнику надо выдать мьют.",
                    type: 3
                },
                {
                    name: "reason",
                    description: "Причина выдачи мьюта.",
                    type: 3
                }
            ]
        },
        {
            name: "remove",
            description: "Убрать мьют в участника.",
            type: 1,
            options: [
                {
                    name: "member",
                    description: "Участник, у которого надо снять мьют.",
                    type: 6,
                    required: true
                }
            ]
        }
    ],
    slash: true
};

const { CommandInteraction, MessageEmbed } = require("discord.js");
const { parseTime, getPermissionLevel } = require("../constants/");
const db = require("../database/")();

module.exports.run = async (interaction = new CommandInteraction) => {
    const guilddb = await db.guild(interaction.guild.id);
    const role = interaction.guild.roles.cache.get(guilddb.get().settings.muteRole);
    const member = interaction.guild.members.resolve(interaction.options.getUser("member").id);
    const user = interaction.options.getUser("member").id;
    if (!role) return interaction.reply({ content: "❌ Не удалось найти роль мьюта.", ephemeral: true });

    switch (interaction.options.getSubcommand(true)) {
        case "add":
            if (interaction.guild.me.roles.cache.sort((a, b) => b.position - a.position).first().rawPosition <= role.rawPosition)
                return interaction.reply({ content: "❌ Роль мьюта находится выше моей.", ephemeral: true });
            if (!interaction.guild.me.permissions.has("MANAGE_ROLES"))
                return interaction.reply({ content: "❌ У меня нет права на изменение ролей.", ephemeral: true });
            if (member.user.bot)
                return interaction.reply({ content: "❌ Вы не можете замьютить бота.", ephemeral: true });
            if (getPermissionLevel(interaction.options.getMember("member")) >= 1)
                return interaction.reply({ content: "❌ Вы не можете замьютить этого участника.", ephemeral: true });
            if (guilddb.get().mutes[member.user.id])
                return interaction.reply({ content: "❌ Этот участник уже замьючен.", ephemeral: true });

            let dmsent = false;
            let time = 0;
            if (!interaction.options.getString("time")?.length) time = -1;
            else time = Date.now() + parseTime(interaction.options.getString("time"));

            interaction.options.getMember("member").roles.add(role).then(async () => {
                guilddb.setOnObject("mutes", interaction.options.getMember("member").user.id, time);
            }).catch(async (err) => {
                await interaction.reply({
                    content: "❌ Произошла какая-то ошибка при выдачи роли...",
                    ephemeral: true
                });
                log.error(err.message + err.stack, {
                    title: `[Shard ${interaction.guild.shardId}]`,
                    description: "```\n" + err.message + err.stack + "\n```"
                });
            });

            return await interaction.reply({
                content: `✅ ${member.user.toString()} был успешно замьючен.` +
                    (dmsent ? "\n[__Пользователь был уведомлён в лс__]" : ""),
                ephemeral: true
            });

        case "remove":
            if (!guilddb.get().mutes[member.user.id])
                return interaction.reply({ content: "❌ Этот участник не замьючен.", ephemeral: true });
            if (!interaction.guild.me.permissions.has("MANAGE_ROLES"))
                return interaction.reply({ content: "❌ У меня нет права на изменение ролей.", ephemeral: true });
            if (interaction.guild.me.roles.cache.sort((a, b) => b.position - a.position).first().rawPosition <= role.rawPosition)
                return interaction.reply({ content: "❌ Роль мьюта находится выше моей.", ephemeral: true });

            interaction.options.getMember("member").roles.remove(role).then(async () => {
                guilddb.removeFromObject("mutes", member.user.id);

                return await interaction.reply({
                    content: `✅ ${user.toString()} был успешно размьючен.` +
                        (dmsent ? "\n[__Пользователь был уведомлён в лс__]" : ""),
                    ephemeral: true
                });
            }).catch(async (err) => {
                await interaction.reply({
                    content: "❌ Произошла какая-то ошибка при убирании роли...",
                    ephemeral: true
                });
                log.error(err.message + err.stack, {
                    title: `[Shard ${interaction.guild.shardId}]`,
                    description: "```\n" + err.message + err.stack + "\n```"
                });
            });
            break;
    };
};