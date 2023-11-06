import {useEffect, useState} from 'react';
import {
    filterPostsByTag,
    getAllPostsFeed,
    getTags,
    getUserPostsFeed,
    sortPostByPinPost,
} from '../../redux/postsReducer';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import EditPostModal from '../../shared/EditPostModal';
import Layout from '../../shared/Layout';
import PostCard from '../../shared/PostCard';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import Tag from '../../ui/Tag';
import './NewsPage.scss';

export default function NewsPage() {
    const {postsFeedByTag, tags, error} = useAppSelector(
        (state) => state.posts,
    );
    const isLoadingPosts = useAppSelector(state => state.posts.isLoadingPosts);
    const postsUserFeed = useAppSelector((state) => state.posts.postsUserFeed);
    const postsAllFeed = useAppSelector((state) => state.posts.postsAllFeed);

    const dispatch = useAppDispatch();

    const [typeNews, setTypeNews] = useState('userNews');

    const getUserNews = async () => {
        await dispatch(getUserPostsFeed()).then(() => dispatch(sortPostByPinPost()));
        dispatch(getTags());
    };

    const getAllNews = async () => {
        await dispatch(getAllPostsFeed()).then(() => dispatch(sortPostByPinPost()));
        dispatch(getTags());
    };

    useEffect(() => {
        if (typeNews === 'userNews') {
            getUserNews();
        }
        if (typeNews === 'allNews') {
            getAllNews();
        }
    }, [typeNews]);

    const [isOpenEditPostModal, setOpenEditPostModal] = useState(false);
    const openEditModalHandler = () => setOpenEditPostModal(!isOpenEditPostModal);

    const [isVisibleTags, setVisibleTags] = useState(false);
    const visibleTagsHandler = () => {
        setVisibleTags(!isVisibleTags);
    };

    const [isActiveTag, setActiveTag] = useState(null);
    const tagFilterHandler = (tag) => {
        dispatch(filterPostsByTag({title: tag.title, typeNews}));
        setActiveTag(tag.id);
    };

    const resetTagsHandler = () => {
        setActiveTag(null);
        dispatch(sortPostByPinPost());
    };

    const userNewsTitleStyle = typeNews === 'userNews' ? '800' : '400';
    const allNewsTitleStyle = typeNews === 'allNews' ? '800' : '400';

    return (
        <Layout>
            <div className='news-page'>
                <div className='news-page__header'>
                    <div className='news-page__header_headers'>
                        <button
                            onClick={() => setTypeNews('userNews')}
                            style={{cursor: 'pointer'}}
                        >
                            <h2 style={{fontWeight: userNewsTitleStyle}}>Мои новости</h2>
                        </button>
                        <button
                            onClick={() => setTypeNews('allNews')}
                            style={{cursor: 'pointer'}}
                        >
                            <h2 style={{fontWeight: allNewsTitleStyle}}>Все новости</h2>
                        </button>
                    </div>
                    <Button
                        label='Поиск постов по тегам'
                        secondary
                        onClick={visibleTagsHandler}
                        width='200px'
                    />

                </div>

                {isLoadingPosts && <Loader />}
                {error && <h3>Ошибка загрузки</h3>}
                {!isLoadingPosts && !error && (
                    <div className='news-page__content'>
                        {isVisibleTags
                        && (
                            <div className="news-page__content_tags">
                                <div
                                    style={{marginBottom: '20px'}}
                                    className="news-page__content_tags"
                                >
                                    {tags.map((tag) => (
                                        <button
                                            onClick={() => tagFilterHandler(tag)}
                                            key={Math.random() * 100}
                                            style={{cursor: 'pointer'}}
                                        >

                                            <Tag
                                                text={tag.title}
                                                secondary
                                                isActiveTag={isActiveTag === tag.id}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    label='Все посты'
                                    secondary
                                    onClick={resetTagsHandler}
                                />
                            </div>
                        )}

                        {isActiveTag !== null && postsFeedByTag.map((post) => (
                            <PostCard
                                hasMenu
                                typePost='public'
                                {...post}
                                key={post.id}
                                openEditModalHandler={openEditModalHandler}
                            />
                        ))}

                        {isActiveTag === null && typeNews === 'userNews' && postsUserFeed.map((post) => (
                            <PostCard
                                hasMenu
                                typePost='public'
                                {...post}
                                key={post.id}
                                openEditModalHandler={openEditModalHandler}
                            />
                        ))}

                        {isActiveTag === null && typeNews === 'allNews' && postsAllFeed.map((post) => (
                            <PostCard
                                hasMenu
                                typePost='public'
                                {...post}
                                key={post.id}
                                openEditModalHandler={openEditModalHandler}
                            />
                        ))}
                    </div>
                )}
            </div>

            {isOpenEditPostModal && (
                <div className='modal-window'>
                    <EditPostModal openEditModalHandler={openEditModalHandler} />
                </div>
            )}
        </Layout>
    );
}
