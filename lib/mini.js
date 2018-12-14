var fs = require("fs");
var path = require("path");
var request = require('request');

module.exports.syncapi = function (user, app, output) {
    //console.log(user,app,output);
    //http://console.app-link.org/api/cms?action=apilist&login=alucard263096&alias=dds
    var url="http://console.app-link.org/api/cms?action=apilist&login="+user+"&alias="+app;
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the baidu homepage.
            var models=JSON.parse(body)
            for(var modelname in models){
                var content="/*******使用方法，下面两句复制到page的js文件的头部\n";
                    content+="\n";
                    content+="import { ApiConfig } from '../../apis/apiconfig';\n";
                    content+="import { InstApi } from '../../apis/"+modelname+".api';\n";
                    content+="\n";
                    content+="var "+modelname+"Api=new "+titleCase(modelname)+"Api();\n";
                    content+="*******/\n";
                    content+="import { ApiConfig } from 'apiconfig';\n";
                    content+="export class "+titleCase(modelname)+"Api{\n";
                    content+="\n";
                    for(var f of models[modelname]){
                        
                        content+="\n";
                        content+="    "+f.func+"(json, callback, showLoading = true) {\n";
                        content+="\n";
                        content+="        if (showLoading)\n";
                        content+="            ApiConfig.ShowLoading();\n";
                        content+="\n";
                        content+="        var header = ApiConfig.GetHeader();\n";
                        content+="        console.log(header);\n";
                        content+="        console.log(json);\n";
                        content+="        wx.request({\n";
                        content+="            url: ApiConfig.GetApiUrl() + '"+f.model+"/"+f.func+"',\n";
                        content+="            data: json,\n";
                        content+="            method: 'POST',\n";
                        content+="            dataType: 'json',\n";
                        content+="            header: header,\n";
                        content+="            success: function (res) {\n";
                        content+="                if (callback != null) {\n";
                        content+="                    callback(res.data);\n";
                        content+="                }\n";
                        content+="            },\n";
                        content+="            fail: function (res) {\n";
                        content+="                console.log(res);\n";
                        content+="                callback(false);\n";
                        content+="            },\n";
                        content+="            complete: function (res) {\n";
                        content+="                console.log(res);\n";
                        content+="            \n";
                        content+="                if (showLoading)\n";
                        content+="                    ApiConfig.CloseLoading();\n";
                        content+="            }\n";
                        content+="        })\n";
                        content+="    }\n";
                    }
                    content+="}\n";

                    var filepath = output + '/' + modelname  + '.api.js';
                    fs.writeFile(filepath,content, (err)=>{
                        if(err) {
                            return console.log(err);
                        }
                        console.log(filepath+" was created.");
                    });
            }
        }else{
            console.log(error);
            console.log("Got api list failed, please check your user and project is correct.");
        }
    })
}

function titleCase(s) {  
    var i, ss = s.toLowerCase().split(/\s+/);  
    for (i = 0; i < ss.length; i++) {  
        ss[i] = ss[i].slice(0, 1).toUpperCase() + ss[i].slice(1);  
    }  
    return ss.join(' ');  
}