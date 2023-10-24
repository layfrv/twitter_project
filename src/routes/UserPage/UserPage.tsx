import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {RootState, useAppDispatch, useAppSelector} from '../../redux/store';
import {getUserById} from '../../redux/usersReducer';
import Layout from '../../shared/Layout';
import PostCard from '../../shared/PostCard';
import ProfileCard from '../../shared/ProfileCard';
import Loader from '../../ui/Loader';
import ReturnButton from '../../ui/ReturnButton';
import './UserPage.scss';

export default function UserPage() {
    const dispatch = useAppDispatch();
    const {selectedUser, selectedUserId, selectedUserStatus} = useSelector(
        (state: RootState) => state.users,
    );

    useEffect(() => {
        dispatch(getUserById(selectedUserId));
    }, []);

    const {postStatus, userPosts, isLoadingPosts} = useAppSelector(
        (state: RootState) => state.posts,
    );

    const history = useHistory();

    const returnButtonHandler = () => {
        history.goBack();
    };

    if (!selectedUser) {
        return null;
    }

    return (
        <Layout>
            <div className='user-page'>
                <ReturnButton onClickHandler={returnButtonHandler} />

                <div className='user-page__content'>
                    <div className='user-page__content-card'>
                        {selectedUserStatus === 'loading' && <Loader />}
                        {selectedUserStatus === 'error' && <h3>Ошибка загрузки</h3>}
                        {selectedUserStatus === 'succeeded' && (
                            <ProfileCard
                                user={selectedUser}
                                type='anotherUser'
                            />
                        )}
                    </div>

                    <div className='user-page__content-posts'>
                        {isLoadingPosts && <Loader />}
                        {!isLoadingPosts && selectedUser.posts.map((post) => (
                            <PostCard
                                {...post}
                                key={post.id}
                                typePost='private'
                                nickname=''
                                creator={selectedUser}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
