import { AbilityBuilder, Ability } from '@casl/ability'
import { permittedFieldsOf } from '@casl/ability/extra'
import { pick } from 'lodash'

/** 权限控制 casl 库学习 */

class Work {
  constructor(attrs: any) {
    Object.assign(this, attrs)
  }
}

interface User {
  id: number
  role: 'admin' | 'vip' | 'normal'
}

const adminUser: User = {
  id: 1,
  role: 'admin'
}

const vipUser: User = {
  id: 2,
  role: 'vip'
}

const normalUser: User = {
  id: 3,
  role: 'normal'
}

const WORK_FIELDS = ['id', 'author', 'isTemplate', 'title', 'content', 'uuid']
const options = { fieldsFrom: (rule: any) => rule.fields || WORK_FIELDS }

const vipWork = new Work({ id: 2, author: 2, isTemplate: true, title: 'vipWork', content: '', uuid: '' })
const normalWork = new Work({ id: 3, author: 3, isTemplate: false, title: 'normalWork', content: '', uuid: '' })

/** 初步学习 casl */
// function defineRules(user: User) {
//   const { can, cannot, build } = new AbilityBuilder(Ability)
//   // 可以读取 Work 实例对应的资源
//   can('read', 'Work')
//   // 不能删除 Work实例对应的 资源
//   cannot('delete', 'Work')
//   // isTemplate 为 false 的数据可以进行更新
//   can('update', 'Work', { isTemplate: false })
//   return build()
// }

function defineRules(user: User) {
  const { can, cannot, build } = new AbilityBuilder(Ability)
  // admin 可以操作任何资源
  if (user.role === 'admin') {
    can('manage', 'all' /** 什么都可以操作 */)
  } else if (user.role === 'vip') {
    can('read', 'Work')
    can('download', 'Work')
    can('delete', 'Work' /** 原型链是不是 */, { author: user.id } /** 满足条件 */)
    can('update', 'Work', ['title', 'content', 'uuid']/** 允许修改的字段 */ , { author: user.id })
  }
  if (user.role === 'normal') {
    can('read', 'Work' /**  */)
    can('delete', 'Work' /** 原型链是不是 */, { author: user.id } /** 满足条件 */)
    can('update', 'Work'/** 原型链是不是 */, ['title', 'content']/** 允许修改的字段 */,  { author: user.id })
  }
  return build()
}
// 获取 admin用户 的操作权限
const rules = defineRules(adminUser)

// admin 用户 可以操作 修改权限吗?
console.log(rules.can('update', vipWork /** 原型链是不是 */))
console.log(rules.can('update', normalWork))

/** vip role */
const rules2 = defineRules(vipUser)
console.log('vip download', rules2.can('download', 'Work'))
console.log('vip update', rules2.can('update', vipWork, 'title' /** title字段是否可以更新 */))
console.log('vip update', rules2.can('update', vipWork, 'uuid'))

/** normal role */
const rules3 = defineRules(normalUser)
console.log('normal download', rules3.can('download', 'Work'))
console.log('normal update', rules3.can('update', normalWork, 'title'))
console.log('normal update normalWork', rules3.can('update', normalWork, 'uuid'))

/** check allowed fields 检查可以使用的字段 */
const fields = permittedFieldsOf(rules2, 'update', vipWork, options)
console.log('vip allowed update', fields)

const fields2 = permittedFieldsOf(rules3, 'update', normalWork, options)
console.log('normal allowed update', fields2)

const reqBody = {
  title: 'CASL',
  content: 'powerFul',
  uuid: 'viking'
}

const rawWork = pick(reqBody, fields2)
console.log('normal user after filter', rawWork)
