package com.utm.gym_tracker.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findById(Long id);

    Optional<User> findByUsername(String username);

    Optional<User> findByUtorID(String utorID);

    Optional<User> findByEmail(String email);
}
