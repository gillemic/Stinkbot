const { Events } = require('discord.js');

module.exports = {
	name: Events.TypingStart,
	execute(typing) {
		if (typing.member?.presence?.status === 'offline') {
			console.log(`${new Date().toLocaleTimeString()} - ${typing.member.displayName} started typing in ${typing.channel.name} WHILE OFFLINE`);
		}
		// console.log(`${typing.member.displayName} started typing in ${typing.channel.name}`);
	},
};