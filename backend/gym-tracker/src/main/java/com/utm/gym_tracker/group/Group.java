package com.utm.gym_tracker.group;

import com.utm.gym_tracker.user.User;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "groups")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Uses auto-incrementing ID
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 20) // Placeholder
    private String name;

    @ManyToMany
    private Set<User> users;

    public Group(String name, Set<User> user) {
        this.name = name;
        this.users = user;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void addUser(User user) {
        this.users.add(user);
    }
}
