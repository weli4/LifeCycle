package model;

import java.util.ArrayList;

public class MultipleSaatiiSessionModel {
    private String[] alternativesArray, criteriesArray;


    private double[][] criteriasMatrix;
    private ArrayList<double[][]> alternativesMatrixList = new ArrayList<double[][]>();

    public String[] getAlternativesArray() {
        return alternativesArray;
    }

    public void setAlternativesArray(String[] alternativesArray) {
        this.alternativesArray = alternativesArray;
    }

    public String[] getCriteriesArray() {
        return criteriesArray;
    }

    public void setCriteriesArray(String[] criteriesArray) {
        this.criteriesArray = criteriesArray;
    }

    public double[][] getCriteriasMatrix() {
        return criteriasMatrix;
    }

    public void setCriteriasMatrix(double[][] criteriasMatrix) {
        this.criteriasMatrix = criteriasMatrix;
    }

    public ArrayList<double[][]> getAlternativesMatrixList() {
        return alternativesMatrixList;
    }

    public void addAltMatrix(double[][] matrix){

         alternativesMatrixList.add(matrix);
    }

}
