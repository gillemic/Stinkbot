const { SlashCommandBuilder } = require('@discordjs/builders');
const { random } = require('../util/random');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roulette')
		.setDescription('Pick a user and play roulette. Don\'t lose though!')
		.addUserOption(option =>
			option.setName('target')
				.setDescription('the member to try and timeout')
				.setRequired(true),
		),
	execute(interaction) {
		const result = random(0, 5);

		const victim = interaction.options.getMember('target');

		if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
			interaction.reply({ content: 'Stinkbot does not have permissions to timeout members :(', ephemeral: true });
			return;
		}

		if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || victim.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			interaction.reply({ content: 'One or more user(s) is an Administator of this guild and cannot be put in timeout', ephemeral: true });
			return;
		}

		if (victim.moderatable) {
			if (result != 2) {
				interaction.member.timeout(1000 * 60 * 15, 'Owned idiot');
				interaction.reply({ content: 'You lost! You\'ve been put in timeout for 15 minutes', ephemeral: true });
			}
			else {
				victim.timeout(1000 * 60 * 15, `You have been put in timeout by ${interaction.member.displayName}`);
				interaction.reply({ content: `You won! ${victim.displayName} has been put in timeout for 15 minutes`, ephemeral: true });
			}
		}
		else {
			interaction.reply('Stinkbot doesn\'t have permissions to timeout this member :(');
		}
	},
};