const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bonk')
		.setDescription('Absolutely bonkers'),
	async execute(interaction) {
		await interaction.deferReply();
		await interaction.editReply({ files: ['./img/yowch.mp4'] });
	},
};