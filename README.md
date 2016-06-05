# loopback-component-sorage-qiniu
因为一个项目中使用到了[七牛云存储](www.qiniu.com)和[strongloop](strongloop.com)，strongloop中的关于storage components使用起来非常简单，所以将七牛的api简单封装一下。
## 安装 Install
npm install loopback-component-sorage-qiniu -S
## Containers and files
使用strongloop的storage会有两个术语：container和file，container可以理解为七牛的bucket，所以file就是一个key：file对了。
如果想使用多个bucket就需要定义多个数据源和对应的Model，每个数据源的domain name是不一样的。

## 使用 Usage
在 /server/datasources.json 手工加入
```
 "qiniuAvatarStorage": {
    "name": "qiniuAvatarStorage",  
    "connector": "loopback-component-storage-qiniu",
    "type": "qiniu", 
    "ACCESS_KEY": "YOUR_ACCESS_KEY",  -->必须的
    "SECRET_KEY": "YOUR_SECRET_KEY",  -->必须的
    "bucketname": "YOUR_BUCKET_NAME", -->必须的
    "domain": "YOUR_DOMAIN_NAME",     -->必须的
    "isPrivate":false                 -->必须的
  }
```
slc loopback:model
* Enter the model name: container
* Select the data-source to attach undefined to: qiniuAvatarStorage (loopback-component-storage-qiniu)
* Select model's base class Model


## 说明
初始版本是从[https://c9.io/smaty1/loopback-storage-qiniu](https://c9.io/smaty1/loopback-storage-qiniu)取得后稍微修改。