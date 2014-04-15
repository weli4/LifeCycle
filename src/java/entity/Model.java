package entity;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
public class Model extends AbstractEntity{
    private String name;
    private String description;
    private List<Stage> stageList;

    @OneToMany
    public List<Stage> getStageList() {
        return stageList;
    }

    public void setStageList(List<Stage> stageList) {
        this.stageList = stageList;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
