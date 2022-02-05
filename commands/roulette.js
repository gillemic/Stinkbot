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

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roulette')
		.setDescription('Pick a user and play roulette. Don\'t lose though!')
		.addUserOption(option =>
			option.setName('target')
				.setDescription('the member to try and timeout')
				.setRequired(false),
		)
		.addBooleanOption(option =>
			option.setName('leaderboard')
				.setDescription('show the leaderboard')
				.setRequired(false),
		),
	async execute(interaction) {
		if (interaction.options.getBoolean('leaderboard')) {
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
				return interaction.reply(leaderboard);
			});
			return;
		}

		const verdict = random(0, 5);

		const victim = interaction.options.getMember('target');

		if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
			interaction.reply({ content: 'Stinkbot does not have permissions to timeout members :(', ephemeral: true });
			return;
		}

		if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || victim.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			interaction.reply({ content: 'One or more user(s) is an Administator of this guild and cannot be put in timeout', ephemeral: true });
			return;
		}

		const userID = interaction.user.id;

		let sql = `SELECT * FROM roulette WHERE UserID="${userID}"`;
		let CL;

		con.query(sql, (err, result) => {
			if (err) throw err;
			if (result.length) {
				// user exists
				CL = result[0].Consecutive_Losses;
			}
			else {
				// new user
				sql = `INSERT INTO roulette VALUES ("${userID}", 0, 0, 0)`;

				CL = 0;

				con.query(sql, (err, result2) => {
					if (err) throw err;
					console.log(result2);
				});
			}
		});

		if (victim.moderatable) {
			if (verdict != 2) {
				interaction.member.timeout(1000 * 60 * (5 * (CL + 1)), 'Owned idiot');
				interaction.reply({ content: `You lost! You've been put in timeout for ${5 * (CL + 1)} minutes.\nConsecutive Losses: ${CL + 1}` });

				sql = `UPDATE roulette SET Consecutive_Losses=Consecutive_Losses+1, Attempts=Attempts+1 WHERE UserID=${userID}`;
			}
			else {
				victim.timeout(1000 * 60 * 5, `You have been put in timeout by ${interaction.member.displayName}`);
				interaction.reply({ content: `You won! ${victim.displayName} has been put in timeout for 5 minutes` });

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
	},
};