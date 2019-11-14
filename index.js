"use strict";

const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 8000;

// Enable environmental values
const dotenv = require('dotenv');
dotenv.config();

const line = require("@line/bot-sdk");
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY
};

const client = new line.Client(config);

app.get('/', (req, res) => {
  res.send('ok');
});

app.post("/hooks", line.middleware(config), (req, res) => {
  res.status(200).end();

  const events = req.body.events;
  const promises = [];
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    promises.push(
      echoman(ev)
    );
  }
  Promise.all(promises);
});

async function echoman(ev) {
  const pro = await client.getProfile(ev.source.userId);
  return client.replyMessage(ev.replyToken, {
    type: "text",
    text: `${pro.displayName}：${ev.message.text}`
  });
}

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`)
});