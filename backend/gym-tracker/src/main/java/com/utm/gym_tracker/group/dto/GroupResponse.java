package com.utm.gym_tracker.group.dto;

import java.util.List;

public class GroupResponse {
    private Long id;
    private String name;
    private List<UserSummary> users;

    public GroupResponse() {}

    public GroupResponse(Long id, String name, List<UserSummary> users) {
        this.id = id;
        this.name = name;
        this.users = users;
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
    public List<UserSummary> getUsers() {
        return users;
    }
    public void setUsers(List<UserSummary> users) {
        this.users = users;
    }
}