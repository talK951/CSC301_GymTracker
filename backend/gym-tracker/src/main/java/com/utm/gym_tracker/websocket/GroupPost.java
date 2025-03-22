package com.utm.gym_tracker.websocket;

public class GroupPost {
    private Long groupId;
    private String groupName;
    private String sender;
    private String content;
    private String timestamp;

    public GroupPost() {}

    public GroupPost(Long groupId, String groupName, String sender, String content, String timestamp) {
        this.groupId = groupId;
        this.groupName = groupName;
        this.sender = sender;
        this.content = content;
        this.timestamp = timestamp;
    }

    public Long getGroupId() {return groupId; }

    public void setGroupId(Long groupId) { this.groupId = groupId; }

    public String getGroupName() { return groupName; }

    public void setGroupName(String groupName) { this.groupName = groupName; }
    
    public String getSender() { return sender; }

    public void setSender(String sender) { this.sender = sender; }

    public String getContent() { return content; }

    public void setContent(String content) { this.content = content; }

    public String getTimestamp() { return timestamp; }

    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

}
