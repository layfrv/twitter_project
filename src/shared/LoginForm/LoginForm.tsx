import {Dispatch, SetStateAction, useState} from 'react';
import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {RoutePaths} from '../../constants/routes';
import {RootState, useAppDispatch} from '../../redux/store';
import {loginUser, uploadAvatar} from '../../redux/userReducer';
import Button from '../../ui/Button';
import Checkbox from '../../ui/Checkbox/Button';
import Input from '../../ui/Input';
import './LoginForm.scss';

type LoginFormProps = {
  avatar: File;
  setAvatar: Dispatch<SetStateAction<File>>
}

export default function LoginForm(props: LoginFormProps) {
    const dispatch = useAppDispatch();
    const history = useHistory();

    const {user, userError, isRegistration} = useSelector(
        (state: RootState) => state.user,
    );

    const {avatar, setAvatar} = props;

    const [activeCheckbox, setActiveCheckbox] = useState(false);
    const onClickCheckbox = (event) => {
        event.preventDefault();
        setActiveCheckbox(!activeCheckbox);
    };

    const [email, setEmail] = useState(localStorage.getItem('email') || '');
    const emailHandler = (newValue) => setEmail(newValue.trim());

    const [password, setPassword] = useState(
        localStorage.getItem('password') || '',
    );
    const passwordHandler = (newValue) => setPassword(newValue.trim());

    const loginHandler = async (event) => {
        event.preventDefault();
        const loginData = {email, password};

        if (avatar && isRegistration) {
            const imageFile = new FormData();
            imageFile.append('file', avatar);
            await dispatch(uploadAvatar(imageFile));
            await dispatch(loginUser(loginData));
            if (user !== null) {
                history.push(RoutePaths.ROUTE_PROFILE);
            }
        } else {
            await dispatch(loginUser(loginData)).then(() => history.push(RoutePaths.ROUTE_PROFILE));
            if (userError === null && activeCheckbox) {
                localStorage.setItem('email', loginData.email);
                localStorage.setItem('password', loginData.password);
            }
        }

        setEmail('');
        setPassword('');
        setAvatar(null);
    };

    return (
        <form
            className='login-form'
            onSubmit={loginHandler}
        >
            <Input
                type='email'
                label='Email'
                placeholder='Введите email'
                name='text'
                value={email}
                onChange={emailHandler}
            />
            <Input
                type='password'
                label='Пароль'
                placeholder='Введите пароль'
                name='password'
                value={password}
                onChange={passwordHandler}
                minLength={4}
            />
            <Checkbox
                isActive={activeCheckbox}
                onClick={onClickCheckbox}
                text='Запомнить меня'
            />
            <Button
                label='Войти'
                primary
            />
        </form>
    );
}
