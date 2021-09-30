const { SlashCommandBuilder } = require('@discordjs/builders');
const { random } = require('../util/random');
const { randomShuffle } = require('../util/shuffle');

const feastArray = ['./img/slob/pizza.gif', './img/slob/hotdog.gif', './img/slob/hotdog2.gif', './img/slob/burger.gif', './img/slob/wing.gif'];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slob')
		.setDescription('Sends a picture of the King')
		.addStringOption(option =>
			option.setName('food')
				.setDescription('The food to send. Pizza, hot dog, wing, or burger. \'feast\' sends all at once.')
				.addChoice('burger', 'burger')
				.addChoice('hot dog', 'hotdog')
				.addChoice('wing', 'wing')
				.addChoice('pizza', 'pizza')
				.addChoice('feast', 'feast')),
	async execute(interaction) {
		const food = interaction.options.getString('food');

		// Check if a food is specified
		if (food) {
			// TODO
			console.log(food);
			if (food === 'pizza') {
				await interaction.deferReply();
				await interaction.editReply({ files: ['img/slob/pizza.gif'] });
			}
			else if (food === 'burger') {
				await interaction.deferReply();
				await interaction.editReply({ files: ['img/slob/burger.gif'] });
			}
			else if (food === 'hot dog' || food === 'hotdog') {
				await interaction.deferReply();
				await interaction.editReply({ files: ['img/slob/hotdog.gif', 'img/slob/hotdog2.gif'] });
			}
			else if (food === 'wing') {
				await interaction.deferReply();
				await interaction.editReply({ files: ['img/slob/wing.gif'] });
			}
			else if (food === 'feast') {
				await interaction.deferReply();
				await interaction.editReply({ files: randomShuffle(feastArray) });
			}
		}
		else {
			console.log(food);
			const rand = random(0, 4);

			await interaction.deferReply();
			await interaction.editReply({ files: [feastArray[rand]] });
		}
	},
};