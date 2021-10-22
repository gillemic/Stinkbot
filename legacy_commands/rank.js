const { hashShuffle } = require('../util/shuffle');
const mysql = require('mysql');
require('dotenv').config();

const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
});

let sql = '';

async function getAdjective() {
	const query = 'SELECT * FROM rank_adjectives ORDER BY RAND() LIMIT 1';
	con.query(query, (error, result) => {
		if (error) return error;
		const adj2 = result[0].descriptors;
		return adj2;
	});
}

module.exports = {
	name: 'rank',
	description: 'ranks the users in a server',
	args: false,
	usage: 'rank [adjective]',
	async execute(message, args) {
		let adj2;

		if (args.length) {
			adj2 = args.join(' ').toLocaleUpperCase();

			sql = `SELECT * FROM rank_adjectives WHERE descriptors="${adj2}"`;
			con.query(sql, (error, result) => {
				if (error) throw error;
				if (result.length) {
					// skip without adding to database
					// console.log(result);
				}
				else {
					// add to databse
					sql = `INSERT INTO rank_adjectives VALUES ("${adj2}")`;
					con.query(sql, (error2) => {
						if (error2) throw error2;
					});
				}
			});
		}
		else {
			// choose from database
			adj2 = await getAdjective();
			sql = 'SELECT * FROM rank_adjectives ORDER BY RAND() LIMIT 1';
			con.query(sql, (error, result) => {
				if (error) return error;
				adj2 = result[0].descriptors;
			});
		}

		const membersList = await message.guild.members.fetch();
		const memberNames = membersList.map(user => user.nickname ?? user.user.username);

		const shuffledNames = hashShuffle(memberNames, adj2);

		let str = `MOST **${adj2}** USERS IN THIS SERVER: RANKED\n\n`;

		const l = shuffledNames.length;

		for (let i = 0; i < l; i++) {
			str += `${i + 1}. ${shuffledNames[i]}\n`;
		}

		message.channel.send(str);
	},
};