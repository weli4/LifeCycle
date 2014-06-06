package controllers;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import solvers.SimpleSaatiSolver;

import java.util.Arrays;


@Controller
@RequestMapping("/saati")
public class DynamicSaatiController {
    private Log log = LogFactory.getLog(SaatiController.class);

    @RequestMapping("/dynamic")
    public ModelAndView dynamicFirstStep(){
        ModelAndView modelAndView = new ModelAndView("/saati/alt_choose");
        modelAndView.addObject("headerText","Выберите альтернативы");
        return modelAndView;
    }

    @RequestMapping(value = "/dynamic",method = RequestMethod.POST)
    public ModelAndView dynamicMaxtixFill(@RequestParam(value = "input_alt") String[] alternativesArray){
        ModelAndView m = new ModelAndView("saati/dynamic_matrix");
        m.addObject("headerText", "Анализ альтернатив");
        m.addObject("alternativesArray", alternativesArray);
        m.addObject("alternativesNumber", alternativesArray.length);
        System.out.println(Arrays.toString(alternativesArray));


        return m;
    }

    @RequestMapping(value ="/dynamic/show-result",method = RequestMethod.POST)
    public @ResponseBody
    String  showGraf(@RequestParam(value = "dynamic")String dynamic,@RequestParam(value = "matrix") String[][] input,@RequestParam(value = "step") String step,
                     @RequestParam(value = "low") String lowLimit, @RequestParam(value = "high") String highLimit,@RequestParam(value = "b") String b,
                     @RequestParam(value = "a") String a){
        log.info("SHOWGRAF");
        log.info(dynamic.toString());
        log.info(step.toString());
        log.info(lowLimit.toString());
        log.info(highLimit.toString());
        log.info(a);
        log.info(b);

        int x = Character.getNumericValue(dynamic.charAt(7));
        int y = Character.getNumericValue(dynamic.charAt(10));
        log.info(x+"    "+y);


        int matrixSize = input[0].length;

        int count = 0;
        for(double value=Double.parseDouble(lowLimit); value<=Double.parseDouble(highLimit); value+=Double.parseDouble(step)){
            count++;
        }


        double[][] outArray = new double[matrixSize][count];
        double[] outParametrArray = new double[count];

        double[][] doubleInputArray = new double[matrixSize][matrixSize];
        for(int i=0; i<matrixSize; i++){
            for(int j=0; j<matrixSize; j++){
                doubleInputArray[i][j] = getDoubleNumber(input[i][j]);

            }

        }
        int counter = 0;
        double value=Double.parseDouble(lowLimit);
        double tempTargetValue;
        for(; value<=Double.parseDouble(highLimit); value+=Double.parseDouble(step)){
            tempTargetValue = Double.parseDouble(a)*value+Double.parseDouble(b);
            if(tempTargetValue != 0){
                doubleInputArray[x][y]=tempTargetValue;
                doubleInputArray[y][x]=1/tempTargetValue;
                SimpleSaatiSolver saatiSolver = new SimpleSaatiSolver(doubleInputArray);
                double[] tempKoef = saatiSolver.getDoubleVector();
                for(int j=0; j<matrixSize; j++){
                    outArray[j][counter] = tempKoef[j];
                }
                outParametrArray[counter] = value;
                counter++;
            }
            else{
                continue;
            }


        }

        StringBuffer sb = new StringBuffer("{");
        //sb.append("\"datasets\":{");
        for(int i=0; i<matrixSize ; i++){
            sb.append("\"vector"+i+"\":{\"data\":[");
            for(int j=0; j<counter; j++){
                sb.append("[");
                sb.append(outParametrArray[j]);
                sb.append(",");
                sb.append(outArray[i][j]);
                sb.append("]");
                if(j!=counter-1){
                    sb.append(",");

                }

            }
            sb.append("]");
            sb.append(", \"label\":"+(i+1));
            sb.append("}");
            if(i!=matrixSize-1){
                sb.append(",");

            }

        }
        sb.append("}");

        //"{\"vector\":[[0,1],[1,3],[2,4]],\"lambda\":2,\"cons_index\":0,\"attit_cons\":0}"
        return sb.toString();

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
