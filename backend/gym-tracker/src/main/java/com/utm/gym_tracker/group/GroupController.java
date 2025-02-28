package com.utm.gym_tracker.group;

import com.utm.gym_tracker.RequestDistributer;
import com.utm.gym_tracker.user.User;
import com.utm.gym_tracker.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.EvaluationException;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestHandler;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "${GROUP_SERVICE_ADDR}")
@RestController
@RequestMapping(path = "/api/group") // TODO
public class GroupController {
    private final GroupService groupService;
    private final RequestDistributer requestDistributer = new RequestDistributer();

    @Autowired
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping()
    public ResponseEntity<List<Group>> getAllGroups() {
        List<Group> groups = this.groupService.getGroups();
        return new ResponseEntity<>(groups, HttpStatus.OK);
    }

    @GetMapping("/{groupName}")
    public ResponseEntity<Group> getGroupByName(@PathVariable String groupName) {
        Optional<Group> group = this.groupService.getGroupByName(groupName);
        return group.map(value
                    -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(()
                    -> new ResponseEntity<>(HttpStatus.NOT_FOUND)
        );
    }

    @GetMapping("/{groupName}/members")
    public ResponseEntity<Set<User>> getGroupMembers(@PathVariable String groupName) {
        Optional<Group> group = this.groupService.getGroupByName(groupName);
        if (group.isEmpty()) { return new ResponseEntity<>(HttpStatus.NOT_FOUND); }
        Optional<Set<User>> users = this.groupService.getMembers(group.get());
        System.out.println(users);
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

    @PostMapping("/{groupName}/members")
    public ResponseEntity<User> addUser(@PathVariable String groupName,
                                        @RequestBody User user) {
        System.out.println("===============groupName:"+groupName+"=================");
        Optional<Group> group = this.groupService.getGroupByName(groupName);
        if (group.isEmpty()) { return new ResponseEntity<>(HttpStatus.NOT_FOUND); }
        Optional<User> createdUser = this.groupService.addUser(group.get(), user);
        System.out.println(createdUser);
        System.out.println(group.get().getUsers());
        return createdUser.map(value
                        -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(()
                        -> new ResponseEntity<>(HttpStatus.CONFLICT)
                );
    }
}
