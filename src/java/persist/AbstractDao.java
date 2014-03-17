package persist;

import entity.AbstractEntity;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.util.List;

public abstract class AbstractDao<T extends AbstractEntity> implements Dao<T>{
    @PersistenceContext
    protected EntityManager em;


    @Transactional
    public List<T> findAll() {
        Query q = em.createQuery("select t from " + getEntityClass() + "where tenant=?");
        return null;
    }

}
