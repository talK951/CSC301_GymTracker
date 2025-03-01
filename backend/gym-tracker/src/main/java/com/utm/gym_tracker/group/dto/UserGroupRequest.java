package com.utm.gym_tracker.group.dto;
import java.util.List;

public class UserGroupRequest {
    private List<Long> userIds;

    public UserGroupRequest() {}

    public UserGroupRequest(List<Long> userIds) {
        this.userIds = userIds;
    }

    public List<Long> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Long> userIds) {
        this.userIds = userIds;
    }
}