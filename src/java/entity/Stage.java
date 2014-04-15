package entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
public class Stage extends AbstractEntity{
    private String name;
    private List<Process> process;
    private Model model;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    @OneToMany
    public List<Process> getProcess() {
        return process;
    }

    public void setProcess(List<Process> process) {
        this.process = process;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public Model getModel() {
        return model;
    }

    public void setModel(Model model) {
        this.model = model;
    }
}
