const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('waa')
		.setDescription('waaAAAAAAAAaaaaa'),
	async execute(interaction) {
		await interaction.deferReply();
		await interaction.editReply({ files: ['./img/waa.mp4'] });
	},
};