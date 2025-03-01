package com.utm.gym_tracker.group;

import com.utm.gym_tracker.dto.ApiResponse;
import com.utm.gym_tracker.group.dto.GroupPostResponse;
import com.utm.gym_tracker.group.dto.GroupResponse;
import com.utm.gym_tracker.group.dto.GroupSummary;
import com.utm.gym_tracker.group.dto.UserSummary;
import com.utm.gym_tracker.user.User;
import com.utm.gym_tracker.user.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/api/group")
public class GroupController {
    private final GroupService groupService;
    private final UserService userService;

    @Autowired
    public GroupController(GroupService groupService, UserService userService) {
        this.groupService = groupService;
        this.userService = userService;
    }

    // Returns a list of all groups.
    @GetMapping()
    public ResponseEntity<ApiResponse<List<GroupSummary>>> getAllGroups() {
        List<Group> groups = this.groupService.getGroups();
        List<GroupSummary> summaries = groups.stream()
            .map(g -> new GroupSummary(g.getId(), g.getName()))
            .collect(Collectors.toList());

            ApiResponse<List<GroupSummary>> response = new ApiResponse<>("Success", summaries);
            return ResponseEntity.ok(response);
    }

    // Returns the group with the given name
    @GetMapping("/{groupName}")
    public ResponseEntity<ApiResponse<GroupResponse>>  getGroupByName(@PathVariable String groupName) {
        Optional<Group> groupOpt = this.groupService.getGroupByName(groupName);
        Group group = groupOpt.get();

        GroupResponse addedGroup = new GroupResponse(
            group.getId(),
            group.getName(),
            group.getUsers().stream()
                .map(user -> new UserSummary(user.getID(), user.getUsername(), user.getName(), user.getEmail()))
                .toList()
        );
        ApiResponse<GroupResponse> response = new ApiResponse<>("Success", addedGroup);
        return ResponseEntity.ok(response);
    }

    // Returns all groups that a user is part of.
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<GroupSummary>>> getGroupsForUser(@PathVariable Long userId) {
        Optional<User> userOpt = userService.getUserByID(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        User user = userOpt.get();

        List<Group> groups = groupService.getGroupsForUser(user);
        List<GroupSummary> summaries = groups.stream()
            .map(g -> new GroupSummary(g.getId(), g.getName()))
            .collect(Collectors.toList());

        ApiResponse<List<GroupSummary>> response = new ApiResponse<>("Success", summaries);
        return ResponseEntity.ok(response);
    }

    // Creates a new group.
    @PostMapping()
    public ResponseEntity<ApiResponse<GroupSummary>> createGroup(@RequestBody Group group) {
        Optional<Group> createdGroup = this.groupService.createGroup(group);
        if (createdGroup.isPresent()) {
            Group g = createdGroup.get();
            GroupSummary summary = new GroupSummary(g.getId(), g.getName());
            ApiResponse<GroupSummary> response = new ApiResponse<>("Success", summary);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    // Adds a user to a group.
    @PostMapping("/{groupName}/users")
    public ResponseEntity<ApiResponse<GroupResponse>> addUserToGroup(@PathVariable String groupName,
                                               @RequestBody UserSummary userSummary) {
        Optional<Group> group = groupService.getGroupByName(groupName);
        if (group.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Optional<User> userOpt = userService.getUserByID(userSummary.getId());
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Optional<User> addedUser = groupService.addUser(group.get(), userOpt.get());
        if (addedUser.isPresent()) {
            Group updatedGroup = groupService.getGroupByName(groupName).get();
            
            List<UserSummary> userSummaries = updatedGroup.getUsers().stream()
                .map(user -> new UserSummary(user.getID(), user.getUsername(), user.getName(), user.getEmail()))
                .toList();
    
            GroupResponse groupResponse = new GroupResponse(updatedGroup.getId(), updatedGroup.getName(), userSummaries);
            ApiResponse<GroupResponse> response = new ApiResponse<>("Success", groupResponse);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    // Removes the user from the group.
    @DeleteMapping("/{groupId}/users/{userId}")
    public ResponseEntity<Void> leaveGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        Optional<Group> groupOpt = groupService.getGroupByID(groupId);
        if (groupOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Group group = groupOpt.get();

        Optional<User> userOpt = userService.getUserByID(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        User user = userOpt.get();

        Optional<User> removedUser = groupService.removeUser(group, user);
        if (removedUser.isPresent()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Adds a post to the group.
    @PostMapping("/{groupName}/post")
    public ResponseEntity<ApiResponse<String>> addPostToGroup(@PathVariable String groupName,
                                                @RequestBody String post) {
        Optional<Group> groupOptional = this.groupService.getGroupByName(groupName);
        if (groupOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Group group = groupOptional.get();
        String extractedPost = extractPostsValue(post);
        group.addPost(extractedPost);  // This method was added to the Group entity.

        // Save the updated group. This assumes that groupService has a method to update an existing group.
        Optional<Group> updatedGroup = this.groupService.updateGroup(group);
        if (updatedGroup.isPresent()) {
            ApiResponse<String> response = new ApiResponse<>("Success", extractedPost);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    // Returns a list of posts for a group.
    @GetMapping("/{groupName}/posts")
    public ResponseEntity<ApiResponse<GroupPostResponse>> getPostsForGroup(@PathVariable String groupName) {
        Optional<Group> groupOptional = this.groupService.getGroupByName(groupName);
        if (groupOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Group group = groupOptional.get();
        GroupPostResponse groupPostResponse = new GroupPostResponse(
                group.getId(),
                group.getName(),
                group.getPosts()
        );
        ApiResponse<GroupPostResponse> response = new ApiResponse<>("Success", groupPostResponse);
        return ResponseEntity.ok(response);
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
