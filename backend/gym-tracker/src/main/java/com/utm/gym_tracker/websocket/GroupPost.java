package com.utm.gym_tracker.websocket;

public class GroupPost {
    private Long groupId;
    private String groupName;
    private String sender;
    private String content;
    private String timestamp;
    private Boolean isImage;
    private String s3ObjectKey;

    public GroupPost() {}

    public GroupPost(Long groupId, String groupName, String sender, String content, String timestamp, String s3ObjectKey, Boolean isImage) {
        this.groupId = groupId;
        this.groupName = groupName;
        this.sender = sender;
        this.content = content;
        this.timestamp = timestamp;
        this.s3ObjectKey = s3ObjectKey;
        this.isImage = isImage;
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

    public String getS3ObjectKey() {
        return s3ObjectKey;
    }
    public void setS3ObjectKey(String s3ObjectKey) {
        this.s3ObjectKey = s3ObjectKey;
    }
    public Boolean getIsImage() {
        return isImage;
    }
    public void setIsImage(Boolean isImage) {
        this.isImage = isImage;
    }

}
