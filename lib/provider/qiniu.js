var qiniu = require('qiniu'),
    conf = require('../../config');    

module.exports.qiniu = client;
module.exports.createclient = function(options) {
    return new client(options);
};

function client(options) {
    options = options || {};
    this.conf = {};
    
    var clientError = new Error("loopback-component-storage-qiniu options required.");
    
    if( !options.ACCESS_KEY || !options.SECRET_KEY || !options.bucketname || !options.domain || (typeof options.isPrivate === 'undefined'))
        throw clientError;
    
    qiniu.conf.ACCESS_KEY = options.ACCESS_KEY ;
    qiniu.conf.SECRET_KEY = options.SECRET_KEY ;
    //ugly,简单点
    this.conf.ACCESS_KEY = options.ACCESS_KEY ;
    this.conf.SECRET_KEY = options.SECRET_KEY ;
    this.conf.bucketname = options.bucketname;
    this.conf.domain     = options.domain;
    this.conf.isPrivate  = options.isPrivate ; 
    
    this.qiniuclient = new qiniu.rs.Client();
    this.qiniursf = qiniu.rsf;
}

//////////////////////////////////////////////单个文件操作//////////////////////////////////////////////////////////////
/**
 * 获取文件信息,在原有的sdk基础上
 */ 
client.prototype.statfile = function(key, cb) {
    var client = this.client || new qiniu.rs.Client();
    
    client.statefile(this.conf.bucketname, key, function(err, ret) {
        if (!err) {
            return cb(err);
        }
        
        return cb(ret);
    });
};

/**
 * 获取uploadtoken,可以设置详细信息
 * @param {Object} options policy options
 * @param {Function} cb callback function
 */ 
client.prototype.GetUploadToken = function(options, cb) {
    options.scope                   = options.scope || this.conf.bucketname;
    
    options.endUser                 = options.endUser || null;
    options.saveKey                 = options.saveKey || null;
    
    options.callbackUrl             = options.callbackUrl || null;
    options.callbackBody            = options.callbackBody || null;
    options.callbackHost            = options.callbackHost || null;
    
    options.returnUrl               = options.returnUrl || null;
    options.returnBody              = options.returnBody || null;
    
    options.persistentOps           = options.persistentOps || null;
    options.persistentNotifyUrl     = options.persistentNotifyUrl || null;
    options.persistentPipeline      = options.persistentPipeline || null;
    
    options.fsizeLimit              = options.fsizeLimit || null;
    
    options.detectMime              = options.detectMime || null;
    
    options.mimeLimit               = options.mimeLimit || null;
    
    //上传完成后需要执行那些数据处理
    options.asyncOps = options.asyncOps || null;     
    this.setupQiniu();
    var putpolicy = new qiniu.rs.PutPolicy2(options);
    
    return cb(null,putpolicy.token());
};


client.prototype.downloadUrl = function(key) {
    var baseUrl = qiniu.rs.makeBaseUrl(this.conf.domain, key);
    var policy = new qiniu.rs.GetPolicy();
    this.setupQiniu();
    return policy.makeRequest(baseUrl);  
};

/**
 * 私有资源下载时获取临时url
 * 
 * @param {Object} options bucket and key
 */
client.prototype.GetDownloadUrl = function(key) {
     var self = this;      
     return self.downloadUrl(key);
 };

/**
 * 删除文件
 */ 
client.prototype.RemoveFile = function(key, cb) {    
    
    var client = this.qiniuclient || new qiniu.rs.Client();
    this.setupQiniu();
    client.remove(this.conf.bucketname, key, function(err, ret) {
       if (err) {
           return cb(err);
       }
       
       return cb(null,ret);
    });
};

/**
* 列出文件列表
*/ 
client.prototype.ListFiles = function(options, cb) {
    var rsf = this.qiniursf || qiniu.rsf;
        
    options.prefix = options.prefix || null;
    options.marker = options.marker || null;
    options.limit = options.limit || null;
    options.delimiter = options.delimiter || null;
    
    this.setupQiniu();
     
    rsf.listPrefix(this.conf.bucketname, options.prefix, options.marker, options.limit,options.delimiter, function(err, ret) {
        if (err) {
            return cb(err);
        }
        
        return cb(null,ret);
    });
};


client.prototype.setupQiniu = function(){
    qiniu.conf.ACCESS_KEY = this.conf.ACCESS_KEY ;
    qiniu.conf.SECRET_KEY = this.conf.SECRET_KEY ;
    
}