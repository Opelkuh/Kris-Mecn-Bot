const dh = require("./discordHelper");
const request = require("request");
const xmlParse = require("xml2js").parseString;

//-----------------------------------
//PORTED FROM KRIS 2.0
//-----------------------------------
function randomInt(min, max) { //MINIMUM - Inclusive, MAXIMUM - Exclusive
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rule34(msg) {
	let target = msg.splitContent.join(" ");
	request.get("https://rule34.xxx/index.php?page=dapi&s=post&q=index&limit=0&tags=" + target, {}, function (error, response, body) {
		if (error) {
			dh.log("Error occured when accessing https://rule34.xxx");
			return;
		}
		xmlParse(body, function (err, data) {
			if (err || !data) {
				dh.log(err)
				return;
			}
			if (data.posts && data.posts.$.count != "0") {
				getRule34Image(msg, data.posts.$.count);
			} else {
				dh.log("Nothing found for r34 request for tags: '" + target + "'");
				msg.channel.send("Nothing found for **" + msg.splitContent.join(" ") + "**, " + msg.author.username);
			}
		});
	})
}

function getRule34Image(msg, count) {
	if (count.length > 6) {
		count = count.substring((count.length - 6));
	}
	count = parseInt(count) - 1;
	target = randomInt(0, count);
	request.get("https://rule34.xxx/index.php?page=dapi&s=post&q=index&limit=1&tags=" + msg.splitContent.join(" ") + "&pid=" + target, {}, function (error, response, body) {
		if (error) {
			dh.log("Error when accessing rule34 picture with id " + target);
			return;
		}
		xmlParse(body, function (err, data) {
			if (err) {
				dh.log("XML parse err: " + err)
				return;
			}
			if (data.hasOwnProperty("posts") && data.posts.hasOwnProperty("post")) {
				dh.log(`Sent r34 image for (${msg.author.id})${msg.author.username}#${msg.author.discriminator}, Tags: "${msg.splitContent.join(" ")}"`);
				msg.channel.send(msg.author.username + " requested **" + msg.splitContent.join(" ") + "**. Selected picture #" + (target + 1) + " from " + (count + 1) + " pictures. Here you go: " + data.posts.post[0].$.file_url);
			} else {
				dh.log("Error occured when requesting r34 image for tags: '" + target + "'");
				msg.channel.send("Couldn't get the picture. Sorry " + msg.author.username + " :(");
			}
		});
	})
}
//-----------------------------------
//END PORT
//-----------------------------------
module.exports.rule34 = new dh.Command("rule34", rule34, "nsfw", "Usage: !rule34 <tags>, Returns image from rule34.xxx with <tags> (separate individual tags with ' ')");