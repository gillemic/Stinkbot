const { SlashCommandBuilder } = require('@discordjs/builders');
const { countImages } = require('../util/createBlend.js');
const { loadAndProcessMyLocalImage } = require('../util/generateImage');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blend')
		.setDescription('Blend it, bitch')
		.addStringOption(option =>
			option.setName('prompt')
				.setDescription('the blend prompt')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();

		const prompt = interaction.options.getString('prompt');

		const folder = await countImages(prompt);

		await loadAndProcessMyLocalImage(folder);

		await interaction.editReply({ files: [`${folder}/final.png`], content: prompt });
	},
};