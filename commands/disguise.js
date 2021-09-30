const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disguise')
		.setDescription('Stinkbot whom?'),
	async execute(interaction) {
		const bot = interaction.client.user;

		bot.setUsername('Petebot');
		bot.setAvatar('img/petey.jpg');
		bot.setActivity('Fallout 76', { type: 'STREAMING' });

		interaction.reply({ content: 'No Stinkbot here, no sir', ephemeral: true });
	},
};