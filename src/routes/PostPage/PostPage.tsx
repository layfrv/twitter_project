import {useEffect, useMemo, useState} from 'react';
import {useMediaQuery} from 'react-responsive';
import {useHistory, useLocation} from 'react-router-dom';
import {RoutePaths} from '../../constants/routes';
import {getPostById, likedPost} from '../../redux/postsReducer';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import CommentsList from '../../shared/CommentsList';
import Layout from '../../shared/Layout';
import LikeCount from '../../ui/LikeCount';
import Loader from '../../ui/Loader';
import PostDate from '../../ui/PostDate';
import ProfileCardMini from '../../ui/ProfileCardMini';
import ReturnButton from '../../ui/ReturnButton';
import Tag from '../../ui/Tag';
import getFileUrl from '../../utils/getFileUrl';
import isAuthorOfPost from '../../utils/isPublicPost';
import './PostPage.scss';

export default function PostPage() {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const isLoadingPosts = useAppSelector((state) => state.posts.isLoadingPosts);
    const isLoadingComments = useAppSelector(
        (state) => state.posts.isLoadingComments,
    );
    const selectedPost = useAppSelector((state) => state.posts.selectedPost);
    const postStatus = useAppSelector((state) => state.posts.postStatus);

    const location = useLocation();
    const postId = location.pathname.split('/').slice(-1);

    useEffect(() => {
        dispatch(getPostById(postId));
    }, []);

    const [likesCount, setLikesCount] = useState(selectedPost?.likesCount);
    const [isLiked, setLiked] = useState(selectedPost?.isLiked);

    const postImageUrl = getFileUrl(selectedPost?.imageId);

    const avatarUrl = useMemo(() => {
        if (selectedPost !== null && postStatus === 'succeeded') {
            return getFileUrl(selectedPost.creator.avatarId);
        }
        return null;
    }, [selectedPost]);

    const onClickLike = async () => {
        setLiked((prevIsLiked) => !prevIsLiked);
        setLikesCount((prevLikesCount) => isLiked ? prevLikesCount - 1 : prevLikesCount + 1);
        await dispatch(likedPost(postId));
    };

    const returnButtonHandler = () => {
        history.goBack();
    };

    const isAuthor = isAuthorOfPost(selectedPost?.id, selectedPost?.creator.id);

    const profileSubscriptionsHandler = () => {
        history.push(RoutePaths.ROUTE_SUBSCRIPTIONS);
    };

    const isDesktop = useMediaQuery({
        query: '(min-width: 1200px)',
    });

    if (isLoadingPosts || postStatus === 'loading') {
        return <Loader />;
    }

    return (
        <Layout>
            {!selectedPost && <Loader />}
            {postStatus === 'succeeded' && (
                <div className='post-page'>
                    <ReturnButton onClickHandler={returnButtonHandler} />

                    {selectedPost.imageId !== null && (
                        <div className='post-page__image'>
                            <img
                                alt='post'
                                src={postImageUrl}
                                loading='lazy'
                            />
                        </div>
                    )}

                    <div className='post-page__content'>
                        <div className='post-page__content_main'>
                            <div className='post-page__content_main_text'>
                                <h2>{selectedPost.title}</h2>
                                <p>{selectedPost.text}</p>
                                <div className='post-page__content_main_tags'>
                                    {selectedPost.tags?.map((tag: any) => (
                                        <Tag
                                            text={tag.title}
                                            key={tag.title}
                                        />
                                    ))}
                                </div>

                                <div className='post-page__content_main_footer'>
                                    <LikeCount
                                        count={likesCount}
                                        isLiked={isLiked}
                                        onClickHandler={onClickLike}
                                    />

                                    <div className='post-page__content_main_footer_data'>
                                        <PostDate date={selectedPost.createTime} />
                                    </div>
                                </div>
                            </div>

                            <div className='post-page__content_main_profile-card'>
                                <ProfileCardMini
                                    user={selectedPost.creator}
                                    type={isAuthor ? 'thisUser' : 'anotherUser'}
                                    buttonHandler={profileSubscriptionsHandler}
                                />
                            </div>
                        </div>

                        <div className='post-page__content_comments'>
                            {!isLoadingComments && <CommentsList postId={postId} />}
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
