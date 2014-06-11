package model;


import java.util.ArrayList;

public class SessionDynamicSaatiModel {
    private String[] alternativesArray, criteriesArray;
    private DynamicMatrixData criteriasData;
    private ArrayList<DynamicMatrixData> alternativesDataList = new ArrayList<DynamicMatrixData>();
    private double topLimit;
    private double lowLimit;
    private double step;

    public double getStep() {
        return step;
    }

    public void setStep(double step) {
        this.step = step;
    }

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

    public DynamicMatrixData getCriteriasData() {
        return criteriasData;
    }

    public void setCriteriasData(DynamicMatrixData criteriasData) {
        this.criteriasData = criteriasData;
    }

    public ArrayList<DynamicMatrixData> getAlternativesDataList() {
        return alternativesDataList;
    }

    public void setAlternativesDataList(ArrayList<DynamicMatrixData> alternativesDataList) {
        this.alternativesDataList = alternativesDataList;
    }

    public double getTopLimit() {
        return topLimit;
    }

    public void setTopLimit(double topLimit) {
        this.topLimit = topLimit;
    }

    public double getLowLimit() {
        return lowLimit;
    }

    public void setLowLimit(double lowLimit) {
        this.lowLimit = lowLimit;
    }
}
