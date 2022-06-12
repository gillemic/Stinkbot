const mysql = require('mysql');
const { doesContain, containsAny } = require('./doesContain');
const { Permissions } = require('discord.js');
const { updateTimeout } = require('./updateTimeout');
// const banned_users = ['347933045371830292'];

const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
});

module.exports = {
	name: 'checkDubs',
	checkDubs(message) {
		const message_id = message.id;
		const m = message.content.toLowerCase();
		const dubs_words = ['dubs', 'dub5', 'doobs', 'd00bs', 'd00b5', 'doubles', 'doobles', 'dubbies', 'dubby', 'dubski'];
		const all_words = [...dubs_words, 'trips', 'quads', 'quints'];

		const last_digit = parseInt(message_id[message_id.length - 1]);

		let count = 1;

		while (last_digit === parseInt(message_id[message_id.length - (count + 1)])) {
			count++;
		}

		let column;
		let correct_call = false;
		let did_attempt = false;

		if (containsAny(m, all_words)) {
			did_attempt = true;
		}

		if (count > 1) {
			switch (count) {
			case 2:
				column = 'dubs';
				if (containsAny(m, all_words)) {
					if (containsAny(m, dubs_words)) {
						correct_call = true;
					}
					message.reply({ content: `MessageID: ${message_id} Holy shit! You got dubs`, files: ['./img/dubs.jpg'] });
				}
				else {
					message.react('2️⃣');
				}
				break;
			case 3:
				column = 'trips';
				if (doesContain(message.content, 'trips')) {
					correct_call = true;
				}
				message.reply({ content: `MessageID: ${message_id} Woah!! You got trips`, files: ['./img/trips.jpg'] });
				break;
			case 4:
				column = 'quads';
				if (doesContain(message.content, 'quads')) {
					correct_call = true;
				}
				message.reply({ content: `MessageID: ${message_id} Oh fug!!! You got quads`, files: ['./img/quads.png'] });
				break;
			case 5:
				column = 'quints';
				if (doesContain(message.content, 'quints')) {
					correct_call = true;
				}
				message.reply({ content: `@everyone MessageID: ${message_id} THATS QUINTS BABY!!`, files: ['./img/thefirstquints.png', './img/quints.png'] });
				break;
			default:
				message.reply({ content: `@everyone MessageID: ${message_id} WOOOOOAAAAAHHHHH!!!!`, files: ['./img/holy.jpg'] });
				break;
			}

			const userID = message.author.id;

			let sql = `SELECT * FROM dubs WHERE UserID="${userID}"`;

			con.query(sql, (err, result) => {
				if (err) throw err;
				if (result.length) {
					// user exists
					if (result[0].highest < count) {
						sql = `UPDATE dubs SET highest=${count} WHERE UserID=${userID}`;
						con.query(sql, (err) => {
							if (err) throw err;
						});
					}

					if (did_attempt) {
						if (correct_call) {
							sql = `UPDATE dubs SET ${column}=${column}+1, called_${column}=called_${column}+1, attempts=attempts+1 WHERE UserID=${userID}`;
						}
						else {
							sql = `UPDATE dubs SET ${column}=${column}+1, attempts=attempts+1 WHERE UserID=${userID}`;
						}
					}
					else {
						sql = `UPDATE dubs SET ${column}=${column}+1 WHERE UserID=${userID}`;
					}

					con.query(sql, (err) => {
						if (err) throw err;
					});
				}
				else {
					// new entry
					sql = `INSERT INTO dubs VALUES ("${userID}", 0, 0, 0, 0, ${count}, 0, 0, 0, 0, 0)`;

					con.query(sql, (err) => {
						if (err) throw err;
					});

					if (did_attempt) {
						if (correct_call) {
							sql = `UPDATE dubs SET ${column}=${column}+1, correct_${column}=correct_${column}+1, attempts=attempts+1 WHERE UserID=${userID}`;
						}
						else {
							sql = `UPDATE dubs SET attempts=attempts+1 WHERE UserID=${userID}`;
						}
					}
					else {
						sql = `UPDATE dubs SET ${column}=${column}+1 WHERE UserID=${userID}`;
					}

					con.query(sql, (err) => {
						if (err) throw err;
					});
				}
			});
		}
		else {
			const userID = message.author.id;

			if (did_attempt) {
				let sql = `SELECT * FROM dubs WHERE UserID="${userID}"`;

				con.query(sql, (err, result) => {
					if (err) throw err;
					if (result.length) {
						// user exists
						if (did_attempt) {
							sql = `UPDATE dubs SET attempts=attempts+1 WHERE UserID=${userID}`;

							con.query(sql, (err) => {
								if (err) throw err;
							});
						}
					}
					else {
						// new user
						if (did_attempt) {
							sql = `INSERT INTO dubs VALUES ("${userID}", 0, 0, 0, 0, 0, 0, 0, 0, 0, 1)`;
						}
						else {
							sql = `INSERT INTO dubs VALUES ("${userID}", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)`;
						}
						con.query(sql, (err) => {
							if (err) throw err;
						});
					}
				});
			}

			if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) && containsAny(m, all_words)) {
				message.react('❌');
				return;
			}

			if (containsAny(m, dubs_words)) {
				updateTimeout(userID, 5);
				message.member.timeout(1000 * 60 * 5, 'Owned idiot');
				message.reply({ content: 'No dubs. You\'ve been put in timeout for 5 minutes.', files: ['./img/clown.jpg'] })
					.then(msg => {
						setTimeout(() => msg.delete(), 1000 * 60 * 5);
						setTimeout(() => message.delete(), 1000 * 60 * 5);
					});
			}
			else if (doesContain(m, 'trips')) {
				updateTimeout(userID, 10);
				message.member.timeout(1000 * 60 * 10, 'Owned idiot');
				message.reply({ content: 'No trips. You\'ve been put in timeout for 10 minutes.', files: ['./img/clown2.jpg'] })
					.then(msg => {
						setTimeout(() => msg.delete(), 1000 * 60 * 10);
						setTimeout(() => message.delete(), 1000 * 60 * 10);
					});
			}
			else if (doesContain(m, 'quads')) {
				updateTimeout(userID, 15);
				message.member.timeout(1000 * 60 * 15, 'Owned idiot');
				message.reply({ content: 'No quads. You\'ve been put in timeout for 15 minutes.', files: ['./img/clown3.jpg'] })
					.then(msg => {
						setTimeout(() => msg.delete(), 1000 * 60 * 15);
						setTimeout(() => message.delete(), 1000 * 60 * 15);
					});
			}
			else if (doesContain(m, 'quints')) {
				updateTimeout(userID, 30);
				message.member.timeout(1000 * 60 * 30, 'Owned idiot');
				message.reply({ content: 'No quints. You\'ve been put in timeout for 30 minutes.', files: ['./img/booboo.jpg'] })
					.then(msg => {
						setTimeout(() => msg.delete(), 1000 * 60 * 30);
						setTimeout(() => message.delete(), 1000 * 60 * 30);
					});
			}
		}
	},
	async dubsLeaderboard(message) {
		let userArray = await message.guild.members.fetch();

		userArray = userArray.map(user => {
			return user.user.id;
		});

		console.log('Connected. Displaying dubs leaderboard');
		const sql = 'SELECT * FROM dubs ORDER BY quints DESC, quads DESC, trips DESC, dubs DESC';

		con.query(sql, userArray, async (err, result) => {
			if (err) throw err;
			let leaderboard = 'DUBS (CHECK EM) LEADERBOARD';
			for (const i in result) {
				if (!userArray.includes(result[i].UserID)) {
					continue;
				}
				const name = await message.guild.members.fetch(result[i].UserID);
				leaderboard += '\n- - - - - - - - - - - - - - - - - - - -\n';
				leaderboard += `**${name.displayName}**  |  Dubs: ${result[i].dubs}  |  Trips: ${result[i].trips}  |  Quads: ${result[i].quads}  |  Quints: ${result[i].quints}`;
			}
			return message.reply(leaderboard);
		});
	},
};
