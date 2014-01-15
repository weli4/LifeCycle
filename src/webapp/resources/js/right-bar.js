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
        var $item = $( this ),$target = $( event.target );
        if ( $target.is( "i.fa-angle-double-right" ) ) {
            $(this).detach().appendTo($workspace).fadeIn();
            $(this).addClass("worked");
            $(this).find("i.fa-angle-double-right").remove();
            $(this).find(".checkpoint").before("<i class='fa fa-times-circle'></i>");
            $(this).find(".checkpoint").append("<i class='fa fa-chevron-down'></i>");
        }
        if ( $target.is( "i.fa-times-circle" ) ) {
            $(this).find("i.fa-times-circle").remove().end().find("i.fa-chevron-down").remove().end().append("<i class='fa fa-angle-double-right'></i>");
            $(this).removeClass("worked").detach().appendTo($rightColumn.find(".resources"));
        }
        if ( $target.is( "i.fa-chevron-down" ) ) {
            var height = $(this).find(".results").height()+20;
            var marginTop = $(this).css("margin-top").replace("px", "");
            $(this).find(".results").css({position: 'relative',left: 20, top: height });
            $(this).find(".results").show("blind");
            $(this).css("margin-top",marginTop-height);

        }
    });


    var trash_icon = "<i class='fa fa-trash-o'></i>";
    $(function() {
        /*$stage.draggable({
         cursor: "move"
         });  */
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
