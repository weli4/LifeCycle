$(document).ready(function() {
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

    $process.draggable({
        grid: [ 20,20 ],
        cancel: "i.fa",
        revert: "invalid",
        helper: 'clone',
        cursor: "move"
    });

    $workspace.droppable({
        accept: ".processes div",
        drop: function( event, ui ) {
            ui.draggable.append(trash_icon).appendTo($workspace).fadeIn()
            var $newPosX = parseInt($(this).css('width').replace("px", "")) + ui.helper.position().left;
            var $newPosY = ui.offset.top - $(this).offset().top;
            ui.draggable.css({position: 'absolute',left: $newPosX, top: $newPosY })
        }
    });
    $processes.droppable({
        accept: ".center-column div",
        drop: function( event, ui ) {
            ui.draggable.find("i.fa-trash-o").remove().end().detach().css({top: 0,left: 0, position: 'relative'}).appendTo($processes);
        }
    });
    $(".process").click(function(event){
        var $item = $( this ),$target = $( event.target );
        if ( $target.is( "i.fa-trash-o" ) ) {
            $(this).find("i.fa-trash-o").remove();
            $(this).detach().css({top: 0,left: 0, position: 'relative'}).appendTo($processes);
        }
    });
});
})
