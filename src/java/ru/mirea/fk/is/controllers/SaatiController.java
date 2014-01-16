package ru.mirea.fk.is.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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
        System.out.println(Arrays.toString(myArray));
        return m;

    }

}
