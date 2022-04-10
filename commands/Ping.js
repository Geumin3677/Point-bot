const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('지연 시간을 측정합니다'),

	async execute(interaction, client) {
		await interaction.reply(`${client.ws.ping} ms`);
	},
};