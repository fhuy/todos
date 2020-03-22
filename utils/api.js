const base_url = 'https://mp.lihs.me',
      log_url ='/login',
      get_url = '/getTodoList',
      add_url = '/addTodo',
      del_url = '/delTodo',
      mod_url = '/modTodo',
      post = 'POST';

const login = () => {
  const promise = new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          requestP(
            post, 
            log_url, 
            { code: res.code }
          ).then(res => {
            if (res.statusCode === 200) {
              wx.setStorageSync('userInfo', res.data)
            } else {
              console.log('登录失败', res.errMsg)
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          reject(res)
        }
      }
    })
  })
  return promise
}

const getList = () => {
  if (!wx.getStorageSync('userInfo')){
      login()
  }
  return requestP(
    post,
    get_url,
    wx.getStorageSync('userInfo')
  )
}

const addApi = (params)=>{
  if (!wx.getStorageSync('userInfo')) {
    login()
  }  
  const userInfo = Object.assign(
    wx.getStorageSync('userInfo'),        //{ uid: , token: }
    { todoText: params }
  )
  return requestP(
    post,
    add_url,
    userInfo
  )
}

const delApi = (id) => {
  if (!wx.getStorageSync('userInfo')) {
    login()
  }  
  const userInfo = Object.assign(
    wx.getStorageSync('userInfo'),        //{ uid: , token: }
    {
      todoId: id
    }
  )
  return requestP(
    post,
    del_url,
    userInfo
  )
}

const delMoreApi = (arr) => {
  if (!wx.getStorageSync('userInfo')) {
    login()
  }  
  const promises=arr.map(id => {
    return delApi(id)
  })
  return Promise.all(promises) 
}

const modApi = (params) => {
  const userInfo = Object.assign(
    wx.getStorageSync('userInfo'),        //{ uid: , token: }
    { 
      todoText: params.new_value, 
      todoIsDone: true,
      todoID: params.id
    }
  )
  return requestP(
    post,
    mod_url,
    userInfo
  )
}

const requestP = (method, url, userInfo) => {
  return new Promise((resolve, reject) => {
    wx.request({
      method,
      url: base_url + url,
      data: userInfo,
      headers: {
        'Content-Type': 'application/json' // 默认值
      },
      success: res => resolve(res),
      fail: res => reject(res)
    })
  })
}

module.exports={
  login,
  getList,
  addApi,
  delApi,
  delMoreApi,
  modApi  
}


// 没有uid和token，就登录
// const getToken=()=>{
//   return new Promise((res, rej) => {
//     if (!wx.getStorageSync('userInfo'){
//       login()

//     }
//   })
// }