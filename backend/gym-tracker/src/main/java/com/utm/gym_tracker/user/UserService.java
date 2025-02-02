package com.utm.gym_tracker.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getUsers() {
        return this.userRepository.findAll();
    }

    public Optional<User> registerUser(User user) {
//        Optional<User> existingUser = this.findUser(user);
//        if (existingUser.isPresent()) {
//            return existingUser;
//        }
        try {
            this.userRepository.save(user);
            return Optional.of(user);
        } catch (DataIntegrityViolationException e) {
            System.out.println(e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<User> getUserByUsername(String username) {
        return this.userRepository.findByUsername(username);
    }

    public Optional<User> getUserByID(Long id) {
        return this.userRepository.findById(id.toString());
    }

    public Optional<User> getUserByUtorID(String utorID) {
        return this.userRepository.findByUtorID(utorID);
    }

    public Optional<User> getUserByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    public Optional<User> findUser(User user) {
        return this.userRepository.findById(user.getID());
    }
}
