const { Client } = require("discord.js");
const handleButton = require("./buttons");
const handleCommand = require("./slash");

module.exports = async (client = new Client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.guild) return;
        if (client.loading) return interaction.reply({
            content: "🌀 Бот ещё запускается, подождите некоторое время...",
            ephemeral: true
        });
        if (interaction.isButton()) return handleButton(interaction);
        if (interaction.isCommand()) return handleCommand(interaction);
    });
};