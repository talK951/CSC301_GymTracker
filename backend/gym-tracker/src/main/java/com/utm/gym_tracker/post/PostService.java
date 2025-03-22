package com.utm.gym_tracker.post;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    private final PostRepository postRepository;

    @Autowired
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post createPost(Post post) {
        if (post.getTimestamp() == null) {
            post.setTimestamp(LocalDateTime.now());
        }
        return postRepository.save(post);
    }

    public List<Post> getPostsForGroup(Long groupId) {
        return postRepository.findByGroupIdOrderByTimestampAsc(groupId);
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }
}
