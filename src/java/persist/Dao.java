package persist;


import entity.AbstractEntity;

public interface Dao<T extends AbstractEntity> {
    Class<T> getEntityClass();
}
