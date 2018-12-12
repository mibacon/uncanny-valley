var request = require('request');
var fs = require('fs');

var data = fs.readFileSync('./data.json')
var parsed = JSON.parse(data)

//stopwords source: https://www.ranks.nl/stopwords
var stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any","are","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does","doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves"];

var hash = []
var tfidf = []
var words = []

for (var j = 0; j < parsed.length; j ++ ) {
    var arrKeys = (Object.keys(parsed[j].convo))
    var localHash = []
    //extract only bot talk
    for (var i = 0; i < arrKeys.length; i++){
        var content = arrKeys[i]
        
        if(arrKeys[i].startsWith('bot')) {
            hash.push(parsed[j].convo[content])
        }
    } //end of i
    
    var hashJoin = hash.join().replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g," ").toLowerCase()
    
    var wordsArray = hashJoin.split(/\s+/)
    
    wordsArray = wordsArray.filter(item => !stopwords.includes(item))
    
    // for (var k = 0; k < wordsArray.length; k++) {
    //     for (i = 0; i < stopwords.length; i++) {
    //         if (wordsArray[k] == stopwords[i]) {
    //             console.log("index is" + k)
    //         }
    //     }
    // }
    
    

    var wordMap = {}
    
    //word frequency
    for (var i =0; i < wordsArray.length; i++){
        
        if(wordMap[wordsArray[i]]) {
            wordMap[wordsArray[i]] ++
        } else {
            wordMap[wordsArray[i]] = 1
        }
        
    } //end of i
    
    // console.log(wordMap)
      //sorted
    var keysSorted = Object.keys(wordMap).sort(function(a,b){return wordMap[b]-wordMap[a]})

 //final sort
    var finalSort = {}
    for (var i = 0; i < keysSorted.length; i++){
        finalSort[keysSorted[i]] = wordMap[keysSorted[i]]
    }
    
} //end of j


fs.writeFileSync('./hash.json', JSON.stringify(finalSort), 'utf-8')

for (var j = 0; j < parsed.length; j ++ ) {
    var arrKeys = (Object.keys(parsed[j].convo))
    var localHash = []
    //extract only bot talk
    for (var i = 0; i < arrKeys.length; i++){
        var content = arrKeys[i]
        
        if(arrKeys[i].startsWith('bot')) {
          localHash.push(parsed[j].convo[content])
        }
    }    
    
    var localJoin = localHash.join().replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g," ").toLowerCase()
   
    var localArray = localJoin.split(/\s+/)
    
    localArray = localArray.filter(item => !stopwords.includes(item))
    localArray = localArray.filter(function(v){return v!==''})
    
    var localMap = {}
    
    for (var i = 0; i < localArray.length; i++) {
        
        if(localMap[localArray[i]]) {
            localMap[localArray[i]] ++
        } else {
             localMap[localArray[i]] = 1
        }
        
    }

    var temp = Object.keys(localMap)
    var totalLocal = {}
    
    
    for (var i = 0; i < temp.length; i++){
        var word = totalLocal[temp[i]] 
        totalLocal[temp[i]] = {}
        totalLocal[temp[i]].wf = localMap[temp[i]]
        totalLocal[temp[i]].tf = finalSort[temp[i]]
        totalLocal[temp[i]].tfidf = Math.floor(totalLocal[temp[i]].wf * Math.log(11/totalLocal[temp[i]].tf))
    } 


    
    var sorted = Object.keys(totalLocal).sort(function(a,b) {
        return totalLocal[b].tfidf - totalLocal[a].tfidf
    })
    
    var localFinal = {}
    localFinal["title"] = "convo" + j
    
    for (var i=0; i <sorted.length; i++) {
        localFinal[sorted[i]] = {}
        localFinal[sorted[i]].wf = totalLocal[sorted[i]].wf
        localFinal[sorted[i]].tf = totalLocal[sorted[i]].tf
        localFinal[sorted[i]].tfidf = totalLocal[sorted[i]].tfidf
    }
    
    tfidf.push(localFinal)
    
        
    var otherSort = Object.keys(totalLocal).sort(function(a,b) {
        return totalLocal[b].tf - totalLocal[a].tf
    })
    
    var otherFinal = {}
    otherFinal["title"] = "convo" + j
    
    for (var i=0; i <otherSort.length; i++) {
        otherFinal[otherSort[i]] = {}
        otherFinal[otherSort[i]].wf = totalLocal[otherSort[i]].wf
        // otherFinal[otherSort[i]].tf = totalLocal[sorted[i]].tf
        // otherFinal[otherSort[i]].tfidf = totalLocal[sorted[i]].tfidf
    }
    
    words.push(otherFinal)
    
}//end of going through every dictionary



fs.writeFileSync('./tfidf.json', JSON.stringify(tfidf), 'utf-8')
fs.writeFileSync('./tf.json', JSON.stringify(words), 'utf-8')