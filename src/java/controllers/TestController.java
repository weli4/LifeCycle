package controllers;


import model.DynamicCell;
import model.DynamicMatrixData;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.Arrays;

import org.codehaus.jackson.map.ObjectMapper;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/saati/test")
public class TestController {
    @RequestMapping("")
    public ModelAndView test(){
        ModelAndView modelAndView = new ModelAndView("/saati/jsontest");

        return modelAndView;
    }
    @RequestMapping(value = "", method = RequestMethod.POST)
    public @ResponseBody  String testResp(HttpServletRequest request){

        ObjectMapper om = new ObjectMapper();

        DynamicMatrixData data;

        try{

            data = om.readValue(request.getInputStream(),DynamicMatrixData.class);
            System.out.println("OKKKKKKKKKKKKKKKKKKKKKKKKKKK");
            for(DynamicCell cell : data.getCellsArray()){
                System.out.println("X :"+cell.getX());
                System.out.println("Y :"+cell.getY());
                System.out.println("TYPE :"+cell.getCellType());
                System.out.println("A :"+cell.getA());
                System.out.println("B :"+cell.getB());
                System.out.println("C :"+cell.getC());
            }
            System.out.println(Arrays.toString(data.getMatrix()[0]));
            System.out.println(Arrays.toString(data.getMatrix()[1]));
            System.out.println(Arrays.toString(data.getMatrix()[2]));
        }
        catch (Exception e){
            data = null;
            e.printStackTrace();

        }
        //ModelAndView modelAndView = new ModelAndView("/saati/jsontest");
       // System.out.println(cellArray.length);
       // System.out.println(cellArray[0]);
//        for(DynamicCell cell : cellArray){
//        System.out.println("X :"+cell.getX());
//        System.out.println("Y :"+cell.getY());
//        System.out.println("TYPE :"+cell.getType());
//        System.out.println("A :"+cell.getA());
//        System.out.println("B :"+cell.getB());
//        System.out.println("C :"+cell.getC());
//       }
        return "{}";
    }
}
