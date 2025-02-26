package com.utm.gym_tracker.user.dto;

import java.util.List;

import com.utm.gym_tracker.workout.dto.WorkoutResponse;

public class UserResponse {
    private Long id;
    private String username;
    private String name;
    private String utorID;
    private String email;
    private String profilePicture;
    private List<WorkoutResponse> workouts;

    public UserResponse() {}

    public UserResponse(Long id, String username, String name, String utorID, String email, String profilePicture, List<WorkoutResponse> workouts) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.utorID = utorID;
        this.email = email;
        this.profilePicture = profilePicture;
        this.workouts = workouts;
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
    public String getUtorID() {
        return utorID;
    }
    public void setUtorID(String utorID) {
        this.utorID = utorID;
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
    public List<WorkoutResponse> getWorkouts() {
        return workouts;
    }
    public void setWorkouts(List<WorkoutResponse> workouts) {
        this.workouts = workouts;
    }
}
