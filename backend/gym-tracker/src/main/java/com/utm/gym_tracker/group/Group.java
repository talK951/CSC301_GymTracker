package com.utm.gym_tracker.group;

import ch.qos.logback.core.joran.spi.DefaultClass;
import com.utm.gym_tracker.user.User;
import jakarta.persistence.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Entity
@Table(name = "groups")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Uses auto-incrementing ID
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 20) // Placeholder
    private String name;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "group_users",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> users = new HashSet<>();

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

    public Set<User> getUsers() {
        return users;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void addUser(User user) {
        this.users.add(user);
    }

    public Optional<User> getUserByID(Long id) {
        User user = null;
        for (User curr: users) {
            if (curr.getID() == id) {
                user = curr;
                break;
            }
        }
        if (user == null) { return Optional.empty(); }
        return Optional.of(user);
    }
}
