const dh = require("./discordHelper.js");

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
	//Return
	return this;
}

module.exports = init;