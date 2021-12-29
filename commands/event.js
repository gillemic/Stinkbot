const { SlashCommandBuilder } = require('@discordjs/builders');
const { resolveVoiceChannel } = require('../util/resolveVoice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('event')
		.setDescription('Schedule an event'),
	async execute(interaction) {
		// get event manager
		const guild_events = interaction.guild.scheduledEvents;
		const voice_channels = await interaction.guild.channels.fetch()
			.then(ch => ch.filter(channel => channel.type === 'GUILD_VOICE'))
			.catch(console.error);

		console.log(voice_channels);

		// create event
		guild_events.create({
			name: 'Cum Party',
			scheduledStartTime: `${new Date(2021, 12, 26, 8, 0, 0)}`,
			privacyLevel: 2,
			entityType: 2,
			channel: voice_channels.first(),
		});
	},
};