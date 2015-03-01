var last_focused_field_name;

var dynamic_fields = new Array();



var dynamicCellsArray = new Array();


$(document).ready(function(){

    var STEP = 1;
    var STEP_COUNT = parseInt($('#step_count').text());
    var multi_mode =  $('#multi_mode_flag').text() === '1';
    if(multi_mode)
        $('#steps_panel').show();



    $('input[name^=matrix]').on('focus',onFocusChanges);



    $('input[name=toggle_dynamic]').on('click',function(){
        console.log("TOOGLE DYNAMIC CLICKED");


        //Вытаскиваем коордитаны ячейки
        var regexp = /matrix\[([0-9]?)\]\[([0-9]?)\]/gi;

        var x = last_focused_field_name.replace(regexp, "$1");
        var y = last_focused_field_name.replace(regexp, "$2");

        console.log("COORDS OF FIELD: "+x+","+y);
        // Ищем есть ли ячейка вмассиве динамических ячеек
        var cellIndex = getCellIndex(x,y);
        if(cellIndex === -1)
            cellIndex = getCellIndex(y,x);



        if(cellIndex === -1){


            dynamicCellsArray.push(new DynamicCell(x,y,1,1,0,0));
            length = dynamicCellsArray.push(new DynamicCell(y,x,1,1,0,0));

            console.log("AFTER ADDING CELLS");
            $('input[name="'+last_focused_field_name+'"]').css('background-color','green');
            $('input[name="'+getMirrowName(last_focused_field_name)+'"]').css('background-color','green');

            reFillDynamicLegend(length - 1);
            $('#dynamic_legend').show();

            $('#dynamic_control').show();
            console.log("END IF");
        }
        else{


            dynamicCellsArray.splice(getCellIndex(x,y),1);
            dynamicCellsArray.splice(getCellIndex(y,x),1);

            $('input[name="'+last_focused_field_name+'"]').css("background-color",'white');
            $('input[name="'+getMirrowName(last_focused_field_name)+'"]').css("background-color",'white');

            $('#dynamic_legend').hide();
            $('#dynamic_control').hide();

            dynamic_fields.splice(elementArrayIndex,1);
            console.log("ELSE END");

        }





    });




    $('input[name=calc_dynamic_matrix]').on('click',function(){

        var matrix = getDoubleMatrix();

        var postData = new PostData(matrix, dynamicCellsArray);
        if(multi_mode){
            $.ajax({
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                type: "POST",
                url: _contextPath+"/saati/dynamic/multiple/calc",
                dataType: "json",
                data: JSON.stringify(postData),
                contentType: 'application/json; charset=UTF-8',
                success: function(data) {
                    dynamicCellsArray = new Array();
                    if(data.message) {
                        console.log("message: "+data.message);
                        $('#matrix_helper_no').show();
                        $('#error_comment').text(data.message);
                        $('#error_comment').show();
                    }
                    else{
                        $('#matrix_helper_no').hide();
                        $('#error_comment').text(data.message);
                        $('#error_comment').hide();

                    }
                    $('#dynamic_control').hide();
                    if(STEP === STEP_COUNT)
                        $('#end').show();
                    else
                        $('#next').show();
                }     ,
                error: function(data) {
                    alert("ERROR");
                }
            });
        }
        else{
            var matrix = getDoubleMatrix();

            postData = new PostData(matrix, dynamicCellsArray);
            $('#result_field').show();
            $.ajax({
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                type: "POST",
                url: _contextPath+"/saati/dynamic/show-result",
                dataType: "json",
                data: JSON.stringify(postData),
                contentType: 'application/json; charset=UTF-8',
                success: function(data){
                    if(data.error !== undefined) return error(data.error);
                    var grafData=[];
                    var i =0;

                    $.each(data,function(key){
                        grafData.push(data[key]);

                    })

                    $.plot($("#placeholder"), grafData,{
                        legend:{
                            position:"sw"
                        },
                        series: {
                            lines: {
                                show: true
                            },
                            points: {
                                show: true
                            }
                        },
                        grid: {
                            hoverable: true,
                            clickable: true
                        }

                    });
                    console.log("AFTER GRAF");


                },
                error: function(data) {
                    alert("ERROR");
                }
            });

            // добавляем подписку к графику
            $("<div id='tooltip'></div>").css({
                position: "absolute",
                display: "none",
                border: "1px solid #fdd",
                padding: "2px",
                "background-color": "#fee",
                opacity: 0.80
            }).appendTo("body");


            // брабатываем события графика
            $("#placeholder").bind("plothover", function (event, pos, item) {
                if (item) {
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);

                    $("#tooltip").html(item.series.label + " при t - " + x + " = " + y)
                        .css({top: item.pageY+5, left: item.pageX+5})
                        .fadeIn(200);
                } else {
                    $("#tooltip").hide();
                }
            });

        }


    })




    $('#next').click(function() {
        $.post(_contextPath+'/saati/dynamic/multiple/next', function(data){
            if(data.error !== undefined) return error(data.error);
            console.log("step"+STEP);
            if(STEP === 1 && STEP !== data.step ) {
                $.post(_contextPath+'/saati/dynamic/multiple/get_alternatives',  function(alt_data){
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
            $('input[name^=matrix]').on('focus',onFocusChanges);
            //Устанавливаем шаг
            $('#step_number').text(data.step);
            $('#step_name').text(data.step_name);

            //Скрываем кнопку
            $('#next').hide();
            $('.matrix_result').hide();
            console.log("POST REQUEST /next OK");
        }, 'json');
    });


    $('#rate_a').on('change',function(){

        var regexp = /matrix\[([0-9]?)\]\[([0-9]?)\]/gi;

        var x = last_focused_field_name.replace(regexp, "$1");
        var y = last_focused_field_name.replace(regexp, "$2");

        dynamicCellsArray[getCellIndex(x,y)].a = $(this).val();
        dynamicCellsArray[getCellIndex(y,x)].a = $(this).val();
        console.log("NEW a :"+ dynamicCellsArray[getCellIndex(x,y)].a );

    })
        .keyfilter(/[0-9\.\-]/);
    $('#rate_b').on('change',function(){
        var regexp = /matrix\[([0-9]?)\]\[([0-9]?)\]/gi;

        var x = last_focused_field_name.replace(regexp, "$1");
        var y = last_focused_field_name.replace(regexp, "$2");

        dynamicCellsArray[getCellIndex(x,y)].b = $(this).val();
        dynamicCellsArray[getCellIndex(y,x)].b = $(this).val();


    })
        .keyfilter(/[0-9\.\-]/);
    $('#rate_c').on('change',function(){
        var regexp = /matrix\[([0-9]?)\]\[([0-9]?)\]/gi;

        var x = last_focused_field_name.replace(regexp, "$1");
        var y = last_focused_field_name.replace(regexp, "$2");

        dynamicCellsArray[getCellIndex(x,y)].c = $(this).val();
        dynamicCellsArray[getCellIndex(y,x)].c = $(this).val();


    })
        .keyfilter(/[0-9\.\-]/);

    $('#cell_dynamic_type').on('change',function(){
        var regexp = /matrix\[([0-9]?)\]\[([0-9]?)\]/gi;

        var x = last_focused_field_name.replace(regexp, "$1");
        var y = last_focused_field_name.replace(regexp, "$2");


        dynamicCellsArray[getCellIndex(x,y)].cellType = $(this).val();
        dynamicCellsArray[getCellIndex(y,x)].cellType = $(this).val();
        reFillDynamicLegend(getCellIndex(x,y));

    });

    $('#end').on('click',function(){
        $.ajax({
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            type: "POST",
            url: _contextPath+"/saati/dynamic/multiple/result",
            dataType: "json",
            contentType: 'application/json; charset=UTF-8',
            success: function(data){
                if(data.error !== undefined) return error(data.error);

                $('#main_div').hide();
                $('#result_field').show();
                var grafData=[];
                var i =0;

                $.each(data,function(key){
                    grafData.push(data[key]);

                })


                // рисуем график
                $.plot($("#placeholder"), grafData,{
                    legend:{
                        position:"sw"
                    },
                    series: {
                        lines: {
                            show: true
                        },
                        points: {
                            show: true
                        }
                    },
                    grid: {
                        hoverable: true,
                        clickable: true
                    }

                });
                console.log("AFTER GRAF");

               // добавляем подписку к графику
                $("<div id='tooltip'></div>").css({
                    position: "absolute",
                    display: "none",
                    border: "1px solid #fdd",
                    padding: "2px",
                    "background-color": "#fee",
                    opacity: 0.80
                }).appendTo("body");


                // брабатываем события графика
                $("#placeholder").bind("plothover", function (event, pos, item) {
                    if (item) {
                        var x = item.datapoint[0].toFixed(2),
                            y = item.datapoint[1].toFixed(2);

                        $("#tooltip").html(item.series.label + " of " + x + " = " + y)
                            .css({top: item.pageY+5, left: item.pageX+5})
                            .fadeIn(200);
                    } else {
                        $("#tooltip").hide();
                    }
                });




            },
            error: function(data) {
                alert("ERROR");
            }
        });
    });
})

function reFillDynamicLegend(cellIndex){
    //1 - linear; 2-log; 3 -exp ; 4 - quadratic
    console.log("IN REFIL DYN LEGEND index:" + cellIndex);

    console.log(dynamicCellsArray[cellIndex].cellType);

    $("#dyn_coord_x").text(dynamicCellsArray[cellIndex].x);
    $("#dyn_coord_y").text(dynamicCellsArray[cellIndex].y);

    $("#rate_a").val(dynamicCellsArray[cellIndex].a);
    $("#rate_b").val(dynamicCellsArray[cellIndex].b);
    $("#rate_c").val(dynamicCellsArray[cellIndex].c);

    if(dynamicCellsArray[cellIndex].cellType == 3 || dynamicCellsArray[cellIndex].cellType==4)
        $("#rate_c_container").show();
    else
        $("#rate_c_container").hide();

    $("#cell_dynamic_type [value="+dynamicCellsArray[cellIndex].cellType+"]").attr("selected", "selected");
    console.log("AFTER REFIL DYN");
}
function getCellIndex(x,y){
    for(var i=0; i<dynamicCellsArray.length; i++){
        if(dynamicCellsArray[i].x === x && dynamicCellsArray[i].y===y ){
            return i;
        }
    }
    return -1;
}
function getDoubleMatrix() {
    var matrix = new Array();
    var matrix_size = $('input[name^=matrix\\[0\\]]').length;

    //var regexp =  "input[name^=matrix\\[\\$1\\]]";
    for(var i=0; i<matrix_size; i++){
        var tempVector = new Array();
        for(var j=0; j<matrix_size; j++){
            tempVector.push(getAnyValue([i,j]));
        }
        matrix.push(tempVector);
    }
    return matrix;
}

function getAnyValue(array) {
    var str = $('input[name="matrix['+ array[0] + ']['+ array[1] +']"]').val();
    if(str.indexOf("/") !== -1){
        numbers = str.split("/");
        console.log(numbers);
        return parseFloat(numbers[0])/parseFloat(numbers[1]).toFixed(3);
    }
    return str;

}
function getMirrowName(value) {

    var regexp = /matrix\[([0-9]?)\]\[([0-9]?)\]/gi;

    var legend_x = parseInt(value.replace(regexp, "$1"));
    var legend_y = parseInt(value.replace(regexp, "$2"));

    return "matrix["+legend_y+"]["+legend_x+"]";

}

function PostData(matrix, cellsArray) {
    this.matrix = matrix;
    this.cellsArray = cellsArray;
}

function DynamicCell(x,y,type,a,b,c) {
    this.x = x;
    this.y = y;
    this.cellType = type;
    this.a = a;
    this.b = b;
    this.c = c;
}

var onFocusChanges = function(){
    var str = $(this).attr('name');
    var regexp = /matrix\[([0-9]?)\]\[([0-9]?)\]/gi;

    var x = str.replace(regexp, "$1");
    var y = str.replace(regexp, "$2");

    last_focused_field_name=$(this).attr('name');;

    var cellIndex = getCellIndex(x,y);
    if(cellIndex === -1)
        cellIndex = getCellIndex(y,x);
    //Покащываем настройки динамического поля,если поле динамическое и наоборот
    if(cellIndex !== -1){
        console.log("ЯЧЕЙКА ДИНАМИЧЕСКАЯ");

        reFillDynamicLegend(cellIndex);
        $('#dynamic_legend').show();

        $('#dynamic_control').show();

    }
    else{
        $('#dynamic_legend').hide();
        $('#dynamic_control').hide();

    }

    console.log(last_focused_field_name);

};