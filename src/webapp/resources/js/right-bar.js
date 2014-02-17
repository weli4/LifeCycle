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
    $(".process").hover(function(){
        $(".properties").html($(this).find(".description").html());

    })
    $(".stage").click(function(event){
        var rHeight = $(this).find(".results").height();
        var rWidth = $(this).find(".results").width();
        var $item = $( this ),$target = $( event.target );
        if ( $target.is( "i.fa-angle-double-right" ) ) {
            $(this).addClass("worked").detach().appendTo($workspace).fadeIn();
            $(this).find("i.fa-angle-double-right").removeClass("fa-angle-double-right").addClass("fa-times-circle");
            $(this).find(".stage_process").removeClass("hide").end().find(".results").removeClass("hide");
            return;
        }
        if ($target.is( "i.fa-times-circle" )) {
            $(this).find("i.fa-times-circle").removeClass("fa-times-circle").addClass("fa-angle-double-right")
            $(this).removeClass("worked").detach().appendTo($rightColumn.find(".resources")).end();
            $(this).find(".stage_process").addClass("hide").end().find(".results").addClass("hide");
            $(this).removeClass("active");
            return;
        }
        if ($target.is( "i.fa-chevron-up" )) {
            $(this).find(".results").width(rWidth+5);
            var marginTop = $(this).css("margin-top").replace("px", "");
            $(this).find(".results").show();
            $(this).find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
            return;
        }
        if($target.is("i.fa-chevron-down")) {
            $(this).find(".results").hide("blind");
            $(this).find(".checkpoint").animate({width: $("i.fa-chevron-down").width()+10}, 500);
            $(this).find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
            return;
        }
        if($target.is(".stage.worked")) {
            $(".active").removeClass("active");
            $(this).addClass("active");
            return;
        }
    });
    $(".results").click(function(event)
    {
        $target = $( event.target );
        if ($target.is("span.show")) {
            $(this).find("span").removeClass("show").addClass("closeUp");
            $(this).find("div.data").slideDown();
            return;
        }
        if ($target.is("span.closeUp")) {
            $(this).find("span").removeClass("closeUp").addClass("show");
            $(this).find("div.data").slideUp();
            return;
        }
    })


    var trash_icon = "<i class='fa fa-trash-o'></i>";
    $(function() {
        $(".stage_process").droppable({
            accept: ".processes div",
            drop: function( event, ui ) {
                ui.draggable.append(trash_icon).appendTo( $(this)).fadeIn();
            }
        });
        $process.draggable({
            grid: [ 20,20 ],
            cancel: "i.fa",
            revert: "invalid",
            helper: 'clone',
            cursor: "move"
        });
        /*$workspace.droppable({
            accept: ".processes div",
            drop: function( event, ui ) {
                ui.draggable.append(trash_icon).appendTo($workspace).fadeIn()
                var $newPosX = parseInt($(this).css('width').replace("px", "")) + ui.helper.position().left;
                var $newPosY = ui.offset.top - $(this).offset().top;
                ui.draggable.css({position: 'absolute',left: $newPosX, top: $newPosY })
            }
        }); */
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
