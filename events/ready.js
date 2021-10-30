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
	'ROTS 2 TOS',
	'Halo Infinite',
	'Aegis Wing',
	'Naruto: Uzumaki Chronicles',
	'1 vs 100',
	'Jimmie Johnson\'s Anything With an Engine',
	'Nudder Shuffle',
	'Little Nicky (2000, GBC)',
	'Antz Extreme Racing',
	'G-Force (2009, PS2)',
	'The Grinch (2000, PS1)',
	'High School Musical: Makin\' the Cut!',
	'PaRappa 2: The Rappening',
	'LEGO Indiana Jones 2: The Adventure Continues',
	'Vampire Rain',
	'Fast and Furious: Showdown',
	'Tony Hawk: Ride',
	'Duke Nukem Forever',
	'The Quiet Man',
	'Doritos Crash Course',
	'Dash of Destruction',
	'CastleMiner Z',
	'AVATOUR',
	'ATV Offroad Fury',
	'Inuyasha: The Secret of the Cursed Mask',
];

const { randomShuffle } = require('../util/shuffle');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		let counter = 0;

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