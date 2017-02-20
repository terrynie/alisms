var http = require('http');
var https = require('https');
var crypto = require('crypto');

/**
 * [exports description]
 * @param  {string} accessKeyId     [description]
 * @param  {string} accessKeySecret [description]
 * @param  {string} signName        [短信签名]
 * @param  {string} templateCode    [短信模板代码]
 * @return {[type]}                 [description]
 */
module.exports = function AliSMS(accessKeyId, accessKeySecret, signName, templateCode) {
    'use strict';
    this.accessKeyId = this.accessKeyId || accessKeyId;
    this.accessKeySecret = this.accessKeySecret || accessKeySecret;
    this.signName = this.signName || signName;
    this.templateCode = this.templateCode || templateCode;
};

/**
 * [发送短信]
 * @param  {[type]} paramString [必需]              对应你要传入短信模板的内容
 * @param  {[type]} receiver    [必需]              为接收短信的号码
 * @param  {[type]} method      [可选 默认GET]       使用GET或POST请求发送
 * @param  {[type]} ssl         [可选 默认false]     是否使用HTTPS发送请求
 * @param  {[type]} format      [可选 默认JSON]      返回类型使用JSON或XML
 * @param  {[type]} uuid        [可选 默认使用随机数]  可自己传入进行覆盖，须确保每次请求不同
 * @param  {[type]} version     [可选 默认最新版API]  阿里云短信服务API版本
 * @return {[type]}             [description]
 */
AliSMS.prototype.sendSMS = function (paramString, receiver, method, ssl, format, uuid, version) {
    'use strict';
    paramString = (typeof paramString === 'string') ? paramString.replace(' ', '') : JSON.stringify(paramString).replace(' ', '');

    var baseURL = ssl ? 'https://sms.aliyuncs.com' : 'http://sms.aliyuncs.com';
    var timestamp = this.getTimestamp();

    method = method || 'GET';
    ssl = ssl || false;
    format = format || 'JSON';
    uuid = uuid || Math.random().toString().slice(2);
    version = version || '2016-09-27';

    // 请求参数按照字母表顺序排列
    var stringToEscape = ['AccessKeyId', this.accessKeyId, 'Action', 'SingleSendSms', 'Format', format, 'ParamString', paramString, 'RecNum', receiver, 'RegionId', 'cn-hangzhou', 'SignName', this.signName, 'SignatureMethod', 'HMAC-SHA1', 'SignatureNonce', uuid, 'SignatureVersion', '1.0', 'TemplateCode', this.templateCode, 'Timestamp', timestamp, 'Version', version];
    // 对请求参数进行第一次encode
    for (var i = 0; i < stringToEscape.length; i += 1) {
        stringToEscape[i] = encodeURIComponent(stringToEscape[i]);
        // 添加&符号和=号，便于下一步拼接query string
        if (i % 2 == 0) {
            stringToEscape[i] += '=';
        } else if (i % 2 == 1) {
            stringToEscape[i] += '&';
        }
    }
    // 拼接参数，得到query string
    var stringEscapedStep1 = stringToEscape.join('');
    // 去除尾部多余的一个&
    stringEscapedStep1 = stringEscapedStep1.slice(0, (stringEscapedStep1.length - 1));
    // 第二次编码，对query string整体编码
    var stringEscaped = encodeURIComponent(stringEscapedStep1);

    var stringToSign = '';
    var signature = '';

    if (method.toLowerCase() === 'get') {
        // 添加请求方法
        stringToSign = 'GET&%2F&' + stringEscaped;
        // 使用HMAC-SHA1进行hash计算,并转为base64编码，然后再将特殊字符编码
        signature = encodeURIComponent(crypto.createHmac('sha1', this.accessKeySecret).update(new Buffer(stringToSign, 'utf8')).digest().toString('base64')).replace('/', '%2F');
        // 生成请求URL
        var url = baseURL + '?Signature=' + signature + '&' + stringEscapedStep1;

        if (ssl) {
            https.get(url, function (res) {
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    console.log(data);
                });
            });
        } else {
            http.get(url, function (res) {
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    console.log(data);
                });
            });
        }
    } else if (method.toLowerCase === 'post') {
        stringToSign = 'POST&%2F&' + stringEscaped;
        signature = encodeURIComponent(crypto.createHmac('sha1', this.accessKeySecret).update(new Buffer(stringToSign, 'utf8')).digest().toString('base64')).replace('/', '%2F');
        var reqData = {
            Signature: signature,
            AccessKeyId: this.accessKeyId,
            Action: 'SingleSendSms',
            Format: format,
            ParamString: paramString,
            RecNum: receiver,
            RegionId: 'cn-hangzhou',
            SignName: this.signName,
            SignatureMethod: 'HMAC-SHA1',
            SignatureNonce: uuid,
            SignatureVersion: '1.0',
            TemplateCode: this.templateCode,
            Timestamp: timestamp,
            Version: version
        };
        var options = {
            host: baseURL,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': reqData.length
            }
        };

        if (ssl) {
            var post_req = https.request(options, function (res) {
                var data = '';
                res.on('date', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    console.log(data);
                });
            });
            post_req.write(reqData);
            post_req.end();
        } else {
            http.request(options, function (res) {
                var data = '';
                res.on('date', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    console.log(data);
                });
            });
        };
    }
};

/**
 * 获取当前时间，并转换为指定形式
 * @return {[type]} [description]
 */
AliSMS.prototype.getTimestamp = function () {
    'use strict';
    var now = new Date();
    var year = now.getUTCFullYear() > 9 ? '' + now.getUTCFullYear() : '0' + now.getUTCFullYear();
    var month = now.getUTCMonth() + 1 > 9 ? '' + now.getUTCMonth() : '0' + now.getUTCMonth();
    var date = now.getUTCDate() > 9 ? '' + now.getUTCDate() : '0' + now.getUTCDate();
    var hours = now.getUTCHours() > 9 ? '' + now.getUTCHours() : '0' + now.getUTCHours();
    var minutes = now.getUTCMinutes() > 9 ? '' + now.getUTCMinutes() : '0' + now.getUTCMinutes();
    var seconds = now.getUTCSeconds() > 9 ? '' + now.getUTCSeconds() : '0' + now.getUTCSeconds();

    return year + '-' + month + '-' + date + 'T' + hours + ':' + minutes + ':' + seconds + 'Z';
};