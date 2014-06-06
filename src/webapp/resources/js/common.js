$(document).ready(function(){





});

/**
 * Извещения
 */
function error(text) {
    console.log("IN ERROR");
    return  $.Growl.show({
        'title'  : "Ошибка",
        'message': text,
        'cls'	 : 'glowl_error',
        'icon'   : "error",
        'timeout': 5000
    });

}

function notice(text) {
    return  $.Growl.show({
        'title'  : "Внимание",
        'message': text,
        'cls'	 : 'glowl_notice',
        'icon'   : "notice",
        'timeout': 5000
    });
}