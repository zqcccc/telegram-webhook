require('dotenv').config({ override: true })
const http = require('http')
const express = require('express')

const app = express()

app.use(express.json())

app.post('/webhook', (req, res) => {
  
  let body = req.body;
  console.log("body: ", body);
  if (body?.message?.text === "/geturl" && body?.message?.chat) {
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

app.listen(3010, () => {console.log('webhook serve on :3010')})
