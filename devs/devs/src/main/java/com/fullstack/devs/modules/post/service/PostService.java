package com.fullstack.devs.modules.post.service;

import com.fullstack.devs.modules.post.mapper.PostMapper;
import com.fullstack.devs.modules.post.model.dto.PostRequest;
import com.fullstack.devs.modules.post.model.dto.PostResponse;
import com.fullstack.devs.modules.post.model.entity.Hashtags;
import com.fullstack.devs.modules.post.model.entity.PostHashtags;
import com.fullstack.devs.modules.post.model.entity.PostHashtagsId;
import com.fullstack.devs.modules.post.model.entity.Posts;
import com.fullstack.devs.modules.post.repository.HashtagsRepository;
import com.fullstack.devs.modules.post.repository.PostHastagsRepository;
import com.fullstack.devs.modules.post.repository.PostsRepository;
import com.fullstack.devs.modules.user.model.entity.Users;
import com.fullstack.devs.modules.user.repository.UserRepository;
import com.fullstack.devs.shared.serviec.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class PostService extends BaseService<Posts, Long> {
    private final UserRepository userRepository;
    private final PostsRepository postsRepository;
    private final PostMapper postMapper;
    private final HashtagsRepository hashtagsRepository;
    private final PostHastagsRepository postHashtagsRepository;
    @Override
    protected JpaRepository<Posts, Long> getRepository() {
        return postsRepository;
    }

    /*metodo para que la percistencia del usueraio se solida*/
    private Users getAuthenticated(){
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email).orElseThrow(()-> new RuntimeException("user not found"));
    }
    /*crear nuevo post */

    public PostResponse createPost(PostRequest request){
        Users user = getAuthenticated();
        Posts posts = new Posts();
        posts.setUsers(user);
        posts.setContent(request.getContent());
        posts.setVisible(true);
        Posts saved = postsRepository.save(posts);
        extractAndLinkHashtags(saved);
        return postMapper.toResponse(saved);

    }
    /*obttener todos los post visibles*/
    public List<PostResponse> getGlobalFeed(){
        return postsRepository.findByIsVisibleTrueOrderByCreatedAtDesc()
                .stream()
                .map(postMapper::toResponse)
                .toList();
    }
    /*obtener todos los post de un usuario*/
    public List<PostResponse> getPost(Long idUser){
        return postsRepository.findByUsers_UserIdAndIsVisibleTrueOrderByCreatedAtDesc(idUser)
                .stream()
                .map(postMapper ::toResponse)
                .toList();
    }

    public PostResponse updatePost(Long postId,Long userId, PostRequest request){
        Posts posts = findById(postId);
        //Verifica que el post permanece al usuario que lo edita
        if (!posts.getUsers().getUserId().equals(userId)){
            throw new RuntimeException("not have permissions for edit this file");
        }
        /*posts.setContent(request.getContent());*/
        Posts updated = update(posts);
        extractAndLinkHashtags(posts);
        return  postMapper.toResponse(updated);
    }

    public void deletePost(Long postId, Long userId){
        Posts posts = findById(postId);

        if (!posts.getUsers().getUserId().equals(userId)){
            throw new RuntimeException("Not have permissions for delete this file");
        }
        posts.setVisible(false);
        postsRepository.save(posts);
    }
        public List<PostResponse> getPostByHashtag(String tag){
        Hashtags hashtags = hashtagsRepository
            .findByTag(tag.toLowerCase())
            .orElseThrow(() -> new RuntimeException("Hashtag not found"));

        return postHashtagsRepository.findByHashtagsId(hashtags)
            .stream()
            .map(PostHashtags::getPostsId)
            .map(postMapper::toResponse)
            .toList();
        }
    /*extrae el hashtag y lo vincula al post*/
    private void extractAndLinkHashtags(Posts post){
        Pattern pattern = Pattern.compile("#(\\w+)");
        Matcher matcher = pattern.matcher(post.getContent());


        while (matcher.find()){
            String tag = matcher.group(1).toLowerCase();
            // busca el hashtag o lo crea
            Hashtags hashtags = hashtagsRepository.findByTag(tag)
                    .orElseGet(() ->{
                        Hashtags newTag = new Hashtags();
                        newTag.setTag(tag);
                        return hashtagsRepository.save(newTag);
                    });
            // crea la relacion entre post0hashtag si es que no existe

            PostHashtagsId pivoy = new PostHashtagsId(
                    post.getPostsId(),
                    hashtags.getHashtagsId()
            );
            if (!postHashtagsRepository.existsById(pivoy)){
                PostHashtags postHashtags = new PostHashtags();
                postHashtags.setId(pivoy);
                postHashtags.setPostsId(post);
                postHashtags.setHashtagsId(hashtags);
                postHashtagsRepository.save(postHashtags);
            }
        }

    }

}
