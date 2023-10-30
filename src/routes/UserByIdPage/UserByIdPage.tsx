import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useHistory, useLocation} from 'react-router-dom';
import {RootState, useAppDispatch, useAppSelector} from '../../redux/store';
import {getPostsByUser, getUserById} from '../../redux/usersReducer';
import Layout from '../../shared/Layout';
import PostCard from '../../shared/PostCard';
import ProfileCard from '../../shared/ProfileCard';
import Loader from '../../ui/Loader';
import ReturnButton from '../../ui/ReturnButton';
import './UserByIdPage.scss';

export default function UserByIdPage() {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const {selectedUser, selectedUserStatus} = useSelector(
        (state: RootState) => state.users,
    );

    const location = useLocation();
    const userId = location.pathname.split('/').slice(-1);

    useEffect(() => {
        dispatch(getUserById(userId)).then(() => dispatch(getPostsByUser(userId)));
    }, []);

    const {userPosts, userPostsStatus} = useAppSelector(
        (state: RootState) => state.users,
    );

    const returnButtonHandler = () => {
        history.goBack();
    };

    if (selectedUser === null) {
        return null;
    }

    return (
        <Layout>
            <div className='user-id-page'>
                <ReturnButton onClickHandler={returnButtonHandler} />

                <div className='user-id-page__content'>
                    <div className='user-id-page__content-card'>
                        {selectedUserStatus === 'loading' && <Loader />}
                        {selectedUserStatus === 'error' && <h3>Ошибка загрузки</h3>}
                        {selectedUserStatus === 'succeeded' && (
                            <ProfileCard
                                user={selectedUser}
                                type='anotherUser'
                            />
                        )}
                    </div>

                    <div className='user-id-page__content-posts'>
                        {userPostsStatus === 'loading' && <Loader />}
                        {userPostsStatus === 'error' && <h2>Ошибка загрузки постов</h2>}
                        {userPostsStatus === 'succeeded' && userPosts.map((post) => (
                            <PostCard
                                hasMenu={false}
                                {...post}
                                key={post.id}
                                typePost='private'
                                creator={selectedUser}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
