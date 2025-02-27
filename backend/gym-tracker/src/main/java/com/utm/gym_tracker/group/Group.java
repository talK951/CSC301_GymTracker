package com.utm.gym_tracker.group;

import ch.qos.logback.core.joran.spi.DefaultClass;
import com.utm.gym_tracker.user.User;
import jakarta.persistence.*;

import java.util.HashMap;
import java.util.Optional;

@Entity
@Table(name = "groups")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Uses auto-incrementing ID
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 20) // Placeholder
    private String name;

    @ManyToMany
    private HashMap<Long, User> users;

    public Group() {}

    public Group(String name) {
        this.name = name;
//        this.users = new HashMap<>();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public HashMap<Long, User> getUsers() {
        return users;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void addUser(User user) {
        this.users.put(user.getID(), user);
    }

    public Optional<User> getUserByID(Long id) {
        User user = this.users.get(id);
        if (user == null) { return Optional.empty(); }
        return Optional.of(user);
    }
}
