import { MongoClient, FindOperators, ObjectId, UpdateFilter } from 'mongodb'

const url = 'mongodb://localhost:27017/'

const client = new MongoClient(url)



async function run() {
  try {
    await client.connect()
    const db = client.db('test')
    const res = await db.command({ ping: 1 })
    console.log('res', res)
    // 根据 球队 查询 球员信息
    const teamCollection = db.collection<{ name: string, age: number, players: any[], team: any }>('team')
    const userCollection = db.collection<{ [key: string]: any }>('user')
    const lakerTeam = await teamCollection.findOne({ name: 'Lakers' })
    const players = await userCollection.find({ team: (lakerTeam as any)._id }).toArray()
    console.log('players', players)
    
    // 根据 球队 查询 某些球员信息
    const netTeam = await teamCollection.findOne({ name: 'Nets' })
    const condition = {
      _id: {
        "$in": netTeam?.players /* 查询在球队中有记录的球员, 查询某些球员而不是全部球员 */ 
      }
    }
    const netPlayers = await userCollection.find(condition).toArray()
    console.log('netPlayers', netPlayers)
  } catch(e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

async function regate() {
  try {
    await client.connect()
    const db = client.db('test')
    const userCollection = db.collection('user')
    const pipeLine = [
      {
        $match: { age: { $gte: 30 } }
      },
      {
        $group: {
          _id: "$team", /*相同得teamId 结合成一条数据, 相同的teamId 将结合成 一条数据 */
          total: { $sum: "$age" }, // 返回新的字段： 值是 每条数据得 age值 相加
          count: { $sum: 1 }, /** 有一条聚合数据 就 +1 */
          avg: { $avg: '$age' /** 请聚合数据 age字段的平均值 */ }
        }
      },
      {
        $sort: { /** 排序 */
          total: 1 /** 按照total 字段 正序排序 */
        }
      }
    ]
    const result = await userCollection.aggregate(pipeLine).toArray()
    console.log('result', result)
  } catch(e) {
    console.error(e)
  } finally {
    await client.close()
  }
  
}

async function lookup() {
  try {
    await client.connect()
    const db = client.db('test')
    const teamCollection = db.collection('team')
    const userCollection = db.collection('user')
    
    const pipeLine = [
      {
        $match: { name: 'Nets' },
      },
      {
        $lookup: { /** team 表 和 user表 的数据 有绑定关系, 查出 team表的数据后, 设置一个新的字段 newPlayers, 里面收集 user表中符合的数据  */
          from: 'user', /** 关联表 */
          localField: 'players', /** team 表中的关联字段 */
          foreignField: '_id', /** user表中的 关联字段 */
          as: 'newPlayers' /** 在 team表查询的数据中 加入 新的字段来展示 user 表的信息 */
        }
      }
    ]
    const teamWithPlayers = await teamCollection.aggregate(pipeLine).toArray()
    console.log('teamWithPlayers', teamWithPlayers)
    
    const pipeLine2 = [
      {
        $match: {
          team: { $exists: true }
        }
      },
      {
        $lookup: {
          from: 'team',
          localField: 'team',
          foreignField: '_id',
          as: 'team'
        }
      }
    ]
    const playerWithTeam = await userCollection.aggregate(pipeLine2).toArray()
    console.log('playerWithTeam', playerWithTeam[0])
  } catch(e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

// run()
lookup()