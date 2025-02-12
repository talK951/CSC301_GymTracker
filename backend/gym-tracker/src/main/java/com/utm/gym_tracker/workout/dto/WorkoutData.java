package com.utm.gym_tracker.workout.dto;

public class WorkoutData {
    private WorkoutResponse workout;

    public WorkoutData() {}

    public WorkoutData(WorkoutResponse workout) {
        this.workout = workout;
    }

    public WorkoutResponse getWorkout() {
        return workout;
    }

    public void setWorkout(WorkoutResponse workout) {
        this.workout = workout;
    }
}
