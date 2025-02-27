package com.utm.gym_tracker.groups;

import com.utm.gym_tracker.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "/api/groups")
public class GroupsController {
    private final GroupsService groupsService;

    @Autowired
    public GroupsController(GroupsService groupsService) {
        this.groupsService = groupsService;
    }

    @GetMapping
    public List<User> getUsersFromGroup(@RequestParam(required = false) String groupName) {
        if (groupName != null) {
            return groupsService.getMemebers(groupName);
        }
        return null;
    }

    @PostMapping
    public ResponseEntity<Group> addGroup(@RequestParam Group group) {
        Group createdGroup = groupsService.addGroup(group);
        return new ResponseEntity<>(createdGroup, HttpStatus.CREATED);
    }

}
