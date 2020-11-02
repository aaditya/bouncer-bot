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

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  } else if (command === "sum") {
    const numArgs = args.map(x => parseFloat(x));
    const sum = numArgs.reduce((counter, x) => counter += x);
    message.reply(`The sum of all the arguments you provided is ${sum}!`);
  } else if (command === "source") {
    message.reply(`You can check out the code at : https://github.com/aaditya/bouncer-bot`);
  }
});

app.get('/', (req, res) => {
  res.json(client.channels.cache);
});

app.post('/:channelId', (req, res) => {
  let target = client.channels.cache.find(c => c.id === req.params.channelId);
  target.send(req.body.message);
  res.json({
    success: true,
    message: req.body.message,
    channel: req.params.channelId,
  })
})

client.login(config.BOT_TOKEN);

app.listen(8080, () => {
  console.log("API Running !")
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
