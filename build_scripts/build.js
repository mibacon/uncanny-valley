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
    testData["user"] = "human"
    testData["user2"] = "cleverbot"
    testData["convo"] = {}

    var splitList = splits

    var counter = 0
    for (var i = 0; i < splitList.length; i+=2) {
         testData["convo"]['user' + counter.toString()] = splitList[i];
         testData["convo"]['bot' + counter.toString()] = splitList[i+1]
         counter ++
    }//end of loop
    //   console.log(testData);
      obj.push(testData)
      console.log(j)
} //end of loop

// console.log(testData)
fs.writeFileSync('./data.json', JSON.stringify(obj), 'utf-8')







