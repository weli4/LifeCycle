package controllers;


import model.MultipleSaatiiSessionModel;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.io.JsonStringEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import solvers.SimpleSaatiSolver;

import javax.servlet.http.HttpSession;
import java.io.UnsupportedEncodingException;
import java.util.Arrays;

@Controller
@RequestMapping("/saati")

public class MultipleSaatiController {
    private Log log = LogFactory.getLog(SaatiController.class);
    private static final String STEP_ATTRIBUTE_NAME = "step",
                                MAX_STEP_ATTRIBUTE_NAME = "max_step";
    private MultipleSaatiiSessionModel saatiSessionModel ;
    @RequestMapping(value = "/multiple")
    public String alernatives(){


        return "redirect:/saati/multiple/set_alternatives";
    }


    @RequestMapping("/multiple/set_alternatives")
    public ModelAndView alt(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("headerText","Выберете альтернативы");
        modelAndView.setViewName("/saati/alt_choose");
        return modelAndView;
    }

    @RequestMapping(value = "/multiple/set_alternatives" , method = RequestMethod.POST)
    public ModelAndView setAlternatives(@RequestParam(value = "input_alt") String[] alternativesArray, HttpSession httpSession){
        ModelAndView modelAndView = new ModelAndView();
        saatiSessionModel = new MultipleSaatiiSessionModel();


        httpSession.setAttribute("sessionObject", saatiSessionModel);


        log.info("STEP 0");
        log.info(Arrays.toString(alternativesArray));
        saatiSessionModel.setAlternativesArray(alternativesArray);

        log.info(Arrays.toString(saatiSessionModel.getAlternativesArray()));
   //     httpSession.setAttribute("headerText", "Выберете критерии");

        modelAndView.setViewName("redirect:/saati/multiple/set_criteries");

        return modelAndView;

    }

    @RequestMapping("/multiple/set_criteries")
    public ModelAndView criteries(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("headerText","Выберете критерии");

        modelAndView.setViewName("/saati/alt_choose");
        return modelAndView;
    }

    @RequestMapping(value = "/multiple/set_criteries" , method = RequestMethod.POST)
    public ModelAndView setCriterias(@RequestParam(value = "input_alt") String[] alternativesArray){
        ModelAndView modelAndView = new ModelAndView();
        log.info(Arrays.toString(alternativesArray));
        saatiSessionModel.setCriteriesArray(alternativesArray);
        log.info(Arrays.toString(saatiSessionModel.getCriteriesArray()));
        //Даем первому вью сравнить критерии между собой

        modelAndView.setViewName("redirect:/saati/multiple/matrix");
        return modelAndView;

    }

    @RequestMapping("/multiple/matrix")
    public ModelAndView matrix(HttpSession httpSession){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("alternativesArray", saatiSessionModel.getCriteriesArray());
        modelAndView.addObject("alternativesNumber", saatiSessionModel.getCriteriesArray().length);
        modelAndView.addObject("multiModeFlag",1);

        httpSession.setAttribute(STEP_ATTRIBUTE_NAME, 1);
        httpSession.setAttribute(MAX_STEP_ATTRIBUTE_NAME, saatiSessionModel.getCriteriesArray().length+1);
        modelAndView.setViewName("/saati/matrix");
        return modelAndView;
    }

    @RequestMapping(value = "/multiple",method = RequestMethod.POST)
    public String start(@RequestParam(value = "input_alt") String[] alternativesArray, HttpSession httpSession ){


        return "redirect:/saati/multiple/set_alternatives";
    }

    @RequestMapping("/multiple/calc")
    public @ResponseBody String calc(@RequestParam(value = "matrix") String[][] input ,  HttpSession httpSession){


        int matrixSize = input[0].length;
        double[][] doubleInputArray = new double[matrixSize][matrixSize];
        for(int i=0; i<matrixSize; i++){
            for(int j=0; j<matrixSize; j++){
                doubleInputArray[i][j] = getDoubleNumber(input[i][j]);

            }

        }
        Integer step =(int) httpSession.getAttribute(STEP_ATTRIBUTE_NAME);
        if(step.equals(1))   {
            saatiSessionModel.setCriteriasMatrix(doubleInputArray);
        }
        else if(step > 1){
            saatiSessionModel.addAltMatrix(doubleInputArray);

        }

        SimpleSaatiSolver saatiSolver = new SimpleSaatiSolver(doubleInputArray);




        return saatiSolver.getSolveAsJSON();
    }


    @RequestMapping(value = "/multiple/result")
    public ModelAndView result(){
        ModelAndView modelAndView = new ModelAndView("/saati/show-result");

        int altCount = saatiSessionModel.getAlternativesArray().length;
        double[] resultArray = new double[altCount];
        double[] rate =  new SimpleSaatiSolver(saatiSessionModel.getCriteriasMatrix()).getDoubleVector();

        for(int i = 0; i < saatiSessionModel.getCriteriesArray().length; i++){
            double[] localWeights = new SimpleSaatiSolver(saatiSessionModel.getAlternativesMatrixList().get(i)).getDoubleVector();


            for(int j = 0; j< altCount; j++){
                resultArray[j]=resultArray[j] + localWeights[j]* rate[i];
            }
        }




        modelAndView.addObject("criteriesArray",saatiSessionModel.getCriteriesArray());
        modelAndView.addObject("alternativesArray",saatiSessionModel.getAlternativesArray());
        modelAndView.addObject("alternativesNumber",saatiSessionModel.getAlternativesArray().length);
        modelAndView.addObject("resultArray",resultArray);
        return modelAndView;

    }


    @RequestMapping(value = "/multiple/next", method = RequestMethod.POST)
    public @ResponseBody String next(HttpSession httpSession){
        int step,maxStep;
        step =(int) httpSession.getAttribute(STEP_ATTRIBUTE_NAME);
        maxStep =(int) httpSession.getAttribute(MAX_STEP_ATTRIBUTE_NAME);
        if(step == maxStep)  {
            return "redirect:/saati/multiple/result";
        }

        step++;
//        if(step-3 == maxStep){
//           // model.setViewName("/saati/show-result");
//            return model;
//
//        }
        log.info("STEP :" +step);
//        model.addAttribute("headerText","Оценка альтернативы "+ saatiSessionModel.getAlternativesArray()[step-3] );
//        model.addAttribute("alternativesArray", saatiSessionModel.getCriteriesArray());
//        model.addAttribute("alternativesNumber", saatiSessionModel.getCriteriesArray().length);
//        model.addAttribute("multiModeFlag",1);

        httpSession.setAttribute(STEP_ATTRIBUTE_NAME, step);
        httpSession.setAttribute(MAX_STEP_ATTRIBUTE_NAME, maxStep);
        String stepComment;
        if(step==1)
            stepComment = "Оценка критериев";
        else
            stepComment = "Оценка альтернатив относительно критерия "+saatiSessionModel.getCriteriesArray()[step-2]+"";

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
        response.append(saatiSessionModel.getAlternativesArray().length);


        response.append("}");
        try {
            return  new String(JsonStringEncoder.getInstance().encodeAsUTF8(response.toString()), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            return  response.toString();
        }
    }

    @RequestMapping(value = "/multiple/get_alternatives", method = RequestMethod.POST)
    public @ResponseBody String getAlternatives(){

        StringBuffer response = new StringBuffer();
        response.append("[");
        String[] alternatives = saatiSessionModel.getAlternativesArray();
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

    private double getDoubleNumber(String str){
        if(str.contains("/")){
            String[] tempArray = str.split("/");
            int numerator = Integer.parseInt(tempArray[0]);
            int denominator = Integer.parseInt(tempArray[1]);

            return (double)numerator/denominator;

        }
        else{
            return Double.parseDouble(str);
        }


    }

}
