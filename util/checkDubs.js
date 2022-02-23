const mysql = require('mysql');
const { doesContain, containsAny } = require('./doesContain');
const { Permissions } = require('discord.js');

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
		const dubs_words = ['dubs', 'dub5', 'doobs', 'd00bs', 'd00b5', 'doubles', 'doobles'];
		const all_words = dubs_words.push(['trips', 'quads', 'quints']);

		const last_digit = parseInt(message_id[message_id.length - 1]);

		let count = 1;

		while (last_digit === parseInt(message_id[message_id.length - (count + 1)])) {
			count++;
		}

		let column;

		if (count > 1) {
			switch (count) {
			case 2:
				column = 'dubs';
				if (containsAny(m, all_words)) {
					message.reply({ content: `MessageID: ${message_id} Holy shit! You got dubs`, files: ['./img/dubs.jpg'] });
				}
				break;
			case 3:
				column = 'trips';
				message.reply({ content: `MessageID: ${message_id} Woah!! You got trips`, files: ['./img/trips.jpg'] });
				break;
			case 4:
				column = 'quads';
				message.reply({ content: `MessageID: ${message_id} Oh fug!!! You got quads`, files: ['./img/quads.png'] });
				break;
			case 5:
				column = 'quints';
				message.reply({ content: `MessageID: ${message_id} THATS QUINTS BABY!!`, files: ['./img/quints.png'] });
				break;
			default:
				message.reply({ content: `MessageID: ${message_id} WOOOOOAAAAAHHHHH!!!!`, files: ['./img/holy.jpg'] });
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
						con.query(sql, function(err, result2) {
							if (err) throw err;
							console.log(result2);
						});
					}

					sql = `UPDATE dubs SET ${column}=${column}+1 WHERE UserID=${userID}`;
					con.query(sql, function(err, result3) {
						if (err) throw err;
						console.log(result3);
					});
				}
				else {
					// new entry
					sql = `INSERT INTO dubs VALUES ("${userID}", 0, 0, 0, 0, ${count})`;

					con.query(sql, function(err, result4) {
						if (err) throw err;
						console.log(result4);
					});

					sql = `UPDATE dubs SET ${column}=${column}+1 WHERE UserID=${userID}`;
					con.query(sql, function(err, result5) {
						if (err) throw err;
						console.log(result5);
					});
				}
				console.log(result);
			});
		}
		else {
			console.log('shut up >:(');
			if (containsAny(m, dubs_words)) {
				if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
					message.reply({ content: 'You are an Administator of this guild and cannot be put in timeout' });
					return;
				}
				message.member.timeout(1000 * 60 * 5, 'Owned idiot');
				message.reply({ content: 'No dubs. You\'ve been put in timeout for 5 minutes.', files: ['./img/clown.jpg'] });
			}
			else if (doesContain(m, 'trips')) {
				if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
					message.reply({ content: 'You are an Administator of this guild and cannot be put in timeout' });
					return;
				}
				message.member.timeout(1000 * 60 * 10, 'Owned idiot');
				message.reply({ content: 'No trips. You\'ve been put in timeout for 10 minutes.', files: ['./img/clown2.jpg'] });
			}
			else if (doesContain(m, 'quads')) {
				if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
					message.reply({ content: 'You are an Administator of this guild and cannot be put in timeout' });
					return;
				}
				message.member.timeout(1000 * 60 * 15, 'Owned idiot');
				message.reply({ content: 'No quads. You\'ve been put in timeout for 15 minutes.', files: ['./img/clown3.jpg'] });
			}
			else if (doesContain(m, 'quints')) {
				// soso
				if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
					message.reply({ content: 'You are an Administator of this guild and cannot be put in timeout' });
					return;
				}
				message.member.timeout(1000 * 60 * 30, 'Owned idiot');
				message.reply({ content: 'No quints. You\'ve been put in timeout for 30 minutes.', files: ['./img/booboo.jpg'] });
			}
		}
	},
	async dubsLeaderboard(message) {
		let userArray = await message.guild.members.fetch();

		userArray = userArray.map(user => {
			return user.user.id;
		});

		console.log(userArray);

		console.log('Connected. Displaying dubs leaderboard');
		const sql = 'SELECT * FROM dubs ORDER BY quints DESC, quads DESC, trips DESC, dubs DESC';

		con.query(sql, userArray, async (err, result) => {
			if (err) throw err;
			console.log(result);
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
