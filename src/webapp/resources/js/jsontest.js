$(document).ready(function(){
    var cellArray = new Array();
    cellArray.push({x:1, y:3, a:1, b:3, c:3, type:1});
    cellArray.push({x:2, y:2, a:2, b:2, c:2, type:2});

    var matrix = new Array();
    matrix.push([1,2,3]);
    matrix.push([1,2,3]);
    matrix.push([1,2,3]);

    var postData = new PostData(matrix,cellArray);
    $('#submit_button').on('click',function(){
        $.ajax({
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            type: "POST",
            url: "/saati/test",
            dataType: "json",
            data: JSON.stringify(postData),
            contentType: 'application/json',
            success: function(data) {
                if(data.status == 'OK') alert('Person has been added');
                else alert('Failed adding person: ' + data.status + ', ' + data.errorMessage);
            }     ,
            error: function(data) {
                alert("ERROR");
            }
        });

    });

})

function PostData(matrix, cellsArray) {
    this.matrix = matrix;
    this.cellsArray = cellsArray;
}