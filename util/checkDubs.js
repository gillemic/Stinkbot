const mysql = require('mysql');

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
		console.log(message.author.id);

		const last_digit = parseInt(message_id[message_id.length - 1]) % 10;

		let count = 1;

		while (last_digit === parseInt(message_id[message_id.length - (count + 1)])) {
			count++;
		}

		let column;

		if (count > 1) {
			switch (count) {
			case 2:
				column = 'dubs';
				message.reply(`MessageID: ${message_id} Holy shit! You got dubs`);
				break;
			case 3:
				column = 'trips';
				message.reply(`MessageID: ${message_id} Woah!! You got trips`);
				break;
			case 4:
				column = 'quads';
				message.reply(`MessageID: ${message_id} Oh fug!!! You got quads`);
				break;
			case 5:
				column = 'quints';
				message.reply(`MessageID: ${message_id} THAT'S QUINTS BABY!!`);
				break;
			default:
				message.reply(`MessageID: ${message_id} WOOOOOAAAAAHHHHH!!!!`);
				break;
			}

			const userID = message.author.id;

			let sql = `SELECT * FROM dubs WHERE UserID="${userID}"`;

			con.query(sql, async (err, result) => {
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
	},
};