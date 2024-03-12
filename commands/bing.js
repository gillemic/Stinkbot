const { SlashCommandBuilder } = require('@discordjs/builders');
const { generateImageFiles } = require('fix-esm').require('bimg');
const { existsSync, mkdirSync } = require('fs');
const sharp = require("sharp");

function sanitizeString(str){
	str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
	return str.trim();
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bing')
		.setDescription('Bing it, bitch')
		.addStringOption(option => option.setName('prompt')
			.setDescription('the bing prompt')
			.setRequired(true)),
	async execute(interaction) {
			const message = await interaction.deferReply({ fetchReply: true });

			const prompt = interaction.options.getString('prompt');

			let imageFiles;

			console.log(prompt);

			try {
				imageFiles = await generateImageFiles(sanitizeString(prompt));
			}
			catch(error) {
				let line = error.name;
				let secondLine = error.message.split('\n').shift();
				console.log(error);
				await interaction.editReply({ content: `${line}: ${secondLine}` });
				setTimeout(() => interaction.deleteReply(), 30000);
				return;
			}
			

			// if (!(Array.isArray(imageFiles))) {
			// 	await interaction.editReply({ content: "There was an error!" });
			// 	return;
			// }

			if (!existsSync('./generated/')) {
				mkdirSync('./generated');
			}

			const folder = `./generated/${message.id}_${prompt.split(' ').join('_').replace(/[/<>:"\\|?*]/g, '')}`;

			if (!existsSync(folder)) {
				mkdirSync(folder);
			}

			let fileArray = [];

			for (const i in imageFiles) {
				const buffer = Buffer.from(imageFiles[i].data, 'base64url');
				const pngBuffer = sharp(buffer)
					.png({ pngquant: true })
					.toFile(`${folder}/dalle${i}.png`, (err, info) => {
						if (err) throw err;
					});

				fileArray.push(`${folder}/dalle${i}.png`);
			}

			await new Promise(resolve => setTimeout(resolve, 2000));

			await interaction.editReply({ content: prompt, files: fileArray.slice(0, -1) });
	}
};