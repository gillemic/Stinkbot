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

		// member joined
		if (!oldChannel) {
			console.log(`${member.displayName} joined the voice channel ${newChannel.name}`);
		}

		// member muted self
		if (newState.mute) {
			console.log(`${member.displayName} is muted`);
		}

		// member started streaming
		if (newState.streaming && !oldState.streaming) {
			console.log(`${member.displayName} started streaming ${member.presence?.activities[0]?.name}`);
		}

		// member stopped streaming
		if (!newState.streaming && oldState.streaming) {
			console.log(`${member.displayName} stopped streaming ${member.presence?.activities[0]?.name}`);
		}
	},
};