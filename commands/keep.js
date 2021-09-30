const { SlashCommandBuilder } = require('@discordjs/builders');
const { random } = require('../util/random');
// const fs = require('fs');
const mysql = require('mysql');
require('dotenv').config();
// const words = require('../words.json');

const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
});


module.exports = {
	data: new SlashCommandBuilder()
		.setName('keep')
		.setDescription('Let Stinkbot choose what to keep')
		.addStringOption(option =>
			option.setName('thing')
				.setDescription('The thing to keep')
				.setRequired(true)),
	async execute(interaction) {
		const thing = interaction.options.getString('thing').toLowerCase();

		const sql = `SELECT * FROM keep_stuff WHERE thing="${thing}"`;

		con.query(sql, (error, result) => {
			if (error) throw error;
			if (result.length) {
				// already been decided on
				const verdict = result[0].decision ? 'Yes' : 'No';
				interaction.reply(`Verdict already reached for ${thing}. Decision was ${verdict}`);
				console.log(verdict);
			}
			else {
				let decision = random(0, 2);
				const sql2 = `INSERT INTO keep_stuff VALUES ("${thing}", ${decision})`;
				con.query(sql2, (error2, result2) => {
					if (error2) throw error2;
					console.log(result2);
				});

				decision = decision ? 'Yes' : 'No';

				interaction.reply(`${thing}? ${decision}`);
			}
		});
	},
};