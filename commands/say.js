const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('tell stinkbot what to say')
		.addStringOption(option =>
			option.setName('phrase')
				.setDescription('the phrase for Stinkbot to say')
				.setRequired(true)),
	async execute(interaction) {
		const sentence = interaction.options.getString('phrase');

		interaction.reply({ content: 'Sent ur thing bro', ephemeral: true });

		interaction.channel.send(sentence);
	},
};