package com.utm.gym_tracker.group.dto;

import java.util.List;

public class CreateGroup {
    private String name;
    private List<Long> userIds;

    public CreateGroup() {}

    public CreateGroup(String name, List<Long> userIds) {
        this.name = name;
        this.userIds = userIds;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Long> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Long> userIds) {
        this.userIds = userIds;
    }
}
