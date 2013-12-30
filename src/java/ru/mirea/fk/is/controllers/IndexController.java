package ru.mirea.fk.is.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created with IntelliJ IDEA.
 * User: tt
 * Date: 30.12.13
 * Time: 20:49
 * To change this template use File | Settings | File Templates.
 */
@Controller
public class IndexController {
    @RequestMapping("/")
    public String index(){
        System.out.println("BIIIIIIIIIIIIIIIIIIIIIIIIIIIIITCHHHHHHHHHHHHHHHHHHH");
        return "index";

    }
    @RequestMapping("/index")
    public String indexXX(){
        System.out.println("BIIIIIIIIIIIIIIIIIIIIIIIIIIIIITCHHHHHHHHHHHHHHHHHHH");
        return "index";

    }



}
