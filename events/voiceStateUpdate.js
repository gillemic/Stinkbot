// const { VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
	name: 'voiceStateUpdate',
	execute(oldState, newState) {
		// something
		const member = newState.member;
		const oldChannel = oldState.channel;
		const newChannel = newState.channel;

		// console.log(`${member.displayName} joined the voice channel ${channel}`);
		// member left
		if (!newChannel) {
			console.log(`${member.displayName} left the voice channel ${oldChannel.name}`);
		}

		if (!oldChannel) {
			console.log(`${member.displayName} joined the voice channel ${newChannel.name}`);
		}

		if (newState.mute) {
			console.log(`${member.displayName} is muted`);
		}
	},
};