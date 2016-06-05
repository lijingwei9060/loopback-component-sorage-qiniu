var provider = require('./provider'),
    async = require('async');

module.exports = StorageService;

/**
 * Storage service 构造函数，options的属性依赖于具体的提供者，暂时只支持七牛
 * 
 */ 
function StorageService(options) {
    if (!(this instanceof StorageService)) {
        return new StorageService(options);
    }  
    this.provider = 'options.type';//暂时直接写死
    this.client = provider.createclient(options);
}

StorageService.providers = {
  "qiniu": provider.qiniu
};


StorageService.prototype.statfile = function(key,  cb) {
    return this.client.statfile(key, cb);
};

StorageService.prototype.GetUploadToken = function(options, cb) {
    if ((options.callbackUrl && options.returnUrl) || (options.callbackBody && options.returnBody)) {
        var paramerr = new Error("parameter error");
        paramerr.statusCode = 401;
        
        return cb(paramerr);
    }
    return this.client.GetUploadToken(options, cb);
};

StorageService.prototype.RemoveFile = function(key, cb) {   
    return this.client.RemoveFile(key, cb);
};

StorageService.prototype.ListFiles = function(options, cb) {    
    return this.client.ListFiles(options, cb);
};

StorageService.prototype.GetDownloadUrl = function(key,cb){
    return cb(null,this.client.GetDownloadUrl(key));
}


StorageService.prototype.Download = function(key,req,res,cb){
    res.redirect(this.client.GetDownloadUrl(key));
}


StorageService.prototype.statfile.shared = true;
StorageService.prototype.statfile.accepts = [
    {arg: 'key', type: 'string'}
];
StorageService.prototype.statfile.returns = {arg: 'fileinfo', type: 'object', root: true};
StorageService.prototype.statfile.http =
{verb: 'get', path: '/files/:key'};


StorageService.prototype.GetUploadToken.shared = true;
StorageService.prototype.GetUploadToken.accepts = [
    {arg: 'options', type: 'object', http: {source: 'body'}}
];
StorageService.prototype.GetUploadToken.returns = {arg: 'token', type: 'string', root: true};
StorageService.prototype.GetUploadToken.http =
{verb: 'get', path: '/GetUploadToken'};


StorageService.prototype.RemoveFile.shared = true;
StorageService.prototype.RemoveFile.accepts = [
  {arg: 'key', type: 'string'}
];
StorageService.prototype.RemoveFile.returns = {};
StorageService.prototype.RemoveFile.http =
{verb: 'delete', path: '/files/:key'};

StorageService.prototype.ListFiles.shared = true;
StorageService.prototype.ListFiles.accepts = [
    {arg: 'options', type: "object", http: {source: 'body'}}
];
StorageService.prototype.ListFiles.returns = {arg: 'files', type: 'array', root: true};
StorageService.prototype.ListFiles.http =
{verb: 'get', path: '/ListFiles'};


StorageService.prototype.GetDownloadUrl.shared = true;
StorageService.prototype.GetDownloadUrl.accepts = [
    {arg: 'key', type: 'string'}
];
StorageService.prototype.GetDownloadUrl.returns = {arg: 'fileurl', type: 'string', root: true};
StorageService.prototype.GetDownloadUrl.http =
{verb: 'get', path: '/fileurl/:key'};


StorageService.prototype.Download.shared = true;
StorageService.prototype.Download.accepts = [
    {arg: 'key', type: 'string'},
    {arg: 'req', type: 'object', 'http': {source: 'req'}},
    {arg: 'res', type: 'object', 'http': {source: 'res'}}
];
StorageService.prototype.Download.returns = {};
StorageService.prototype.Download.http =
{verb: 'get', path: '/download/:key'};