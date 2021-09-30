const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ooh')
		.setDescription('Across the liiiine... oooooooooooh'),
	async execute(interaction) {
		await interaction.deferReply();
		await interaction.editReply({ files: ['./img/ooh.mp4'] });
	},
};