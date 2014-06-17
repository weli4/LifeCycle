var MAX_ALT_NUMBER = 8;
var MIN_ALT_NUMBER = 2;

var altNumber = MIN_ALT_NUMBER;
//var altsArray = new Array();
$(document).ready( function(){
    //Функция для добавления новых элементов ввода
    document.getElementById("add_button").onclick = function(){
        if(altNumber < MAX_ALT_NUMBER){
            altNumber++;
            var li = document.createElement('li');
            var div = document.createElement('div');
            $(div).addClass("form-group");

            div.innerHTML = '<label class="col-sm-1 text-right" for="alt'+altNumber+'">'+altNumber+'</label><div class="col-sm-6"><input id="alt'+altNumber+'" type="text" name="input_alt" class="form-control"/></div>';

            //li.innerHTML = '<div class="com-sl-2">'+altNumber+'</div><div class="com-sl-8"><input type="text" name="input_alt" class="form-control"/></div>';
            $("#form").append(div);
        }
    };
    //Удаление элементов ввода
    document.getElementById("sub_button").onclick = function(){
        if(altNumber > MIN_ALT_NUMBER){
            $('#form div.form-group:last-child').remove();
            altNumber--;
        }
    };

//    document.getElementById("submit_button").onclick = function(){
//
//        var inputs = document.getElementById("alt_ordered_list").getElementsByTagName("input");
//
//        for(var i=0; i<altNumber; i++){
//            altsArray.add(inputs[i]);
//        }
//
//    };


});

