require('dotenv').config({ override: true });
var http = require('http');
var express = require('express');
var app = express();
app.use(express.json());
app.post('/webhook', function (req, res) {
    var _a, _b;
    var body = req.body;
    console.log("body: ", body);
    if (((_a = body === null || body === void 0 ? void 0 : body.message) === null || _a === void 0 ? void 0 : _a.text) === "/geturl" && ((_b = body === null || body === void 0 ? void 0 : body.message) === null || _b === void 0 ? void 0 : _b.chat)) {
        var https = require("https");
        var options = {
            host: "api.telegram.org",
            path: "/bot".concat(process.env.BOT_TOKEN, "/sendMessage?chat_id=").concat(body.message.chat.id, "&text=https://status.onlylike.work/")
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
    res.status(200);
    res.end('done');
});
app.listen(3010, function () { console.log('webhook serve on :3010'); });
