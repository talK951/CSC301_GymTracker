package com.utm.gym_tracker.group;

import com.utm.gym_tracker.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Component
public class GroupService {
    private final GroupRepository groupRepository;

    @Autowired
    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public List<Group> getGroups() {
        return this.groupRepository.findAll();
    }

    public Optional<Group> createGroup(Group group) {
        try {
            Group savedGroup = this.groupRepository.save(group);
            return Optional.of(savedGroup);
        } catch (DataIntegrityViolationException e) {
            System.out.println("Error creating group: " + e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<Group> getGroupByName(String name) {
        return this.groupRepository.findByName(name);
    }

    public Optional<Group> getGroupByID(Long id) {
        return this.groupRepository.findById(id);
    }

    public List<Group> getGroupsForUser(User user) {
        return groupRepository.findByUsersContaining(user);
    }

    public Optional<Set<User>> getMembers(Group group) {
        Set<User> users = group.getUsers();
        if (users.isEmpty()) { 
            return Optional.empty(); 
        }
        return Optional.of(users);
    }

    public Optional<User> addUser(Group group, User user) {
        Optional<Group> groupOpt = this.groupRepository.findByName(group.getName());
        if (groupOpt.isEmpty()) {
            System.out.println("Group not found: " + group.getName());
            return Optional.empty();
        }
        Group storedGroup = groupOpt.get();
        if (!storedGroup.equals(group)) {
            System.out.println("Group mismatch for: " + group.getName());
            return Optional.empty();
        }

        Optional<User> existingUser = storedGroup.getUserByID(user.getID());
        if (existingUser.isPresent()) {
            System.out.println("User already exists in group: " + user.getID());
            return Optional.empty();
        }

        storedGroup.addUser(user);
        groupRepository.save(storedGroup);
        return Optional.of(user);
    }

    public Optional<User> removeUser(Group group, User user) {
        Optional<Group> groupOpt = this.groupRepository.findByName(group.getName());
        if (groupOpt.isEmpty()) {
            System.out.println("Group not found: " + group.getName());
            return Optional.empty();
        }
        Group storedGroup = groupOpt.get();
        if (!storedGroup.getUsers().removeIf(u -> u.getID().equals(user.getID()))) {
            System.out.println("User not found in group: " + user.getID());
            return Optional.empty();
        }
        groupRepository.save(storedGroup);
        return Optional.of(user);
    }

    public Optional<Group> updateGroup(Group group) {
        try {
            Group updatedGroup = this.groupRepository.save(group);
            return Optional.of(updatedGroup);
        } catch (DataIntegrityViolationException e) {
            System.out.println("Error updating group: " + e.getMessage());
            return Optional.empty();
        }
    }
}
