const dh = require("./discordHelper.js");
const cfg = require("./config");
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const ytSearch = require("youtube-search");

// Utils
const { parseVolume } = require("./utilities.js");

const SUPPORTED_SOUND_FILES = [".mp3", ".wav", ".webm", ".mpag", ".mp4"];
const NUM_EMOJIS = [
	"0⃣",
	"1⃣",
	"2⃣",
	"3⃣",
	"4⃣",
	"5⃣",
	"6⃣",
	"7⃣",
	"8⃣",
	"9⃣",
	"🔟"
];


function init(client) {
	this.nowPlaying = "";

	this.setPlaying = (value) => {
		this.nowPlaying = value;
	}

	this.fileCommands = [];

	let files = fs.readdirSync("./music");
	files.forEach((item) => {
		let ext = path.extname(item);
		if (SUPPORTED_SOUND_FILES.indexOf(ext) != -1) {
			this.fileCommands.push(new dh.Command(path.basename(item, ext), (msg) => {
				getConnection(msg, (con) => {
					if (!con) return;
					con.playFile(path.resolve("music/" + item));
					dh.log(`Playing "${item}" in ${con.channel.name}, guild: ${con.channel.guild.name}`);
					setPlaying(item);
				}, true);
			}, "music"));
		}
	});

	this.playing = new dh.Command("playing", (msg) => {
		msg.author.send(this.nowPlaying);
	}, "voice controls", "Sends a message with url to song which is (or was) playing");

	function getConnection(msg, callback, connect = false) {
		let channel = msg.member.voiceChannel;
		let id = msg.member.voiceChannelID;
		if (!channel || !id) {
			callback(null);
			return;
		}
		if (id in client.voiceCons) {
			callback(client.voiceCons[id]);
			return;
		} else if (connect) {
			if (!channel.joinable) {
				callback(null);
				return;
			} else {
				channel.join()
					.then(connection => {
						connection.on("disconnect", (e) => {
							delete client.voiceCons[id];
							dh.log(`Disconnected from ${channel.name} in ${channel.guild.name}`);
						});
						client.voiceCons[id] = connection;
						dh.log(`Connected to voice channel (${id})${channel.name} in ${channel.guild.name}`);
						callback(connection);
						return;
					})
					.catch(console.error);
			}
		}
	}

	//Utility
	this.stop = new dh.Command("stop", (msg) => {
		getConnection(msg, (con) => {
			if (!con || !con.dispatcher) return;
			con.dispatcher.stream.destroy();
			con.dispatcher.end("stop");
		});
	}, "voice controls", "Stops the current song without leaving the channel");

	this.dc = new dh.Command("dc", (msg) => {
		getConnection(msg, (con) => {
			if (!con) return;
			if (con.dispatcher) {
				con.dispatcher.end("dc");
			}
			con.disconnect();
		});
	}, "voice controls", "Disconnects the bot from the current channel");

	this.volume = new dh.Command("volume", (msg) => {
		getConnection(msg, (con) => {
			if (!con || !con.dispatcher) return;

			const vol = parseVolume(msg.splitContent[0]);
			con.dispatcher.setVolume(vol);
		});
	}, "voice controls", "Usage: !volume <percentage>, Sets the music volume in percentages (Default - 100)");

	//Commands

	function chainReact(msg, reactions, callback, index = 0) {
		if (!reactions[index]) {
			callback(msg);
			return;
		}
		msg.react(reactions[index])
			.then(() => chainReact(msg, reactions, callback, index + 1))
			.catch(() => chainReact(msg, reactions, callback, index + 1));
	}

	function youtube(msg) {
		if (msg.channel.type != "text") return;
		let url = msg.splitContent[0];
		const volume = parseVolume(msg.splitContent[1]);
		if (!url) {
			dh.log(`(${msg.author.id})${msg.author.username}#${msg.author.discriminator} requested "yt" without arguments`);
			return;
		}
		if (!ytdl.validateURL(url)) {
			let searchString = msg.splitContent.join(" ");
			ytSearch(searchString, {
				key: cfg.YOUTUBE_API_KEY,
				maxResults: 5
			}, (err, res) => {
				if (err) {
					msg.channel.send("Bot error! Sorry :(")
						.catch(err => {
							throw new Error(err)
						});
					dh.log("ERROR - %o", err);
				}
				let text = `__Search results for **${searchString}**:__`;
				res.forEach((item, index) => {
					text += `\n**#${index + 1}** - ${item.title}`;
				});
				msg.channel.send(text)
					.then(async (message) => {
						let reactions = {};
						res.forEach(await function (item, i) {
							let char = NUM_EMOJIS[i + 1];
							reactions[char] = item;
						});
						reactions["❌"] = {};
						chainReact(message, Object.keys(reactions), (message) => {
							dh.log("Sent all reactions");
						});
						message.awaitReactions((reaction, user) => reaction.emoji.name in reactions && user.id == msg.author.id, {
							max: 1,
							time: 30000
						})
							.then((reactionCol) => {
								let reaction = reactionCol.array()[0];
								if (reaction && reaction.emoji.name in reactions && reactions[reaction.emoji.name].link) {
									playYoutube(msg, reactions[reaction.emoji.name].link);
								}
								if (message.deletable) {
									message.delete()
										.then(message => dh.log(`Deleted message bots message.`))
										.catch(err => dh.log("ERROR - " + err));
								}
							})
							.catch((err) => {
								dh.log("ERROR - %o", err);
							});
					});
			});
			return;
		} else {
			playYoutube(msg, url, volume);
		}
	}

	function playYoutube(msg, url, volume = 1) {
		getConnection(msg, (con) => {
			if (!con) return;
			let stream = ytdl(url, {
				filter: 'audioonly',
				quality: "lowest"
			});
			if (!stream) {
				dh.log(`YTDL didn't return any stream for "${url}"`);
				return;
			}
			setPlaying(url);
			con.playStream(stream);
			con.dispatcher.setVolume(volume);
			dh.log(`Playing "${url}" in ${con.channel.name}, guild: ${con.channel.guild.name}`)
		}, true);
	}

	this.yt = new dh.Command("yt", youtube, "youtube", "Usage: !yt <search_terms> <volume>, Returns top 5 searches from youtube and plays the selected one. Can also be used with <video_link> which will play the audio immediately.");

	//Return
	return this;
}

module.exports = init;