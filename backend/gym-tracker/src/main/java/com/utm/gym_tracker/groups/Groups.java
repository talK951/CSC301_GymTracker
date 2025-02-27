package com.utm.gym_tracker.groups;

import com.utm.gym_tracker.user.User;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "groups")
public class Groups {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String groupName;

    @ElementCollection
    @CollectionTable(name = "group_posts", joinColumns = @JoinColumn(name = "group_id"))
    @Column(name = "post", nullable = false)
    private Set<String> posts = new HashSet<>();

    @ManyToMany(mappedBy = "groups")
    private Set<User> users = new HashSet<>();

    public Groups(String groupName) {
        this.groupName = groupName;
    }

    public Groups() {}

    public Long getId() {
        return id;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Set<String> getPosts() {
        return posts;
    }

    public void addPost(String post) {
        this.posts.add(post);
    }

    public Set<User> getUsers() {
        return users;
    }

    public void addUser(User user) {
        this.users.add(user);
        user.getGroups().add(this);
    }
}
