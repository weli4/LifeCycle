package persist;

import org.springframework.stereotype.Repository;
import entity.Process;

@Repository
public class ProcessDao extends AbstractDao<Process>{
    @Override
    public Class<Process> getEntityClass() {
        return Process.class;
    }
}
