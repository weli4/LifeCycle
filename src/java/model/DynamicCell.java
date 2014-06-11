package model;


public class DynamicCell {
    private int x,y, cellType;
    private double a,b,c;

    public DynamicCell(){


    }

    public DynamicCell(int x, int y, int cellType, double a, double b, double c) {
        this.x = x;
        this.y = y;
        this.cellType = cellType;
        this.a = a;
        this.b = b;
        this.c = c;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getCellType() {
        return cellType;
    }

    public void setCellType(int cellType) {
        this.cellType = cellType;
    }

    public double getA() {
        return a;
    }

    public void setA(double a) {
        this.a = a;
    }

    public double getB() {
        return b;
    }

    public void setB(double b) {
        this.b = b;
    }

    public double getC() {
        return c;
    }

    public void setC(double c) {
        this.c = c;
    }
}
