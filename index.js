const Discord = require("discord.js");
const express = require('express');
const bodyParser = require('body-parser');

const config = require("./config.json");

const client = new Discord.Client();
const app = express();

app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));

const prefix = "~";

client.on("message", function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  // message.guild.id

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`** :hourglass: ${Math.abs(timeTaken)}ms **`);
  }

  if (command === "source") {
    message.reply(`You can check out the code at https://github.com/aaditya/bouncer-bot`);
  }
});

app.get('/', (req, res) => {
  let channels = client.channels.cache.map(({ type, name, id, guild }) => ({ guild: guild.id, data: { type, name, id }, }));
  return res.status(200).json({
    data: client.guilds.cache.map((server) => ({
      id: server.id,
      name: server.name,
      channels: channels.filter(d => d.guild === server.id).map(c => c.data)
    }))
  });
});

app.post('/', (req, res) => {
  let { message, channelId } = req.body;
  if (!message || !channelId) {
    return res.status(400).json({
      message: "Invalid Fields"
    })
  }

  let target = client.channels.cache.find(c => c.id === channelId);
  target.send(message);

  return res.status(200).json({
    channel: channelId,
    message,
  });
});

client.login(config.BOT_TOKEN);

app.listen(8080, () => {
  console.log("API Running !")
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
