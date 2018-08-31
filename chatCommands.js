const dh = require("./discordHelper.js");
const discord = require("discord.js")
const request = require("request");

function init(client) {
	this.flex = new dh.Command("flex", (msg) => {
		getRandomChoice = (array) => {
			return array[Math.floor(Math.random() * array.length)];
		}

		let color = msg.splitContent[0];
		let face = msg.splitContent[1];

		const colorChoices = ["", "pale", "cream", "moderate", "dark", "black"];
		const faceChoices = ["tongue", "lips", "kiss"];
		if (!color) color = getRandomChoice(colorChoices);
		if (!face) face = getRandomChoice(faceChoices);

		switch (color) {
			case "pale":
				color = "🏻";
				break;
			case "cream":
				color = "🏼";
				break;
			case "moderate":
				color = "🏽";
				break;
			case "dark":
				color = "🏾";
				break;
			case "black":
				color = "🏿";
				break;
			default:
				color = "";
				break;
		}
		switch (face) {
			case "tongue":
				face = "👅";
				break;
			case "lips":
				face = "👄";
				break;
			case "kiss":
				face = "💋";
				break;
			case "pig":
				face = "🐽";
				break;
			default:
				face = "👅";
				break;
		}
		msg.channel.send(`💪${color}👁️${face}👁️💪${color}`);
	}, "chat", "Flex on 'em! Usage: !flex <none;pale;cream;moderate;dark;black> <none;tongue;lips;kiss;pig>");

	this.wiki = new dh.Command("wiki", (msg) => {
		let target = msg.splitContent.join("_");
		request.get("https://en.wikipedia.org/w/api.php?action=opensearch&search=" + encodeURIComponent(target) + "&limit=1&namespace=0&format=json", {}, function (error, response, body) {
			if (error) {
				dh.log("Wiki error");
				return;
			}
			let data = JSON.parse(body);
			let query = msg.splitContent.join(" ");
			if (data.length < 4 || !data[1].length) {
				msg.channel.send(`Nothing found for *${query}*, **${msg.author.username}**. Sorry.`);
				return;
			}
			let found = data[1][0];
			let result = data[2][0];
			let link = data[3][0];
			const embed = new discord.RichEmbed()
				.setTitle(found)
				.setAuthor("Wiki", "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1122px-Wikipedia-logo-v2.svg.png")
				.setDescription(result)
				.addField("Link", `${link}`)
				.setFooter(`Search result for "${query}". Requested by ${msg.author.username}`, msg.author.avatarURL)
			msg.channel.send(embed);
		});
	}, "chat", "Get wikipedia article! Usage: !wiki <query>");

	this.calc = new dh.Command("calc", (msg) => {
		let problem = msg.splitContent.join(" ");
		if (!problem.match(/^[0-9\+\-\*\/\%\:\s]+$/)) {
			msg.channel.send(`Invalid format, **${msg.author.username}**.`);
			return;
		}
		problem.replace(":", "/");
		msg.channel.send(`\`${problem}\`\n**Result:** \`${eval(problem)}\``);
	}, "calc", "Easy calculator! Usage: !calc <problem>");
	//Return
	return this;
}

module.exports = init;