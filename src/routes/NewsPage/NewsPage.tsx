import {useEffect, useState} from 'react';
import {
    getPostsFeed,
    sortPostByPinPost,
    sortPostsByDateAsc,
    sortPostsByDateDesc,
} from '../../redux/postsReducer';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import EditPostModal from '../../shared/EditPostModal';
import Layout from '../../shared/Layout';
import PostCard from '../../shared/PostCard';
import Loader from '../../ui/Loader';
import {ReactComponent as SortIcon} from '../../ui/icons/sort.svg';
import './NewsPage.scss';

export default function NewsPage() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getPostsFeed()).then(() => dispatch(sortPostByPinPost()));
    }, []);

    const {postsFeed, isLoadingPosts, error} = useAppSelector(
        (state) => state.posts,
    );

    const [isOpenEditPostModal, setOpenEditPostModal] = useState(false);
    const openEditModalHandler = () => setOpenEditPostModal(!isOpenEditPostModal);

    const sortByDateAsc = () => dispatch(sortPostsByDateAsc());
    const sortByDateDesc = () => dispatch(sortPostsByDateDesc());

    const [sortedByDateAsc, setSortType] = useState(true);
    const sortChangeHandler = () => {
        if (sortedByDateAsc) {
            sortByDateDesc();
            setSortType(!sortedByDateAsc);
        } else {
            sortByDateAsc();
            setSortType(!sortedByDateAsc);
        }
    };

    return (
        <Layout>
            <div className='news-page'>
                <div className='news-page__header'>
                    <h1>Новости</h1>
                    <button
                        className='news-page__header_icon'
                        onClick={sortChangeHandler}
                    >
                        <SortIcon />
                    </button>
                </div>

                {isLoadingPosts && <Loader />}
                {error && <h3>Ошибка загрузки</h3>}
                {!isLoadingPosts && !error && (
                    <div className='news-page__content'>
                        {postsFeed.map((post) => (
                            <PostCard
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
