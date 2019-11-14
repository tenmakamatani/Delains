// Setup express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static('public'));

// Setup axios and trains information
const axios = require('axios');
const trains = require('./trains');

// Enable environmental values
const dotenv = require('dotenv');
dotenv.config();

const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY
};

const client = new line.Client(config);

app.get('/', (req, res) => {
  res.send('ok');
});

app.post('/hooks', line.middleware(config), (req, res) => {
  res.status(200).end();

  const events = req.body.events;
  const promises = [];
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    promises.push(
      echoman(ev)
    );
  }
  Promise.all(promises).catch((err) => {
    console.log(err);
  });
});

async function echoman(ev) {

  if (ev.type === 'message') {
    // Get token
    const TRAIN_TOKEN = process.env.TRAIN_TOKEN;

    let infos;
    try {
      infos = await axios.get(`https://api-tokyochallenge.odpt.org/api/v4/odpt:TrainInformation?odpt:operator=odpt.Operator:${ev.message.text}&acl:consumerKey=${TRAIN_TOKEN}`);
    } catch (e) {
      return client.replyMessage(ev.replyToken, {
        type: 'text',
        text: 'その線はありません！'
      });
    }

    let text = '';
    infos.data.forEach((info) => {
      if (infos.length === 1 || infos.data.indexOf(info) === infos.data.length - 1) {
        text += info['odpt:trainInformationText'].ja
      } else {
        text += info['odpt:trainInformationText'].ja + '\n'
      }
    });

    return client.replyMessage(ev.replyToken, {
      type: 'text',
      text: text
    });
  } else if (ev.type === 'follow' || ev.type === 'join') {
    return client.replyMessage(ev.replyToken, {
      type: 'text',
      text: '遅延情報を知りたい路線を選んでください！',
      quickReply: trains
    })
  }

}

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`)
});