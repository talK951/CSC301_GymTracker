package com.utm.gym_tracker.exercise.dto;

import java.time.LocalDateTime;

public class ExerciseResponse {
    private Long id;
    private String exercise;
    private Integer sets;
    private Integer reps;
    private Double weight;
    private LocalDateTime createdAt;

    public ExerciseResponse() {}

    public ExerciseResponse(Long id, String exercise, Integer sets, Integer reps, Double weight, LocalDateTime createdAt) {
        this.id = id;
        this.exercise = exercise;
        this.sets = sets;
        this.reps = reps;
        this.weight = weight;
        this.createdAt = createdAt;
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
    public Integer getReps() {
        return reps;
    }
    public void setReps(Integer reps) {
        this.reps = reps;
    }
    public Double getWeight() {
        return weight;
    }
    public void setWeight(Double weight) {
        this.weight = weight;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
