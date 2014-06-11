package model;

/**
 * Created with IntelliJ IDEA.
 * User: Austry
 * Date: 11.06.14
 * Time: 15:40
 * To change this template use File | Settings | File Templates.
 */
public class GrafModel {

    String label;
    double[][] data;

    public GrafModel(String label, double[][] data) {
        this.label = label;
        this.data = data;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public double[][] getData() {
        return data;
    }

    public void setData(double[][] data) {
        this.data = data;
    }
}
