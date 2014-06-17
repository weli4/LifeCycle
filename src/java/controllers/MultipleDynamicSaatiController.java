package controllers;


import model.DynamicCell;
import model.DynamicMatrixData;
import model.GrafModel;
import model.SessionDynamicSaatiModel;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.io.JsonStringEncoder;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import solvers.SimpleSaatiSolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;

@Controller
@RequestMapping("/saati/dynamic/multiple")
public class MultipleDynamicSaatiController {

    private static final String STEP_ATTRIBUTE_NAME = "step" ;
    private static final String MAX_STEP_ATTRIBUTE_NAME = "step_count";
    private static final double MAX_ATTITUDE_INDEX = 0.1;
    private SessionDynamicSaatiModel sessionDynamicModel = new SessionDynamicSaatiModel();
    private Log log = LogFactory.getLog(MultipleDynamicSaatiController.class);


    @RequestMapping("")
    public String start(){

        return "redirect:/saati/dynamic/multiple/set_alternatives";
    }

    @RequestMapping("/set_alternatives")
    public ModelAndView alt(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("headerText","Выберете альтернативы");
        modelAndView.setViewName("/saati/alt_choose");
        return modelAndView;
    }


    @RequestMapping(value = "/set_alternatives" , method = RequestMethod.POST)
    public ModelAndView setAlternatives(@RequestParam(value = "input_alt") String[] alternativesArray, HttpSession httpSession){
        ModelAndView modelAndView = new ModelAndView();
        sessionDynamicModel = new SessionDynamicSaatiModel();

        httpSession.setAttribute("sessionObject", sessionDynamicModel);


        log.info(Arrays.toString(alternativesArray));
        sessionDynamicModel.setAlternativesArray(alternativesArray);


        modelAndView.setViewName("redirect:/saati/dynamic/multiple/set_criteries");

        return modelAndView;

    }


    @RequestMapping("/set_criteries")
    public ModelAndView criteries(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("headerText","Выберете критерии");

        modelAndView.setViewName("/saati/alt_choose");
        return modelAndView;
    }

    @RequestMapping(value = "/set_criteries" , method = RequestMethod.POST)
    public ModelAndView setCriterias(@RequestParam(value = "input_alt") String[] alternativesArray){
        ModelAndView modelAndView = new ModelAndView();
        sessionDynamicModel.setCriteriesArray(alternativesArray);
        log.info(Arrays.toString(sessionDynamicModel.getCriteriesArray()));
        //Даем первому вью сравнить критерии между собой

        modelAndView.setViewName("redirect:/saati/dynamic/multiple/set_limits");
        return modelAndView;

    }

    @RequestMapping("/set_limits")
    public String limits(){

        return "/saati/set-limits";
    }


    @RequestMapping(value = "/set_limits" , method = RequestMethod.POST)
    public ModelAndView setCriterias(@RequestParam(value = "low_limit") double lowLimit, @RequestParam(value = "top_limit") double topLimit,
                                     @RequestParam(value = "step") double step){
        ModelAndView modelAndView = new ModelAndView();

        sessionDynamicModel.setLowLimit(lowLimit);
        sessionDynamicModel.setTopLimit(topLimit);
        sessionDynamicModel.setStep(step);
        log.info("Нижний "+ lowLimit);
        log.info("Верхний "+ topLimit);
        log.info("Шаг "+ step);


        modelAndView.setViewName("redirect:/saati/dynamic/multiple/matrix_start");
        return modelAndView;

    }


    @RequestMapping("/matrix_start")
    public ModelAndView matrixStart(HttpSession session){
        ModelAndView modelAndView = new ModelAndView("/saati/dynamic_matrix");
        session.setAttribute(STEP_ATTRIBUTE_NAME, 1);
        session.setAttribute(MAX_STEP_ATTRIBUTE_NAME, sessionDynamicModel.getCriteriesArray().length+1);
        modelAndView.addObject("alternativesNumber", sessionDynamicModel.getCriteriesArray().length);
        modelAndView.addObject("alternativesArray", sessionDynamicModel.getCriteriesArray());
        modelAndView.addObject("multiModeFlag", 1);
        modelAndView.addObject("max_step", sessionDynamicModel.getCriteriesArray().length+1);
        return modelAndView;
    }


    @RequestMapping(value = "/next", method = RequestMethod.POST,produces="application/json;charset=UTF-8")
    public @ResponseBody String next(HttpSession httpSession,Model model){
        int step,maxStep;
        step =(int) httpSession.getAttribute(STEP_ATTRIBUTE_NAME);
        maxStep =(int) httpSession.getAttribute(MAX_STEP_ATTRIBUTE_NAME);
        if(step == maxStep)  {
            return "redirect:/saati/dynamic/multiple/result";
        }

        step++;

        log.info("STEP :" +step);


        httpSession.setAttribute(STEP_ATTRIBUTE_NAME, step);
        httpSession.setAttribute(MAX_STEP_ATTRIBUTE_NAME, maxStep);
        String stepComment;
        if(step==1)
            stepComment = "Оценка критериев";
        else
            stepComment = "Оценка альтернатив относительно критерия "+sessionDynamicModel.getCriteriesArray()[step-2]+"";

        //{"step":3,"step_name":"\u043a2","matrix_size":2}
        StringBuffer response = new StringBuffer();
        response.append("{");
        response.append("\"step\":");
        response.append(step);
        response.append(",");
        response.append("\"step_name\":");
        response.append("\""+stepComment+"\"");
        response.append(",");
        response.append("\"matrix_size\":");
        response.append(sessionDynamicModel.getAlternativesArray().length);

        response.append("}");
        try {

            return  new String(JsonStringEncoder.getInstance().encodeAsUTF8(response.toString()), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            return  response.toString();
        }
    }



    @RequestMapping("/calc")
    public @ResponseBody
    String calc(HttpServletRequest request, HttpSession httpSession){
        ObjectMapper om = new ObjectMapper();
        String message = "";

        DynamicMatrixData data ;
        int step = (int)httpSession.getAttribute(STEP_ATTRIBUTE_NAME);
        try{

            data = om.readValue(request.getInputStream(),DynamicMatrixData.class);
            if(step == 1){
                sessionDynamicModel.setCriteriasData(data);

            }
            else{
                sessionDynamicModel.getAlternativesDataList().add(data);
            }
            double lowLimit = sessionDynamicModel.getLowLimit();
            double topLimit = sessionDynamicModel.getTopLimit();

            calculateStaticMatrixByParameter(data,lowLimit);
            double lowAttitudeIndex = new SimpleSaatiSolver(data.getMatrix()).getAttitudeIndex();


            calculateStaticMatrixByParameter(data,topLimit);
            double topAttitudeIndex = new SimpleSaatiSolver(data.getMatrix()).getAttitudeIndex();

            if(topAttitudeIndex > MAX_ATTITUDE_INDEX || lowAttitudeIndex > MAX_ATTITUDE_INDEX ){
                message = "ОС при t = " + lowLimit +" : " +lowAttitudeIndex +"; ОС при t = "+topLimit +" : "+ topAttitudeIndex;

            }
        }
        catch(Exception e){
            e.printStackTrace();


        }



        return "{\"message\":\""+message+"\"}";
    }


    @RequestMapping(value = "/get_alternatives", method = RequestMethod.POST)
    public @ResponseBody String getAlternatives(){

        StringBuffer response = new StringBuffer();
        response.append("[");
        String[] alternatives = sessionDynamicModel.getAlternativesArray();
        for(int i=0; i < alternatives.length; i++){
            response.append("\""+alternatives[i]+"\"");
            if(i != alternatives.length-1){
                response.append(",");
            }


        }

        response.append("]");


        try {
            return  new String(JsonStringEncoder.getInstance().encodeAsUTF8(response.toString()), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            return  response.toString();
        }
    }

    @RequestMapping(value = "/result")
    public @ResponseBody GrafModel[] result(){
        double lowLimit = sessionDynamicModel.getLowLimit();
        double highLimit = sessionDynamicModel.getTopLimit();
        double step = sessionDynamicModel.getStep();
        double [][] criteriasMatrix = sessionDynamicModel.getCriteriasData().getMatrix();
        DynamicCell[] criteriasDynamicCellArray = sessionDynamicModel.getCriteriasData().getCellsArray();

        String[] alternatives = sessionDynamicModel.getAlternativesArray();
        String[] criterias = sessionDynamicModel.getCriteriesArray();

        int alternativesLength = alternatives.length;
        int criteriasLength = criterias.length;

        DynamicMatrixData[] alternativesDataArrray = sessionDynamicModel.getAlternativesDataList().toArray( new DynamicMatrixData[alternatives.length]);

        LinkedHashMap<Double, double[]> resultMap = new LinkedHashMap<Double, double[]>();

        for(Double t = lowLimit; t<=highLimit; t+=step){

            //Вычисляем статическую матрицу критериев от t
            calculateStaticMatrixByParameter(sessionDynamicModel.getCriteriasData(),t);


            // Вычисляем вектор критериев преобразованной выше матрице
            double[] criteriesWeightArray = new SimpleSaatiSolver(criteriasMatrix).getDoubleVector();

            // вычисляем вектора весов альтернатив
            //заведем массив для хранения локальных весов
            double[][] alternativesLocalWeights = new double[criteriasLength][];
            double[] currentAltWeights = new double[alternativesLength];




            //Вычисляем статическое состояние матриц альтернатив для каждого критерия и вычисляем веса
            for(int i = 0; i < criteriasLength; i++){
                calculateStaticMatrixByParameter(alternativesDataArrray[i],t);
                alternativesLocalWeights[i] = new SimpleSaatiSolver(alternativesDataArrray[i].getMatrix()).getDoubleVector();

                //умножаем полученные веса на коэффициент критерия
                for(int j=0; j< alternativesLocalWeights[i].length; j++){
                    alternativesLocalWeights[i][j] *= criteriesWeightArray[i];
                    currentAltWeights[j] += alternativesLocalWeights[i][j];
                }

            }

            //Запоминаем значения для конкретного t
            resultMap.put(t,currentAltWeights);

        }

        ArrayList<GrafModel> list = new ArrayList<GrafModel>();
//
//        double[][] array = {{1,2},{5,7}};
//        double[][] array2 = {{2,4},{6,8}};
        for(int i=0; i<alternativesLength; i++){
            ArrayList<double[]> tempGrafData = new ArrayList<double[]>();
            for(Double key : resultMap.keySet()){
                double[] tempPoint = new double[2];
                tempPoint[0] = key;
                tempPoint[1] = resultMap.get(key)[i];
                tempGrafData.add(tempPoint);
            }
            list.add(new GrafModel(alternatives[i],tempGrafData.toArray(new double[tempGrafData.size()][])));
        }

//        list.add(new GrafModel("Первый лабле",array));
//        list.add(new GrafModel("Второй лабле",array2));



        return list.toArray(new GrafModel[list.size()]);

    }

    @RequestMapping("/reset")
    public String resetAll(HttpSession session){
        session.setAttribute(STEP_ATTRIBUTE_NAME,1);
        sessionDynamicModel = new SessionDynamicSaatiModel();
        return "redirect:/saati/";
    }

    private double getDynamicCellValue(DynamicCell cell, double t){

        double a = cell.getA();
        double b = cell.getB();
        int x =  cell.getX();
        int y = cell.getY();

        double result;
        switch(cell.getCellType()){
            case 1:  result = a*t+b;
                break;
            case 2:  result = a*Math.log10(t+1)+b;
                break;
            case 3:
                double c = cell.getC();
                result = a*Math.exp(t*b)+c;
                break;
            case 4:
                double c2 = cell.getC();
                result = a*Math.pow(t,2)+b*t+c2;
                break;

            default: result=0;
                break;
        }
        return result;
    }

    private void calculateStaticMatrixByParameter(DynamicMatrixData data, double t){


            DynamicCell[] currentCellsArray = data.getCellsArray();
            double[][] currentMatrix = data.getMatrix();

        // цикл для заполнения матрицы статическими значениями динамических ячеек
            for(int k=0; k< currentCellsArray.length; k++){
                //вычисляем значение конкретной ячейки
                DynamicCell currentCell = currentCellsArray[k];
                double tempCellValue = getDynamicCellValue(currentCell,t);
                int x = currentCell.getX();
                int y = currentCell.getY();


                if(tempCellValue != 0){
                    if(y>x)  {
                        currentMatrix[x][y]=tempCellValue;
                        currentMatrix[y][x]=1/tempCellValue;
                    }
                    else  {
                        currentMatrix[y][x]=tempCellValue;
                        currentMatrix[x][y]=1/tempCellValue;
                    }
                }
            }




    }
}
