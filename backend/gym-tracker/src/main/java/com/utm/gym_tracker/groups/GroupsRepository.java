package com.utm.gym_tracker.groups;

import org.apache.catalina.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupsRepository extends JpaRepository<Group, Long> {
    Group findByGroupName(String groupName);
}
