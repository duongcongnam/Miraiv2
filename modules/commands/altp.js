const moneydown = 5000; // Sửa số tiền đăng kí chơi tại đây

const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "altp",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Khoa x Nam",
  description: "chương trình Ai Là Triệu Phú siêu khó vip pro",
  commandCategory: "Game",
  usages: "register/play/info/stop || setlv (đặc quyền admin)",
  cooldowns: 5
};

function equi(level) {
  if (level == 0) var tienthuong = 0;
  if (level == 1) var tienthuong = 200;
  if (level == 2) var tienthuong = 400;
  if (level == 3) var tienthuong = 600;
  if (level == 4) var tienthuong = 1000;
  if (level == 5) var tienthuong = 2000;
  if (level == 6) var tienthuong = 3000;
  if (level == 7) var tienthuong = 6000;
  if (level == 8) var tienthuong = 10000;
  if (level == 9) var tienthuong = 14000;
  if (level == 10) var tienthuong = 22000;
  if (level == 11) var tienthuong = 30000;
  if (level == 12) var tienthuong = 40000;
  if (level == 13) var tienthuong = 80000;
  if (level == 14) var tienthuong = 150000;
  if (level == 15) var tienthuong = 250000;
  return tienthuong;
}


module.exports.handleReply = async function ({ event, Users, api, handleReply, Currencies }) {
  if (handleReply.type == "answer") {
    var { threadID, messageID, senderID } = event;
    if (senderID !== handleReply.author) return api.sendMessage("Chỗ người khác đang chơi vô duyên thế -.-", threadID, messageID);
    var name = await Users.getNameUser(senderID);
    var senderInfo = await Users.getData(senderID);
    var choose = event.body.toUpperCase();

    if (choose == "HELP 1" || choose == "HELP1") {
      if (senderInfo.data.helpaltp.helpm !== 1) return api.sendMessage("Bạn đã dùng quyền trợ giúp này rồi!", threadID, messageID);
      api.unsendMessage(handleReply.messageID);
      var mot = handleReply.one;
      var a = handleReply.author;
      var b = handleReply.dapandung;
      var c = handleReply.giaithich;
      senderInfo.data.helpaltp.helpm = 0;
      await Users.setData(senderID, senderInfo);
      var callback = () => api.sendMessage({
        body: `Chúng tôi đã nhờ máy tính loại bỏ hai phương án sai là ${mot[0]} và ${mot[1]}`,
        attachment: fs.createReadStream(__dirname + `/cache/question.png`)}, threadID, (error, info) => {
          global.client.handleReply.push({
            type: "answer",
            name: this.config.name,
            author: a,
            dapandung: b,
            giaithich: c,
            level: senderInfo.data.altp.level,
            messageID: info.messageID
          })
        fs.unlinkSync(__dirname + "/cache/question.png")
        })
      return request(`${mot[2]}`).pipe(fs.createWriteStream(__dirname + `/cache/question.png`)).on("close",() => callback());
    }

    if (choose !== "A" && choose !== "B" && choose !== "C" && choose !== "D") return api.sendMessage("Câu trả lời của bạn đéo hợp lệ!",threadID, messageID);
    if (choose == handleReply.dapandung) {
      var levelcc = handleReply.level + 1;
      if (levelcc < 15) {
        api.unsendMessage(handleReply.messageID);
        if (levelcc == 1) { djtme = "câu hỏi đầu tiên"; } else djtme = `câu hỏi số ${levelcc}`;
        api.sendMessage(`${choose} là đáp án chính xác, ${handleReply.giaithich}\n\nXin chúc mừng người chơi ${name} đã xuất sắc trả lời đúng ${djtme} nâng mức phần thưởng lên ${equi(levelcc)}$`, threadID, messageID);
        var cauhoi = levelcc + 1;

        const res = await axios.get(`https://raw.githubusercontent.com/KhoaDo472005/ailatrieuphu/main/altp${cauhoi}.json`);
        var x = Math.floor(Math.random() * res.data.allquestion.length);
        var question = res.data.allquestion[x];
        var linkanh = question.link;
        var dapandung = question.dapan;
        var giaithich = question.giaithich;
        var helpmot = question.helpone;
        senderInfo.data.altp = { level: levelcc, rd: x };
        await Users.setData(senderID, senderInfo);
        var cc = cauhoi == 5? "Câu hỏi cột mốc đầu tiên":cauhoi == 10?"Câu hỏi cột mốc thứ hai":cauhoi == 15?"Câu hỏi cuối cùng":"Câu hỏi số "+cauhoi
        var lmao = cc != "Câu hỏi số "+cauhoi?"trị giá":"nâng mức phần thưởng lên"
        var bruh = `${cc} ${lmao} ${equi(cauhoi)}$`;
        if (senderInfo.data.helpaltp.helpm == 1) bruh = bruh + '\n+Reply "help 1" để dùng quyền trợ giúp 50:50';
        var callback = () => api.sendMessage({
        body: `${bruh}`,
        attachment: fs.createReadStream(__dirname + `/cache/question.png`)}, threadID, (error, info) => {
          global.client.handleReply.push({
            type: "answer",
            name: this.config.name,
            author: senderID,
            dapandung: dapandung,
            giaithich: giaithich,
            one: helpmot,
            level: senderInfo.data.altp.level,
            messageID: info.messageID
          })
        fs.unlinkSync(__dirname + "/cache/question.png")
        })
        return request(linkanh).pipe(fs.createWriteStream(__dirname + `/cache/question.png`)).on("close",() => callback());
        
      } else if (levelcc == 15) {
        api.unsendMessage(handleReply.messageID);
        Currencies.increaseMoney(senderID, 250000);
        senderInfo.data.altp = { level: -1, rd: -1 };
        await Users.setData(senderID, senderInfo);
        return api.sendMessage(`${choose} là đáp án chính xác, ${handleReply.giaithich}\n\nXin chúc mừng người chơi ${name} đã xuất sắc vượt qua 15 câu hỏi của chương trình mang về 250000$\nHẹn gặp lại bạn ở chương trình lần sau!`, threadID, messageID);
      }
    } else {
      api.unsendMessage(handleReply.messageID);
      var level = handleReply.level;
      if (level >= 5 && level < 10) { var tienthuong = 2000; } else if (level >= 10) { var tienthuong = 22000; } else var tienthuong = 0;
      senderInfo.data.altp = { level: -1, rd: -1 };
      await Users.setData(senderID, senderInfo);
      if (tienthuong == 2000) var moc = "đầu tiên";
      if (tienthuong == 22000) var moc = "thứ hai";
      if (moc == "đầu tiên" || moc == "thứ hai") {
        Currencies.increaseMoney(senderID, tienthuong);
        return api.sendMessage(`${choose} là đáp án không chính xác, câu trả lời đúng của chúng ta là ${handleReply.dapandung}, ${handleReply.giaithich}\n\nNgười chơi của chúng ta đã trả lời sai và ra về với phần thưởng ở mốc ${moc} là ${tienthuong}$\nCảm ơn bạn đã tham gia chương trình, hẹn gặp lại bạn ở chương trình lần sau!`, threadID, messageID);
      } else {
        return api.sendMessage(`${choose} là đáp án không chính xác, câu trả lời đúng của chúng ta là ${handleReply.dapandung}, ${handleReply.giaithich}\n\nCảm ơn bạn đã tham gia chương trình, hẹn gặp lại bạn ở chương trình lần sau!`, threadID, messageID); 
      }
    }
  }
}


module.exports.run = async function ({ api, event, args, Currencies, Users}) {
  const threadSetting = global.data.threadData.get(threadID) || {};
  var prefix = threadSetting.PREFIX || global.config.PREFIX;
  const { configPath } = global.client;
  delete require.cache[require.resolve(configPath)];
  var config = require(configPath);
  const { ADMINBOT } = global.config;
  const listAdmin = ADMINBOT || config.ADMINBOT || [];
  var { threadID, messageID, senderID } = event;
  const dataMoney = await Currencies.getData(senderID);
  const money = dataMoney.money;
  var senderInfo = await Users.getData(senderID);
  var msg = `Bạn có thể dùng:\n\n  ${prefix}altp register: đăng kí tham gia chương trình\n  ${prefix}altp play: lấy câu hỏi tiếp theo\n  ${prefix}altp info: xem thông tin câu hỏi và tiền thưởng hiện tại của bạn\n  ${prefix}altp stop: dừng cuộc chơi và nhận tiền thưởng tương ứng`;
  var check = 0;
  for (const idAdmin of listAdmin) if (senderID == idAdmin) check++;
  if (check !== 0) msg += `\n  ${prefix}altp setlv [số level] @tag: thiết đặt lv của @tag (đặc quyền admin).`
  if (args.length == 0) return api.sendMessage(msg, threadID, messageID);
  var type = args[0].toLowerCase();
  if (type !== "register" && type !== "play" && type !== "info" && type !== "stop" && type!== "setlv") return api.sendMessage(msg, threadID, messageID);

  if (type == "setlv") {
    try {
      if (check == 0) return api.sendMessage("Bạn không đủ quyền hạn để dùng tính năng này!", threadID, messageID);
      var lv = parseInt(args[1]);
      if (isNaN(lv) || lv < 0 || lv > 15) return api.sendMessage(`Level ${args[1]} ko hợp lệ!`, threadID, messageID);
      var mention = Object.keys(event.mentions)[0];
      if (!mention) {
        var uname = "bạn";
        var mention = senderID;
      } else var uname = event.mentions[mention].replace("@", "");
      var Info = await Users.getData(mention);
      Info.data.altp = { level: lv, rd: -1 };
      await Users.setData(mention, Info);
      return api.sendMessage(`Đã đặt level của ${uname} thành ${lv}!`, threadID, messageID);
    } catch (error) {
      return api.sendMessage(`${error}!`, threadID, messageID);
    }
  }

  if (type == "register") {
    if (senderInfo.data.altp && senderInfo.data.altp.level !== -1) return api.sendMessage("Bạn đã đăng kí rồi, vui lòng vượt qua hết câu hỏi hoặc dừng cuộc chơi để có thể đăng kí lại!", threadID, messageID);
    if (money < moneydown) return api.sendMessage(`Bạn không có đủ ${moneydown} để đăng kí, vui lòng theo thầy Huấn làm ăn bươn chải!`, threadID, messageID);
    return api.sendMessage(`Reaction vào tin nhắn này để xác nhận dùng ${moneydown}$ đăng kí tham gia chương trình!`, threadID, (error, info) => {
      global.client.handleReaction.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        type: "register"
      })
    }, messageID)
  };
  
  if (type == "stop") {
    if (!senderInfo.data.altp || senderInfo.data.altp.level == -1) return api.sendMessage("Bạn chưa đăng kí tham gia chương trình!", threadID, messageID);
    var abc = senderInfo.data.altp.level;
    return api.sendMessage(`Reaction vào tin nhắn này để xác nhận dừng cuộc chơi tại đây và ra về với phần thưởng ${equi(abc)}$`, threadID, (error, info) => {
      global.client.handleReaction.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        type: "stop"
      })
    }, messageID)
  };
  
  if (type == "info") {
    const path2 = __dirname + '/cache/info.png';
    if (!fs.existsSync(path2)) {
      var down = (await axios.get("https://i.postimg.cc/D0nccdss/info.png", { responseType: "arraybuffer" })).data;
      fs.writeFileSync(path2, Buffer.from(down, "utf-8"));
    };
    if (!senderInfo.data.altp || senderInfo.data.altp.level == -1) return api.sendMessage({ body: `Bạn chưa đăng kí, dùng ${prefix}altp register để đăng kí nhé! (tốn ${moneydown}$)`, attachment: fs.createReadStream(path2)}, threadID, () => fs.unlinkSync(path2), messageID);
    var level = senderInfo.data.altp.level;
    if (level == 0) return api.sendMessage({ body: `Bạn chưa vượt qua câu hỏi nào, dùng ${prefix}altp play để bắt đầu nhé!`, attachment: fs.createReadStream(path2)}, threadID, () => fs.unlinkSync(path2), messageID);
    var name = await Users.getNameUser(senderID);
    return api.sendMessage({ body: `Bạn đã vượt qua ${level} câu hỏi\nTiền thưởng hiện tại là ${equi(level)}$\nDùng ${prefix}altp play để tiếp tục nhé!`, attachment: fs.createReadStream(path2)}, threadID, () => fs.unlinkSync(path2), messageID);
  };
  
  if (type == "play") {
    try {
      if (!senderInfo.data.altp || senderInfo.data.altp.level == -1) return api.sendMessage (`Bạn chưa đăng kí tham gia chương trình\nVui lòng dùng "${prefix}altp register" để đăng kí (tốn ${moneydown}$)`, threadID, messageID);
      if (isNaN(senderInfo.data.altp.level)) {
        senderInfo.data.altp = { level: 0, rd: -1 }
        await Users.setData(senderID, senderInfo);
      }
      var level = senderInfo.data.altp.level;
      if (level == 15) return api.sendMessage(`Bạn đã vượt qua hết 15 câu hỏi, dùng ${prefix}altp stop để nhận 250.000$`, threadID, messageID);
      var cauhoi = level + 1;
      const res = await axios.get(`https://raw.githubusercontent.com/KhoaDo472005/ailatrieuphu/main/altp${cauhoi}.json`);
      if (!senderInfo.data.altp.rd || senderInfo.data.altp.rd == -1) {
        var x = Math.floor(Math.random() * res.data.allquestion.length);
        senderInfo.data.altp = { level: level, rd: x };
        await Users.setData(senderID, senderInfo);
      } else var x = senderInfo.data.altp.rd;
      var question = res.data.allquestion[x];
      var linkanh = question.link;
      var dapan = question.dapan;
      var giaithich = question.giaithich;
      var helpmot = question.helpone;
      if (cauhoi == 1) { var cc = "Câu hỏi đầu tiên" } else if (cauhoi == 5) { var cc = "Câu hỏi cột mốc đầu tiên" } else if (cauhoi == 10) { var cc = "Câu hỏi cột mốc thứ hai" } else if (cauhoi == 15) { var cc = "Câu hỏi cuối cùng" } else var cc = `Câu hỏi số ${cauhoi}`;
      if (cc !== `Câu hỏi số ${cauhoi}`) { var lmao = "trị giá"; } else var lmao = "nâng mức phần thưởng lên";
	  var bruh = `${cc} ${lmao} ${equi(level+1)}$`;
	  if (senderInfo.data.helpaltp.helpm == 1) bruh = bruh + '\n+Reply "help 1" để dùng quyền trợ giúp 50:50';
      var callback = () => api.sendMessage({
        body: `${bruh}`,
        attachment: fs.createReadStream(__dirname + `/cache/question.png`)}, threadID, (error, info) => {
          global.client.handleReply.push({
          type: "answer",
          name: this.config.name,
          author: senderID,
          dapandung: dapan,
          giaithich: giaithich,
		  one: helpmot,
          level: level,
          messageID: info.messageID
        })
        fs.unlinkSync(__dirname + "/cache/question.png")
      })
      return request(linkanh).pipe(fs.createWriteStream(__dirname + `/cache/question.png`)).on("close",() => callback());
    }
    catch (error) {
      return api.sendMessage("Đã xảy ra lỗi!", threadID, messageID);
    }
  }
}

module.exports.handleReaction = async({ api, event, Threads, handleReaction, Currencies, Users }) => {
  if (event.userID != handleReaction.author) return
  var senderInfo = await Users.getData(handleReaction.author);
  
  if (handleReaction.type == "register") {
    const threadSetting = global.data.threadData.get(event.threadID) || {};
    var prefix = threadSetting.PREFIX || global.config.PREFIX;
    api.unsendMessage(handleReaction.messageID);
    Currencies.decreaseMoney(handleReaction.author, moneydown);
    const path1 = __dirname + '/cache/intro.png';
    if (!fs.existsSync(path1)) {
      var down = (await axios.get("https://i.postimg.cc/FH7B0wvY/intronew.png", { responseType: "arraybuffer" })).data;
      fs.writeFileSync(path1, Buffer.from(down, "utf-8"));
    };
    senderInfo.data.altp = { level: 0, rd: -1 };
    senderInfo.data.helpaltp = { helpm: 1, helph: 1, helpb: 1 };
    await Users.setData(handleReaction.author, senderInfo);
    return api.sendMessage({body: `Đăng kí thành công, chào mừng bạn đến với chương trình Ai Là Triệu Phú!\n\nDùng "${prefix}altp play" để bắt đầu!`, attachment: fs.createReadStream(path1)}, event.threadID, () => fs.unlinkSync(path1));
  }
  if (handleReaction.type == "stop") {
    api.unsendMessage(handleReaction.messageID);
    var level = senderInfo.data.altp.level;
    var name = await Users.getNameUser(handleReaction.author);
    Currencies.increaseMoney(handleReaction.author,equi(level));
    senderInfo.data.altp = { level: -1, rd: -1 };
    await Users.setData(handleReaction.author, senderInfo);
    return api.sendMessage(`Người chơi ${name} đã vượt qua ${level} câu hỏi, mang về phần thưởng là ${equi(level)}$\nHẹn gặp lại bạn ở chương trình lần sau!`, event.threadID);
  }
}
