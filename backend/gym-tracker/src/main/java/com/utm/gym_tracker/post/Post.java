package com.utm.gym_tracker.post;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.utm.gym_tracker.group.Group;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @Column(nullable = false)
    private Long senderId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // @Column(columnDefinition = "TEXT")
    // private String imageUrl;
    @Column
    private String s3ObjectKey;

    @Column
    private Boolean isImage;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public Post() {}

    public Post(Group group, Long senderId, String content, LocalDateTime timestamp) {
        this.group = group;
        this.senderId = senderId;
        this.content = content;
        this.timestamp = timestamp;
        this.isImage = false; 
    }

    public Long getId() {
        return id;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group groupId) {
        this.group = groupId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

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

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
