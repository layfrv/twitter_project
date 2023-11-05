import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { resetError } from '../../redux/userReducer';
import LoginForm from '../../shared/LoginForm';
import RegisterForm from '../../shared/RegisterForm';
import TabsControl from '../../shared/TabsControl';
import AlertMessage from '../../ui/AlertMessage';
import Loader from '../../ui/Loader';
import { ReactComponent as Logo } from '../../ui/icons/logo.svg';
import './AuthPage.scss';

const buttonsTab = ['Авторизация', 'Регистрация'];

export default function AuthPage() {
    const dispatch = useDispatch();

    const {userError, isLoadingUser} = useSelector(
        (state: RootState) => state.user,
    );

    const [activeTab, setActiveTab] = useState(0);
    const handleClickTab = (id: number) => {
        if (userError) { dispatch(resetError()); }
        setActiveTab(id);
    };

    const [avatar, setAvatar] = useState(null);
    const avatarHandler = (newValue) => setAvatar(newValue);

    return (
        <div className='auth-page'>
            <div className='auth-page__background' />
            <div className='auth-page__content'>
                <div className='auth-page__form'>
                    <div className='auth-page__logo'>
                        <Logo />
                    </div>
                    <TabsControl
                        buttons={buttonsTab}
                        clickedId={activeTab}
                        onClick={handleClickTab}
                    />
                    {activeTab === 0 ? (
                        <LoginForm
                            avatar={avatar}
                            setAvatar={avatarHandler}
                        />
                    ) : (
                        <RegisterForm
                            avatar={avatar}
                            setAvatar={avatarHandler}
                        />
                    )}
                    {isLoadingUser && <Loader />}
                    {!isLoadingUser && userError && <AlertMessage error={userError} />}
                </div>
            </div>
        </div>
    );
}
