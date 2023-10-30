/* eslint-disable no-console */
import {Dispatch, SetStateAction, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../../redux/store';
import {registerUser} from '../../redux/userReducer';
import AlertMessage from '../../ui/AlertMessage';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import TextField from '../../ui/TextField';
import UploadImageButton from '../../ui/UploadImageButton';
import './RegisterForm.scss';

type RegisterFormProps = {
  avatar: File;
  setAvatar: Dispatch<SetStateAction<File>>
}

export default function RegisterForm(props: RegisterFormProps) {
    const dispatch = useAppDispatch();
    const {avatar, setAvatar} = props;

    const [firstName, setFirstName] = useState('');
    const firstNameHandler = (newValue) => setFirstName(newValue.trim());

    const [lastName, setLastName] = useState('');
    const lastNameHandler = (newValue) => setLastName(newValue.trim());

    const [password, setPassword] = useState('');
    const passwordHandler = (newValue) => setPassword(newValue.trim());

    const [email, setEmail] = useState('');
    const emailHandler = (newValue) => setEmail(newValue.trim());

    const [description, setDescription] = useState('');
    const descriptionHandler = (newValue) => setDescription(newValue);

    const isRegistered = useSelector(
        (state: RootState) => state.user.isRegisterSuccess,
    );

    const handleRegistration = (event) => {
        event.preventDefault();
        const registerData = {
            firstName,
            lastName,
            password,
            email,
            description,
        };
        if (avatar !== null) {
            setAvatar(avatar);
        }
        dispatch(registerUser(registerData));
        setFirstName('');
        setEmail('');
        setPassword('');
        setDescription('');
        setLastName('');
    };

    return (
        <form
            className='register-form'
            onSubmit={handleRegistration}
        >
            <Input
                type='text'
                label='Имя'
                placeholder='Введите имя'
                name='firstName'
                value={firstName}
                onChange={firstNameHandler}
                minLength={2}
            />
            <Input
                type='text'
                label='Фамилия'
                placeholder='Введите фамилию'
                name='lastName'
                value={lastName}
                onChange={lastNameHandler}
                minLength={2}
            />
            <Input
                type='email'
                label='Email'
                placeholder='Введите email'
                name='email'
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
                maxLength={16}
            />
            <UploadImageButton
                image={avatar}
                label='Фото профиля'
                buttonText='Нажмите для загрузки'
                onChange={setAvatar}
            />
            <TextField
                name='description'
                label='Описание профиля'
                placeholder='Расскажите о себе'
                value={description}
                onChange={descriptionHandler}
            />

            <Button
                label='Зарегистрироваться'
                primary
            />
            {isRegistered && (
                <AlertMessage
                    success
                    text='Вы зарегистрированы!'
                />
            )}
        </form>
    );
}
