const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('batman')
		.setDescription('I am batman'),
	execute(interaction) {
		interaction.reply({ files: ['./img/batman.jpg'] });
	},
};