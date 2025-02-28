package com.utm.gym_tracker.group;

import com.utm.gym_tracker.RequestDistributer;
import com.utm.gym_tracker.user.User;
import com.utm.gym_tracker.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.expression.EvaluationException;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestHandler;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.http.HttpClient;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "${GROUP_SERVICE_ADDR}")
@RestController
@RequestMapping(path = "/api/group") // TODO
public class GroupController {

    @Autowired
    private RestTemplate restTemplate;
    private final GroupService groupService;
    private final HttpClient httpClient = HttpClient.newHttpClient();

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
        Set<User> users = group.get().getUsers();
//        System.out.println(group.get());
//        System.out.println(users);
        return new ResponseEntity<>(users, HttpStatus.OK);
//        return users.map(value
//                        -> new ResponseEntity<>(value, HttpStatus.OK))
//                .orElseGet(()
//                        -> new ResponseEntity<>(HttpStatus.NOT_FOUND)
//        );
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
                                        @RequestBody String username) {
//        System.out.println("===============groupName:"+groupName+"=================");
        Optional<Group> group = this.groupService.getGroupByName(groupName);
        if (group.isEmpty()) { return new ResponseEntity<>(HttpStatus.NOT_FOUND); }
        Optional<User> existingUser = this.getUser(username);
        if (existingUser.isEmpty()) { return new ResponseEntity<>(HttpStatus.NOT_FOUND); }
//        System.out.println(existingUser);
        Optional<User> createdUser = this.groupService.addUser(group.get(), existingUser.get());
//        System.out.println(createdUser);
//        System.out.println(group.get());
        this.groupService.createGroup(group.get());
        return createdUser.map(value
                        -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(()
                        -> new ResponseEntity<>(HttpStatus.CONFLICT)
                );
    }

    private Optional<User> getUser(String username) {
        String url = "http://localhost:8080/api/user?username=" + username; // TODO: Placeholder
//        System.out.println(url);
        ResponseEntity<User> response = this.restTemplate.getForEntity(url, User.class);
        if (response.getStatusCode().isError()) {
            return Optional.empty();
        }
        User user = response.getBody();
        if (user == null) {
            return Optional.empty();
        }
        return Optional.of(user);
    }
}
