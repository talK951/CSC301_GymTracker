package com.utm.gym_tracker.group.dto;

public class UserSummary {
    private Long id;
    private String username;
    private String name;
    private String email;
    private String profilePicture;

    public UserSummary() {}

    public UserSummary(Long id, String username, String name, String email, String profilePicture) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.profilePicture = profilePicture;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getProfilePicture() {
        return profilePicture;
    }
    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}