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

//    public Optional<Group> getGroupByName(String name) {
//        return this.groupRepository.findByName(name);
//    }
//
//    public Optional<Group> getGroupsByMember(String member) {
//        return this.groupRepository.findByMember(member);
//    }

    public Optional<Set<User>> getMembers(String groupName) {
        Optional<Group> group = this.groupRepository.findByName(groupName);
        if (group.isEmpty()) { return Optional.empty(); }
        Set<User> users = group.get().getUsers();
        if (users.isEmpty()) { return Optional.empty(); }
        return Optional.of(users);
    }
}
