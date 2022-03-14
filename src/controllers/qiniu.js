const qiniu = require('qiniu');

const config = new qiniu.conf.Config();
const accesskey = process.env.QINIU_ACCESSKEY;
const SecretKey = process.env.QINIU_SECRETKEY;

// 空间对应的机房
config.zone = qiniu.zone.Zone_z0;
const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();

const options = {
  scope: 'xek',
  returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
  callbackBodyType: 'application/json'
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const mac = new qiniu.auth.digest.Mac(accesskey, SecretKey);
const Token = putPolicy.uploadToken(mac);

const  putStreams =function(key, localFile) {
  formUploader.putFile(Token, key, localFile, putExtra, (respErr, respBody, respInfo) => {
    if (respErr) {
      throw respErr;
    }
    if (respInfo.statusCode === 200) {
      console.log(respBody);
    } else {
      console.log(respInfo.statusCode);
      console.log(respBody);
    }
  });
}
const formStreams= function(key,stream,cb){
  var formUploader = new qiniu.form_up.FormUploader(config);
  var putExtra = new qiniu.form_up.PutExtra();
  var readableStream = stream; // 可读的流
  formUploader.putStream(Token, key, readableStream, putExtra, function (respErr,
    respBody, respInfo) {
    if (respErr) {
      throw respErr;
    }
    cb(respInfo,respBody)
  });
}
// exports.formStreams = formStreams;
module.exports = {
  putStreams,
  formStreams
};
