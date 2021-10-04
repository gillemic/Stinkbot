module.exports = {
	name: 'messageDelete',
	execute(message) {
		console.log(`Message from ${message.author.username} was deleted`);
	},
};