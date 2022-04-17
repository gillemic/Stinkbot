const mysql = require('mysql');

const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
});

module.exports = {
	name: 'updateTimeout',
	updateTimeout(userID, time) {
		let sql = `SELECT * FROM timeout WHERE UserID="${userID}"`;

		con.query(sql, (err, result) => {
			if (err) throw err;
			if (result.length) {
				// user exists
				sql = `UPDATE timeout SET Timeouts=Timeouts+1, TotalTime=TotalTime+${time} WHERE UserID=${userID}`;
				con.query(sql, function(err, result3) {
					if (err) throw err;
					console.log(result3);
				});
			}
			else {
				// new entry
				sql = `INSERT INTO timeout VALUES ("${userID}", 1, ${time})`;

				con.query(sql, function(err, result4) {
					if (err) throw err;
					console.log(result4);
				});
			}
		});
	},
	async timeoutLeaderboard(message) {
		let userArray = await message.guild.members.fetch();

		userArray = userArray.map(user => {
			return user.user.id;
		});

		console.log('Connected. Displaying dubs leaderboard');
		const sql = 'SELECT * FROM timeout ORDER BY TotalTime DESC, Timeouts ASC';

		con.query(sql, userArray, async (err, result) => {
			if (err) throw err;
			let leaderboard = 'TIMEOUT LEADERBOARD';
			for (const i in result) {
				if (!userArray.includes(result[i].UserID)) {
					continue;
				}
				const name = await message.guild.members.fetch(result[i].UserID);
				leaderboard += '\n- - - - - - - - - - - - - - - - - - - -\n';
				leaderboard += `**${name.displayName}**  |  Timeouts: ${result[i].dubs}  |  Total time spent in timeout: ${result[i].trips}`;
			}
			return message.reply(leaderboard);
		});
	},
};
