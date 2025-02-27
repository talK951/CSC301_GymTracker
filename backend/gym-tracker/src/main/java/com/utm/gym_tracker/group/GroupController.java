package com.utm.gym_tracker.group;

import com.utm.gym_tracker.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.EvaluationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping(path = "/api/group") // TODO
public class GroupController {
    private final GroupService groupService;

    @Autowired
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping()
    public ResponseEntity<List<Group>> getAllGroups() {
        List<Group> groups = this.groupService.getGroups();
        return new ResponseEntity<>(groups, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<Group> getGroupByName(@RequestParam String groupName) {
        Optional<Group> group = this.groupService.getGroupByName(groupName);
        return group.map(value
                    -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(()
                    -> new ResponseEntity<>(HttpStatus.NOT_FOUND)
        );
    }

    @GetMapping()
    public ResponseEntity<Set<User>> getGroupMembers(@RequestParam String groupName) {
        Optional<Group> group = this.groupService.getGroupByName(groupName);
        if (group.isEmpty()) { return new ResponseEntity<>(HttpStatus.NOT_FOUND); }
        Optional<Set<User>> users = this.groupService.getMembers(group.get());
        return users.map(value
                        -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(()
                        -> new ResponseEntity<>(HttpStatus.NOT_FOUND)
        );
    }

    @PostMapping()
    public ResponseEntity<Group> createGroup(@RequestBody Group group) {
        Optional<Group> createdGroup = this.groupService.createGroup(group);
        return createdGroup.map(value
                        -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(()
                        -> new ResponseEntity<>(HttpStatus.CONFLICT)
                );
    }

    @PostMapping()
    public ResponseEntity<User> addUser(@RequestParam String groupName,
                                        @RequestBody User user) {
        Optional<Group> group = this.groupService.getGroupByName(groupName);
        if (group.isEmpty()) { return new ResponseEntity<>(HttpStatus.NOT_FOUND); }
        Optional<User> createdUser = this.groupService.addUser(group.get(), user);
        return createdUser.map(value
                        -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(()
                        -> new ResponseEntity<>(HttpStatus.CONFLICT)
                );
    }
}
