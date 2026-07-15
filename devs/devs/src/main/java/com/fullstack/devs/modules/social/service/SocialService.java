package com.fullstack.devs.modules.social.service;

import com.fullstack.devs.modules.post.model.entity.Posts;
import com.fullstack.devs.modules.post.repository.PostsRepository;
import com.fullstack.devs.modules.social.mapper.SocialMapper;
import com.fullstack.devs.modules.social.model.dto.CommentRequest;
import com.fullstack.devs.modules.social.model.dto.CommentResponse;
import com.fullstack.devs.modules.social.model.dto.LikeResponse;
import com.fullstack.devs.modules.social.model.entity.Comments;
import com.fullstack.devs.modules.social.model.entity.PostLikes;
import com.fullstack.devs.modules.social.model.entity.PostLikesId;
import com.fullstack.devs.modules.social.repository.CommentsLikesRepository;
import com.fullstack.devs.modules.social.repository.CommentsRepository;
import com.fullstack.devs.modules.social.repository.PostLikesRepository;
import com.fullstack.devs.modules.user.model.entity.Users;
import com.fullstack.devs.modules.user.repository.UserRepository;
import com.fullstack.devs.shared.events.concrectEvents.PostLikeEvent;
import com.fullstack.devs.shared.serviec.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SocialService extends BaseService<Comments,Long> {
    private final UserRepository userRepository;
    private final PostsRepository postsRepository;
    private final PostLikesRepository postLikesRepository;
    private final CommentsLikesRepository commentsLikesRepository;
    private final CommentsRepository commentsRepository;
    private final SocialMapper socialMapper;
    private  final ApplicationEventPublisher eventPublisher;

    @Override
    protected JpaRepository<Comments, Long> getRepository() {
        return commentsRepository;
    }

    private Users getAuthenticate(){
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email).orElseThrow(()-> new RuntimeException("User not found"));
    }

    private CommentResponse toCommentResponse(Comments comment) {
        int likesCount = (int) commentsLikesRepository.countByCommentId_CommentsId(comment.getCommentsId());
        return socialMapper.toResponse(comment, likesCount);
    }

    /*Crear un nuevo comentario*/
    public CommentResponse createdComment(Long postId, CommentRequest request){
        Users user = getAuthenticate();
        Posts post = postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comments comments = socialMapper.toEntity(request);
        comments.setUsers(user);
        comments.setPosts(post);

        Comments saved = commentsRepository.save(comments);
        return toCommentResponse(saved);
    }

    /*ver el contenido de un comentario*/
    public  CommentResponse getComment(Long commentId){
        Comments comment = findById(commentId);
        return toCommentResponse(comment);
    }

    /*actualizar comentario*/
    public CommentResponse updateComment(Long commentId, CommentRequest request){
        Users user = getAuthenticate();
        Comments comment = commentsRepository
                .findByCommentsIdAndUsers_UserId(commentId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("Comment not found or not owned by user"));

        comment.setContent(request.getContent());
        Comments saved = commentsRepository.save(comment);
        return toCommentResponse(saved);
    }

    /*eliminar comentario*/
    @Transactional
    public void deleteComment(Long commentId) {
        Users user = getAuthenticate();
        Comments comment = commentsRepository
                .findByCommentsIdAndUsers_UserId(commentId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("Comment not found or not owned by user"));
        commentsLikesRepository.deleteByCommentId_CommentsId(commentId);
        commentsRepository.delete(comment);
    }

    /*ver todos los comentarios de un post*/
    public List<CommentResponse> getCommentsByPost(Long postId) {
        if (!postsRepository.existsById(postId)) {
            throw new RuntimeException("Post not found");
        }
        return commentsRepository.findByPosts_PostsId(postId)
                .stream()
                .map(this::toCommentResponse)
                .toList();
    }

    /*ver todos los likes de un post*/
    public List<LikeResponse> getPostLikes(Long postId) {
        if (!postsRepository.existsById(postId)) {
            throw new RuntimeException("Post not found");
        }
        return postLikesRepository.findByPosts_PostsId(postId)
                .stream()
                .map(socialMapper::postLikeToResponse)
                .toList();
    }

    /*likes de post */
    public LikeResponse likePost(Long postId){
        Users actor = getAuthenticate();
        Posts posts = postsRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

        PostLikesId id = new PostLikesId(actor.getUserId(), postId);
        if (postLikesRepository.existsById(id)){
            throw new RuntimeException("Already liked this post");
        }

        //save the like
        PostLikes likes  =  new PostLikes();
        likes.setId(id);
        likes.setUsers(actor);
        likes.setPosts(posts);
        postLikesRepository.save(likes);
        // publica el  evento , notificando si el actor no es el dueno del post
        if (!actor.getUserId().equals(posts.getUsers().getUserId())){
            eventPublisher.publishEvent(new PostLikeEvent(this,actor.getUSerId(),posts.getUsers().getUSerId(),postId));
        }
        return buildLikeResponse(actor, postId, "POST");
    }



    /*ver todos los likes de un comentario*/
    public List<LikeResponse> getCommentLikes(Long commentId) {
        if (!commentsRepository.existsById(commentId)) {
            throw new RuntimeException("Comment not found");
        }
        return commentsLikesRepository.findByCommentId_CommentsId(commentId)
                .stream()
                .map(socialMapper::commentsLikeToResponse)
                .toList();
    }

}
