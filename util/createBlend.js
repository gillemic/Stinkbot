const sharp = require('sharp');
const axios = require('axios');
const fs = require('fs');
const { Client, ClientV1 } = require('craiyon');

const craiyon = new Client();
const craiyonV1 = new ClientV1();

module.exports = {
	async countImages(prompt_obj, id, version) {
		let result;

		if (version) {
			try {
				result = await craiyon.generate(prompt_obj);
			} catch(error) {
				console.log(error)
				return 'error';
			}
		}
		else {
			try {
				result = await craiyonV1.generate(prompt_obj);
			} catch(error) {
				console.log(error)
				return 'error';
			}
		}

		let images;

		if (version) {
			images = [];

			for (const i in result) {
				let k = (await axios({ url: result[i], responseType: "arraybuffer" })).data;
				images.push(k);
			}

		}
		else {
			images = result.asBase64();
		}

		if (!fs.existsSync('./generated/')) {
			fs.mkdirSync('./generated');
		}

		const input = prompt_obj.prompt;

		const folder = `./generated/${id}_${input.split(' ').join('_').replace(/[/<>:"\\|?*]/g, '')}`;

		if (!fs.existsSync(folder)) {
			fs.mkdirSync(folder);
		}

		if (version) {
			for (const i in images) {
				const buffer = Buffer.from(images[i]);
				const pngBuffer = sharp(buffer)
					.png({ pngquant: true })
					.toFile(`${folder}/dalle${i}.png`, (err) => {
						if (err) throw err;
					});
			}

			return folder;
		}
		else {
			for (const i in images) {
				const buffer = Buffer.from(images[i], 'base64url');
				sharp(buffer)
					.png({ pngquant: true })
					.toFile(`${folder}/dalle${i}.png`, (err) => {
						if (err) throw err;
					});
			}

			return folder;
		}
	},
};