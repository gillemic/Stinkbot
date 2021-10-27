const statuses = [
	'deez',
	'with fire',
	'Conor stinks',
	'Predator: Proving Grounds',
	'Black Ops II',
	'Realm Royale',
	'Metroid™ Dread',
	'PGA TOUR 2K21',
	'Borderlands 3',
	'Peggle 2',
	'Back 4 Butt',
	'Tannenberg',
	'EDF 5',
	'Gal Gun 2',
	'Worms Battlegrounds',
	'White Boyz Wit Attitude: The Pur$uit of Money',
	'Destiny 3',
	'GTA IV',
	'Bloodborne',
	'Otomedius X',
	'Hello Kitty Online',
	'Barbie Horse Adventures',
	'Nancy Drew: Secret of the Scarlet Hand',
	'AMBER: Journeys Beyond',
	'The Crystal Key',
	'NiBiRu: Age of Secrets',
	'Freddi Fish 4: The Case of the Hogfish Rustlers of Briny Gulch',
];

const { random } = require('../util/random');
const { randomShuffle } = require('../util/shuffle');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		let counter = random(0, statuses.length);

		let shuffledStatuses = randomShuffle(statuses);

		const updateStatus = () => {
			client.user?.setPresence({
				status: 'online',
				activities: [
					{
						name: shuffledStatuses[counter],
					},
				],
			});

			if (++counter >= statuses.length) {
				counter = 0;
				shuffledStatuses = randomShuffle(statuses);
			}

			setTimeout(updateStatus, 1000 * 60 * 15);
		};
		updateStatus();
	},
};