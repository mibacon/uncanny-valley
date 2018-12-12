$(function(){
    
    var titles= ["Whatdoyouthinkofthesingularity", 
                "Whatdoyoudreamabout", 
                "Niceweatherwerehaving", 
                "Mybackisaching", 
                "Whoareyou", 
                "Sowhatdoyoudoforaliving", 
                "YouaremucheasiertotalktothanmyfriendAlice", 
                "CantbeImustbehuman", 
                "Tosomeonewhoisagirl", 
                "CanyoupassaTuringtest", 
                "Itssunnyoutside", 
                "Wellthatwasagoodyogurt", 
                "Imhungry", 
                "Imabitanxious", 
                "Impushingofftheinevitable"]
    
    var current = $(location).attr("href")
    var num;
    current = current.substring(current.lastIndexOf("/")+1, current.indexOf(".html"))
   
    titles.forEach(function(val, key){
        
        if(val == current) {
            num = key
            console.log(val + " "+ num)
        }
    })
     
   
      $.getJSON('./data1.json', function(data){
        
        var ourData = data[num]
        
        var convo = ourData.convo
        
        var labels = ourData.labels
        
        var botParts = []
        
        var newLabels =[]
        
        
        // Object.keys(labels).forEach(function(val) {
        //     labels[val].index = val
            
        //     var temp ={}
        //     temp.index = labels[val].index
        //     temp.score = labels[val].score
        //     temp.label = labels[val].label
            
        //     newLabels.push(temp)
        // })
        
        // console.log(newLabels)
        $(function(){
            
            $("#container").scrollStory()
            
        })
        
        Object.keys(convo).forEach(function(val, key) {
            
            var lineNumber = val.replace(/[a-z]/g, "")
            var lineClass;
            var user = val.replace(/\d/g, ""); 
            var speakerClass;
            
            if(lineNumber % 3 == 0) {
                lineClass = "first"
            } else if(lineNumber %3 == 1) {
                 lineClass = "second"
            } else {
                lineClass = "third"
            }
            
            if(user == "user") {
                speakerClass = "human"
            } else {
                speakerClass = "bot story"
                botParts.push(convo[val])
            }
            
            $('.right-side').append('<div class="' + lineClass+ ' '+ speakerClass+ '"> '+ convo[val] + '</div>')
            
        })
        
        function cap(string) 
            {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        
        $('#subtitle').append('<div id="convo-title">'+ ourData.title + '</div>')
       
        $('#subtitle').append('<div id="convo-participants">'+ cap(ourData.user) + ' ... '+ cap(ourData.user2) + '</div>')

        
        $('.bot').fitText(.8)
        
        $('.end').append('<div class="summary"> </div>')
    
         //end of scroll story
        

        
        
        
        $('.summary').text(ourData.title)
            .append('<div> url </div>')
            
            
        botParts.forEach(function(val, key) {
            
            $('.summary').append('<span>' + val+ ' </span>')
        
            
            
        })
        
        
        
        
    })//end of data
    
    
    
})// end of jquery