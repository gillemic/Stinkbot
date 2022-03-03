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

		// member started streaming
		if (newState.streaming && !oldState.streaming) {
			console.log(`${new Date().toLocaleTimeString()} - ${member.user.tag} has started streaming in ${newState.channel.name}`);
		}

		// member stopped streaming
		if (!newState.streaming && oldState.streaming) {
			console.log(`${new Date().toLocaleTimeString()} - ${member.displayName} stopped streaming`);
		}
	},
};