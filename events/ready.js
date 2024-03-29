const { Events } = require('discord.js');
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
	'Bloodborne 2',
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
	'Little Nicky (GBC)',
	'Antz Extreme Racing',
	'G-Force (PS2)',
	'The Grinch (PS1)',
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
	'Ninja Blade',
	'Urban Dead',
	'King\'s Field IV',
	'Horse Racing 2016',
	'Titanfall 3'
];

const { randomShuffle } = require('../util/shuffle');
const cron = require('cron');


module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`${new Date().toLocaleTimeString()} - Ready! Logged in as ${client.user.tag}`);

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

		const scheduledMessage = new cron.CronJob('00 00 04 * * *', () => {
			// This runs every day at 04:00:00, you can do anything you want
			const channel = client.channels.cache.get('358699161551634442');
			channel.send({ files: ['./img/rugrats.gif'] });
		});

		// When you want to start it, use:
		scheduledMessage.start();
	},
};
