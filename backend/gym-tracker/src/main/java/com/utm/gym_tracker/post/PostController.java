package com.utm.gym_tracker.post;

import com.utm.gym_tracker.dto.ApiResponse;
import com.utm.gym_tracker.group.Group;
import com.utm.gym_tracker.group.GroupService;
import com.utm.gym_tracker.post.dto.PostResponse;
import com.utm.gym_tracker.user.User;
import com.utm.gym_tracker.user.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final GroupService groupService;
    private final UserService userService;

    @Autowired
    public PostController(PostService postService, GroupService groupService, UserService userService){
        this.postService = postService;
        this.groupService = groupService;
        this.userService = userService;
    }

    // Create a new post
    @PostMapping
    public ResponseEntity<ApiResponse<Post>> createPost(@RequestBody Post post) {
        Post created = postService.createPost(post);
        ApiResponse<Post> response = new ApiResponse<>("Success", created);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get all posts for a specific group (ordered by timestamp)
    @GetMapping("/group/{groupName}")
    public ResponseEntity<ApiResponse<List<PostResponse>>> getPostsForGroup(@PathVariable String groupName) {
        Optional<Group> groupOpt = groupService.getGroupByName(groupName);
        if (groupOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<Post> posts = postService.getPostsForGroup(groupOpt.get().getId());
        List<PostResponse> postResponseList = posts.stream()
                .map(this::mapPostToResponse)
                .collect(Collectors.toList());
        ApiResponse<List<PostResponse>> response = new ApiResponse<>("Success", postResponseList);
        return ResponseEntity.ok(response);
    }

    // Helper method to map a Post entity to a PostResponse DTO.
    private PostResponse mapPostToResponse(Post post) {
    Optional<User> senderOpt = userService.getUserByID(post.getSenderId());
    String senderUsername = senderOpt.map(User::getUsername).orElse("Unknown");

    return new PostResponse(
            post.getId(),
            post.getContent(),
            post.getTimestamp(),
            post.getGroup().getId(),
            post.getGroup().getName(),
            senderUsername,
            post.getS3ObjectKey(),
            post.getIsImage()
    );
}
}
