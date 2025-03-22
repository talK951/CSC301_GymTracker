package com.utm.gym_tracker.post.dto;

import java.time.LocalDateTime;

public class PostResponse {
    private Long id;
    private String content;
    private LocalDateTime timestamp;
    private Long groupId;
    private String groupName;
    private String senderUsername; 

    public PostResponse() {}

    public PostResponse(Long id, String content, LocalDateTime timestamp, Long groupId, String groupName, String senderUsername) {
        this.id = id;
        this.content = content;
        this.timestamp = timestamp;
        this.groupId = groupId;
        this.groupName = groupName;
        this.senderUsername = senderUsername;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }
    public String getSenderUsername() { return senderUsername; }
    public void setSenderUsername(String senderUsername) { this.senderUsername = senderUsername; }
}