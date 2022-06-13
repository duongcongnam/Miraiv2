module.exports.config = {
	name: "money",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Kiểm tra số tiền của bản thân hoặc người được tag",
	commandCategory: "Ngân hàng",
	usages: "[trống|Tag]",
	cooldowns: 5
};
module.exports.run = async function({ api, event, args, Currencies, Users}) {
	  const { threadID, messageID, senderID, mentions } = event;
	if (!args[0]) {
		const money = (await Currencies.getData(senderID)).money;
    let name = await Users.getNameUser(event.senderID)
	return api.sendMessage(`[ 𝗧𝗧𝗧𝗞 ]\n🧠 Tên: ${name}\n💵 Tài sản: ${money} $`,event.threadID, event.messageID);	}
	else if (Object.keys(event.mentions).length == 1) {
		var mention = Object.keys(mentions)[0];
		var money = (await Currencies.getData(mention)).money;
		if (!money) money = 0;
 return api.sendMessage({body:`[ 𝗧𝗧𝗧𝗞 ]\n🧠 Tên: ${mentions[mention].replace(/\@/g, "")}\n💵 Tài sản: ${money} $`,
			mentions: [{
			  tag: mentions[mention].replace(/\@/g, ""),
				id: mention
			}]
    }, threadID, messageID);
	}
	else return global.utils.throwError(this.config.name, threadID, messageID);
}
