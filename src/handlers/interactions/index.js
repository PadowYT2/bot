const { Client } = require("discord.js");
const handleButton = require("./buttons");
const handleCommand = require("./slash");

module.exports = (client = new Client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.guild) return;
        if (client.loading) return interaction.reply({
            content: "🌀 Бот ещё запускается, подождите некоторое время...",
            ephemeral: true
        });
        if (interaction.isCommand()) return handleCommand(interaction);
        if (interaction.isButton()) return handleButton(interaction);
    });
};