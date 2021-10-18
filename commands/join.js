const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');

// const connection = joinVoiceChannel({
// 	channelId: channel.id,
// 	guildId: channel.guild.id,
// 	adapterCreator: channel.guild.voiceAdapterCreator,
// });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Make Stinkbot join the Voice Channel'),
	async execute(interaction) {
		const member = interaction.member;
		const channel = interaction.channel;
		const connection = joinVoiceChannel({
			channelId: member.voice.channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});

		interaction.reply({ content: 'connected!', ephemeral: true });
	},
};