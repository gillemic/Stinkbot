const { SlashCommandBuilder } = require('@discordjs/builders');
const mysql = require('mysql');
require('dotenv').config();

class HOT {
	constructor(choice) {
		this.playerChoice = choice;
		this.cpuChoice = Math.floor(Math.random() * 2);
	}

	playerNumber(choice) {
		if (choice === 'h') {
			return 0;
		}
		else if (choice === 't') {
			return 1;
		}
		else {
			return -1;
		}
	}

	chooseWinner(winner, playerID, stinkbotID) {
		switch (winner) {
		case 0:
			this.winnerID = playerID;
			this.loserID = stinkbotID;
			break;

		case 1:
		case -1:
			this.winnerID = stinkbotID;
			this.loserID = playerID;
			break;
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
		.setName('hot')
		.setDescription('Play Heads or Tails against Stinkbot')
		.addStringOption(option =>
			option.setName('choice')
				.setDescription('Your choice. h or t')
				.addChoices([['h', 'h'], ['t', 't'], ['leaderboard', 'leaderboard'], ['ban', 'ban'], ['unban', 'unban']])
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

			console.log(userArray);

			console.log('Connected. Displaying HOT leaderboard');
			const sql = 'SELECT * FROM discord_bot.hot_leaderboard';
			con.query(sql, userArray, async (err, result) => {
				if (err) throw err;
				console.log(result);
				let leaderboard = 'HEADS OR TAILS LEADERBOARD';
				for (const i in result) {
					if (!userArray.includes(result[i].UserID)) {
						continue;
					}
					const name = await interaction.guild.members.fetch(result[i].UserID);
					leaderboard += '\n- - - - - - - - - - - - - - - - - - - -\n';
					leaderboard += `**${name.displayName}**  |  Wins: ${result[i].Wins}  |  W/L: ${result[i].WL}\n`;
				}
				return interaction.reply(leaderboard.substring(0, leaderboard.length - 1));
			});
		}
		else if (choice === 'ban') {
			// TODO
			console.log('Connected. Banning ' + interaction.user.username);
			const id = interaction.user.id;
			const sql = `UPDATE hot SET isBanned=True WHERE UserID=${id}`;
			con.query(sql, function(err) {
				if (err) throw err;
				console.log('Banned af');
			});
			interaction.reply('Nice job, you\'re banned');
		}
		else if (choice === 'unban' && interaction.user.username === 'mjelly96') {
			console.log('Connected. Unbanning all members');
			const sql = 'UPDATE hot SET isBanned=False';
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
			let sql = `SELECT isBanned FROM hot WHERE UserID="${userID}"`;

			con.query(sql, async (err, result) => {
				if (err) throw err;
				if (result.length) {
					console.log('User in database');
					if (result[0].isBanned) {
						console.log('User is banned');
						interaction.reply('Dude you\'re banned af');
					}
					else {
						const game = new HOT(choice);

						game.playGame(userID, botID);

						if (game.tie) {
							// not gonna happen sucka
						}
						else {
							const winnerID = game.winnerID;
							const loserID = game.loserID;
							const winner = await interaction.guild.members.fetch(winnerID);
							const loser = await interaction.guild.members.fetch(loserID);

							// console.log(winnerID, loserID, winner, loser);

							interaction.reply(`${winner.displayName} wins! ${loser.displayName} stinks!`);

							sql = `UPDATE hot SET Wins=Wins+1 WHERE UserID=${game.winnerID}`;

							con.query(sql, function(err, result2) {
								if (err) throw err;
								console.log(result2);
							});

							sql = `UPDATE hot SET Losses=Losses+1 WHERE UserID=${game.loserID}`;

							con.query(sql, function(err, result3) {
								if (err) throw err;
								console.log(result3);
							});
						}
					}
				}
				else {
					// new player
					sql = `INSERT INTO hot VALUES ("${userID}", 0, 0, "${interaction.user.username}", false)`;

					con.query(sql, function(err, result4) {
						if (err) throw err;
						console.log(result4);
					});

					const game = new HOT(choice);

					game.playGame(userID, botID);

					if (game.tie) {
						// not gonna happen suckas
					}
					else {
						const winnerID = game.winnerID;
						const loserID = game.loserID;
						const winner = await interaction.guild.members.fetch(winnerID);
						const loser = await interaction.guild.members.fetch(loserID);

						// console.log(winnerID, loserID, winner, loser);

						interaction.reply(`${winner.displayName} wins! ${loser.displayName} stinks!`);

						sql = `UPDATE hot SET Wins=Wins+1 WHERE UserID=${game.winnerID}`;

						con.query(sql, function(err, result2) {
							if (err) throw err;
							console.log(result2);
						});

						sql = `UPDATE hot SET Losses=Losses+1 WHERE UserID=${game.loserID}`;

						con.query(sql, function(err, result3) {
							if (err) throw err;
							console.log(result3);
						});
					}
				}
				console.log(result);
			});
		}
	},
};