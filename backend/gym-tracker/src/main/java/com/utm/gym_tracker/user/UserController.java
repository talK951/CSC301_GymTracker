package com.utm.gym_tracker.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(path = "/api/user") // TODO
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public Optional<User> getUser(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String utorID,
            @RequestParam(required = false) String email) {
        if (username != null) {
            return this.userService.getUserByUsername(username);
        } else if (id != null) {
            return this.userService.getUserByID(id);
        } else if (utorID != null) {
            return this.userService.getUserByUtorID(utorID);
        } else if (email != null) {
            return this.userService.getUserByEmail(email);
        }
        return Optional.empty();
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
