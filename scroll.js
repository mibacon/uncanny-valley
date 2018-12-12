
      
$(function(){
    var color = {
        onCulture: "#B82601",
        onKnowledge: "#82276F",
        onIdentity: "#00467C", 
        onLonliness: "#431B8E", 
        onReligion: "#9A031E",
        none: "#414a4c"
    }
      
      
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
        
       
        Object.keys(labels).forEach(function(val) {
            labels[val].index = val
            
            var temp ={}
            temp.index = labels[val].index
            temp.score = labels[val].score
            temp.label = labels[val].label
            
            newLabels.push(temp)
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
                speakerClass = "bot"
                botParts.push(convo[val])
            }
     
            
            newLabels[lineNumber][speakerClass] = convo[val]
            newLabels[lineNumber]["lineClass"] = lineClass
            
      
        })       
        
       
       
        $(function(){
            
            $("#container").scrollStory({
                content: newLabels,
                autoActivateFirstItem: true,
                itembuild: function(ev,item){
                    var revisedLabel = item.data.label.replace(" ", "")
                   
                    item.el.append('<div class="human '  + item.data.lineClass+ '">' + item.data.human + '</div>')
                    item.el.append('<div class="bot '  + item.data.lineClass+ '">' + item.data.bot + '</div>')
                    
                    item.el.children().eq(1).css("font-size", window.innerHeight/10)
                    
                    if (revisedLabel) {
                         item.el.children().eq(1).css('color', color[revisedLabel])
                    }
                }
            })   
            
        })
        
        $('#container').on('itementerviewport', function(ev, item) {
        //  $('#container').on('itemfocus', function(ev, item) {
             var revisedLabel;
             if(!item.data.label) {
                 revisedLabel = "none"
             } else {
                 revisedLabel = item.data.label.replace(' ', '')
             }
          
             
             
             $('#chart').animate({height: item.data.score*10}).removeClass().addClass(revisedLabel)
             
             $('#dynamic').text(item.data.label).removeClass().addClass(revisedLabel)
            
             $('#dynamic.'+revisedLabel).css('color', color[revisedLabel])
             $('#chart.'+revisedLabel).css('background-color', color[revisedLabel])
             
            
         })
        
        
        
        $('#container').on("containerinactive", function(ev, item) {
            $('#convo-title, #convo-participants, #chart, .random, .label').hide()
            $('#sum').show().text("Summary")
        })
        
        $('#container').on("containeractive", function(ev, item) {
            $('#convo-title, #convo-participants, #chart, .random, .label').show()
            $('#sum').hide()
            
        })
        
        function cap(string) 
            {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        
        $('#subtitle').append('<div id="convo-title">'+ ourData.title + '</div>')
       
        $('#subtitle').append('<div id="convo-participants">'+ cap(ourData.user) + ' ... '+ cap(ourData.user2) + '</div>')

        
     
        
        $('.end').append('<div class="summary"> </div>')
    
         
        var div = d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);

        
    
        
        $('.summary').append('<div id="recap">' + ourData.title + '</div>')
            .append('<div id="url"> Is the bot clever? Find out at <a href= "http://www.cleverbot.com"> cleverbot.com </a> </div> <br> <br> ')
            .append('<div class="bot_recap"></div>')
        
        $('#url').css('font-family', 'Open Sans, serif')
            
        botParts.forEach(function(val, key) {
            var revisedLabel;
           
            if(!newLabels[key].label) {
                revisedLabel = "none"
            } else {
                revisedLabel = newLabels[key].label.replace(" ", "")
                
            }
            
            
            $('.bot_recap').append('<span class="snip index_'+ key + " "+revisedLabel+ '">' + val+ ' </span>')
            
            $('.'+revisedLabel).css({
                'color': color[revisedLabel],
                'font-family': 'Open Sans'})
            
        })    
        
      
            
        $('.summary').append('<div class="summary-chart"></div>')
        
       
        var width = $('.summary-chart').width()
      
        var x = d3.scaleBand()
            .range([0, width])
            .paddingInner(0.01)
            .domain(Object.keys(newLabels))
            .round(true)
            
        var y = d3.scaleLinear()
            .range([5, 300])
            .domain([0, 10])
        
        
        
        var svg = d3.select('.summary-chart').append('svg')
            .attr('width', width)
            .attr('height', 500)
        
        var bars = svg.selectAll('rect')
            .data(newLabels)
            .enter()

        bars.append('rect')
           
            .attr('class', function(d, i){
                if (!d.label) {
                    return "bar index_" + i + " none"
                } else {
                    return "bar index_" + i + " " + d.label.replace(" ", "")
                }
            })
            .attr('height', function(d){
                return y(d.score)
            })
            .attr('x', function(d, i){
                return x(i)
            })
            .attr('y', function(d,i){
                return 499 - y(d.score)
            })
            .attr('width', x.bandwidth())
            .attr('fill', function(d){
                if(d.label) {
                    return color[d.label.replace(" ", "")]
                } else {
                    return color["none"]
                }
                
            })
            .on('mouseover', function(d){
                var thisClass = d3.select(this).attr("class")
                thisClass= thisClass.substring(4, 12)
                d3.selectAll('.bar:not(.'+thisClass+")").attr('opacity', .25);
                $('.snip').not('.'+thisClass).css('opacity', '.25')
              
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                div.html('<span> Randomness Score: ' + d.score + "<br/> Index: "  +  d.label)	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");
            
            })
            
            .on('mouseout', function(d){
                 var thisClass = d3.select(this).attr("class")
                
                thisClass= thisClass.substring(4, 12)
                 d3.selectAll('.bar').attr('opacity', 1)
                $('.snip').css('opacity', '1')
                
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);
                
            })
        
            
            
            $('.snip').on('mouseover', function(){
                $('.snip').not(this).css('opacity', '.25')
                
                
                var thisClass= $(this).attr('class').substring(5, 13)
                
                $('.'+thisClass).addClass('active')
                
                d3.select("svg").selectAll("*:not(.active)").attr('opacity', '.25'); 
                
                
        
            })
        
            $('.snip').on('mouseout', function(){
                $('.snip').not(this).css('opacity', '1')
                var thisClass= $(this).attr('class').substring(5, 13)
                
                $('.'+thisClass).removeClass('active')
                
             
                 d3.selectAll('rect').attr('opacity', '1')
            })
            
    })//end of data
    
    
    
})// end of jquery