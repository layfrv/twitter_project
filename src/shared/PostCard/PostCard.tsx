/* eslint-disable no-console */
import {useMemo, useState} from 'react';
import {useMediaQuery} from 'react-responsive';
import {useHistory} from 'react-router-dom';
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
import Tag from '../../ui/Tag';
import {ReactComponent as PinIcon} from '../../ui/icons/pin.svg';
import noneAvatar from '../../ui/images/none-avatar.png';
import createNickname from '../../utils/createNickname';
import isAuthorOfPost from '../../utils/isPublicPost';
import ProfileCardHeader from '../ProfileHeader';
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
  nickname?: string;
  creator: UserType;
  typePost: 'private' | 'public';
  openEditModalHandler?: () => void;
  hasMenu: boolean;
};

export default function PostCard(props: PostType) {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const userId = useAppSelector((state) => state.user.user.id);

    const [isLiked, setLiked] = useState(props.isLiked);
    const [likesCount, setLikesCount] = useState(props.likesCount);

    const pinnedPostIdFromStore = useAppSelector(
        (state) => state.posts.pinnedPostId,
    );

    const isPinnedPost = props.id === pinnedPostIdFromStore;

    const pinPostHandler = () => {
        if (isPinnedPost) {
            dispatch(unpinPost(props.id));
        } else {
            dispatch(pinPost(props.id)).then(() => dispatch(sortPostByPinPost()));
        }
    };

    const deleteHandler = () => {
        dispatch(deletePost());
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

    const isDesktop = useMediaQuery({
        query: '(min-width: 1200px)',
    });

    if (props.creator === null) {
        return null;
    }

    const onClickLike = async () => {
        setLiked(!isLiked);
        // eslint-disable-next-line no-unused-expressions
        isLiked ? setLikesCount(likesCount - 1) : setLikesCount(likesCount + 1);
        await dispatch(likedPost(props.id));
    };

    const selectOnClick = () => {
        dispatch(selectPost(props.id));
    };

    const selectOnClickAndRedirectPost = async () => {
        await dispatch(selectPost(props.id));
        const newUrl = RoutePaths.ROUTE_POST_ID.replace(':id', props.id.toString());
        await history.push(newUrl);
    };

    const createdNickname = props.creator?.nickname !== null
        ? props.creator.nickname
        : createNickname(props.creator?.email);

    const postImage = `${process.env.REACT_APP_BACKEND_URL}${GET_FILE}${props.imageId}`;

    const avatarUrl = props.creator?.avatarId !== null
        ? `${process.env.REACT_APP_BACKEND_URL}${GET_FILE}${props.creator.avatarId}`
        : noneAvatar;

    const isAuthor = isAuthorOfPost(props.creator.id, userId);

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
                        userId={props.creator.id}
                        avatarUrl={avatarUrl}
                        firstName={props.creator.firstName}
                        lastName={props.creator.lastName}
                        nickName={createdNickname}
                    />
                    {isPinnedPost && (
                        <PinIcon className="post__content_header_pin-icon" />
                    )}
                    {props.hasMenu && (
                        <div className="post__content_header_menu">
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
                </div>
            )}

            {hasImage && (
                <div
                    className="post__with-image__image"
                    onClick={selectOnClickAndRedirectPost}
                    onKeyDown={selectOnClickAndRedirectPost}
                    role="link"
                    tabIndex={0}
                >
                    <img
                        alt="post"
                        src={postImage}
                        loading="lazy"
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
                            userId={props.creator.id}
                            avatarUrl={avatarUrl}
                            firstName={props.creator.firstName}
                            lastName={props.creator.lastName}
                            nickName={createdNickname}
                        />

                        {props.typePost === 'public' && isPinnedPost && isDesktop && (
                            <div className="post__content_header_pin-icon">
                                <PinIcon />
                            </div>
                        )}
                        {props.hasMenu && props.typePost === 'public' && isDesktop && (
                            <div className="post__content_header_menu">
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
                                ? 'post__with-image__content_body_header'
                                : 'post__content_body_header'
                        }
                    >
                        <div
                            className={
                                hasImage
                                    ? 'post__with-image__content_body_header_title'
                                    : 'post__content_body_header_title'
                            }
                        >
                            <h3>{props.title}</h3>
                        </div>
                        {isPinnedPost && props.typePost === 'private' && (
                            <div className="post__content_body_pin-icon">
                                <PinIcon />
                            </div>
                        )}
                        {props.hasMenu && props.typePost === 'private' && (
                            <div className="post__content_body_menu">
                                <DropdownMenu
                                    items={dropdownMenuPrivatePostItems}
                                    selectOnClick={selectOnClick}
                                />
                            </div>
                        )}
                    </div>

                    <p
                        className={
                            hasImage
                                ? 'post__with-image__content_body_text'
                                : 'post__content_body_text'
                        }
                    >
                        {props.text}
                    </p>
                    <div className="post__content_body_tags">
                        {props.tags?.map((tag: any) => (
                            <Tag
                                text={tag.title}
                                key={tag.title}
                                primary
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
                    <div className="post__content_footer_data">
                        <PostDate date={props.createTime} />
                    </div>
                </div>
            </div>
        </div>
    );
}
