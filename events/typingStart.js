module.exports = {
	name: 'typingStart',
	execute(typing) {
		if (typing.member?.presence.status === 'offline') {
			console.log(`${typing.member.displayName} started typing in ${typing.channel.name} WHILE OFFLINE`);
		}
		// console.log(`${typing.member.displayName} started typing in ${typing.channel.name}`);
	},
};