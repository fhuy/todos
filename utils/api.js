const app = getApp()
const base_url = 'https://mp.lihs.me',
      post = 'POST';

const login = () => {  
  const userid = new Promise((resolve, reject) => {
    const log_url = `${base_url}/login`
    wx.login({
      success(res) {
          if (res.code) {
            resolve(
              requestLogin(
                post,
                log_url,
                { code: res.code }
              )
            )
          } else {
            reject(res)
          }
        }
    })
  })
  return userid.then(res => {
    if (res.statusCode === 200){
      app.globalData.userID = {
        uid: res.data.uid,
        token: res.data.token
      }      
      return getLists()
    }
    return res.errMsg
  })
}

const getLists = () => {
  const get_url = `${base_url}/getTodoList`  
  return requestP(
    post,
    get_url
  )
}

const addTodo = (todoText)=>{
  if (!wx.getStorageSync('userInfo')) {
    login()
  }  
  const add_url = `${base_url}/addTodo`
  const userInfo = { 
    todoText 
  }
  return requestP(
    post,
    add_url,
    userInfo
  )
}

const delTodo = (id) => {
  if (!wx.getStorageSync('userInfo')) {
    login()
  }  
  const del_url = `${base_url}/delTodo`
  const userInfo = {
      todoId: id
    }
  return requestP(
    post,
    del_url,
    userInfo
  )
}

const delMoreTodos = (moreSelected) => {
  if (!wx.getStorageSync('userInfo')) {
    login()
  }  
  const promises=moreSelected.map(id => {
    return delTodo(id)
  })
  return Promise.all(promises) 
}

const modTodo = (modTodo) => {
  const mod_url = `${base_url}/modTodo`
  const userInfo = { 
      todoText: modTodo.new_value, 
      todoIsDone: true,
      todoID: modTodo.id
    }
  return requestP(
    post,
    mod_url,
    userInfo
  )
}

const requestLogin = (method, url, userInfo) => {
  const userID = app.globalData.userID;
  return new Promise((resolve, reject) => {
    wx.request(
      {
        method,
        url,
        data: userInfo,
        headers: {
          'Content-Type': 'application/json' // 默认值
        },
        success: res => resolve(res),
        fail: res => reject(res)
    })
  })
}


// function responseModel(res) {
//   if (res.statusCode === 200) {
//     return new Promise((resolve, reject)=>{
//       resolve(res)
//       })
//   }else if(res.statusCode===400){
//       console.log('错误请求')
//   }
// }


const requestP = (method, url, userInfo={}) => {
  const uid = app.globalData.userID.uid,
        token = app.globalData.userID.token;

  return new Promise((resolve, reject) => {
    wx.request({
      method,
      url,  
      data: Object.assign(
        {
          uid,
          token
        },
        userInfo
      ),          
      headers: {
        'Content-Type': 'application/json' // 默认值
      },
      success: res => resolve(res),
      // success: res => resolve(responseModel(res)),
      // success: res => { return responseModel(res)},
      fail: res => reject(res)
    })
  })
}

module.exports={
  login,
  getLists,
  addTodo,
  delTodo,
  delMoreTodos,
  modTodo  
}

