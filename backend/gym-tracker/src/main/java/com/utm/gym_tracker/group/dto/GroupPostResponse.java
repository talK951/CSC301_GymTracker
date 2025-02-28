package com.utm.gym_tracker.group.dto;

import java.util.List;

public class GroupPostResponse {
    private Long id;
    private String name;
    private List<String> posts;

    public GroupPostResponse() {}

    public GroupPostResponse(Long id, String name, List<String> posts) {
        this.id = id;
        this.name = name;
        this.posts = posts;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public List<String> getPosts() {
        return posts;
    }
    public void setPosts(List<String> posts) {
        this.posts = posts;
    }
}