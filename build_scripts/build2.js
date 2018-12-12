var request = require('request');
var fs = require('fs');

var obj=[]


for (var j = 0; j < 15; j++){
    var data = fs.readFileSync('./convo' + j +'.txt')
    
    var testData = {};
    
    var splits = data.toString().split('\n')
    
    
    for(var i = splits.length - 1; i >= 0; i--) {
        if(splits[i] == "") {
           splits.splice(i, 1);
        }
        splits[i] = splits[i].substring(splits[i].indexOf(":") + 1).trim();;
        
    } //end of loop
    
    testData["title"] = splits[0]
    testData["bot-human"] = 1
    testData["lonely"] = Math.round(Math.random())
    testData["identity"] = Math.round(Math.random())
    testData["knowledge"] = Math.round(Math.random())
    testData["religion"] = Math.round(Math.random())
    testData["culture"] = Math.round(Math.random())
    
    obj.push(testData)
}

fs.writeFileSync('./frontpage.json', JSON.stringify(obj), 'utf-8')