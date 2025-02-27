package com.utm.gym_tracker.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Component
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public List<User> getUsers() {
        return this.userRepository.findAll();
    }

    public Optional<User> registerUser(User user) {
        if (!user.getEmail().contains("@mail.utoronto.ca")) {
            return Optional.empty();
        }
        hashPassword(user);
        System.out.println(user);
        try {
            this.userRepository.save(user);
            return Optional.of(user);
        } catch (DataIntegrityViolationException e) {
            System.out.println(e.getMessage());
            return Optional.empty();
        }
    }

    private void hashPassword(User user) {
        String hashedPassword = this.passwordEncoder
                .encode(user.getPassword());
        user.setPassword(hashedPassword);
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

    public Optional<User> authenticateUser(Long id, String password) {
        Optional<User> user = this.getUserByID(id);
        if (user.isEmpty()) { return user; }

        String userPassword = user.get().getPassword();
        if (passwordEncoder.matches(password, userPassword)) {
            return user;
        }
        return Optional.empty();
    }
}
