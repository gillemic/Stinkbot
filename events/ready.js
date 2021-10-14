/* const statuses = [
	'deez',
	'with fire',
	'Conor stinks',
	'Predator: Proving Grounds',
	'Black Ops II',
	'Realm Royale',
	'Metroid™ Dread',
];*/

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity('Metroid™ Dread');
	},
};