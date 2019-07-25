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
                
                
                
                
                var content="import { Injectable } from '@angular/core';\n";
                    content+="import { HttpClient, HttpHeaders } from '@angular/common/http';\n";
                    content+="import { ApiConfig } from '../app/api.config'\n";
                    content+="@Injectable()\n";
                    content+="export class "+titleCase(modelname)+"Api {\n";
                    content+="\n";
                    content+="    constructor(public http: HttpClient) {\n";
                    content+="\n";
                    content+="    }\n";
                    
                    content+="\n";
                    for(var f of models[modelname]){
                        
                        content+="\n";
                        content+="    public "+f.func+"(data, showLoadingModal: boolean = true) {\n";
                        content+="        var url = ApiConfig.getApiUrl() + '"+f.model+"/"+f.func+"';\n";
                        content+="        var headers = ApiConfig.GetHeader(url, data);\n";
                        content+="        let options = { headers: headers };\n";
                        content+="        let body = ApiConfig.ParamUrlencoded(data);\n";
                        content+="        let loading = null;\n";
                        content+="\n";
                        content+="        if (showLoadingModal) {\n";
                        content+="            loading = ApiConfig.GetLoadingModal();\n";
                        content+="        }\n";
                        content+="\n";
                        content+="        return this.http.post(url, body, options).toPromise()\n";
                        content+="            .then((res) => {\n";
                        content+="                return res.json();\n";
                        content+="            })\n";
                        content+="            .catch(err => {\n";
                        content+="                console.error(err);\n";
                        content+="                return ApiConfig.ErrorHandle('"+f.model+"/"+f.func+"', data, err);\n";
                        content+="            });\n";
                        content+="    }\n";
                        content+="\n";
                        
                    }
                    content+="}\n";

                    var filepath = output + '/' + modelname  + '.api.ts';
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