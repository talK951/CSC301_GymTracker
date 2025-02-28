package com.utm.gym_tracker.group;

import com.utm.gym_tracker.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    Optional<Group> findByName(String name);

    @Query("SELECT u FROM Group g JOIN g.users u WHERE g.id = :groupId AND u.id = :userId")
    Optional<User> findUserInGroup(@Param("groupId") Long groupId, @Param("userId") Long userId);
}
