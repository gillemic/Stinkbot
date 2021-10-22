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
	name: 'hot',
	description: '',
	args: false,
	usage: '',
	async execute(message, args) {
		const userID = message.author.id;
		const botID = message.client.user.id;

		const choice = args[0] ?? 'ban';

		if (!choice) {
			message.channel.send('Woah mama');
		}
		else if (choice === 'leaderboard') {
			let userArray = await message.guild.members.fetch();

			userArray = userArray.map(user => {
				return user.user.id;
			});

			// console.log(userArray);

			// console.log('Connected. Displaying HOT leaderboard');
			const sql = 'SELECT * FROM discord_bot.hot_leaderboard';

			con.query(sql, userArray, async (err, result) => {
				if (err) throw err;
				// console.log(result);
				let leaderboard = 'HEADS OR TAILS LEADERBOARD';
				for (const i in result) {
					if (!userArray.includes(result[i].UserID)) {
						continue;
					}
					const name = await message.guild.members.fetch(result[i].UserID);
					leaderboard += '\n- - - - - - - - - - - - - - - - - - - -\n';
					leaderboard += `**${name.displayName}**  |  Wins: ${result[i].Wins}  |  W/L: ${result[i].WL}\n`;
				}
				return message.reply(leaderboard.substring(0, leaderboard.length - 1));
			});
		}
		else if (choice === 'ban') {
			console.log('Banning ' + message.author.username);
			const id = message.user.id;

			const sql = `UPDATE hot SET isBanned=True WHERE UserID=${id}`;

			con.query(sql, function(err) {
				if (err) throw err;
				// console.log('Banned af');
			});
			message.reply('Nice job, you\'re banned');
		}
		else if (choice === 'unban' && message.author.username === 'mjelly96') {
			console.log('Unbanning all members');
			const sql = 'UPDATE hot SET isBanned=False';
			con.query(sql, function(err) {
				if (err) throw err;
				// console.log('Unbanned');
			});
		}
		else if (choice === 'unban') {
			message.reply('Only my creator can unban. Live with your foolish decision');
		}
		else {
			let sql = `SELECT isBanned FROM hot WHERE UserID="${userID}"`;

			con.query(sql, async (err, result) => {
				if (err) throw err;
				if (result.length) {
					// console.log('User in database');
					if (result[0].isBanned) {
						// console.log('User is banned');
						message.reply('Dude you\'re banned af');
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
							const winner = await message.guild.members.fetch(winnerID);
							const loser = await message.guild.members.fetch(loserID);

							message.reply(`${winner.displayName} wins! ${loser.displayName} stinks!`);

							sql = `UPDATE hot SET Wins=Wins+1 WHERE UserID=${game.winnerID}`;

							con.query(sql, function(err) {
								if (err) throw err;
								// console.log(result2);
							});

							sql = `UPDATE hot SET Losses=Losses+1 WHERE UserID=${game.loserID}`;

							con.query(sql, function(err) {
								if (err) throw err;
								// console.log(result3);
							});
						}
					}
				}
				else {
					// new player
					sql = `INSERT INTO hot VALUES ("${userID}", 0, 0, "${message.author.username}", false)`;

					con.query(sql, function(err) {
						if (err) throw err;
						// console.log(result4);
					});

					const game = new HOT(choice);

					game.playGame(userID, botID);

					if (game.tie) {
						// not gonna happen suckas
					}
					else {
						const winnerID = game.winnerID;
						const loserID = game.loserID;
						const winner = await message.guild.members.fetch(winnerID);
						const loser = await message.guild.members.fetch(loserID);

						message.reply(`${winner.displayName} wins! ${loser.displayName} stinks!`);

						sql = `UPDATE hot SET Wins=Wins+1 WHERE UserID=${game.winnerID}`;

						con.query(sql, function(err) {
							if (err) throw err;
							// console.log(result2);
						});

						sql = `UPDATE hot SET Losses=Losses+1 WHERE UserID=${game.loserID}`;

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