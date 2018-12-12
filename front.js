

$(function(){
  
  var color = {
        culture: "#B82601",
        knowledge: "#82276F",
        identity: "#00467C", 
        lonely: "#431B8E", 
        religion: "#9A031E"
      }
      
  $('.filter span').each(function(val){
    console.log($(this).attr('id'))
    $(this).css('color', color[$(this).attr('id')])
  })
    
 

  $.getJSON('./frontpage.json', function(data){
      
      
      $.each(data, function(key, value){
          var url = value.title
          url = url.replace(/[.,?!\s,']/g, '')
          url = url+".html"
          
          if(value.culture == 1) {
            value.id = "culture"
          } else if(value.knowledge ==1) {
            value.id ="knowledge"
          } else if(value.identity ==1) {
            value.id ="identity"
          } else if(value.lonely ==1) {
            value.id ="lonely"
          } else {
            value.id ="religion"
          }
         $(".right").append('<span class="subpage"><a href="./' + url + '" class="' + value.id + '">' + value.title + "</a></span> ")
          
      })
        $('.right').append('<span class="bottom"> <a href="methodology.html"> methodology </a></span>')
        $('.right').fitText()
      // $('.right').fitLine(1.2)
      
      
      $(".filter").children().on("mouseover",function(){
        var highlight = $(this).attr("id")
        $('.'+highlight).css('color', color[highlight])
      })
      
      $(".filter").children().on("mouseout",function(){
         if (!$(this).hasClass("selected") ) {
        var highlight = $(this).attr("id")
        $('.'+highlight).css('color', 'black')}
      })
      
      $('.title').on('click', function(){
        $('.filter').removeClass("selected")
        
        $(".right").children().remove()
            
            $.each(data, function(key,value){
              var url = value.title
              url = url.replace(/[.,?!\s,']/g, '')
              url = url+".html"
             $(".right").append('<span class="subpage"><a href="./' + url + '" class="' + value.id + '">' + value.title + "</a></span> ")
              
            })
      })
      
      $(".filter").children().on("click",function(){
         
          
          if ( $(this).hasClass("selected") ) {
            
            $(this).removeClass("selected")
            $(".right").children().remove()
            
            $.each(data, function(key,value){
              var url = value.title
              url = url.replace(/[.,?!\s,']/g, '')
              url = url+".html"
             $(".right").append('<span class="subpage"><a href="./' + url + '" class="' + value.id + '">' + value.title + "</a></span> ")
              
            })
            
          } else {
           
            $(".filter").children().removeClass("selected")
            $(this).addClass("selected")
            $(".right").children().remove()
            
            
            var id = ($(this).attr("id"))
            $.each(data, function(key,value){
              var url = value.title
              url = url.replace(/[.,?!\s,']/g, '')
              url = url+".html"
              
              if (value[id] == 1) {
                 $(".right").append('<span class="subpage"><a href="./' + url + '" class="' + value.id + '">' + value.title + "</a></span> ")
                  $('.'+value.id).css('color', color[value.id])
                  
                }
            }) //end of each
         
          }
          
            
          
      })  //end of click
      
      
  }) //end of data
   

});