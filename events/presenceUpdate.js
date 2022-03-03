module.exports = {
	name: 'presenceUpdate',
	execute(oldPresence, newPresence) {
		// console.log(oldPresence, newPresence);
		if (!newPresence.activities) return false;

		newPresence.forEach(activity => {
			if (activity.type == 'STREAMING') {
				console.log(`${newPresence.user.tag} is streaming at ${activity.url}`);
			}
		});
	},
};