const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageDelete,
	execute(message) {
		console.log(`${new Date().toLocaleTimeString()} - Message from ${message.author.username} was deleted`);
	},
};