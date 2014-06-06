package controllers;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import solvers.SimpleSaatiSolver;

import java.util.ArrayList;
import java.util.Arrays;


@Controller
@RequestMapping("/saati")
public class SaatiController {
    private Log log = LogFactory.getLog(SaatiController.class);

    @RequestMapping("")
    public String mainPage(){

        return "saati/main";
    }
    @RequestMapping("/single")
    public ModelAndView firstStep(){
        ModelAndView modelAndView = new ModelAndView("/saati/alt_choose");
        modelAndView.addObject("headerText","Выберите альтернативы");
        return modelAndView;
    }


    @RequestMapping(value = "/single",method = RequestMethod.POST)
    public ModelAndView singleMaxtixFill(@RequestParam(value = "input_alt") String[] alternativesArray){
        ModelAndView m = new ModelAndView("saati/matrix");
        m.addObject("headerText", "Простое сравнение альтернатив");
        m.addObject("alternativesArray", alternativesArray);
        m.addObject("alternativesNumber", alternativesArray.length);
        System.out.println(Arrays.toString(alternativesArray));


        return m;
    }




    @RequestMapping(value = "/calc", method = RequestMethod.POST)
    public @ResponseBody String calc(@RequestParam(value = "matrix") String[][] input , Model model){
        log.info("WORKS!");

        int matrixSize = input[0].length;
        double[][] doubleInputArray = new double[matrixSize][matrixSize];
        for(int i=0; i<matrixSize; i++){
            for(int j=0; j<matrixSize; j++){
                doubleInputArray[i][j] = getDoubleNumber(input[i][j]);

            }

        }
        log.info("Parsing array is done");

        SimpleSaatiSolver saatiSolver = new SimpleSaatiSolver(doubleInputArray);




        return saatiSolver.getSolveAsJSON();
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
