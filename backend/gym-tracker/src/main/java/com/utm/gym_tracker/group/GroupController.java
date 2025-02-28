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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
        return createdUser.map(value
                        -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(()
                        -> new ResponseEntity<>(HttpStatus.CONFLICT)
                );
    }

    @PostMapping("/{groupName}/post")
    public ResponseEntity<Group> addPostToGroup(@PathVariable String groupName,
                                                @RequestBody String post) {
        Optional<Group> groupOptional = this.groupService.getGroupByName(groupName);
        if (groupOptional.isEmpty()) {
            System.out.println("Dolphin 1");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Group group = groupOptional.get();
        group.addPost(extractPostsValue(post));  // This method was added to the Group entity.

        // Save the updated group. This assumes that groupService has a method to update an existing group.
        Optional<Group> updatedGroup = this.groupService.updateGroup(group);
        return updatedGroup.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.CONFLICT));
    }

    @GetMapping("/{groupName}/posts")
    public ResponseEntity<List<String>> getPostsForGroup(@PathVariable String groupName) {
        Optional<Group> groupOptional = this.groupService.getGroupByName(groupName);
        if (groupOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<String> posts = groupOptional.get().getPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    private static String extractPostsValue(String input) {
        if (input == null) return null;
        // This regex looks for "posts": "<value>" and captures the value inside the quotes.
        Pattern pattern = Pattern.compile("\"posts\"\\s*:\\s*\"([^\"]*)\"");
        Matcher matcher = pattern.matcher(input);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }


}
