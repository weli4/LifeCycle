var last_focused_field_name;

var dynamic_fields = new Array();
$(document).ready(function(){
    console.log("START");

    console.log("heloo@");


    $('input[name^=matrix]').on('focus',function(){
        var str = $(this).attr('name');
        var regexp = /matrix\[([0-9]?)\]\[([0-9]?)\]/gi;

        var x = str.replace(regexp, "$1");
        var y = str.replace(regexp, "$2");

        last_focused_field_name=$(this).attr('name');;

        console.log(last_focused_field_name);

    });



    $('input[name=toggle_dynamic]').on('click',function(){
        console.log("onclick");
        console.log("dyn "+dynamic_fields);
        console.log(last_focused_field_name);
        var elementArrayIndex =dynamic_fields.indexOf(last_focused_field_name);
        console.log("inDEX OF LEMENT = "+elementArrayIndex);

        if(elementArrayIndex === -1){
            console.log("START IF");
            console.log(last_focused_field_name);

            dynamic_fields.push(last_focused_field_name);

            $('input[name="'+last_focused_field_name+'"]').css('background-color','green');

            $('#dynamic_legend').show();

            $('#dynamic_control').show();
            console.log("END IF");
        }
        else{

            $('input[name="'+last_focused_field_name+'"]').css("background-color",'white');

            $('#dynamic_legend').hide();
            $('#dynamic_control').hide();

            dynamic_fields.splice(elementArrayIndex,1);
            console.log("ELSE END");

        }

        reFillDynamicLegend();



    });

    function reFillDynamicLegend(){


    }
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
    function getValue(array) {

        return $('input[name="matrix['+ array[0] + ']['+ array[1] +']"]').val();

    }
    $('input[name=calc_dynamic_matrix]').on('click',function(){
        console.log('click');
        $.post('/saati/dynamic/show-result',"&dynamic="+dynamic_fields[0]+"&low="+$('#low_limit_input').val()+"&high="+$('#high_limit_input').val()+
        "&step="+$('#step_input').val()+getMatrixForPost()+"&a="+$('#a').val()+"&b="+$('#b').val(), function(data){
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


                $.plot($("#placeholder"), grafData );
               console.log("AFTER GRAF");



        },'json');


    })

    //$.plot($("#placeholder"), [ d1, d2, d3 ]);

})

