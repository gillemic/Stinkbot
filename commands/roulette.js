const { SlashCommandBuilder } = require('@discordjs/builders');
const { random } = require('../util/random');
const { Permissions } = require('discord.js');
const mysql = require('mysql');

const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
});

function calculateTime(minutes) {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	if (hours > 0 && mins === 0) {
		return `${hours} hour(s)`;
	}
	else if (hours > 0) {
		return `${hours} hour(s) and ${mins} minutes`;
	}
	else {
		return `${mins} minutes`;
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roulette')
		.setDescription('Pick a user or show the leaderboard')
		.addSubcommand(subcommand =>
			subcommand.setName('target')
				.setDescription('The member to try and timeout. Don\'t lose though!')
				.addUserOption(option =>
					option.setName('user').setDescription('the user to target').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('leaderboard')
				.setDescription('show the leaderboard'))
		.addSubcommand(subcommand =>
			subcommand.setName('fuckmeup')
				.setDescription('fucks you up fr')),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'target') {
			//
			const verdict = random(0, 6);

			const victim = interaction.options.getMember('user');
			const userID = interaction.member.id;

			if (victim.id === interaction.client.user.id) {
				interaction.reply({ content: 'Fool. You cannot timeout Stinkbot.', ephemeral: true });
				return;
			}

			if (victim.isCommunicationDisabled()) {
				const time = victim.communicationDisabledUntil;
				interaction.reply({ content: `${victim.displayName} is already in timeout! (Until ${time.toLocaleTimeString()} PST)` });
				return;
			}

			if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
				interaction.reply({ content: 'Stinkbot does not have permissions to timeout members :(', ephemeral: true });
				return;
			}

			if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || victim.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
				interaction.reply({ content: 'One or more user(s) is an Administator of this guild and cannot be put in timeout', ephemeral: true });
				return;
			}

			let sql = `SELECT * FROM roulette WHERE UserID="${userID}"`;
			let CL = 0;

			con.query(sql, async (err, result) => {
				if (err) throw err;
				console.log(result[0]);
				if (result.length) {
					// user exists
					CL = parseInt(result[0].Consecutive_Losses);
				}
				else {
					// new user
					sql = `INSERT INTO roulette VALUES ("${userID}", 0, 0, 0)`;

					con.query(sql, (err, result2) => {
						if (err) throw err;
						console.log(result2);
					});
				}

				if (victim.moderatable) {
					if (victim.id === userID) {
						if (verdict === 2) {
							interaction.member.timeout(1000 * 60 * 60 * 2, 'Owned idiot');
							await interaction.deferReply();
							await interaction.editReply({ content: `You lost! You've been put in timeout for ${calculateTime(120)}.`, files: ['./img/roulette_loss.gif'] });
							return;
						}
						else {
							interaction.reply({ content: '**\\*click**\\*' });
							return;
						}
					}
					else if (verdict != 2) {
						interaction.member.timeout(1000 * 60 * (30 + (15 * CL)), 'Owned idiot');
						await interaction.deferReply();
						await interaction.editReply({ content: `You lost! You've been put in timeout for ${calculateTime(30 + 15 * CL)}.\nConsecutive Losses: ${CL + 1}`, files: ['./img/roulette_loss.gif'] });

						sql = `UPDATE roulette SET Consecutive_Losses=Consecutive_Losses+1, Attempts=Attempts+1 WHERE UserID=${userID}`;
					}
					else {
						victim.timeout(1000 * 60 * (15 + 5 * CL), `You have been put in timeout by ${interaction.member.displayName}`);
						await interaction.deferReply();
						await interaction.editReply({ content: `You won! ${victim.displayName} has been put in timeout for ${calculateTime(15 + 5 * CL)}`, files: ['./img/roulette_win.jpg'] });

						sql = `UPDATE roulette SET Consecutive_Losses=0, Wins=Wins+1, Attempts=Attempts+1 WHERE UserID=${userID}`;
					}
					con.query(sql, (err, result3) => {
						if (err) throw err;
						console.log(result3);
					});
				}
				else {
					interaction.reply('Stinkbot doesn\'t have permissions to timeout this member :(');
				}
			});
			//
		}
		else if (interaction.options.getSubcommand() === 'leaderboard') {
			let userArray = await interaction.guild.members.fetch();

			userArray = userArray.map(user => {
				return user.user.id;
			});

			console.log('Connected. Displaying roulette leaderboard');
			const sql = 'SELECT * FROM roulette_leaderboard';

			con.query(sql, userArray, async (err, result) => {
				if (err) throw err;
				// console.log(result);
				let leaderboard = 'ROULETTE LEADERBOARD';
				for (const i in result) {
					if (!userArray.includes(result[i].UserID)) {
						continue;
					}
					const name = await interaction.guild.members.fetch(result[i].UserID);
					leaderboard += '\n- - - - - - - - - - - - - - - - - - - -\n';
					leaderboard += `**${name.displayName}**  |  Wins: ${result[i].Wins}  |  Attempts: ${result[i].Attempts}  |  W/L: ${result[i].WL}`;
				}
				await interaction.deferReply();
				await interaction.editReply({ content: leaderboard });
			});
		}
		else if (interaction.options.getSubcommand() === 'fuckmeup') {
			if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
				interaction.reply({ content: 'You are an Administator of this guild and cannot be put in timeout', ephemeral: true });
				return;
			}
			interaction.member.timeout(1000 * 60 * 60 * 24 * 28 + 13, 'Owned idiot');
			await interaction.deferReply();
			await interaction.editReply({ content: `You have been fucked up and put in timeout for ${calculateTime(60 * 60 * 24 * 28 + 13)}.` });
		}
		else {
			interaction.reply({ content: 'You need to specify a subcommand', ephemeral: true });
		}
	},
};