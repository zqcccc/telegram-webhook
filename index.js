var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
require('dotenv').config({ override: true });
var http = require('http');
var express = require('express');
var axios = require('axios');
var _a = require('./db'), operationWhenExpire = _a.operationWhenExpire, setExpire = _a.setExpire;
var app = express();
app.use(express.json());
app.get('/', function (req, res) {
    res.end('hello world');
});
app.post('/webhook', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var body, https, options, callback;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        body = req.body;
        console.log("body: ", JSON.stringify(body, null, 2));
        if (((_a = body === null || body === void 0 ? void 0 : body.message) === null || _a === void 0 ? void 0 : _a.new_chat_member) || ((_b = body === null || body === void 0 ? void 0 : body.message) === null || _b === void 0 ? void 0 : _b.left_chat_member)) {
            console.log("delete message ".concat(body.message.message_id, " in chat ").concat(body.message.chat.id));
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
            setExpire("".concat(body.message.chat.id, ":").concat(body.message.message_id), 48 * 60 * 60 * 1000);
        }
        else if (((_c = body === null || body === void 0 ? void 0 : body.message) === null || _c === void 0 ? void 0 : _c.text) === "/geturl" && ((_d = body === null || body === void 0 ? void 0 : body.message) === null || _d === void 0 ? void 0 : _d.chat)) {
            https = require("https");
            options = {
                host: "api.telegram.org",
                path: "/bot".concat(process.env.BOT_TOKEN, "/sendMessage?chat_id=").concat(body.message.chat.id, "&text=https://status.onlylike.work/")
            };
            callback = function (response) {
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
        return [2 /*return*/];
    });
}); });
setInterval(function () {
    operationWhenExpire(function (key) {
        var _a = key.split(':'), chatId = _a[0], messageId = _a[1];
        axios.get("https://api.telegram.org/bot".concat(process.env.BOT_TOKEN2, "/deleteMessage"), {
            params: {
                chat_id: chatId,
                message_id: messageId
                // chat_id: body.message.chat.id,
                // message_id: body.message.message_id
            }
        })["catch"](function (e) {
            console.log(e.message);
        });
    });
}, 24 * 60 * 60 * 1000);
var port = process.env.SERVER_PORT || 4010;
app.listen(port, function () { console.log('webhook serve on :' + port); });
