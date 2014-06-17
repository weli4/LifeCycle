package solvers;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.math3.linear.EigenDecomposition;
import org.apache.commons.math3.linear.MatrixUtils;
import org.apache.commons.math3.linear.RealMatrix;
import org.apache.commons.math3.linear.RealVector;

import java.util.Arrays;


public class SimpleSaatiSolver {

    private static final double[] RANDOM_INDEXES_TABLE = {0,0,0.58,0.9,1.12,1.24,1.32,1.41,1.45};
    private Log log = LogFactory.getLog(SimpleSaatiSolver.class);
    private RealMatrix matrix;
    private double lambda,consIndex,attitCons ;


    public SimpleSaatiSolver(double[][] inputArray){
        this.matrix = MatrixUtils.createRealMatrix(inputArray);
        EigenDecomposition decompositionSolver = new EigenDecomposition(matrix);
        lambda = round(decompositionSolver.getRealEigenvalue(0));
        int matrixSize = matrix.getRowDimension();
        consIndex = round((lambda - matrixSize ) /(matrixSize - 1));
        attitCons = round(consIndex/RANDOM_INDEXES_TABLE[matrixSize-1]);

    }

    //"{\"vector\":[0.8,0.2],\"lambda\":2,\"cons_index\":0,\"attit_cons\":0}"
    public String getSolveAsJSON(){
        StringBuffer resultStr = new StringBuffer("");
        resultStr.append("{");
        resultStr.append(getJSONAttribute("vector",getVector()));
        resultStr.append(",");
        resultStr.append(getJSONAttribute("lambda",Double.toString(lambda)));
        resultStr.append(",");
        resultStr.append(getJSONAttribute("cons_index",Double.toString(consIndex)));
        resultStr.append(",");
        resultStr.append(getJSONAttribute("attit_cons",Double.toString(attitCons)));
        resultStr.append("}");



        return resultStr.toString();
    }
    public double getAttitudeIndex(){

        return  attitCons;
    }

    private String getJSONAttribute(String name, String value){
        return "\""+name+"\":"+value;

    }

    private String getVector(){
        EigenDecomposition decompositionSolver = new EigenDecomposition(matrix);
       StringBuffer resultStr = new StringBuffer();
        resultStr.append("[");

        RealVector r =  decompositionSolver.getEigenvector(0).unitVector();

        double sum = r.getL1Norm();
        double[] d = r.toArray();



        for(int i = 0; i < d.length; i++){
            d[i] /= sum;

            resultStr.append(round(d[i]));
            if(i != d.length-1){
                resultStr.append(",");
            }

        }
        resultStr.append("]");



        return resultStr.toString();
    }

    public double[] getDoubleVector(){
        EigenDecomposition decompositionSolver = new EigenDecomposition(matrix);

        RealVector r =  decompositionSolver.getEigenvector(0).unitVector();

        double sum = r.getL1Norm();
        double[] d = r.toArray();

        for(int i = 0; i < d.length; i++){
            d[i] /= sum;
            d[i]=round(d[i]);
        }

        return d;
    }

    private double round(double val){
        double result = val;
        result *= 1000;
        result = Math.abs(Math.round(result));
        result /= 1000;
//        if(val<0)
//            result*= -1;
        return result;

    }



}
