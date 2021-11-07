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
			console.log(`${new Date().toLocaleTimeString()} - ${member.displayName} left the voice channel ${oldChannel.name}`);
		}

		// member joined
		if (!oldChannel) {
			console.log(`${new Date().toLocaleTimeString()} - ${member.displayName} joined the voice channel ${newChannel.name}`);
		}

		// member muted self
		if (newState.mute) {
			console.log(`${new Date().toLocaleTimeString()} - ${member.displayName} is muted`);
		}

		// member started streaming
		if (newState.streaming && !oldState.streaming) {
			console.log(`${new Date().toLocaleTimeString()} - ${member.displayName} started streaming`);
		}

		// member stopped streaming
		if (!newState.streaming && oldState.streaming) {
			console.log(`${new Date().toLocaleTimeString()} - ${member.displayName} stopped streaming`);
		}
	},
};