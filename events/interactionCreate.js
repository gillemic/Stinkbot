module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		const client = interaction.client;

		if (!interaction.isCommand()) return;

		if (interaction.channel.id === '358699161551634442') {
			// stink chat
			interaction.reply({ content: 'Not today sucka', ephemeral: true });
			return;
		}

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		// console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
	},
};