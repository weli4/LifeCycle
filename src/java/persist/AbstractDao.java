package persist;

import entity.AbstractEntity;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import service.TenantHelper;
import util.HibernateUtil;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.util.List;

public abstract class AbstractDao<T extends AbstractEntity> implements Dao<T>{
    @PersistenceContext
    protected EntityManager em;

    @Autowired
    private TenantHelper tenantHelper;

    @Transactional
    public List<T> findAll() {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        List<T> result = session.createQuery("from"+getEntityClass()+"order by lastName, firstName").list();
        session.getTransaction().commit();
        return result;

    }
    @Transactional
    public T find(Long id) {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        T result = (T) session.load(getEntityClass(), id);
        session.getTransaction().commit();
        return result;
    }
}