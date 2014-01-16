$(document).ready(function() {
    var $workspace=$(".center-column"),
        $processes=$(".processes"),
        $process=$(".process");
        $stage=$(".stage");
        $rightColumn=$(".right-column");

    $(".fa-folder").click(function(){
        var div= $(this).parent().find(".inner")
        if(div.css("display")!="none")
        {
            div.slideUp("fast");
        }
        else
        {
            div.slideDown("fast");
        }
    });
    $(".stage").click(function(event){
        var rHeight = $(this).find(".results").height();
        var rWidth = $(this).find(".results").width();
        var $item = $( this ),$target = $( event.target );
        if ( $target.is( "i.fa-angle-double-right" ) ) {
            $(this).addClass("worked").detach().appendTo($workspace).fadeIn();
            $(this).find("i.fa-angle-double-right").remove();
            $(this).find(".checkpoint").before("<i class='fa fa-times-circle'></i>").append("<i class='fa fa-chevron-up'></i>");

        }
        if ($target.is( "i.fa-times-circle" )) {
            $(this).find("i.fa").remove().end().append("<i class='fa fa-angle-double-right'></i>");
            $(this).removeClass("worked").detach().appendTo($rightColumn.find(".resources")).end().find(".results").hide().end().css("margin-top", 0);
        }
        if ($target.is( "i.fa-chevron-up" )) {
            $(this).find(".results").width(rWidth+5);
            var marginTop = $(this).css("margin-top").replace("px", "");
            $(this).css("margin-top",marginTop-rHeight).find("i.fa-chevron-up")//.css({left: -width});
            $(this).find(".results").show("blind");
            //$(this).find(".checkpoint").css({width: rWidth});
            $(this).find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
            return;
        }
        if($target.is("i.fa-chevron-down")) {
            $(this).find(".results").hide("blind");
            $(this).find(".checkpoint").animate({width: $("i.fa-chevron-down").width()+10}, 500);
            $(this).find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        }
    });


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
