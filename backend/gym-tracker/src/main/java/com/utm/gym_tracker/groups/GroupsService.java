package com.utm.gym_tracker.groups;

import com.utm.gym_tracker.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.beans.Transient;
import java.util.List;
import java.util.Optional;

@Component
public class GroupsService {
    private final GroupsRepository groupsRepository;

    @Autowired
    public GroupsService(GroupsRepository groupsRepository) {
        this.groupsRepository = groupsRepository;
    }

    public List<Group> getGroups() {
        return groupsRepository.findAll();
    }

    public List<Group> getGroupByName(String groupName) {
        return groupsRepository.findAll().stream().filter(group -> group.getGroupName().equals(groupName)).toList();
    }

    public Group addGroup(Group group) {
        groupsRepository.save(group);
        return group;
    }

    public Group addPost(String groupName, String post) {
        Optional<Group> group = groupsRepository.findById(groupName);

        if (group.isPresent()) {
            Group g = group.get();
            g.addPost(post);
            groupsRepository.save(g);
            return g;
        }
        return null;
    }

    public List<String> getPosts(String groupName) {
        Optional<Group> group = groupsRepository.findById(groupName);

        if (group.isPresent()) {
            Group g = group.get();
            return g.getPosts();
        }
        return null;
    }

    public List<User> getMemebers(String groupName) {
        Optional<Group> group = groupsRepository.findById(groupName);

        if (group.isPresent()) {
            Group g = group.get();
            return g.getUsers();
        }
        return null;
    }
}
