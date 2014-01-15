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
            li.innerHTML = '<input type="text" name="input_alt'+'" /> ';
            document.getElementById("alt_ordered_list").appendChild(li);
        }
    };
    //Удаление элементов ввода
    document.getElementById("sub_button").onclick = function(){
        if(altNumber > MIN_ALT_NUMBER){
            document.getElementById("alt_ordered_list").getElementsByTagName("li")[altNumber-1].remove();
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

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}