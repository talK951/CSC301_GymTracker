package com.utm.gym_tracker.groups;

import com.utm.gym_tracker.user.User;
import jakarta.persistence.*;

import java.util.ArrayList;

@Entity
@Table(name = "groups")
public class Group {
    @Id
    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String groupName;

    @ElementCollection
    @CollectionTable(name = "group_posts")
    @Column(name = "post", nullable = false)
    private ArrayList<String> posts = new ArrayList<>();

    @ManyToMany(mappedBy = "groups")
    private ArrayList<User> users = new ArrayList<>();

    public Group(String groupName) {
        this.groupName = groupName;
    }


    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public ArrayList<String> getPosts() {
        return posts;
    }

    public void addPost(String post) {
        this.posts.add(post);
    }

    public ArrayList<User> getUsers() {
        return users;
    }

    public void addUser(User user) {
        this.users.add(user);
    }
}
