# cookie&local/sessionStorage

##  三者都有的特性

|        | cookie     | localstorage | sessionstorage |
| ------ | ---------- | ------------ | -------------- |
| 请求是否携带 | 每次都携带      | 只在本地         | 只在本地           |
| 可携带数据量 | 不超过4k      | 5M或更大        | 5M或更大          |
| 有效周期   | 可以设置有效时间   | 不手动删除为永久     | 窗口关闭就没了        |
| 有效路径   | 可以设置       | 所有同源窗口共享     | 当前窗口           |
| 是否能跨域  | 可跨二级，跨别的不行 | 不行           | 不行             |
| 数量限制   | 浏览器有限制     | 无限制          | 无限制            |

- 共同点：都是储存在浏览器端，都是同源的。（同端口、同协议、同域名）


- LocalStorage是`不能`跨域的，但是，可以借助`postMessage`和`iframe`来实现跨域的数据读取

- cookie可以用php实现跨域，但是js层面无法实现。

  `可以通过服务器http响应头来设置允许cookie跨域操作`

  > 一般来说cookie是不能跨域的，不然你的信息就不安全了。

## 操作cookie的方法

```js
document.cookie="键=值";
```

[cookie数量限制 ](https://cloud.tencent.com/developer/article/1096075) 

一般限定20个比较合理, 理论上无限制。
