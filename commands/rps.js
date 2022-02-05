const { SlashCommandBuilder } = require('@discordjs/builders');
// const { random } = require('../util/random');
const mysql = require('mysql');
require('dotenv').config();

class RPS {
	constructor(choice) {
		this.playerChoice = choice;
		this.cpuChoice = Math.floor(Math.random() * 3);
		this.tie = true;
	}

	playerNumber(choice) {
		if (choice === 'r') {
			return 0;
		}
		else if (choice === 'p') {
			return 1;
		}
		else if (choice === 's') {
			return 2;
		}
		else {
			return -1;
		}
	}

	chooseWinner(winner, playerID, stinkbotID) {
		switch (winner) {
		case 1:
		case -2:
			// updateWins(playerID, botID, channel);
			this.tie = false;
			this.winnerID = playerID;
			this.loserID = stinkbotID;
			break;

		case 0:
			// channel.send("Tie!");
			break;

			/* case 1:
					updateWins(playerID, client.user.id, channelID);
					break;*/
		case 2:
		case -1:
			// you lose!
			// updateWins(botID, playerID, channel);
			this.tie = false;
			this.winnerID = stinkbotID;
			this.loserID = playerID;
			break;

				/* case 2:
						updateWins(client.user.id, playerID, channelID);
						break;*/
		}
	}

	playGame(userID, botID) {
		const winner = this.playerNumber(this.playerChoice) - this.cpuChoice;
		this.chooseWinner(winner, userID, botID);
	}
}

const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('Play Rock, Paper, Scissors against Stinkbot')
		.addStringOption(option =>
			option.setName('choice')
				.setDescription('Your choice. r, p, or s.')
				.addChoices([['r', 'r'], ['p', 'p'], ['s', 's'], ['leaderboard', 'leaderboard'], ['ban', 'ban'], ['unban', 'unban']])
				.setRequired(true)),
	async execute(interaction) {
		const userID = interaction.user.id;
		const botID = interaction.client.user.id;

		const choice = interaction.options.getString('choice');

		if (!choice) {
			interaction.reply('Woah mama');
		}
		else if (choice === 'leaderboard') {
			let userArray = await interaction.guild.members.fetch();

			userArray = userArray.map(user => {
				return user.user.id;
			});

			// console.log(userArray);

			// console.log('Connected. Displaying RPS leaderboard');
			const sql = 'SELECT * FROM discord_bot.rps_leaderboard';
			con.query(sql, userArray, async (err, result) => {
				if (err) throw err;
				// console.log(result);
				let leaderboard = 'ROCK, PAPER, SCISSORS LEADERBOARD';
				for (const i in result) {
					if (!userArray.includes(result[i].UserID)) {
						continue;
					}
					const name = await interaction.guild.members.fetch(result[i].UserID);
					leaderboard += '\n- - - - - - - - - - - - - - - - - - - -\n';
					leaderboard += `**${name.displayName}**  |  Wins: ${result[i].Wins}  |  W/L: ${result[i].WL}`;
				}
				return interaction.reply(leaderboard);
			});
		}
		else if (choice === 'ban') {
			console.log('Connected. Banning ' + interaction.user.username);

			const id = interaction.user.id;
			const sql = `UPDATE rps SET isBanned=True WHERE UserID=${id}`;

			con.query(sql, function(err) {
				if (err) throw err;
				console.log('Banned af');
			});
			interaction.reply('Nice job, you\'re banned');
		}
		else if (choice === 'unban' && interaction.user.username === 'mjelly96') {
			console.log('Connected. Unbanning all members');
			const sql = 'UPDATE rps SET isBanned=False';
			con.query(sql, function(err) {
				if (err) throw err;
				console.log('Unbanned');
			});
			interaction.reply({ content: 'All users unbanned' });
		}
		else if (choice === 'unban') {
			interaction.reply({ content: 'Only my creator can unban. Live with your foolish decision', ephemeral: true });
		}
		else {
			let sql = `SELECT isBanned, Wins FROM rps WHERE UserID="${userID}"`;

			con.query(sql, async (err, result) => {
				if (err) throw err;
				if (result.length) {
					// console.log('User in database');
					if (result[0].isBanned) {
						console.log('User is banned');
						interaction.reply('Dude you\'re banned af');
					}
					else {
						const game = new RPS(choice);

						game.playGame(userID, botID);

						if (game.tie) {
							interaction.reply('Tie!');
						}
						else {
							const winnerID = game.winnerID;
							const loserID = game.loserID;
							const winner = await interaction.guild.members.fetch(winnerID);
							const loser = await interaction.guild.members.fetch(loserID);
							const playerWins = result[0].Wins;

							if (winner.user.username === 'Stinkbot') {
								interaction.reply(`${winner.displayName} wins! ${loser.displayName} stinks!`);
							}
							else {
								interaction.reply(`${winner.displayName} wins! ${loser.displayName} stinks! ${playerWins + 1} total wins`);
							}

							sql = `UPDATE rps SET Wins=Wins+1 WHERE UserID=${game.winnerID}`;

							con.query(sql, function(err) {
								if (err) throw err;
								// console.log(result2);
							});

							sql = `UPDATE rps SET Losses=Losses+1 WHERE UserID=${game.loserID}`;

							con.query(sql, function(err) {
								if (err) throw err;
								// console.log(result3);
							});
						}
					}
				}
				else {
					// new player
					sql = `INSERT INTO rps VALUES ("${userID}", 0, 0, "${interaction.user.username}", false)`;

					con.query(sql, function(err) {
						if (err) throw err;
						// console.log(result4);
					});

					const game = new RPS(choice);

					game.playGame(userID, botID);

					if (game.tie) {
						interaction.reply('Tie!');
					}
					else {
						const winnerID = game.winnerID;
						const loserID = game.loserID;
						const winner = await interaction.guild.members.fetch(winnerID);
						const loser = await interaction.guild.members.fetch(loserID);

						const playerWins = result[0].Wins;

						if (winner.user.username === 'Stinkbot') {
							interaction.reply(`${winner.displayName} wins! ${loser.displayName} stinks!`);
						}
						else {
							interaction.reply(`${winner.displayName} wins! ${loser.displayName} stinks! ${playerWins + 1} total wins`);
						}

						sql = `UPDATE rps SET Wins=Wins+1 WHERE UserID=${game.winnerID}`;

						con.query(sql, function(err) {
							if (err) throw err;
							// console.log(result2);
						});

						sql = `UPDATE rps SET Losses=Losses+1 WHERE UserID=${game.loserID}`;

						con.query(sql, function(err) {
							if (err) throw err;
							// console.log(result3);
						});
					}
				}
				// console.log(result);
			});
		}
	},
};
