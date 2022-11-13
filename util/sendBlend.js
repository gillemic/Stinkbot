const fs = require('fs');

module.exports = {
	name: 'requestBlend',
	requestBlend(message) {
		if (!message.reference) {
			return;
		}
		
		const blendID = message.reference.messageId;

		const files = fs.readdirSync('./generated/');

		let blendFolder;

		for (let file of files) {
			if (file.startsWith(blendID)) {
				blendFolder = file;
				continue;
			}
		}

		// folder not found
		if (!blendFolder) {
			return
		}

		const path = `./generated/${blendFolder}`;

		let blendNumber = parseInt(message.content);

		blendNumber = blendNumber-1;

		if (blendNumber >= 0 && blendNumber <= 8) {
			message.reply({ files: [`${path}/dalle${blendNumber}.png`] });
		}
	},
};