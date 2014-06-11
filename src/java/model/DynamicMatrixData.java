package model;

public class DynamicMatrixData {
    double[][] matrix;
    DynamicCell[] cellsArray;

    public double[][] getMatrix() {
        return matrix;
    }

    public void setMatrix(double[][] matrix) {
        this.matrix = matrix;
    }

    public DynamicCell[] getCellsArray() {
        return cellsArray;
    }

    public void setCellsArray(DynamicCell[] cellsArray) {
        this.cellsArray = cellsArray;
    }
}
