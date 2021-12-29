module.exports = {
	name: 'resolveVoice',
	resolveVoiceChannel(server) {
		const voiceChannels = server.channels.cache.filter((channel) => { return channel.type === 'GUILD_VOICE'; });

		for (let v = 0; v < voiceChannels.length; v++) {
			const voiceChannel = voiceChannels[v];

			if (voiceChannel?.joinable) {
				return voiceChannel;
			}
		}

		// not found
		return null;
	},
};