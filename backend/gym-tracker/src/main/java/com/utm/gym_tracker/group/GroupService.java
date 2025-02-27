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
            this.groupRepository.save(group);
            return Optional.of(group);
        } catch (DataIntegrityViolationException e) {
            System.out.println(e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<Group> getGroupByName(String name) {
        return this.groupRepository.findByName(name);
    }

    public Optional<Set<User>> getMembers(Group group) {
        Set<User> users = group.getUsers();
        if (users.isEmpty()) { return Optional.empty(); }
        return Optional.of(users);
    }

    public Optional<User> addUser(Group group, User user) {
        Optional<Group> existingGroup = this.groupRepository.findByName(group.getName());
        if (existingGroup.isEmpty()) {
            return Optional.empty();
        }
        if (!existingGroup.get().equals(group)) {
            return Optional.empty();
        }
        existingGroup.get().addUser(user);
        return Optional.of(user);
    }
}
