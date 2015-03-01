package controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;


@Controller
public class IndexController {
    @RequestMapping("")
    public ModelAndView index(){
        System.out.println("123231");
        return new ModelAndView("index");

    }
    @RequestMapping("/index")
    public ModelAndView indexXX(){
        ModelAndView m = new ModelAndView("index");
        m.addObject("text","text");
        System.out.println("request '/index'");
        return m;
    }



}
