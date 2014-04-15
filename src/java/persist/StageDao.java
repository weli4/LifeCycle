package persist;

import entity.Stage;
import org.springframework.stereotype.Repository;

@Repository
public class StageDao extends AbstractDao<Stage>{
    @Override
    public Class<Stage> getEntityClass() {
        return Stage.class;
    }
}
