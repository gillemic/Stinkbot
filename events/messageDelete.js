module.exports = {
	name: 'messageDelete',
	execute(message) {
		console.log(`${new Date().toLocaleTimeString()} - Message from ${message.author.username} was deleted`);
	},
};