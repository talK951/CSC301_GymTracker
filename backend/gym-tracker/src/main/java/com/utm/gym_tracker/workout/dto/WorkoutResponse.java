package com.utm.gym_tracker.workout.dto;

import java.time.LocalDateTime;
import java.util.List;
import com.utm.gym_tracker.exercise.dto.ExerciseResponse;

public class WorkoutResponse {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<ExerciseResponse> exercises;

    public WorkoutResponse() {}

    public WorkoutResponse(Long id, LocalDateTime startTime, LocalDateTime endTime, List<ExerciseResponse> exercises) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.exercises = exercises;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
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
    public List<ExerciseResponse> getExercises() {
        return exercises;
    }
    public void setExercises(List<ExerciseResponse> exercises) {
        this.exercises = exercises;
    }
}