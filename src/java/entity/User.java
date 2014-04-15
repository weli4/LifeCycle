package entity;

import javax.persistence.Entity;

@Entity
public class User extends AbstractEntity{
    private String email;
    private String password;
}
