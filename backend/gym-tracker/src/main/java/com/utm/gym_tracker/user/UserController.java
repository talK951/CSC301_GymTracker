package com.utm.gym_tracker.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.utm.gym_tracker.security.JwtResponse;
import com.utm.gym_tracker.security.JwtService;
import com.utm.gym_tracker.user.dto.LoginRequest;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:8081")
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

    // @GetMapping("/auth")
    // public ResponseEntity<User> authenticateUser(
            // @RequestParam("username") String username,
            // @RequestParam("password") String password) {
        // Optional<User> user = this.userService.getUserByUsername(username);
        // if (user.isEmpty()) {
            // return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        // }
        // Optional<User> authenticatedUser =
                // this.userService.authenticateUser(user.get().getID(), password);
        // return authenticatedUser.map(value
                        // -> new ResponseEntity<>(value, HttpStatus.OK))
                // .orElseGet(()
                        // -> new ResponseEntity<>(HttpStatus.UNAUTHORIZED));
    // }
    
    @PostMapping("/auth")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> user = userService.getUserByUsername(loginRequest.getUsername());
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Optional<User> authenticatedUser =
                userService.authenticateUser(user.get().getID(), loginRequest.getPassword());
        if (authenticatedUser.isPresent()) {
            // Generate JWT token
            String token = jwtService.generateToken(authenticatedUser.get());
            System.out.println(token);
            return ResponseEntity.ok(new JwtResponse(token));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping()
    public ResponseEntity<User> getUserByEmail(
            @RequestParam("email") String email) {
        Optional<User> user = this.userService.getUserByEmail(email);
        return user.map(value
                        -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(()
                        -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
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
}
