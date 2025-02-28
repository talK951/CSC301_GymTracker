package com.utm.gym_tracker.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.utm.gym_tracker.dto.ApiResponse;
import com.utm.gym_tracker.exercise.dto.ExerciseResponse;
import com.utm.gym_tracker.group.dto.UserSummary;
import com.utm.gym_tracker.security.JwtResponse;
import com.utm.gym_tracker.security.JwtService;
import com.utm.gym_tracker.user.dto.LoginRequest;
import com.utm.gym_tracker.user.dto.UserResponse;
import com.utm.gym_tracker.workout.Workout;
import com.utm.gym_tracker.workout.dto.WorkoutResponse;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/api/user")
public class UserController {
    private final UserService userService;
    private final JwtService jwtService;

    @Autowired
    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    
    @PostMapping("/auth")
    public ResponseEntity<ApiResponse<JwtResponse>> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> user = userService.getUserByUsername(loginRequest.getUsername());
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Optional<User> authenticatedUser =
                userService.authenticateUser(user.get().getID(), loginRequest.getPassword());
        if (authenticatedUser.isPresent()) {
            // Generate JWT token
            String token = jwtService.generateToken(authenticatedUser.get());

            JwtResponse jwtResponse = new JwtResponse(token, "Bearer", jwtService.getJwtExpirationMs() / 1000);
            ApiResponse<JwtResponse> response = new ApiResponse<>("Success", jwtResponse);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/email")
    public ResponseEntity<ApiResponse<UserResponse>> getUserByEmail(
            @RequestParam("email") String email) {
        Optional<User> userOpt = this.userService.getUserByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        User user = userOpt.get();

        List<WorkoutResponse> workoutDTOs = user.getWorkouts().stream()
        .map(this::mapWorkoutToDto)
        .collect(Collectors.toList());
        
        UserResponse userResponse = new UserResponse(
            user.getID(),
            user.getUsername(),
            user.getName(),
            user.getUtorID(),
            user.getEmail(),
            user.getProfilePicture(),
            workoutDTOs
        );

        ApiResponse<UserResponse> response = new ApiResponse<>("Success", userResponse);
        return ResponseEntity.ok(response);
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<UserSummary>>> getUsers() {
        List<User> users = this.userService.getUsers();
        if (users.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<UserSummary> userSummaries = users.stream()
        .map(user -> new UserSummary(
                user.getID(),
                user.getUsername(),
                user.getName(),
                user.getEmail()
        ))
        .collect(Collectors.toList());

        ApiResponse<List<UserSummary>> response = new ApiResponse<>("Success", userSummaries);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody User user) {
        Optional<User> createdUser = this.userService.registerUser(user);
        return createdUser.map(value
                -> new ResponseEntity<>(value, HttpStatus.CREATED))
                    .orElseGet(()
                -> new ResponseEntity<>(HttpStatus.CONFLICT));
    }

//    @PutMapping
//    public ResponseEntity<User> updateUser(@RequestParam User user) {
//        User updatedUser = this.userService.modifyUser(user);
//    }

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
