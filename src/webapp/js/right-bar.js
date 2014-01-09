var $workspace=$(".center-column"),
    $processes=$(".processes"),
    $process=$(".process");

$(".fa-folder").click(function(){
    var div= $(this).parent().find("div")
    if(div.css("display")!="none")
    {
        div.slideUp("fast");
    }
    else
    {
        div.slideDown("fast");
    }
})
var trash_icon = "<i class='fa fa-trash-o'></i>";
$(function() {
    $process.draggable({ revert: "invalid" });

    $workspace.droppable({
        accept: ".processes div",
        cancel: "span.glyphicon-remove",
        drop: function( event, ui ) {
            ui.draggable.append(trash_icon).appendTo($workspace).fadeIn()
            var $newPosX = ui.offset.left - $(this).offset().left;
            var $newPosY = ui.offset.top - $(this).offset().top;
            ui.draggable.css({left: $newPosX})
        }
    });
    $processes.droppable({
        cancel: "span.glyphicon-remove",
        accept: ".center-column div",
        drop: function( event, ui ) {
            ui.draggable.find("span.glyphicon-remove").remove().end().detach().css({top: 0,left: 0}).appendTo($processes);


        }
    });

    $process.find(".glyphicon-remove").click(function(){
        alert("ok");
        $(this).parent().find("span.glyphicon-remove").remove();
        $(this).parent().appendTo($processes);

    })

});

