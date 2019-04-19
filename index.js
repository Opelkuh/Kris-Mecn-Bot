const dh = require("./discordHelper.js");
const Discord = require('discord.js');
const discordClient = new Discord.Client();
//Config
const cfg = require("./config");
//Additional libraries

//Command files
const voiceCommands = require("./voiceCommands.js")(discordClient);
const nsfwCommands = require("./nsfwCommands.js");
const utilityCommands = require("./utilityCommands.js")(discordClient);
const chatCommands = require("./chatCommands.js")(discordClient);
const HangMan = require("./HangMan.js")(discordClient);
//Vars
const client = new dh.Client(discordClient, cfg.PREFIX);

discordClient.on('ready', () => {
	dh.log('Ready!');
	discordClient.user.setPresence(cfg.PRESENCE);
});

discordClient.voiceCons = {};

client.login(cfg.DISCORD_TOKEN);
//Register admins
cfg.ADMINS.forEach((i) => {
	client.registerAdmin(i);
});


var deleteCmd = new dh.Command(null, (msg) => {
	if (msg.deletable) {
		msg.delete()
			.then(msg => dh.log(`Deleted message from (${msg.author.id})${msg.author.username}#${msg.author.discriminator}`))
			.catch(err => dh.log("ERROR - " + err));
	}
});



client.addCommand(deleteCmd);
//Add voice commands
client.addCommand(voiceCommands.yt);
client.addCommand(voiceCommands.dc);
client.addCommand(voiceCommands.stop);
client.addCommand(voiceCommands.volume);
voiceCommands.fileCommands.forEach(item => {
	client.addCommand(item);
});
//Add chat commnads
client.addCommand(chatCommands.flex);
client.addCommand(chatCommands.wiki);
client.addCommand(chatCommands.calc);
client.addCommand(chatCommands.roll);
client.addCommand(HangMan.HangManStart);
client.addCommand(HangMan.HangManGuess);
//Add nsfw commands
client.addCommand(nsfwCommands.rule34);
//Add util commands
client.addCommand(utilityCommands.uptime);
client.addCommand(utilityCommands.invite);
client.addCommand(utilityCommands.restart);
//Create help
var helpString = cfg.HELP_PREFIX + client.generateHelp(["util", "nsfw", "voice controls", "youtube", "music", "chat"]);
var helpCmd = new dh.Command("help", (msg) => {
	msg.author.send(helpString);
});
client.addCommand(helpCmd);

console.log("Loaded all commands!");