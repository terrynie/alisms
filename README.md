#AliSMS
帮助您快速使用Node.js接入阿里云短信服务。

####安装

```shell
$ npm install alisms-dx
```

####使用

```javascript
var AliSMS = require('alisms-dx');
// accessKeyId和accessKeySecret在阿里云获取
// signName是您的【短信签名】名称，templateCode是您的【短信模板】代码
var options = {
    accessKeyId: YOUR_ACCESSKEYID, 
    accessKeySecret: YOUR_ACCESSKEYSECRET, 
    signName: YOUR_SIGNNAME, 
    templateCode: YOUR_TEMPLATECODE
}
var alismsDX = new AliSMS(options);

// paramString [必需]                    对应你要传入短信模板的内容
// receiver    [必需]                    为接收短信的号码
// method      [可选 默认GET]           使用GET或POST请求发送
// ssl         [可选 默认false]         是否使用HTTPS发送请求
// format      [可选 默认JSON]          返回类型使用JSON或XML
// uuid        [可选 默认使用随机数] 可自己传入进行覆盖，须确保每次请求不同
// version     [可选 默认最新版API]   阿里云短信服务API版本
var sendOptions = {
    paramString: CUSTOM_PARAMSTRING, 
    receiver: CUSTOM_RECEIVER, 
    method: CUSTOM_METHOD, 
    ssl: CUSTOM_SSL, 
    format: CUSTOM_FORMAT, 
    uuid: CUSTOM_UUID, 
    version: CUSTOM_VERSION
}

// callback可选，接受的参数为阿里云返回信息，可不提供
function callback(result) {
    // ....some code
}
alismsDX.sendSMS(sendOptions, callback);
```

####声明
第一次在npm中发布module，肯定还有很多不足之处，如有发现望及时指正，我会及时修改。

可PR或联系邮箱: [niemingyang8@gmail.com](mailto://niemingyang8@gmail.com)

如有赐教，将万分感激！


####LICENSE
MIT