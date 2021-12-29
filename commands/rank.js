const { SlashCommandBuilder } = require('@discordjs/builders');
const { hashShuffle } = require('../util/shuffle');
const mysql = require('mysql2');
require('dotenv').config();
// const fs = require('fs');
// const descriptors = require('../descriptors.json');

const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
});

let sql = '';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Ranks the users in a server')
		.addStringOption(option =>
			option.setName('adjective')
				.setDescription('An adjective to rank everyone by. Leave blank to choose a random one from Stinkbot\'s past')
				.setRequired(false)),
	async execute(interaction) {
		let adj2 = interaction.options.getString('adjective');

		if (adj2) {
			adj2 = adj2.toLocaleUpperCase();

			sql = `SELECT * FROM rank_adjectives WHERE descriptors="${adj2}"`;
			con.query(sql, (error, result) => {
				if (error) throw error;
				if (result.length) {
					// skip without adding to database
					console.log(result);
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
			sql = 'SELECT * FROM rank_adjectives ORDER BY RAND() LIMIT 1';

			con.query(sql, (error, result) => {
				if (error) throw error;
				adj2 = result[0].descriptors ?? 'STINKY';
			});
		}

		const membersList = await interaction.guild.members.fetch();
		const memberNames = membersList.map(user => user.nickname ?? user.user.username);

		const shuffledNames = hashShuffle(memberNames, adj2);

		let str = `MOST **${adj2}** USERS IN THIS SERVER: RANKED\n\n`;

		const l = shuffledNames.length;

		for (let i = 0; i < l; i++) {
			str += `${i + 1}. ${shuffledNames[i]}\n`;
		}

		interaction.reply(str);
	},
};