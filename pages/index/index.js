//index.js
//获取应用实例
const API=require('../../utils/api.js')
const app = getApp()

Page({
  data: {
    input: '',
    todos: [],
    all: false,
    tags: []
  },
  onLoad: function () {
    API.login().then(res=>{
      console.log('look',res)
      // if (res.statusCode === 200){
        this.setData({
          todos: res.data.list
          // todos: res
        })
      // } else {
      //   console.log('获取数据失败', res.errMsg)
      // }
    })
  },
  toAdd: function (res) {
    if(this.data.todos.length===10){
      wx.showToast({
        title: '添加已达上限，若要继续添加，请先删除',
        icon: 'none',
        duration: 2000
      })
      this.setData({input: ''})
      return
    }
    if (!res.detail.value || !res.detail.value.trim()) {
      return
    }
    const value = res.detail.value    
    API.addApi(value)
      .then(res => {
        if (res.statusCode === 200) {
          this.data.todos.push({
            text: value,
            id: res.data.id
          })
          this.setData({
            input: '',
            todos: this.data.todos,
          })
          wx.setStorageSync('todo_list', this.data.todos)
        } else {
          console.log('添加失败', res.errMsg)
        }
      })  
      .catch(err => {
        console.log(err)
      })        
  },
  toRemove: function (e) {
    const id = parseInt(e.currentTarget.id)
    API.delApi(id)
      .then(res => {
        if (res.statusCode === 200) {
          this.data.todos = this.data.todos.filter(item => item.id != id)
          this.setData({ todos: this.data.todos })
          wx.setStorageSync('todo_list', this.data.todos)  
        } else {
          console.log('删除失败', res.errMsg)
        }      
      })
      .catch(err => {
        console.log(err)
      })    
  },
  toEdit: function (e) {
    const id=e.currentTarget.dataset.id,
          last_value=e.currentTarget.dataset.text,
          new_value=e.detail.value;
    const editInfo={
      id,
      new_value
    }
    if(last_value !== new_value){
      API.modApi(editInfo)
        .then(res =>{
          if(res.statusCode===200){
            this.data.todos.forEach(item => {
              if (item.id === id) {
                item.text = new_value
              }
            })
            this.setData({ data: this.data.todos })
          }
        })
        .catch(err => {
          console.log('修改失败',err)
        })
    }
  },
  checkboxChange: function (e) {
    let tags = e.detail.value;
    tags = tags.map(Number)
    this.setData({ tags })
    this.data.all = (tags.length === this.data.todos.length) ? true : false
    this.setData({ all: this.data.all })
  },
  clearRemove: function () {
    API.delMoreApi(this.data.tags)
      .then(res => {
          this.data.todos = this.data.todos.filter(item => {
            return this.data.tags.includes(item.id) === false
          })
          this.setData({ todos: this.data.todos })
          wx.setStorageSync('todo_list', this.data.todos)
          this.data.todos = this.data.todos.map(item => {
            item.checked = false;
            return item
          })
          this.setData({
            todos: this.data.todos,
            all: false
          })
      })
      .catch(err => {
        console.log('删除失败',err)
      })
  },
  selectAll: function () {
    this.data.all = !this.data.all
    this.setData({ all: this.data.all })
    if (this.data.all) {
      this.data.todos.forEach((item, index) => {
        item.checked = true;
      })
      this.setData({
        todos: this.data.todos,
      })
    } else {
      this.data.todos.forEach((item, index) => {
        item.checked = false;
      })
      this.setData({
        todos: this.data.todos,
      })
    }
  }
})
