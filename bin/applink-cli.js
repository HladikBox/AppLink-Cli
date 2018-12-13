#!/usr/bin/env node
var program = require('commander');

program.version('v' + require('../package.json').version)
       .description('test');

program.command('syncapi <type> <user> <app> <output>')
       .description('Sync all api from project')
       .action(function (typ,user,app,output) {
        
        if(typ=="mini"){
            var cli=require("../lib/mini.js");
            if(cli.syncapi(user,app,output)){
                
            }
        }else{
            console.log("We don't support the mini now, please try to use [mini/ionic].");
        }
        
         
       });

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
}