package com.utm.gym_tracker.websocket;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.utm.gym_tracker.group.Group;
import com.utm.gym_tracker.group.GroupService;
import com.utm.gym_tracker.post.Post;
import com.utm.gym_tracker.post.PostService;
import com.utm.gym_tracker.user.User;
import com.utm.gym_tracker.user.UserService;


@Controller
public class GroupChatController {

    private final GroupService groupService;
    private final PostService postService;
    private final UserService userService;
    
    @Autowired
    public GroupChatController(GroupService groupService, PostService postService, UserService userService) {
        this.groupService = groupService;
        this.postService = postService;
        this.userService = userService;
    }

    // Handle incoming messages on /app/chat/{groupName} and broadcasts them to /topic/chat/{groupName}.
    @MessageMapping("/chat/{groupName}")
    @SendTo("/topic/chat/{groupName}")
    public GroupPost sendPost(GroupPost post) throws Exception {
        Optional<Group> groupOpt = groupService.getGroupByName(post.getGroupName());
        if (groupOpt.isPresent()) {
            Group group = groupOpt.get();

            Post newPost = new Post();
            newPost.setGroup(group);

            newPost.setSenderId(Long.parseLong(post.getSender()));
            newPost.setContent(post.getContent());

            if (Boolean.TRUE.equals(post.getIsImage())) {
                newPost.setIsImage(true);
                newPost.setS3ObjectKey(post.getS3ObjectKey()); 
            } else {
                newPost.setIsImage(false);
            }

            newPost.setTimestamp(LocalDateTime.now());

            postService.createPost(newPost);

            Optional<User> sender = userService.getUserByID(Long.parseLong(post.getSender()));
            post.setSender(sender.get().getUsername());
            post.setGroupId(group.getId());
            post.setTimestamp(newPost.getTimestamp().toString());
        
        }
        return post;
        
    }
}
