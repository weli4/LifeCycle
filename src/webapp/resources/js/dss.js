$(document).ready(function() {
    var multi_mode =  $('#multi_mode_flag').text() === '1';
    if(multi_mode)
        $('#steps_panel').show();
    var STEP = 1;
    var STEP_COUNT = parseInt($('#step_count').text());

    $('input[name^=matrix]')
        .on('keypress',validate)
        //WORKS!
        .on('change', onChange )
        //WORKS!!!!!!!
        .on('focus', onFocus);
    //WORKS!!!!!
    //Убрали фокус с матрицы - скрываем хелпер
    $('input[name^=matrix]').on('focusout', function(){
        $('#legend_helper').text("");
    });


    /**
     * Кнопка "расчет".
     */
    // Вроде работает. нужно сделать генерацию строки для отправки
    $('input[name=calc_matrix]').click(function(){

        $('.matrix_result').hide();
        var matrix="&matrix=1,2&matrix=2,1";
       // matrix.appendText("&matrix=[1,2]&matrix=[2,1]");
        var url,multi_mode;
        console.log($('#multi_mode_flag').text());
        multi_mode =  $('#multi_mode_flag').text() === '1';
        if(multi_mode)  {
            url="/saati/multiple/calc";
        }
        else{
            url = '/saati/calc';
        }



        $.post(url,getMatrixForPost(), function(data){
            if(data.error !== undefined) return error(data.error);

            //Устаналиваем Вектора
            fillVectors(data.vector);

            //Лямда
            $('#lambda').text(data.lambda);
            //ИС
            $('#cons_index').text(data.cons_index);
            //ОС
            $('#attit_cons').text(data.attit_cons);
            //Проверка на согласованность матрицы
            if(data.attit_cons > 0.1) { //Матрица не согласованна


                //Подкрашиваем ОС
                $('#attit_cons').css('color','red');

                $('.parametrs').show();
                $('#vectors').show();
                $("#matrix_helper_no").show();

            }
            else {
                $("#matrix_helper_yes").show();
                $('#attit_cons').css('color','green');

            }
            if(multi_mode){
                console.log("COUNT "+$("#step_count").text());
                console.log("STEp "+STEP);
                if(STEP === STEP_COUNT)
                    $('input[name=end]').show();
                else
                    $('input[name=next]').show();
            }
            $("#result_helper").show();
            //Если шаг - последний, то показываем кнопку "ОП", если нет - кнопку "далее"

            //Для простого сравнения альтернатив

                $('.parametrs').show();
                $('#vectors').show();
                recommend_alternative();


        },'json');

    });

    function getMatrixForPost(){
        var matrix_size = $('input[name^=matrix\\[0\\]]').length;
        var resultString = "";

        //var regexp =  "input[name^=matrix\\[\\$1\\]]";
        for(var i=0; i<matrix_size; i++){
            resultString = resultString.concat("&matrix=");
            for(var j=0; j<matrix_size; j++){
                resultString = resultString.concat(getValue([i,j]));
                if(j!==matrix_size-1){
                    resultString = resultString.concat(',');
                }
            }
//
        }
        return resultString;

    }

    $("#matrix_helper_yes a").click(function(){

        $('.parametrs').toggle();
        $('#vectors').toggle();
        return false;
    });

    $('input[name=next]').click(function() {
        _this = this;
        $.post('/saati/multiple/next/', function(data){
            if(data.error !== undefined) return error(data.error);
            console.log("step"+STEP);
            if(STEP === 1 && STEP !== data.step ) {
                $.post('/saati/multiple/get_alternatives',  function(alt_data){
                    if(alt_data.error !== undefined) return error(alt_data.error);
                    console.log("data recived");
                    drawLegend(alt_data);
                },'json');
            }
            //Перезаливаем легенду
            STEP = data.step;
            console.log("after if")
            //Перерисовываем таблицу с матрицей
            drawMatrixTable(data.matrix_size);

            //Устанавливаем шаг
            $('#step_number').text(data.step);
            $('#step_name').text(data.step_name);

            //Скрываем кнопку
            $(_this).hide();
            $('.matrix_result').hide();
            console.log("POST REQUEST /next OK");
        }, 'json');
    });

    //Кнопка "Обобщенные приоритеты"
    $('input[name=general]').click(function(){
        _this = this;

        $.post('/ajax/dss/calc_general/',{catId: CATEGORY}, function(data){
            if(data.error !== undefined) return error(data.error);
            fillVectors(data);
            fillGeneral(data);

            //Находим и выделяем рекомендуемую альтернативу
            recommend_alternative();

            $('.matrix_result').hide();


        }, 'json');
    });

    /**
     * Находим и выделяем рекомендуемую альтернативу
     *
     */




});

function recommend_alternative(){

    //Находим максимум и выделяем
    var max = parseFloat($('.vector_ul li:eq(0) .vector_field').text());
    var max_index = 0;

    $.each($('.vector_ul li .vector_field'), function(index, value) {
        var tmp = parseFloat($(value).text());
        if(tmp > max) {
            max = tmp;
            max_index = index;
        }
    });


    //Выделяем те, что равны максимум

    $('#legend_ol li').css('color', 'black');

    $.each($('.vector_ul li .vector_field'), function(index, value) {
        tmp = parseFloat($(value).text());
        if(tmp == max) {
            $('#legend_ol li:eq('+index+')').css('color', 'green');
            $('.vector_ul li:eq('+index+')').css('color', 'green');

        }

    });

}

/**
 * Заполняем блок с векторами
 */
function fillVectors(vector) {

    str = '<ul class="vector_ul">';
    for(i=0;i<vector.length;i++) {
        str += '<li>x' +(i+1)+ ' = <span class="vector_field">' + vector[i] + '</span><br />';
    }

    str += '</ul>';

    $('#vector').html(str);
}

function drawLegend(alternatives) {
    str = '';
    console.log("in drawLegend")
    for(i=0;i<alternatives.length;i++) {
        str += '<li>'+alternatives[i]+'<span></span></li>';
    }
    console.log("in drawLegend after for")
    $('#legend_ol').html(str);
    console.log("DRAW LEGEND OK");
}

function drawMatrixTable(size) {
    console.log("IN DRAW MATRIX! SIZE : "+size);
    chars = ['A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    str = '<table cellpadding="0" cellspacing="0">';
    for(i=0;i<size;i++) {
        str += '<tr>';
        for(j=0;j<size;j++) {
            str += '<td><input type="text" name="matrix['+i+']['+j+']"';
            if(i == j)
                str += ' value="1" ';
            str+= '/></td>';
        }
        str += '<td class="legend_y">' + chars[i] + '</td></tr>';
    }

    str += '<tr>';
    for(i=0;i<size;i++)
        str += '<td class="legend_x">' + chars[i] + '</td>';

    str += '<td class="legend_x"></td>';
    str += '</tr></table>';

    $('form[name=matrix]').html(str);
    $('input[name^=matrix]')
        .on('keypress',validate)
        //WORKS!
        .on('change', onChange )
        //WORKS!!!!!!!
        .on('focus', onFocus);
    console.log("DRAW MATRIX OK");
}

var onChange = function(){ //Изменения элемента
    console.log("in change");
    var value = $(this).val();
    var new_value = "";

    //Проверка - имеет ли значение вид: 1 или 1/2 или 1.5

    var pattern = /^[0-9]+(((\/)[1-9][0-9]*)|(\.[0-9]+))?$/;
    if( !pattern.test( value ) )
        return false;

    //Определяем ячейку
    var str = $(this).attr('name');
    var regexp = /matrix\[([0-9]?)\]\[([0-9]?)\]/gi;

    var x = str.replace(regexp, "$1");
    var y = str.replace(regexp, "$2");



    //Задаем значение для зеркальной ячейки

    new_value = getMirrow(value);


    if(x == y) new_value = 1;

    $('input[name="matrix['+ y + ']['+ x +']"]').val(new_value);

    //Показываем зависимые элементы
    showDependentValues(x, y);

    return true;


}
var onFocus =  function(){  //При заполнении матрицы - событие по нажатию на форму


    var str = $(this).attr('name');
    var regexp = /matrix\[([0-9]?)\]\[([0-9]?)\]/gi;

    var legend_x = parseInt(str.replace(regexp, "$1"));
    var legend_y = parseInt(str.replace(regexp, "$2"));

    var legend = $("#legend_ol li");

    var text = 'Уровень приоритета для "' + legend.eq(legend_x).text() + '" относительно "' + legend.eq(legend_y).text() + '"?';


    $('#legend_helper').text(text);

}

function validate(e)  {

    e = e || event;

    if (e.ctrlKey || e.altKey || e.metaKey) return;

    var chr = getChar(e);

    // с null надо осторожно в неравенствах, т.к. например null >= '0' => true!
    // на всякий случай лучше вынести проверку chr == null отдельно
    if (chr === null) return;

    if (chr < '.' || chr > '9'  ) {
        return false;
    }


};

/*
 * Заполняем обобщенные приоритеты
 */

function fillGeneral(vector) {


    $.each($('#legend_ol li'), function(index, value) {
        $('#legend_ol li:eq('+index+') span').text(" = " + vector[index] );


    });

}






//Получаем значение для зеркальной ячейки
function getMirrow(value) {

    //Целые числа
    pattern_num = /^[1-9]+[0-9]*$/

    //Десятичная дробь
    pattern_flt = /^[0-9]+\.[0-9]+$/

    //Обыкновенная дробь
    pattern_frc = /^[1-9]+[0-9]*\/[1-9]+[0-9]*$/


    if(pattern_num.test(value) )
        if(parseInt(value) != 1)
            new_value = '1/' + value;
        else
            new_value = 1;

    else if(pattern_flt.test(value) && parseFloat(value))
        new_value = 1 / parseFloat(value);

    else if(pattern_frc.test(value)) {

        arr = value.split("/");
        new_value = arr[1] / arr[0];

    }

    return new_value;
}

//Получаем и вычисляем значение для зеркальной ячейки
function calcFractions(value) {
    new_value = value;

    //Обыкновенная дробь
    pattern_frc = /^[1-9]+[0-9]*\/[1-9]+[0-9]*$/

    if(pattern_frc.test(value)) {
        arr = value.split("/");
        new_value = arr[0] / arr[1];
    }

    return new_value;
}

/**
 * Показываем заивисимые значения для проверки на согласованность
 */
function showDependentValues(x,y) {

    //Возобновляем цвет фона
    $('input[name^="matrix["]').css('background-color','white');
    $('#input_helper').hide();

    if(x == y) return;

    //Находим размер матрицы
    var input_name = $('input[name^="matrix["]:last').attr('name');
    var regexp = /matrix\[([0-9]?)\]\[([0-9]?)\]/gi;
    var matrix_size = input_name.replace(regexp, "$1");

    //Проходимся по всем элементам матрицы, с которыми может быть согласованность
    //Выделяем "треугольники".
    for(i_m=0;i_m<=matrix_size;i_m++)
    {
        if(i_m == x || i_m == y) continue;

        if(getBigSmallNumberOfMatrixIndex(i_m,x,x,y).val() != ""  &&
            getBigSmallNumberOfMatrixIndex(i_m,y,x,y).val() != ""	)
        {
            if(saatiMismatched(getSmallMatrix(i_m,x,y))) {
                inputHelper(matrix_size,x,y);
                getBigSmallNumberOfMatrixIndex(i_m,x,x,y).css('background-color','#FF80C0');
                getBigSmallNumberOfMatrixIndex(i_m,y,x,y).css('background-color','#FF80C0');
                return $('input[name="matrix['+ x + ']['+ y +']"]').css('background-color','red');

            }

        }
    }

}

//Информация о подходящий значениях матрицы
function inputHelper(matrix_size,x,y) {
    $('#input_helper').show();
    values = findTrueValue(matrix_size, x, y);
    if(!values.length)
        $('#input_helper').text('Значения кардинально рассогласованы. Модифицируйте другую ячейку, затем возвращайтесь к текущей.');
    else
        $('#input_helper').text('Ячейки рассогласованы. Вы можете использовать следующие значения: ' + values.join(" , "));
}
/**
 * Поиск подходящего значения матрицы
 * @param matrix_size
 * @param x
 * @param y
 *
 */
function findTrueValue(matrix_size, x, y) {
    tmp1 = $('input[name="matrix['+ x + ']['+ y +']"]').val();

    values = {};

    for(d=0;d<=1;d++) {

        for(i_val=1;i_val<=9;i_val++) {

            if(d)
                val = i_val;
            else
                val = '1/' + i_val;

            $('input[name="matrix['+ x + ']['+ y +']"]').val(val);

            for(i_m2=0;i_m2<=matrix_size;i_m2++)
            {
                if(i_m2 == x || i_m2 == y) continue;

                if(getBigSmallNumberOfMatrixIndex(i_m2,x,x,y).val() != ""  &&
                    getBigSmallNumberOfMatrixIndex(i_m2,y,x,y).val() != ""	)
                {
                    if(values[i_m2] ===  undefined)
                        values[i_m2] = new Array();

                    if(!saatiMismatched(getSmallMatrix(i_m2,x,y))) {
                        if(val == '1/1') continue;
                        values[i_m2].push(val);

                    }

                }
            }
        }

    }
    $('input[name="matrix['+ x + ']['+ y +']"]').val(tmp1);
    //Вычисляем схождения массивов

    for (var p in values)
        if(!values[p].length)
            return new Array();

    i = 0;
    var str = '';
    for (var p in values) {
        str += "values['"+p+"'],";
        i++;
    }
    str = str.substring(0,--str.length);
    console.log("3");
    if(i > 1) {
        eval("values = array_intersect("+str+");");
        if(values === undefined)
            return new Array();

        var arr = new Array();
        for (var p in values)
            arr.push(values[p]);

        return arr;

    }
    else
        return values[p];

}

//Рассогласованна ли матрица? Проверка по методологии Саати.
function saatiMismatched(matrix) {
    //Приводим тип
    for(var i=0;i<3;i++)
        for(var j=0;j<3;j++)
            matrix[i][j] = parseFloat(calcFractions(matrix[i][j]));

    var saati = new Saati(matrix);

    if(saati.calcAttitudeConsistency() > 0.1)
        return true;

    return false;

}


function getBigSmallNumberOfMatrixIndex(i,z,x,y) {

    var element = getDiagonal(i,z,x,y);
    return $('input[name="matrix['+ element[0] + ']['+ element[1] +']"]');

}

function getSmallMatrix(_i,x,y) {

    //Получаем требуемые элементы
    var el1 = getDiagonal(_i,x,x,y);
    var el2 = getDiagonal(_i,y,x,y);
    var el3 = [x,y];


    //Сортируем пузырьком по X
    var x_sort = new Array(el1,el2,el3);
    for(i=0;i<3;i++)
        for(j=0;j<3;j++)
            if(x_sort[i][0] < x_sort[j][0])
            {
                tmp = x_sort[i];
                x_sort[i] = x_sort[j];
                x_sort[j] = tmp;
            }


    if(x_sort[0][0] == x_sort[1][0]) {//Правая диагональ

        //Сортируем по Y
        if(x_sort[0][1] > x_sort[1][1]) {
            tmp = x_sort[1];
            x_sort[1] = x_sort[0];
            x_sort[0] = tmp;
        }

        return    [[1, getValue(x_sort[0]), getValue(x_sort[1])],
            [getMirrow(getValue(x_sort[0])), 1, getValue(x_sort[2])],
            [getMirrow(getValue(x_sort[1])), getMirrow(getValue(x_sort[2])), 1]];

    }
    else { //Левая диагональ
        //Сортируем по Y
        if(x_sort[1][1] > x_sort[2][1]) {
            var tmp = x_sort[2];
            x_sort[2] = x_sort[1];
            x_sort[1] = tmp;
        }

        return 	  [[1, getMirrow(getValue(x_sort[0])), getMirrow(getValue(x_sort[1]))],
            [getValue(x_sort[0]), 1, getMirrow(getValue(x_sort[2]))],
            [getValue(x_sort[1]), getValue(x_sort[2]), 1]];
    }

}

/*
 * Получаем значение матрицы по координатам
 */
function getValue(array) {

    return $('input[name="matrix['+ array[0] + ']['+ array[1] +']"]').val();

}

// Для выбора диагонали:
// Если x > y, то должно возвращаться matrix[большее_число][меньшее_число]
// Иначе matrix[меньшее_число][большее_число]
// TODO: Достаточно запутанный механизм, необходимо переделать
function getDiagonal(i,z,x,y) {
    if((x > y && z > i) || (x < y && z < i))
        return [z, i];
    else
        return [i, z];
}

function array_intersect (arr1) {
    var retArr = {},
        argl = arguments.length,
        arglm1 = argl - 1,
        k1 = '',
        arr = {},
        i = 0,
        k = '';

    arr1keys: for (k1 in arr1) {
        arrs: for (i = 1; i < argl; i++) {
            arr = arguments[i];
            for (k in arr) {
                if (arr[k] === arr1[k1]) {
                    if (i === arglm1) {
                        retArr[k1] = arr1[k1];
                    }
                    // If the innermost loop always leads at least once to an equal value, continue the loop until done
                    continue arrs;
                }
            }
            // If it reaches here, it wasn't found in at least one array, so try next value
            continue arr1keys;
        }
    }

    return retArr;
}


function getChar(event) {
    if (event.which === null) {
        if (event.keyCode < 32) return null;
        return String.fromCharCode(event.keyCode); // IE
    };

    if (event.which!==0 && event.charCode!==0) {
        if (event.which < 32) return null;
        return String.fromCharCode(event.which);   // остальные
    };

    return null; // специальная клавиша
}