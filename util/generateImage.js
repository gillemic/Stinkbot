const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const width = 1024;
const height = 1024;

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

const x_coord = [0, 342, 684, 0, 342, 684, 0, 342, 684];
const y_coord = [0, 0, 0, 342, 342, 342, 684, 684, 684];

module.exports = {
	async loadAndProcessMyLocalImage(blend_folder) {
		if (!fs.existsSync(blend_folder)) {
			console.log(`cannot find folder "${blend_folder}"`);
			return;
		}

		await new Promise(resolve => setTimeout(resolve, 2000));

		for (let i = 0; i < 9; i++) {
			// await new Promise(resolve => setTimeout(resolve, 2000));
			const localImage = await loadImage(`${blend_folder}/dalle${i}.png`)
			// await new Promise(resolve => setTimeout(resolve, 2000));
			context.drawImage(localImage, x_coord[i], y_coord[i], 340, 340)
		}

		const buffer = canvas.toBuffer('image/png');
		fs.writeFileSync(`${blend_folder}/final.png`, buffer);

		return blend_folder;
	},
};