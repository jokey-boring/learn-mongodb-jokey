import { connect, disconnect, model, Schema } from 'mongoose'

async function main() {
  try {
    await connect('mongodb://localhost:27017/test')
    console.log('mongodb数据库连接成功')
    // const ProductSchema = new Schema({
    //   name: { type: String },
    //   price: { type: Number }
    // })
    // // 创建 prodecus 表, 如果已经存在这张表了，不会覆盖
    // const ProductModel = model('Product', ProductSchema)
    // // 往 products表里 创建一条数据
    // const result = await ProductModel.create({
    //   name: 'cellPhone', price: 1300
    // })
    // console.log('result', result)

    // // 新的创建数据的方法
    // const ipad = new ProductModel({
    //   name: 'ipad',
    //   price: 4000
    // })
    // await ipad.save()

    const UserSchema = new Schema({
      name: { type: String },
      age: { type: Number },
      hobbies: { type: Array },
      team: { type: Schema.Types.ObjectId, ref: 'team' }
    }, { collection: 'user'}/** 哪张表 */)

    const UserModel = model('User', UserSchema)
    const result = await UserModel.find({ age: { $gt: 30 } }).exec()
    console.log('result', result)
  } catch(e) {
    console.error(e)
  } finally {
    console.log('关闭数据库')
    await disconnect()
  }
}

main()