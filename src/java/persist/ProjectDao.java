package persist;

import entity.Project;
import org.springframework.stereotype.Repository;

@Repository
public class ProjectDao extends AbstractDao<Project>{

    @Override
    public Class<Project> getEntityClass() {
        return Project.class;
    }
}
