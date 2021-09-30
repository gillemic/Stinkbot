const { SlashCommandBuilder } = require('@discordjs/builders');
const { random } = require('../util/random');
const { randomShuffle } = require('../util/shuffle');

const buddyArray = ['img/buds/mudbud.jpg', 'img/buds/buddha.jpg', 'img/buds/budderball.jpg', 'img/buds/rosebud.jpg', 'img/buds/b-dawg.jpg'];
const entourageArray = ['img/buds/shasta.jpg', 'img/buds/spudnik.jpg', 'img/buds/puppy_paws.jpg', 'img/buds/pip.jpg'];

const everyone = ['mudbud', 'buddha', 'budderball', 'rosebud', 'b-dawg', 'shasta', 'spudnik', 'puppy paws', 'pip', 'santa paws', 'ghost pip'];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bud')
		.setDescription('sends a bud')
		.addStringOption(option =>
			option.setName('buddy')
				.setDescription('the buddy to send, leave blank to send a random buddy')),
	async execute(interaction) {
		let buddy = interaction.options.getString('buddy');

		if (buddy) {
			if (everyone.includes(buddy)) {
				buddy = buddy.split(' ').join('_');
				interaction.reply({ files: [`./img/buds/${buddy}.jpg`] });
			}
			else if (buddy === 'the gang' || buddy === 'gang') {
				interaction.reply({ files: randomShuffle(buddyArray) });
			}
			else if (buddy === 'the entourage' || buddy === 'entourage') {
				interaction.reply({ files: randomShuffle(entourageArray) });
			}
			else {
				interaction.reply({ content: 'Buddy not found. Do you seriously not know your buddies??', ephemeral: true });
			}
		}
		else {
			const rand = random(0, 5);

			interaction.reply({ files: [buddyArray[rand]] });
		}
	},
};