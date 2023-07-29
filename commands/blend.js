const { SlashCommandBuilder } = require('@discordjs/builders');
const { countImages } = require('../util/createBlend.js');
const { loadAndProcessMyLocalImage } = require('../util/generateImage');
const { containsAtAll } = require('../util/doesContain');
const { CraiyonModel } = require('craiyon')
 
const banned_words = ['blackface', 'black face', 'darkface', 'dark face', 'caricature', 'racist', 'racism', 'shaughn', 'shaaughn', 'squigger', 'squigga', 'spooks', 'starving', 'child', 'children', 'hungy', 'hungry', 'kid', 'famished', 'hitler', 'adolf'];
const banned_users = ['105884992055349248', '415407957371781123'];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blend')
		.setDescription('Blend it, bitch')
		.addStringOption(option =>
			option.setName('prompt')
				.setDescription('the blend prompt')
				.setMaxLength(100)
				.setRequired(true))
		.addStringOption(option =>
			option.setName('type')
				.setDescription('What style/filter you want the blend to be')
				.addChoices(
					{ name: 'Art', value: CraiyonModel.Art },
					{ name: 'Drawing', value: CraiyonModel.Drawing },
					{ name: 'Photo', value: CraiyonModel.Photo },
				))
		.addStringOption(option =>
			option.setName('negative')
				.setDescription('Negative words to exclude from blends')
				.setMaxLength(100))
		.addBooleanOption(option =>
			option.setName('v1')
				.setDescription('Use the old version (v1) of Craiyon instead')),
	async execute(interaction) {
		/*if (interaction.user.id === '105884992055349248') {
			await interaction.editReply({ content: 'Ur done kid', ephemeral: true });
			return;
		}*/

		const message = await interaction.deferReply({ fetchReply: true });

		const prompt = interaction.options.getString('prompt');
		const version = interaction.options.getBoolean('v1');
		const model = interaction.options.getString('type') ?? CraiyonModel.None;
		const negative = interaction.options.getString('negative');

		let prompt_obj = {
			prompt: prompt
		}

		let prompt_str = prompt;

		if (!version) {
			if (model) {
				prompt_obj.model = model
				if (model != 'none'){
					prompt_str += ` (${model})`;
				}
			}

			if (negative) {
				prompt_obj.negative_prompt = negative;
			}
		}
		else {
			prompt_str += ` (Craiyon v1)`;
		}

		// Check if query is too long
		if (prompt.length > 100) {
			await interaction.editReply({ content: 'DALL·E: Invalid query\nQuery is too long.', ephemeral: true });
			return;
		}

		// check if banned words
		const query = prompt.toLowerCase();
		if (banned_users.includes(interaction.user.id) && containsAtAll(query, banned_words)) {
			await interaction.editReply({ content: 'Nope.', ephemeral: true });
			return;
		}

		const folder = await countImages(prompt_obj, message.id, version);

		await loadAndProcessMyLocalImage(folder);

		await interaction.editReply({ files: [`${folder}/final.png`], content: prompt_str });
	},
};