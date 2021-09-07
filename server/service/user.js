//Koa2/service/user.js
const allSqlAction = require("../lib/mysql")
async function checkUser(account, password) {
  let sql = `select * from elm_user where elm_userPhone = ${account} and elm_userPassword=${password}`
  return allSqlAction.allSqlAction(sql).then(res => {
    if (res.length == 1 && res[0].elm_userPhone === account && elm_userPassword === password) {
      return { msg: "登陆成功", code: 200 }
    } else {
      return { msg: "登录失败", code: 201 }
    }
  })
}
async function findUser(phone, password) {
  let sql = `select * from elm_user where elm_userPhone = ${phone}`
  return allSqlAction.allSqlAction(sql).then(res => {
    if (res.length == 0) {
      return registerUser(phone, password)
    } else {
      return { msg: "用户已存在", code: 202 }
    }
  })
}
async function registerUser(phone, password) {
  let sql = `insert into elm_user (elm_userPhone,elm_userPassword) values ('${phone}','${password}')`
  return allSqlAction.allSqlAction(sql).then(res => {
    if (res.affectedRows == 1) {
      return { msg: "注册成功", code: 200 }
    } else {
      return { msg: "注册失败", code: 200 }
    }
  })
}
module.exports = {
  checkUser,
  findUser,
  registerUser
}