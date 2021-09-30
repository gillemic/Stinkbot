const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('boot')
		.setDescription('Sends a boot'),
	execute(interaction) {
		interaction.reply({ files: ['./img/boot.jpg'] });
	},
};