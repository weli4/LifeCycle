package controllers;

import model.DynamicCell;
import model.DynamicMatrixData;
import model.GrafModel;
import model.SessionDynamicSaatiModel;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import solvers.SimpleSaatiSolver;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Arrays;


@Controller
@RequestMapping("/saati")
public class DynamicSaatiController {
    private Log log = LogFactory.getLog(SaatiController.class);
    private SessionDynamicSaatiModel sessionModel = new SessionDynamicSaatiModel();
    @RequestMapping("/dynamic")
    public ModelAndView dynamicFirstStep(){
        ModelAndView modelAndView = new ModelAndView("/saati/alt_choose");
        modelAndView.addObject("headerText","Выберите альтернативы");
        return modelAndView;
    }

    @RequestMapping(value = "/dynamic",method = RequestMethod.POST)
    public ModelAndView setAlt(@RequestParam(value = "input_alt") String[] alternativesArray){
        ModelAndView modelAndView = new ModelAndView("redirect:/saati/dynamic/set_limits");
        sessionModel.setAlternativesArray(alternativesArray);

        return modelAndView;
    }

    @RequestMapping("/dynamic/set_limits")
    public ModelAndView limits(){
        ModelAndView modelAndView = new ModelAndView("/saati/set-limits");
        modelAndView.addObject("headerText","Определите динамические параметры");
        return modelAndView;
    }

    @RequestMapping(value = "/dynamic/set_limits", method = RequestMethod.POST)
    public ModelAndView setLimits(@RequestParam(value = "low_limit") double lowLimit, @RequestParam(value = "top_limit") double topLimit,
                                  @RequestParam(value = "step") double step){
        ModelAndView modelAndView = new ModelAndView("redirect:/saati/dynamic/matrix");
        sessionModel.setLowLimit(lowLimit);
        sessionModel.setTopLimit(topLimit);
        sessionModel.setStep(step);
        return modelAndView;
    }

    @RequestMapping(value = "/dynamic/matrix")
    public ModelAndView dynamicMaxtixFill(){
        ModelAndView m = new ModelAndView("/saati/dynamic_matrix");
        m.addObject("headerText", "Анализ альтернатив");
        m.addObject("alternativesArray", sessionModel.getAlternativesArray());
        m.addObject("alternativesNumber", sessionModel.getAlternativesArray().length);
        m.addObject("multiModeFlag", 0);


        return m;
    }

    @RequestMapping(value ="/dynamic/show-result",method = RequestMethod.POST)
    public @ResponseBody
    GrafModel[] showGraf(HttpServletRequest request){
        ObjectMapper om = new ObjectMapper();

        DynamicMatrixData data;
        ArrayList<GrafModel> list = new ArrayList<GrafModel>();
        try{

            data = om.readValue(request.getInputStream(),DynamicMatrixData.class);
            //sessionDynamicModel

            double[][] input = data.getMatrix();
            double lowLimit = sessionModel.getLowLimit();
            double highLimit = sessionModel.getTopLimit();
            double step = sessionModel.getStep();


            int matrixSize = input[0].length;

            int count = 0;
            for(double value=lowLimit; value<=highLimit; value+=step){
                count++;
            }


            double[][] outArray = new double[matrixSize][count];
            double[] outParametrArray = new double[count];


            int counter = 0;

            double tempTargetValue;
            DynamicCell[] cells = data.getCellsArray();
            for(double value=lowLimit; value<=highLimit; value+=step){
                for(int k=0; k< cells.length; k++){
                    double a = cells[k].getA();
                    double b = cells[k].getB();
                    int x =  cells[k].getX();
                    int y = cells[k].getY();
                   // log.info("Cell x: "+x +" y: " +y+" a: "+a +" b: "+b+" type: "+cells[k].getCellType() );
                    //1 - linear; 2-log; 3 -exp ; 4 - quadratic
                    switch(cells[k].getCellType()){
                        case 1:  tempTargetValue = a*value+b;
                            break;
                        case 2:  tempTargetValue = a*Math.log10(value+1)+b;
                            break;
                        case 3:
                                 double c = cells[k].getC();
                                 tempTargetValue = a*Math.exp(value*b)+c;
                            break;
                        case 4:
                                 double c2 = cells[k].getC();
                                 tempTargetValue = a*Math.pow(value,2)+b*value+c2;
                            break;

                        default: tempTargetValue=0;
                            break;
                    }

                    if(tempTargetValue != 0){
                        if(y>x)  {
                            input[x][y]=tempTargetValue;
                            input[y][x]=1/tempTargetValue;
                        }
                        else  {
                            input[y][x]=tempTargetValue;
                            input[x][y]=1/tempTargetValue;
                        }
                    }
                }


                SimpleSaatiSolver saatiSolver = new SimpleSaatiSolver(input);
                double[] tempKoef = saatiSolver.getDoubleVector();
                for(int j=0; j<matrixSize; j++){
                    outArray[j][counter] = tempKoef[j];
                }
                outParametrArray[counter] = value;
                counter++;



            }


            for(int i=0; i<matrixSize ; i++){
                double[][] array = new double[counter][2];
                for(int j=0; j<counter; j++){
                    array[j][0] = outParametrArray[j];
                    array[j][1] = outArray[i][j];
                }
                list.add(new GrafModel(sessionModel.getAlternativesArray()[i],array));
            }
            return list.toArray(new GrafModel[list.size()]);
        }
        catch(Exception e){

            e.printStackTrace();

            return list.toArray(new GrafModel[list.size()]);
        }


    }



}
