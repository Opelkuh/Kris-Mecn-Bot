const dh = require("./discordHelper.js");
const cfg = require("./config");

const INVITE_STRING = cfg.INVITE_LINK;

function init(client) {
	this.uptime = new dh.Command("uptime", (msg) => {
		let date = new Date(process.uptime() * 1000);
		let timeString = `${(date.getHours()-1).toString().padStart(2,"0")} hours ${date.getMinutes().toString().padStart(2,"0")} minutes ${date.getSeconds().toString().padStart(2,"0")} seconds`;
		dh.log("Uptime is " + timeString);
		msg.channel.send("I've been working for " + timeString);
	}, "util", "Send the current uptime");

	this.invite = new dh.Command("invite", (msg) => {
		msg.author.send(INVITE_STRING);
	}, "util", "Sends you the invite link");

	this.restart = new dh.Command("restart", (msg) => {
		console.log(msg.fromAdmin);
		if (!msg.fromAdmin) return;
		dh.log(`Restart was issued by (${msg.author.id})${msg.author.username}#${msg.author.discriminator}`);
		console.log("bye");
		msg.channel.send("Bye")
			.then(() => {
				process.exit(69);
			})
			.catch((err) => {
				process.exit(69);
			});
	}, "admin");

	//Return
	return this;
}

module.exports = init;