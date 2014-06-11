var last_focused_field_name;

var dynamic_fields = new Array();



var dynamicCellsArray = new Array();


$(document).ready(function(){

    var STEP = 1;
    var STEP_COUNT = parseInt($('#step_count').text());
    var multi_mode =  $('#multi_mode_flag').text() === '1';
    if(multi_mode)
        $('#steps_panel').show();

    $('input[name^=matrix]').on('focus',function(){
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

    });



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
        console.log('click');

        var matrix = getDoubleMatrix();

//            var cellArray = new Array();
//            cellArray.push({x:0, y:1, a:1, b:0, c:3, type:1});
//            cellArray.push({x:2, y:2, a:2, b:2, c:2, type:2});
        var postData = new PostData(matrix, dynamicCellsArray);
        if(multi_mode){





            $.ajax({
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                type: "POST",
                url: "/saati/dynamic/multiple/calc",
                dataType: "json",
                data: JSON.stringify(postData),
                contentType: 'application/json; charset=UTF-8',
                success: function(data) {
                    dynamicCellsArray = new Array();
                    console.log("COUNT "+$("#step_count").text());
                    console.log("STEp "+STEP);
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

//            var cellArray = new Array();
//            cellArray.push({x:0, y:1, a:1, b:0, c:3, type:1});
//            cellArray.push({x:2, y:2, a:2, b:2, c:2, type:2});
            postData = new PostData(matrix, dynamicCellsArray);

            $.ajax({
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                type: "POST",
                url: "/saati/dynamic/show-result",
                dataType: "json",
                data: JSON.stringify(postData),
                contentType: 'application/json; charset=UTF-8',
                success: function(data){
                    if(data.error !== undefined) return error(data.error);


                    //var d1 = $(data).find("vector0");

                    //console.log(d1);
//              var grafData = [];
//                grafData.push(grafData.datasets.vector0);
//                grafData.push(grafData.datasets.vector1);


                    var grafData=[];
                    var i =0;

                    $.each(data,function(key){
                        grafData.push(data[key]);

                    })
//           for(var i=0; i<3; i++){
//               grafData.push(data["vector"+i]);
//
//           }
//            console.log(data["vector"+i]);
//              console.log(data["vector1"]);


                    $.plot($("#placeholder"), grafData,{
                        legend:{
                            position:"sw"
                        }

                    });
                    console.log("AFTER GRAF");



                },
                error: function(data) {
                    alert("ERROR");
                }
            });




            //$.post('/saati/dynamic/show-result',postData, ,'json');

        }


    })

    //$.plot($("#placeholder"), [ d1, d2, d3 ]);


    $('#next').click(function() {
        $.post('/saati/dynamic/multiple/next', function(data){
            if(data.error !== undefined) return error(data.error);
            console.log("step"+STEP);
            if(STEP === 1 && STEP !== data.step ) {
                $.post('/saati/dynamic/multiple/get_alternatives',  function(alt_data){
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

    });
    $('#rate_b').on('change',function(){
        var regexp = /matrix\[([0-9]?)\]\[([0-9]?)\]/gi;

        var x = last_focused_field_name.replace(regexp, "$1");
        var y = last_focused_field_name.replace(regexp, "$2");

        dynamicCellsArray[getCellIndex(x,y)].b = $(this).val();
        dynamicCellsArray[getCellIndex(y,x)].b = $(this).val();


    });
    $('#rate_c').on('change',function(){
        var regexp = /matrix\[([0-9]?)\]\[([0-9]?)\]/gi;

        var x = last_focused_field_name.replace(regexp, "$1");
        var y = last_focused_field_name.replace(regexp, "$2");

        dynamicCellsArray[getCellIndex(x,y)].c = $(this).val();
        dynamicCellsArray[getCellIndex(y,x)].c = $(this).val();


    });

    $('#cell_dynamic_type').on('change',function(){
        var regexp = /matrix\[([0-9]?)\]\[([0-9]?)\]/gi;

        var x = last_focused_field_name.replace(regexp, "$1");
        var y = last_focused_field_name.replace(regexp, "$2");


        dynamicCellsArray[getCellIndex(x,y)].cellType = $(this).val();
        dynamicCellsArray[getCellIndex(y,x)].cellType = $(this).val();
        reFillDynamicLegend(getCellIndex(x,y));

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