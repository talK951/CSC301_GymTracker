package com.utm.gym_tracker.groups;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface GroupsRepository extends JpaRepository<Group, String> {
    ArrayList<String> getGroupUsersByGroupName(String groupName);
    ArrayList<String> getPostsByGroupName(String groupName);
}
