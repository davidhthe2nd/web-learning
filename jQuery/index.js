$("button").click(function(){
    $("h1").hide();
});

$("body").keydown(function(event){
    $("h1").text(event.key);
});