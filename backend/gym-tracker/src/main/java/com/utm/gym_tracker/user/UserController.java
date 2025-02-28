package com.utm.gym_tracker.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "${USER_SERVICE_ADDR}")
@RestController
@RequestMapping(path = "/api/user") // TODO
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/auth")
    public ResponseEntity<User> authenticateUser(
            @RequestParam("username") String username,
            @RequestParam("password") String password) {
        Optional<User> user = this.userService.getUserByUsername(username);
        if (user.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Optional<User> authenticatedUser =
                this.userService.authenticateUser(user.get().getID(), password);
        return authenticatedUser.map(value
                        -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(()
                        -> new ResponseEntity<>(HttpStatus.UNAUTHORIZED));
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
