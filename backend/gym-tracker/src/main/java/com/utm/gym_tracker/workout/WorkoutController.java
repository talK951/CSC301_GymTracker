package com.utm.gym_tracker.workout;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.utm.gym_tracker.dto.ApiResponse;
import com.utm.gym_tracker.user.User;
import com.utm.gym_tracker.user.UserService;
import com.utm.gym_tracker.exercise.Exercise;
import com.utm.gym_tracker.exercise.dto.ExerciseResponse;
import com.utm.gym_tracker.workout.dto.WorkoutData;
import com.utm.gym_tracker.workout.dto.WorkoutResponse;

@RestController
@RequestMapping("/api/workout")
public class WorkoutController {
    private final WorkoutService workoutService;
    private final UserService userService;

    @Autowired
    public WorkoutController(WorkoutService workoutService, UserService userService) {
        this.workoutService = workoutService;
        this.userService = userService;
    }

    private User getAuthenticatedUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkoutData>> getWorkoutById(@PathVariable Long id) {
        Optional<Workout> workoutOpt = workoutService.getWorkoutById(id);
        User authUser = getAuthenticatedUser();

        if (!workoutOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Workout workout = workoutOpt.get();
        if (!workoutService.isWorkoutOwnedByUser(workout, authUser.getID())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        WorkoutResponse workoutDTO = mapWorkoutToDto(workout);
        WorkoutData workoutData = new WorkoutData(workoutDTO);
        ApiResponse<WorkoutData> response = new ApiResponse<>("Success", workoutData);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Map<String, List<WorkoutResponse>>>> getWorkoutsForUser(@PathVariable Long userId) {
        Optional<User> userOpt = userService.getUserByID(userId);
        User authUser = getAuthenticatedUser();

        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        if (!authUser.getID().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        List<Workout> workouts = workoutService.getWorkoutsForUser(userId);
        List<WorkoutResponse> workoutDtos = workouts.stream()
                .map(this::mapWorkoutToDto)
                .collect(Collectors.toList());
        
        Map<String, List<WorkoutResponse>> data = new HashMap<>();
        data.put("workouts", workoutDtos);
        
        ApiResponse<Map<String, List<WorkoutResponse>>> response = new ApiResponse<>("Success", data);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WorkoutData>> createWorkout(@RequestBody Workout workout) {
        User authUser = getAuthenticatedUser();
        workout.setUser(authUser);

        if (workout.getExercises() != null) {
            workout.getExercises().forEach(exercise -> {
                exercise.setWorkout(workout);
            });
        }

        Workout createdWorkout = workoutService.createWorkout(workout);

        WorkoutResponse workoutDTO = mapWorkoutToDto(createdWorkout);

        WorkoutData workoutData = new WorkoutData(workoutDTO);
        ApiResponse<WorkoutData> response = new ApiResponse<>("Success", workoutData);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        Optional<Workout> workoutOpt = workoutService.getWorkoutById(id);
        User authUser = getAuthenticatedUser();

        if (!workoutOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Workout workout = workoutOpt.get();
        if (!workoutService.isWorkoutOwnedByUser(workout, authUser.getID())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        workoutService.deleteWorkout(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkoutResponse>> updateWorkout(
            @PathVariable Long id, 
            @RequestBody Workout workoutDetails) {
            
        if (workoutDetails.getId() != null && !workoutDetails.getId().equals(id)) {
            return ResponseEntity.badRequest().build();
        }
        User authUser = getAuthenticatedUser();
        Optional<Workout> workoutOpt = workoutService.getWorkoutById(id);
        if (!workoutOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Workout existingWorkout = workoutOpt.get();
        if (!workoutService.isWorkoutOwnedByUser(existingWorkout, authUser.getID())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        existingWorkout.setStartTime(workoutDetails.getStartTime());
        existingWorkout.setEndTime(workoutDetails.getEndTime());

        if (workoutDetails.getExercises() != null) {
            Map<Long, Exercise> existingExercisesMap = existingWorkout.getExercises().stream()
                    .filter(e -> e.getId() != null)
                    .collect(Collectors.toMap(Exercise::getId, e -> e));
        
            for (Exercise incoming : workoutDetails.getExercises()) {
                if (incoming.getId() != null) {
                    Exercise existingExercise = existingExercisesMap.get(incoming.getId());
                    if (existingExercise != null) {
                        existingExercise.setExercise(incoming.getExercise());
                        existingExercise.setSets(incoming.getSets());
                        existingExercise.setReps(incoming.getReps());
                        existingExercise.setWeight(incoming.getWeight());
                    } else {
                        // Handle the case where the exercise doesn't belong to this workout.
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                    }
                } else {
                    // New exercise
                    incoming.setWorkout(existingWorkout);
                    existingWorkout.getExercises().add(incoming);
                }
            }
        }

        Workout updatedWorkout = workoutService.updateWorkout(existingWorkout);
        WorkoutResponse workoutDto = mapWorkoutToDto(updatedWorkout);
        ApiResponse<WorkoutResponse> apiResponse = new ApiResponse<>("Success", workoutDto);
        return ResponseEntity.ok(apiResponse);
    }

    private WorkoutResponse mapWorkoutToDto(Workout workout) {
        List<ExerciseResponse> exerciseDtos = workout.getExercises().stream()
            .map(exercise -> new ExerciseResponse(
                exercise.getId(),
                exercise.getExercise(),
                exercise.getSets(),
                exercise.getReps(),
                exercise.getWeight(),
                exercise.getCreatedAt()
            ))
            .collect(Collectors.toList());

        return new WorkoutResponse(
            workout.getId(),
            workout.getStartTime(),
            workout.getEndTime(),
            exerciseDtos
        );
    }
}
