var fs = require("fs");
var path = require("path");
var http = require('http');
var querystring = require('querystring');

module.exports.syncapi=function(user,app,output){
    //console.log(user,app,output);
    //http://console.app-link.org/api/cms?action=apilist&login=alucard263096&alias=dds

    
    var postData = querystring.stringify({
        'login': user,
        'alias': app   // 课程编号
    });

    var options = {
        hostname: 'console.app-link.org',
        port: 80,
        path: '/api/cms',
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Connection': 'keep-alive',
            'Content-Length': postData.length,  // 这里需要改为postData.length
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
        }
    }


    var req = http.request(options, function(res) {
        console.log(res);
    });
    
    req.write(postData);
    req.end();
}