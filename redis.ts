const Redis = require('ioredis')

const redis = new Redis(6379)

const pub = new Redis(6379)

const sub = new Redis(6379)

async function run() {
  try {
    /** 'ex' 超过10秒 就过期 */
    // await redis.set('name', 'jokey', 'ex', 10)
    const result = await redis.get('name')
    console.log('result', result)
    /** array */
    await redis.lpush('sortware', 'mysql', 'redis')
    const arr = await redis.lrange('sortware', 0, 10)
    console.log('arr', arr)

    /** object */
    await redis.hmset('person', { name: 'jokey', age: 30 })
    const obj = await redis.hgetall('person')
    console.log('obj', obj)

    /** 发布订阅 */
    const r = await sub.subscribe('channel-1')
    console.log(r)
    sub.on('message', (channel: string, message: any) => {
      console.log(`Received ${message} from ${channel}`)
    })
    // pub
    setTimeout(() => {
      pub.publish('channel-1', 'hello')
    }, 1000)
  } catch(e) {
    console.error(e)
  } finally {
    redis.disconnect()
  }
}

run()