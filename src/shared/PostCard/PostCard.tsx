/* eslint-disable no-console */
import {useMemo, useState} from 'react';
import {useMediaQuery} from 'react-responsive';
import {useHistory} from 'react-router-dom';
import {BASE_URL} from '../../constants/auth';
import {RoutePaths} from '../../constants/routes';
import {GET_FILE} from '../../constants/user';
import {
    deletePost,
    likedPost,
    pinPost,
    selectPost,
    sortPostByPinPost,
    unpinPost,
} from '../../redux/postsReducer';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {TagType} from '../../types/Post';
import {UserType} from '../../types/User';
import DropdownMenu from '../../ui/DropDownMenu';
import LikeCount from '../../ui/LikeCount';
import PostDate from '../../ui/PostDate';
import ProfileCardHeader from '../../ui/ProfileHeader';
import Tag from '../../ui/Tag';
import {ReactComponent as PinIcon} from '../../ui/icons/pin.svg';
import noneAvatar from '../../ui/images/none-avatar.png';
import createNickname from '../../utils/createNickname';
import isAuthorOfPost from '../../utils/isPublicPost';
import './PostCard.scss';

export type PostType = {
id: number;
title: string;
text: string;
creatorId: number;
likesCount: number;
isLiked: boolean;
imageId: number;
tags: TagType[];
createTime: Date;
nickname: string;
creator: UserType;
typePost: 'private' | 'public';
openEditModalHandler?: () => void;
};

export default function PostCard(props: PostType) {
    const dispatch = useAppDispatch();

    const [isLiked, setLiked] = useState(props.isLiked);
    const [likesCount, setLikesCount] = useState(props.likesCount);

    const onClickLike = async () => {
        setLiked(!isLiked);
        // eslint-disable-next-line no-unused-expressions
        isLiked ? setLikesCount(likesCount - 1) : setLikesCount(likesCount + 1);
        await dispatch(likedPost(props.id));
    };

    const pinnedPostIdFromStore = useAppSelector(
        (state) => state.posts.pinnedPostId,
    );

    const isPinnedPost = props.id === pinnedPostIdFromStore;

    const postImage = `${BASE_URL}${GET_FILE}${props.imageId}`;

    const avatarUrl = props?.creator.avatarId
        ? `${BASE_URL}${GET_FILE}${props.creator.avatarId}`
        : noneAvatar;

    const history = useHistory();

    const selectOnClickAndRedirect = async () => {
        await dispatch(selectPost(props.id));
        const newUrl = RoutePaths.ROUTE_POST_ID.replace(':id', props.id.toString());
        await history.push(newUrl);
    };

    const selectOnClick = () => {
        dispatch(selectPost(props.id));
    };

    const deleteHandler = () => {
        dispatch(deletePost());
    };

    const pinPostHandler = () => {
        if (isPinnedPost) {
            dispatch(unpinPost(props.id));
        } else {
            dispatch(pinPost(props.id)).then(() => dispatch(sortPostByPinPost()));
        }
    };

    const dropdownMenuPrivatePostItems = useMemo(
        () => [
            {
                name: isPinnedPost ? 'Открепить пост' : 'Закрепить пост',
                func: pinPostHandler,
            },
            {name: 'Редактировать пост', func: props.openEditModalHandler},
            {name: 'Удалить пост', func: deleteHandler},
        ],
        [props],
    );

    const dropdownMenuPublicPostItems = [
        {
            name: isPinnedPost ? 'Открепить пост' : 'Закрепить пост',
            func: pinPostHandler,
        },
    ];

    const createdNickname = props?.creator.nickname
        ? props.creator.nickname
        : createNickname(props.creator.email);

    const isAuthor = isAuthorOfPost(props.id, props.creatorId);

    const isDesktop = useMediaQuery({
        query: '(min-width: 1200px)',
    });

    const hasImage = props.imageId !== null;

    return (
        <div className={hasImage ? 'post__with-image' : 'post'}>
            {props.typePost === 'public' && !isDesktop && (
                <div
                    className={
                        hasImage
                            ? 'post__with-image__content_header'
                            : 'post__content_header'
                    }
                >
                    <ProfileCardHeader
                        avatarUrl={avatarUrl}
                        firstName={props.creator.firstName}
                        lastName={props.creator.lastName}
                        nickName={createdNickname}
                    />
                    {isPinnedPost && (
                        <PinIcon className='post__content_header_pin-icon' />
                    )}
                    <DropdownMenu
                        items={
                            isAuthor
                                ? dropdownMenuPrivatePostItems
                                : dropdownMenuPublicPostItems
                        }
                        selectOnClick={selectOnClick}
                    />
                </div>
            )}

            {hasImage && (
                <div
                    className='post__with-image__image'
                    onClick={selectOnClickAndRedirect}
                    onKeyDown={selectOnClickAndRedirect}
                    role="link"
                    tabIndex={0}
                >
                    <img
                        alt='post'
                        src={postImage}
                        loading='lazy'
                    />
                </div>
            )}

            <div className={hasImage ? 'post__with-image__content' : 'post__content'}>
                {props.typePost === 'public' && isDesktop && (
                    <div
                        className={
                            hasImage
                                ? 'post__with-image__content_header'
                                : 'post__content_header'
                        }
                    >
                        <ProfileCardHeader
                            avatarUrl={avatarUrl}
                            firstName={props.creator.firstName}
                            lastName={props.creator.lastName}
                            nickName={createdNickname}
                        />

                        {props.typePost === 'public' && isPinnedPost && isDesktop && (
                            <PinIcon className='post__content_header_pin-icon' />
                        )}
                        {props.typePost === 'public' && isDesktop && (
                            <DropdownMenu
                                items={
                                    isAuthor
                                        ? dropdownMenuPrivatePostItems
                                        : dropdownMenuPublicPostItems
                                }
                                selectOnClick={selectOnClick}
                            />
                        )}
                    </div>
                )}

                <div
                    className={
                        hasImage ? 'post__with-image__content_body' : 'post__content_body'
                    }
                >
                    <div
                        className={
                            hasImage
                                ? 'post__with-image__content_body_title'
                                : 'post__content_body_title'
                        }
                    >
                        <h3>{props.title}</h3>
                        {isPinnedPost && props.typePost === 'private' && (
                            <PinIcon className='post__content_header_pin-icon' />
                        )}
                        {props.typePost === 'private' && (
                            <DropdownMenu
                                items={dropdownMenuPrivatePostItems}
                                selectOnClick={selectOnClick}
                            />
                        )}
                    </div>

                    <p className={hasImage ? 'post__with-image__content_body_text' : 'post__content_body_text'}>
                        {props.text}
                    </p>
                    <div className='post__content_body_tags'>
                        {props.tags?.map((tag: any) => (
                            <Tag
                                text={tag.title}
                                key={tag.title}
                            />
                        ))}
                    </div>
                </div>

                <div
                    className={
                        hasImage
                            ? 'post__with-image__content_footer'
                            : 'post__content_footer'
                    }
                >
                    <LikeCount
                        count={likesCount}
                        isLiked={isLiked}
                        onClickHandler={onClickLike}
                    />
                    <div className='post__content_footer_data'>
                        <PostDate date={props.createTime} />
                    </div>
                </div>
            </div>
        </div>
    );
}
