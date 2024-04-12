require('dotenv').config({ override: true })
const { kv } = require("@vercel/kv")

// const { Redis } = require('@upstash/redis')

// const redis = new Redis({
//   url: process.env.KV_REST_API_URL,
//   token: process.env.KV_REST_API_TOKEN,
// })

const toDeletePrefix = 'toDeleteInTGChat:'

async function operationWhenExpire(cb) {
  const res = await kv.keys(`${toDeletePrefix}*`)
  if (res?.length) {
    for (let i = 0; i < res.length; i++) {
      const key = res[i]
      const value = await kv.get(key)
      if (value < Date.now()) {
        console.log('key: ', key)
        console.log('value: ', value)
        await cb(key.slice(toDeletePrefix.length))
        await kv.del(key)
      }
    }
  }
}

async function setExpire(key, expire = 24 * 60 * 60) {
  return await kv.set(`${toDeletePrefix}${key}`, Date.now() + expire * 1000)
}

module.exports.operationWhenExpire = operationWhenExpire
module.exports.setExpire = setExpire

// if(require.main === module) {
//   ; (async function main() {
  
//     // setExpire('hello')
  
//     // kv.keys('toDelete:*').then(console.log)
  
//     // kv.del('toDelete:test1').then(console.log)
//     // kv.del('toDelete:test2').then(console.log)
    
//     // operationWhenExpire(async (key) => {
//     //   console.log('key: ', key)
//     //   // await kv.delete(`toDelete:${key}`)
//     // })
//     // // 获取当前时间的时间戳
//     // let currentTimeStamp = Date.now();
  
//     // // 将时间戳转换为 Date 对象
//     // let currentDate = new Date(currentTimeStamp);
  
//     // // 一天的毫秒数
//     // let oneDayMilliseconds = 24 * 60 * 60 * 1000;
  
//     // // 计算一天后的时间戳
//     // let nextDayTimeStamp = currentTimeStamp + oneDayMilliseconds;
  
//     // // 创建新的 Date 对象，表示一天后的时间
//     // let nextDayDate = new Date(nextDayTimeStamp).toLocaleString();
  
//     // console.log(nextDayDate);
//   })()
// }

