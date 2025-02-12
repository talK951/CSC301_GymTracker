package com.utm.gym_tracker.workout.dto;

import java.time.LocalDateTime;

public class WorkoutResponse {
    private Long id;
    private String exercise;
    private Integer sets;
    private Double weight;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public WorkoutResponse() {}

    public WorkoutResponse(Long id, String exercise, Integer sets, Double weight, LocalDateTime startTime, LocalDateTime endTime) {
        this.id = id;
        this.exercise = exercise;
        this.sets = sets;
        this.weight = weight;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getExercise() {
        return exercise;
    }
    public void setExercise(String exercise) {
        this.exercise = exercise;
    }
    public Integer getSets() {
        return sets;
    }
    public void setSets(Integer sets) {
        this.sets = sets;
    }
    public Double getWeight() {
        return weight;
    }
    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
    public LocalDateTime getEndTime() {
        return endTime;
    }
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}

