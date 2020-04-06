const qiniu = require('qiniu');

const config = new qiniu.conf.Config();
const accesskey = 'sKinjQ5quCjitqHIAdhSNVjMpW7fB0aud5bVdjuR';
const SecretKey = 'YxdUUrWMa2bl7g60nFOGlvUAy42x4OvEOoJxmYf1';

// 空间对应的机房
config.zone = qiniu.zone.Zone_z2;
const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();

const options = {
  scope: 'statich5',
  returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
  callbackBodyType: 'application/json'
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const mac = new qiniu.auth.digest.Mac(accesskey, SecretKey);
const Token = putPolicy.uploadToken(mac);

function putStreams(key, localFile) {
  formUploader.putFile(Token, key, localFile, putExtra, (respErr, respBody, respInfo) => {
    if (respErr) {
      throw respErr;
    }
    if (respInfo.statusCode === 200) {
      console.log(respBody);

      // const sql = 'insert into `xek_bing` (`id`,`name`,`describe`,`bash`,`create_date`) values (?,?,?,?,NOW());';
      // const value = [new Date().getTime(), respBody.key, JSON.stringify(desc), respBody.hash];
      // uploadImg(sql, value, resp => {
      //   console.log(resp);
      // });
    } else {
      console.log(respInfo.statusCode);
      console.log(respBody);
    }
  });
}
module.exports = putStreams;
