package controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.Arrays;


@Controller
@RequestMapping("/saati")
public class SaatiController {

    @RequestMapping("")
    public String mainPage(){

        return "saati/main";
    }
    @RequestMapping("/single")
    public String firstStep(){

        return "/saati/alt_choose";
    }
    @RequestMapping(value = "/single",method = RequestMethod.POST)
    public ModelAndView maxtixFill(@RequestParam(value = "input_alt") String[] myArray){
        ModelAndView m = new ModelAndView("saati/matrix");

        m.addObject("myArray",myArray);
        m.addObject("alternativesNumber",myArray.length);
        System.out.println(Arrays.toString(myArray));


        return m;
    }
    @RequestMapping(value = "/calc", method = RequestMethod.POST)
    public @ResponseBody String calc(@RequestParam(value = "matrix") String[][] input , Model model){
        System.out.println("WORKS!");
        System.out.println(input[0][0]);
        System.out.println(input[0][1]);


        return "{\"vector\":[0.8,0.2],\"lambda\":2,\"cons_index\":0,\"attit_cons\":0}";
    }

}
