# todos

#因为API不能用了，所以有很多问题未解决，请谅解#
#有时间或许会用Node把接口重写#
#代码不够规范之处，请谅解，正在朝这方面努力#

1.
  if (!wx.getStorageSync('userInfo')) {
    login()
  }  
2.requestLogin，没有想好{ code: res.code }参数怎么和requestP融合，或许可以用一个判断
3.“统一处理错误的逻辑”，这里关于代码设计之处不太明白，或许之后会看到类似的处理然后明白怎么做

![image](https://github.com/fhuy/todos/blob/master/imgs/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200323132158.png)
