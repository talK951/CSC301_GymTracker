package com.utm.gym_tracker.workout;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WorkoutService {
    private final WorkoutRepository workoutRepository;

    @Autowired
    public WorkoutService(WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }

    // Retrieve a workout by its ID
    public Optional<Workout> getWorkoutById(Long workoutId) {
        return workoutRepository.findById(workoutId);
    }

    // Retrieve all workouts for a specific user
    public List<Workout> getWorkoutsForUser(Long userId) {
        return workoutRepository.findByUserId(userId);
    }

    // Create a workout
    public Workout createWorkout(Workout workout) {
        if (workout.getStartTime().isAfter(workout.getEndTime())) {
            throw new IllegalArgumentException("Start time cannot be after end time");
        }

        return workoutRepository.save(workout);
    }

    // Update an existing workout
    public Workout updateWorkout(Workout workout) {
        Optional<Workout> existingWorkout = workoutRepository.findById(workout.getId());
        if (existingWorkout.isPresent()) {
            return workoutRepository.save(workout);
        } else {
            throw new RuntimeException("Workout not found with id " + workout.getId());
        }
    }

    // Delete a workout by its ID
    public void deleteWorkout(Long workoutId) {
        workoutRepository.deleteById(workoutId);
    }

    // Verify that workout is owned by user
    public boolean isWorkoutOwnedByUser(Workout workout, Long userId) {
        return workout.getUser().getID().equals(userId);
    }
}
