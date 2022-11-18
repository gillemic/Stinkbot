const axios = require('axios');
// const { toUint8Array } = require('js-base64');
const sharp = require('sharp');
const fs = require('fs');

const headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	'Origin': 'https://hf.space',
	'Referer': 'https://hf.space/',
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)',
};

module.exports = {
	async getImages(prompt) {
		try {
			return await axios.post('https://bf.dallemini.ai/generate', {
				'prompt': prompt,
			}, headers);
		}
		catch (error) {
			console.error(error);
		}
	},
	async countImages(input, id) {
		const request = await module.exports.getImages(input);

		const images = request.data.images;

		if (!fs.existsSync('./generated/')) {
			fs.mkdirSync('./generated');
		}

		const folder = `./generated/${id}_${input.split(' ').join('_').replace(/[\/<>:"\\|?\*]/g,"")}`;

		if (!fs.existsSync(folder)) {
			fs.mkdirSync(folder);
		}

		for (const i in images) {
			const buffer = Buffer.from(images[i], 'base64url');
			await sharp(buffer)
				.png({ pngquant: true })
				.toFile(`${folder}/dalle${i}.png`, (err) => {
					if (err) throw err;
				});
		}

		return folder;
	},
};