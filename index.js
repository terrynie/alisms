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
function AliSMS(options) {
    'use strict';
    this.accessKeyId = this.accessKeyId || options.accessKeyId;
    this.accessKeySecret = this.accessKeySecret || options.accessKeySecret;
    this.signName = this.signName || options.signName;
    this.templateCode = this.templateCode || options.templateCode;
};

/**
 * [发送短信]
 * @param  {[type]} options.paramString [必需]              对应你要传入短信模板的内容
 * @param  {[type]} options.receiver    [必需]              为接收短信的号码
 * @param  {[type]} options.method      [可选 默认GET]       使用GET或POST请求发送
 * @param  {[type]} options.ssl         [可选 默认false]     是否使用HTTPS发送请求
 * @param  {[type]} options.format      [可选 默认JSON]      返回类型使用JSON或XML
 * @param  {[type]} options.uuid        [可选 默认使用随机数]  可自己传入进行覆盖，须确保每次请求不同
 * @param  {[type]} options.version     [可选 默认最新版API]  阿里云短信服务API版本
 * @return {[type]} callback            [可选 参数为返回信息]
 */
AliSMS.prototype.sendSMS = function (options, callback) {
    'use strict';

    var _paramString = (typeof options.paramString == 'string') ? options.paramString : JSON.stringify(options.paramString);
    _paramString = _paramString.replace(/(\')|( )/g, function (match, p1, p2) {
        return p1 ? '"' : '';
    });

    var _baseURL = options.ssl ? 'https://sms.aliyuncs.com' : 'http://sms.aliyuncs.com';

    var _receiver = (typeof options.receiver == 'string') ? options.receiver : options.receiver.toString();
    _receiver = _receiver.replace(/(\')|( )/g, function (match, p1, p2) {
        return p1 ? '"' : '';
    })
    var _method = options.method || 'GET';
    var _ssl = options.ssl || false;
    var _format = options.format || 'JSON';
    var _uuid = options.uuid || Math.random().toString().slice(2);
    var _version = options.version || '2016-09-27';
    var _timestamp = this.getTimestamp();

    // 请求参数按照字母表顺序排列
    var stringToEscape = ['AccessKeyId', this.accessKeyId, 'Action', 'SingleSendSms', 'Format', _format, 'ParamString', _paramString, 'RecNum', _receiver, 'RegionId', 'cn-hangzhou', 'SignName', this.signName, 'SignatureMethod', 'HMAC-SHA1', 'SignatureNonce', _uuid, 'SignatureVersion', '1.0', 'TemplateCode', this.templateCode, 'Timestamp', _timestamp, 'Version', _version];
    var temp = [];
    // 对请求参数进行第一次encode
    for (var i = 0; i < stringToEscape.length - 1; i += 1) {
        temp[i] = stringToEscape[i];
        stringToEscape[i] = encodeURIComponent(stringToEscape[i]);
        // 添加&符号和=号，便于下一步拼接query string
        if (i % 2 == 0) {
            stringToEscape[i] += '=';
        } else if (i % 2 == 1) {
            stringToEscape[i] += '&';
        }
    }
    temp[temp.length] = stringToEscape[temp.length];
    // 拼接参数，得到query string
    var stringEscapedStep1 = stringToEscape.join('');

    // 第二次编码，对query string整体编码
    var stringEscaped = encodeURIComponent(stringEscapedStep1);

    var stringToSign = '';
    var signature = '';

    // define callback
    var cb = function (res) {
        var data = '';
        res.on('date', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            callback ? callback(data) : console.log(data);

        });
        res.on('error', function (err) {
            callback ? callback(JSON.stringify(err)) : console.log(JSON.stringify(err));
        });
    }

    if (_method.toLowerCase() === 'get') {
        // 添加请求方法
        stringToSign = 'GET&%2F&' + stringEscaped;

        // 使用HMAC-SHA1进行hash计算,并转为base64编码，然后再将特殊字符编码
        signature = encodeURIComponent(crypto.createHmac('sha1', this.accessKeySecret + '&').update(new Buffer(stringToSign, 'utf8')).digest().toString('base64')).replace(/\//g, '%2F');
        // 生成请求URL
        var url = _baseURL + '?Signature=' + signature + '&' + stringEscapedStep1;

        if (_ssl) {
            https.get(url, cb);
        } else {
            http.get(url, cb);
        }
    } else if (_method.toLowerCase() === 'post') {
        stringToSign = 'POST&%2F&' + stringEscaped;

        signature = encodeURIComponent(crypto.createHmac('sha1', this.accessKeySecret + '&').update(new Buffer(stringToSign, 'utf8')).digest().toString('base64')).replace(/\//g, '%2F');

        for (var i = 0; i < temp.length - 1; i += 1) {
            // 添加&符号和=号，便于下一步拼接query string
            if (i % 2 == 0) {
                temp[i] += '=';
            } else if (i % 2 == 1) {
                temp[i] += '&';
            }
        }

        var data = temp.join('');

        var reqData = 'Signature=' + signature + '&' + data;

        // http https use deferent port
        var _port = _ssl ? 443 : 80;
        var options = {
            host: 'sms.aliyuncs.com',
            port: _port,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(reqData)
            }
        };

        if (_ssl) {
            var post_req = https.request(options, cb);
        } else {
            var post_req = http.request(options, cb);
        };
        post_req.write(reqData);
        post_req.end();
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
    var month = now.getUTCMonth() + 1 > 9 ? '' + (now.getUTCMonth() + 1) : '0' + (now.getUTCMonth() + 1);
    var date = now.getUTCDate() > 9 ? '' + now.getUTCDate() : '0' + now.getUTCDate();
    var hours = now.getUTCHours() > 9 ? '' + now.getUTCHours() : '0' + now.getUTCHours();
    var minutes = now.getUTCMinutes() > 9 ? '' + now.getUTCMinutes() : '0' + now.getUTCMinutes();
    var seconds = now.getUTCSeconds() > 9 ? '' + now.getUTCSeconds() : '0' + now.getUTCSeconds();

    return year + '-' + month + '-' + date + 'T' + hours + ':' + minutes + ':' + seconds + 'Z';
};

module.exports = AliSMS;