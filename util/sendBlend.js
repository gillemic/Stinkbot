const fs = require('fs');

module.exports = {
	name: 'requestBlend',
	requestBlend(message) {
		// check if message is a reply
		if (!message.reference) {
			return;
		}
		
		// get the referenced message id from the reply
		const blendID = message.reference.messageId;

		// get the files from the generated/ directory
		const files = fs.readdirSync('./generated/');

		// create variable but don't assign value
		let blendFolder;

		for (let file of files) {
			if (file.startsWith(blendID)) {
				// if folder with messageID is found, initialize blendFolder variable
				blendFolder = file;
				continue;
			}
		}

		// folder not found
		if (!blendFolder) {
			return
		}

		// concatenate path
		const path = `./generated/${blendFolder}`;

		// get the first character and convert to reply
		let blendNumber = parseInt(message.content.charAt(0));

		// subtract 1 for computing purposes
		blendNumber = blendNumber-1;

		// check if number between 0-8 and send file, check for delete perms, and delete reply message
		if (blendNumber >= 0 && blendNumber <= 8) {
			message.channel.send({ files: [`${path}/dalle${blendNumber}.png`] });
			if (message.guild.me.permissions.has('MANAGE_MESSAGES')) {
				setTimeout(() => message.delete(), 3000);
			}
		}
	},
};