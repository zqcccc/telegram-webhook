require('dotenv').config({ override: true })
const http = require('http')
const express = require('express')
const axios = require('axios')
const { operationWhenExpire, setExpire } = require('./db')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.end('hello world')
})

app.post('/webhook', async (req, res) => {

  let body = req.body;
  console.log("body: ", JSON.stringify(body, null, 2));
  if (body?.message?.new_chat_member || body?.message?.left_chat_member) {
    console.log(`delete message ${body.message.message_id} in chat ${body.message.chat.id} after 25 hours.`)
    // setTimeout(() => {
    //   axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN2}/deleteMessage`, {
    //     params: {
    //       chat_id: body.message.chat.id,
    //       message_id: body.message.message_id
    //     }
    //   }).catch(e => {
    //     console.log(e.message)
    //   })
    // }, 3000);
    setExpire(`${body.message.chat.id}:${body.message.message_id}`, 25 * 60 * 60)
  } else if (body?.message?.text === "/geturl" && body?.message?.chat) {
    const https = require("https");

    var options = {
      host: "api.telegram.org",
      path: `/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${body.message.chat.id}&text=https://status.onlylike.work/`,
    };

    var callback = function (response) {
      var str = "";

      //another chunk of data has been received, so append it to `str`
      response.on("data", function (chunk) {
        str += chunk;
      });

      //the whole response has been received, so we just print it out here
      response.on("end", function () {
        console.log("response: ", str);
      });
    };

    https.request(options, callback).end();
  }
  res.status(200)
  res.end('done')
})


setInterval(() => {
  operationWhenExpire((key) => {
    const [chatId, messageId] = key.split(':')
    axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN2}/deleteMessage`, {
      params: {
        chat_id: chatId,
        message_id: messageId
        // chat_id: body.message.chat.id,
        // message_id: body.message.message_id
      }
    }).catch(e => {
      console.log(e.message)
    })
  })
}, 24 * 60 * 60 * 1000);
operationWhenExpire((key) => {
  const [chatId, messageId] = key.split(':')
  axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN2}/deleteMessage`, {
    params: {
      chat_id: chatId,
      message_id: messageId
      // chat_id: body.message.chat.id,
      // message_id: body.message.message_id
    }
  }).catch(e => {
    console.log(e.message)
    throw e
  })
})

const port = process.env.SERVER_PORT || 4010
app.listen(port, () => { console.log('webhook serve on :' + port) })
