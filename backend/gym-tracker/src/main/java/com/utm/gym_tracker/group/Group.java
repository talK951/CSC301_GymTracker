package com.utm.gym_tracker.group;

import com.utm.gym_tracker.post.Post;
import com.utm.gym_tracker.user.User;
import jakarta.persistence.*;

import java.util.*;

@Entity
@Table(name = "groups")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 20)
    private String name;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "group_users",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> users = new HashSet<>();

    // @ElementCollection
    // @OrderColumn(name = "post_order")
    // @Column(name = "post", nullable = false)
    // private List<String> posts = new ArrayList<>();

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();

    public Group() {}

    public Group(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public void addUser(User user) {
        if (user != null) {
            this.users.add(user);
            user.getGroups().add(this);
        }
    }

    public void removeUser(User user) {
        if (user != null) {
            this.users.remove(user);
            user.getGroups().remove(this);
        }
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

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    public void addPost(Post post) {
        this.posts.add(post);
        post.setGroup(this);
    }
}
