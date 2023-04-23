const sharp = require('sharp');
const fs = require('fs');
const { Client } = require('craiyon');

const craiyon = new Client();

module.exports = {
	async countImages(input, id) {
		const result = await craiyon.generate({
			prompt: input,
		})

		const images = result.asBase64();

		if (!fs.existsSync('./generated/')) {
			fs.mkdirSync('./generated');
		}

		const folder = `./generated/${id}_${input.split(' ').join('_').replace(/[/<>:"\\|?*]/g, '')}`;

		if (!fs.existsSync(folder)) {
			fs.mkdirSync(folder);
		}

		for (const i in images) {
			const buffer = Buffer.from(images[i], 'base64url');
			const pngBuffer = sharp(buffer)
				.png({ pngquant: true })
				.toFile(`${folder}/dalle${i}.png`, (err) => {
					if (err) throw err;
				});
		}

		return folder;
	},
};