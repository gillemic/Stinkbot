const statuses = [
	'deez',
	'with fire',
	'Conor stinks',
	'Predator: Proving Grounds',
	'Black Ops II',
	'Realm Royale',
	'Metroid™ Dread',
];

const { random } = require('../util/random');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		let counter = random(0, statuses.length);

		const updateStatus = () => {
			client.user?.setPresence({
				status: 'online',
				activities: [
					{
						name: statuses[counter],
					},
				],
			});

			if (++counter >= statuses.length) {
				counter = 0;
			}

			setTimeout(updateStatus, 1000 * 60 * 15);
		};
		updateStatus();
	},
};