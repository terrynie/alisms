var https = require('https');
var expect = require('chai').expect;


describe('https请求测试', function () {
    it('https GET请求百度首页', function () {
        https.get('https://www.baidu.com', function (res) {
            'use strict';
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                expect(data).to.contain('百度一下');
            });
        });
    });

    // it('https POST请求测试', function () {
    //     var post_data = {
    //         'step': '0',
    //         'email': '88@terrynie.com',
    //         'pwd': '318eada434d716b7af7da5f87b235e1e4182d2e23d9d56cf27eafaa7b5b5f0f7b5011efacf3211aa213981a1733bf50b42ad219d18bc3ec7437ec0fdc23286264833c548392824e2b08e9236dffa7b8be228c9194c3e7997a68070bc9a537d7afdf89b794a9038e2db8db2fb4ba174348b7fe7612ccfd6bf59af404',
    //         'nick': 'testtest',
    //         'track':'{"lname_s_t":0,"lname_i_t":5265,"lname_c_x":0,"lname_c_y":0,"lname_c_t":0,"lname":"519046658@qq.com","lname_l":16,"pwd_s_t":0,"pwd_i_t":7935,"pwd_c_x":0,"pwd_c_y":0,"pwd_c_t":0,"pwd_l":9,"nick_s_t":0,"nick_i_t":7085,"nick_c_x":0,"nick_c_y":0,"nick_c_t":0,"nick":"testtest","nick_l":8,"reg_btn_x":0,"reg_btn_y":0,"reg_btn_c_t":0,"total_time":0,"submit_count":0,"click_count":0}'
    //     }
    //     var options = {
    //         host: 'http://m.weibo.cn',
    //         path: '/regsubmitDeal/v5Reg',
    //         method: 'POST',
    //         headers: {
    //             'Host':'m.weibo.cn',
    //             'Origin': 'http://m.weibo.cn',
    //             'Referer': 'http://m.weibo.cn/reg/index?vt=4&res=wel&wm=3349&backURL=http%3A%2F%2Fm.weibo.cn%2F',
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //             'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'
    //         }
    //     };
    //     var post_req = https.request(options, function (res) {
    //         var data = '';
    //         res.on('date', function (chunk) {
    //             data += chunk;
    //         });
    //         res.on('end', function () {
    //             console.log(data);
    //         });
    //         res.on('error', function (err) {
    //             console.log(err);
    //         })
    //     });
    //     post_req.write(post_data.toString());
    //     post_req.end();
    // });
});