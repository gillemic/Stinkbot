const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reveal')
		.setDescription('Reveal Petebot for what he really is (must use disguise first)'),
	async execute(interaction) {
		const bot = interaction.client.user;

		bot.setUsername('Stinkbot');
		bot.setAvatar('img/stinkbot.jpg');
		bot.setActivity({ name: 'Conor Sucks ', type: 'STREAMING', url: 'twitch.tv/twistingnutsack' });

		interaction.reply({ content: 'Sike it was me the whole time', ephemeral: true });
	},
};