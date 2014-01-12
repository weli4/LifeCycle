package ru.mirea.fk.is.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class IndexController {
    @RequestMapping("")
    public String index(){
        System.out.println("request ''");
        return "index";

    }
    @RequestMapping("/index")
    public String indexXX(){
        System.out.println("request '/index'");
        return "home";

    }



}
