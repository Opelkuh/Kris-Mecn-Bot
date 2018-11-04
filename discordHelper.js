Log = (msg) => {
	let date = new Date();
	let day = `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
	let time = `${date.getHours().toString().padStart(2,"0")}:${date.getMinutes().toString().padStart(2,"0")}:${date.getSeconds().toString().padStart(2,"0")}`;
	msg = `${day} ${time} - ` + msg;
	console.log(msg);
};

class Client {
	_handleCommand(msg) {
		if (msg.author.bot || !msg.content.startsWith(this.prefix)) return;
		if (this.admins.indexOf(msg.author.id) != -1) msg.fromAdmin = true;
		let msgSplit = msg.content.substr(this.prefix.length).split(" ");
		if (msgSplit[0].toLowerCase() in this.commands) {
			let command = msgSplit.shift().toLowerCase();
			Log(`(${msg.author.id})${msg.author.username}#${msg.author.discriminator} requested "${command}"`);
			msg.splitContent = msgSplit;
			this.commands[command].call(msg);
			this.onCommand.forEach((item) => {
				item.call(msg);
			});
		}
	}

	constructor(client, prefix) {
		this.commands = {};
		this.onCommand = [];
		this.admins = [];
		this.client = client;
		this.prefix = prefix;

		this.client.on('message', msg => {
			this._handleCommand(msg)
		});

		this.client.on('disconnect', () => {
			Log("Disconnected from Discord servers!");
		});

		this.client.on('resume', (num) => {
			Log("Connection to Discord servers resumed! Missed " + num + " messages.");
		});
	}

	addCommand(cmd) {
		if (!cmd.command) {
			return this.onCommand.push(cmd)
		}
		this.commands[cmd.command.toLowerCase()] = cmd;
	}

	registerAdmin(id) {
		this.admins.push(id);
	}

	login(token) {
		this.client.login(token);
	}

	generateHelp(groups) {
		var commandArray = Object.values(this.commands);
		var ret = "";
		groups.forEach(group => {
			var commands = commandArray.filter(i => {
				return i.group == group
			});
			if (commands.length <= 0) return;
			ret += "__**" + group.toUpperCase() + "**__\n";
			commands.forEach(item => {
				ret += `${this.prefix}${item.command}`;
				if (item.description) {
					ret += ` - ${item.description}`;
				}
				ret += "\n";
			});
			ret += "\n";
		});
		return ret;
	}
}

class Command {
	constructor(command, func, group = "", description = "") {
		this.command = command;
		this.function = func;
		this.group = group;
		this.description = description;
	}

	call(msg) {
		this.function(msg);
	}
}

module.exports.log = Log;
module.exports.Client = Client;
module.exports.Command = Command;
