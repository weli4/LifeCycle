/**
 * Класс для проверки на согласованность матриц 3х3 по Методике Саати
 */

Saati = function(matrix) {

    //Случайная согласованность(Т.Саати) для матрицы размером 3х3
    this.dss_random_consistency = 0.58;

    this.matrix = matrix;

    this.calcVectors = function() {

        var vectors = new Array(3);

        var m = this.matrix;

        //Из произведения строки берем корень  степени размера матрицы.
        for(i=0;i<3;i++)
            vectors[i] = Math.pow( m[i][0]*m[i][1]*m[i][2], 1/3 );

        //Получаем сумму векторов
        var sum  = vectors[0] + vectors[1] + vectors[2];

        //нормализуем результат
        for(i=0;i<3;i++)
            vectors[i] = vectors[i] / sum;

        return vectors;

    }

    this.calcLambda = function() {

        var vectors = this.calcVectors();

        var  sum = new Array(0,0,0);

        //Суммируем каждый столбец суждений
        for(i = 0; i < 3; i ++)
            for(j = 0; j < 3; j ++)
                sum [i] += this.matrix[j][i];


        //Умножаем сумму столбца на величину соответствующей компоненты нормализованного вектора приоритетов
        for(var i = 0; i < 3; i ++)
            sum[i] = vectors[i] * sum[i];


        //И суммируем получившиеся числа
        return sum[0]+sum[1]+sum[2];

    }

    this.calcConsistencyIndex = function() {
        //Вычисляем индекс согласованности
        return Math.abs( (this.calcLambda() - 3 ) / 2 );
    }

    this.calcAttitudeConsistency = function(){

        return Math.abs ( this.calcConsistencyIndex() / this.dss_random_consistency );

    }

};