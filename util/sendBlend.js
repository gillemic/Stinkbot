const fs = require('fs');

const positions = ['top left', 'top middle', 'top right', 'middle left', 'middle middle', 'middle right', 'bottom left', 'bottom middle', 'bottom right'];

module.exports = {
	name: 'requestBlend',
	async requestBlend(message) {
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

		const oldMessage = await message.channel.messages.fetch(blendID);

		// Not from Stinkbot
		if (oldMessage.author.id != '344321956096638997') {
			return;
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
			oldMessage.reply({ content: `${oldMessage.content} (requested by ${message.member.displayName})`, files: [`${path}/dalle${blendNumber}.png`] });
			if (message.guild.me.permissions.has('MANAGE_MESSAGES')) {
				setTimeout(() => message.delete(), 1000);
			}
		}
	},
};