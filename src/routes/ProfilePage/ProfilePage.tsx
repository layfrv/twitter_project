import {useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {RoutePaths} from '../../constants/routes';
import {getUserPosts, sortPostByPinPost} from '../../redux/postsReducer';
import {RootState, useAppDispatch, useAppSelector} from '../../redux/store';
import {deleteUser, logoutUser} from '../../redux/userReducer';
import CreatePostModal from '../../shared/CreatePostModal';
import DeleteModal from '../../shared/DeleteModal/DeleteModal';
import EditPostModal from '../../shared/EditPostModal';
import Layout from '../../shared/Layout';
import PostCard from '../../shared/PostCard';
import ProfileCard from '../../shared/ProfileCard';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import ModalWrapper from '../../ui/ModalWrapper';
import './ProfilePage.scss';

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const {isLoadingUser, user} = useSelector((state: RootState) => state.user);
    const history = useHistory();

    useEffect(() => {
        dispatch(getUserPosts(user?.id)).then(() => dispatch(sortPostByPinPost()));
    }, []);

    const {userPosts, isLoadingPosts} = useAppSelector(
        (state: RootState) => state.posts,
    );

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const openDeleteModalHandler = () => setDeleteModalOpen(!isDeleteModalOpen);

    const [isSuccessDeleted, setSuccessDeleted] = useState(false);
    const [isErrorDeleted, setErrorDeleted] = useState(false);

    const deleteUserHandler = () => {
        const isDeleted = dispatch(deleteUser());

        if (isDeleted) {
            setSuccessDeleted(true);
        } else {
            setErrorDeleted(true);
        }
    };

    const handleCloseButton = () => {
        history.replace(RoutePaths.ROUTE_LOGIN);
        dispatch(logoutUser());
    };

    const [isOpenCreatePostModal, setOpenCreatePostModal] = useState(false);
    const createPostModalOpenHandler = () => {
        setOpenCreatePostModal(!isOpenCreatePostModal);
    };

    const subscriptionsHandler = () => {
        history.push(RoutePaths.ROUTE_SUBSCRIPTIONS);
    };

    const logoutUserHandler = () => {
        history.replace(RoutePaths.ROUTE_LOGIN);
        dispatch(logoutUser());
    };

    const editUserHandler = () => {
        history.push(RoutePaths.ROUTE_EDIT_PROFILE);
    };

    const [isOpenEditPostModal, setOpenEditPostModal] = useState(false);
    const openEditModalHandler = () => setOpenEditPostModal(!isOpenEditPostModal);

    const dropdownMenuItems = useMemo(
        () => [
            {name: 'Редактировать профиль', func: editUserHandler},
            {name: 'Выйти из профиля', func: logoutUserHandler},
            {name: 'Удалить профиль', func: openDeleteModalHandler},
        ],
        [],
    );

    if (!user) {
        return null;
    }

    return (
        <Layout>
            <div className='profile-page'>
                <h1>Мой профиль</h1>
                <div className='profile-page__content'>
                    <div className='profile-page__content-card'>
                        {isLoadingUser && <Loader />}
                        {!isLoadingUser && (
                            <ProfileCard
                                user={user}
                                type='thisUser'
                                dropdownMenuItems={dropdownMenuItems}
                                primaryButtonHandler={createPostModalOpenHandler}
                                secondaryButtonHandler={subscriptionsHandler}
                            />
                        )}
                    </div>

                    <div className='profile-page__content-posts'>
                        {isLoadingPosts ? (
                            <Loader />
                        ) : (
                            !isLoadingPosts && userPosts.map((post) => (
                                <PostCard
                                    {...post}
                                    key={post.id}
                                    typePost='private'
                                    hasMenu
                                    creator={user}
                                    openEditModalHandler={openEditModalHandler}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
            {isDeleteModalOpen && (
                <DeleteModal
                    handleDeleteUser={deleteUserHandler}
                    openDeleteModal={openDeleteModalHandler}
                />
            )}
            {isSuccessDeleted && (
                <ModalWrapper>
                    <h2>Профиль успешно удален!</h2>
                    <Button
                        label='ок'
                        secondary
                        onClick={handleCloseButton}
                    />
                </ModalWrapper>
            )}
            {isErrorDeleted && (
                <ModalWrapper>
                    <h2>Ошибка удаления</h2>
                    <Button
                        label='ок'
                        secondary
                        onClick={createPostModalOpenHandler}
                    />
                </ModalWrapper>
            )}

            {isOpenCreatePostModal && (
                <div className='modal-window'>
                    <CreatePostModal
                        createPostModalHandler={createPostModalOpenHandler}
                    />
                </div>
            )}

            {isOpenEditPostModal && (
                <div className='modal-window'>
                    <EditPostModal openEditModalHandler={openEditModalHandler} />
                </div>
            )}
        </Layout>
    );
}
