package controllers;


import model.DynamicMatrixData;
import model.SessionDynamicSaatiModel;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
import java.util.Arrays;

@Controller
@RequestMapping("/saati/dynamic/multiple")
public class MultipleDynamicSaatiController {

    private static final String STEP_ATTRIBUTE_NAME = "step" ;
    private static final String MAX_STEP_ATTRIBUTE_NAME = "step_count";
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

    @RequestMapping(value = "/next", method = RequestMethod.POST)
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
            return  new String(response.toString().getBytes("UTF-8"), "ISO-8859-1");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            return  response.toString();
        }
    }



    @RequestMapping("/calc")
    public @ResponseBody
    String calc(HttpServletRequest request, HttpSession httpSession){
        ObjectMapper om = new ObjectMapper();

        DynamicMatrixData data;
        int step = (int)httpSession.getAttribute(STEP_ATTRIBUTE_NAME);
        try{

            data = om.readValue(request.getInputStream(),DynamicMatrixData.class);
            if(step == 1){
                sessionDynamicModel.setCriteriasData(data);

            }
            else{
                sessionDynamicModel.getAlternativesDataList().add(data);
            }


        }
        catch(Exception e){
            e.printStackTrace();


        }
        return "{\"message\":\" OK\"}";
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
            return  new String(response.toString().getBytes("UTF-8"), "ISO-8859-1");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            return  response.toString();
        }
    }

    @RequestMapping(value = "/result")
    public ModelAndView result(){
        ModelAndView modelAndView = new ModelAndView("/saati/show-result");

        int altCount = sessionDynamicModel.getAlternativesArray().length;
        double[] resultArray = new double[altCount];
        //double[] rate =  new SimpleSaatiSolver(sessionDynamicModel.getCriteriasMatrix()).getDoubleVector();

        for(int i = 0; i < sessionDynamicModel.getCriteriesArray().length; i++){
        //    double[] localWeights = new SimpleSaatiSolver(sessionDynamicModel.getAlternativesMatrixList().get(i)).getDoubleVector();


            for(int j = 0; j< altCount; j++){
          //      resultArray[j]=resultArray[j] + localWeights[j]* rate[i];
            }
        }




        modelAndView.addObject("criteriesArray",sessionDynamicModel.getCriteriesArray());
        modelAndView.addObject("alternativesArray",sessionDynamicModel.getAlternativesArray());
        modelAndView.addObject("alternativesNumber",sessionDynamicModel.getAlternativesArray().length);
        modelAndView.addObject("resultArray",resultArray);
        return modelAndView;

    }
}
