import { MongoClient, FindOptions, ObjectId, UpdateFilter } from 'mongodb'

const url = 'mongodb://localhost:27017/'

const client = new MongoClient(url)

async function run() {
  try {
    await client.connect()
    const db = client.db('test')
    const userCollection = db.collection<{hobbies: string[]}>('test')
    // // 数据插入
    // const result = await userCollection.insertOne({ name: 'AD', subname: '戴维斯' })
    // // const results = await userCollection.insertMany()
    // console.log('result', result)
    // const result = await userCollection.findOne({ name: 'AD' })
    // console.log('result', result)
    // const cursor = userCollection.find()
    // 1. 使用 forEach
    // await cursor.forEach(doc => console.log(doc))
    // 2. 使用 toArray
    // const results = await userCollection.find().toArray()
    // console.log('the result array', results)
    // 1. 比较操作符
    // const results = await userCollection.find({ age: { $lt: 30 /* 小于 30 */ } }).toArray()
    // console.log('results', results)
    // 2. 逻辑操作符, 或， 与
    // 与
    // const results = await userCollection.find({ age: { $lt: 30 }, name: 'jokey' }).toArray()
    // 或
    // const condition = {
    //   $or: [
    //     {
    //       age: { $gt: 30 }
    //     },
    //     {
    //       name: 'AD'
    //     }
    //   ]
    // }
    // const results = await userCollection.find(condition).toArray()
    const options: FindOptions = {
      limit: 2, // 只截取 多少条数据
      skip: 1, // 跳过 多少条数据, 从哪条数据开始
      sort: { age: -1 }, // 数据排序， 以 age 字段， 进行升序排序(1), 降序（-1）
      projection: { _id: 0, name: 1 } // 不展示 某些字段(0), 只展示 某些字段(1), _id 默认为1
    }
    // 1. element 操作符
    // const results = await userCollection.find({ sub_name: { $exists: true, $type: "array" } }, options).toArray()
    // console.log('results', results)
    // 2. 返回结果 调整, 只返回两条
    // const results = await userCollection.find({}, options).toArray()
    // 3.支持链式 调用
    // const results = await userCollection.find({}).limit(2).sort({ age: 1 }).toArray()
    // console.log('results', results)
    // 1. 替换
    // const replaceDoc = await userCollection.replaceOne({ name: 'AD' }, { name: '789', age: 40 })
    // console.log('replaceDoc', replaceDoc)
    // 2. 修改
    // const updateFilter: UpdateFilter<{ name: string, age: number }> = {
    //   $set: { // 修改操作
    //     name: 'Lebron',
    //   },
    //   $inc: { // 对数值 进行操作
    //     age: 9 // 对 age 字段的值 +9
    //   }
    // }
    // const updateDoc = await userCollection.updateOne({ _id: new ObjectId('62df9aa846b45f946f1631dd')}, updateFilter)
    // const updateFilter: UpdateFilter<{ name: string, age: number, hobbies: string[] }> = {
      // $set: { // 修改操作
      //   hobbies: ['music']
      // },
      // $push: { // push 单条数据
      //   hobbies: 'football'
      // },
      // $push: { // push 多条数据
      //   hobbies: { $each: ['golf', 'reading'], $position: 0 /** 插入到 数组的第一项 */ }
      // },
      // $pop: {
      //   hobbies: 1 // 删除数组的 最后一个元素（1）, 删除数组的第一个元素（0）
      // }
      // $pull: {
      //   hobbies: 'golf' // 删除 指定值的 元素
      // }
      // $inc: { // 对数值 进行操作
      //   age: 9 // 对 age 字段的值 +9
      // }
      // $set: {
      //   "hobbies.0": "golf" // 修改 数组的第一项
      // }
    // }
    // const updateDoc = await userCollection.updateOne({ _id: new ObjectId('62df9aa846b45f946f1631dd')}, updateFilter)
    // console.log('updateDoc', updateDoc)
    
    // 查询 数组条件(全部匹配) 
    // const result = await userCollection.findOne({ hobbies: ["golf", "music", "football"] })
    //
    // const result = await userCollection.findOne({
    //   // hobbies: { $all: ['golf', 'music'] } // hobbies 字段 必须 有这两个值才匹配 
    //   // hobbies: 'golf' // 匹配到 golf 即可
    //   // hobbies: { $regex: /olf/g } // 正则
    // })

    // 修改数组中的某值, 根据搜索条件来缺陷数组下标

    // const updateFilter: UpdateFilter<{ name: string, age: number, hobbies: string[] }> = {
    //   $set: {
    //     'hobbies.$': 'golf-new' // 根据 搜索条件缺陷数组下标
    //   }
    // }

    // const updateDoc = await userCollection.updateOne({
    //   _id: new ObjectId('62df9af77da3451166e6c18e'),
    //   hobbies: 'golf'
    // }, updateFilter)
    // console.log('result', result)
    // let testArr: any[] = []
    // for (let i = 1; i < 50000; i++) {
    //   testArr.push({ type: 'test', name: `test${i}`, age: i })
    // }
    // const result = await userCollection.insertMany(testArr)
    const result = await userCollection.find({ name: 'test49999' }).explain()
    // const result = await userCollection.createIndex({ name: 1 /** 建立正序的基于name的索引 */ })
    // const indexResult = await userCollection.listIndexes().toArray()
    // const dropResult = await userCollection.dropIndex('name_1')
    // console.log('dropResult', dropResult)
    // console.log('indexResult', indexResult)
    console.log('result', result)
  } catch (e) {
    console.error(e)
  } finally {
    client.close()
  }
}

run()
