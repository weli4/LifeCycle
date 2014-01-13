package ru.mirea.fk.is.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class WorkspaceController {
    @RequestMapping("/workspace")
    public ModelAndView workspace()
    {
        return new ModelAndView("workspace");
    }

}
