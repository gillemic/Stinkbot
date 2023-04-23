const { Events } = require('discord.js');

module.exports = {
	name: Events.PresenceUpdate,
	execute(oldPresence, newPresence) {
		// console.log(oldPresence, newPresence);
		if (!newPresence.activities) return false;

		newPresence.activities.forEach(activity => {
			if (activity.type == 'STREAMING') {
				console.log(`${newPresence.user.tag} is streaming at ${activity.url}`);
			}
		});
	},
};