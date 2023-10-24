import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {RootState, useAppDispatch} from '../../redux/store';
import {resetError, resetUpdate} from '../../redux/userReducer';
import EditForm from '../../shared/EditForm';
import Layout from '../../shared/Layout';
import AlertMessage from '../../ui/AlertMessage';
import Loader from '../../ui/Loader';
import ReturnButton from '../../ui/ReturnButton';
import './EditProfilePage.scss';

export default function EditProfilePage() {
    const {editError, isLoadingUser, isUpdated, user} = useSelector(
        (state: RootState) => state.user,
    );
    const dispatch = useAppDispatch();
    const history = useHistory();

    const navigateToProfile = () => {
        dispatch(resetError());
        dispatch(resetUpdate());
        history.goBack();
    };

    if (isLoadingUser) {
        return <Loader />;
    }

    return (
        <Layout>
            <div className='edit-page'>
                <div className='edit-page__background' />
                <div className='edit-page__content'>
                    <div className='edit-page__form'>
                        <ReturnButton onClickHandler={navigateToProfile} />
                        <h1>Редактирование профиля</h1>
                        <EditForm />
                        {!isLoadingUser && editError && <AlertMessage error={editError} />}
                        {isUpdated && !editError && (
                            <AlertMessage
                                success
                                text='Данные обновлены!'
                            />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
