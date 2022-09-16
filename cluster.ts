import http from 'http'
import cluster from 'cluster'
import { cpus } from 'os'
import process from 'process'

/** 这台电脑有多少个cpu 就启动多少个 子进程, 而且这些进程 同时监听一个8000 端口 */

// master 主进程
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
} else {
  // 子进程
  http.createServer((req, res) => {
    console.log('欢迎访问 8000端口')
    res.writeHead(200)
    res.end('hello world')
  }).listen(8000)
  console.log(`Worker ${process.pid} started`)
}