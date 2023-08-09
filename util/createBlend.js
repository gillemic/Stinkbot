const sharp = require('sharp');
const fs = require('fs');
const { Client, ClientV1 } = require('craiyon');

const craiyon = new Client();
const craiyonV1 = new ClientV1();

module.exports = {
	async countImages(prompt_obj, id, version) {
		let result;

		if (version) {
			result = await craiyon.generate(prompt_obj);
		}
		else {
			result = await craiyonV1.generate(prompt_obj);
		}

		const images = result.asBase64();

		if (!fs.existsSync('./generated/')) {
			fs.mkdirSync('./generated');
		}

		const input = prompt_obj.prompt;

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