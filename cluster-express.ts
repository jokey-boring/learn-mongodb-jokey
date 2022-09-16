import http from 'http'
import cluster from 'cluster'
import { cpus } from 'os'
import process from 'process'
import express from 'express'

function startExpress() {
  const app = express()

  app.get('/api/slow', (req, res) => {
    console.time('slowApi')
    const baseNumber = 7
    let result = 0
    for (let i = Math.pow(baseNumber, 7); i >= 0; i--) {
      result += Math.tan(i) * Math.atan(i)
    }
    console.timeEnd('slowApi')
    console.log(`Result number is ${result} - on process ${process.pid}`)
    res.send(`Result number is ${result}`)
    // 在响应的时候发送消息
    process.send({ cmd: 'notify' })
  })

  app.listen(3000, () => {
    console.log('App listening on port 3000, process id is', process.pid)
  })
}

let numReq = 0

/** 这台电脑有多少个cpu 就启动多少个 子进程, 而且这些进程 同时监听一个8000 端口 */

// master 进程
if (cluster.isPrimary) {
  console.log(`Master ${process.pid} running`)
  const cpuLength = cpus().length
  console.log('cpu cores', cpuLength)
  for (let i = 0; i < cpuLength; i++) {
    cluster.fork()
  }
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`)
  })
  console.log('workers', cluster.workers)
  for (const id in cluster.workers) {
    cluster.workers[id].on('message', (msg) => {
      if (msg.cmd && msg.cmd === 'notify') {
        numReq += 1
      }
    })
  }
  setInterval(() => {
    console.log('接受了几次请求?', numReq)
  }, 2000)
} else {
  // 子进程
  // http.createServer((req, res) => {
  //   console.log('欢迎访问 8000端口')
  //   res.writeHead(200)
  //   res.end('hello world')
  // }).listen(8000)
  // console.log(`Worker ${process.pid} started`)
  startExpress()
}