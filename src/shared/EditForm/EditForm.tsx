/* eslint-disable no-console */
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../../redux/store';
import {editUser, logoutUser, uploadAvatar} from '../../redux/userReducer';
import {EditUserDataType} from '../../types/User';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import TextField from '../../ui/TextField';
import UploadImageButton from '../../ui/UploadImageButton';
import './EditForm.scss';

export default function EditForm() {
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useAppDispatch();

    const [newFirstName, setFirstName] = useState(user?.firstName);
    const firstNameChange = (newValue) => setFirstName(newValue);

    const [newLastName, setLastName] = useState(user?.lastName);
    const lastNameChange = (newValue) => setLastName(newValue);

    const [newEmail, setEmail] = useState(user?.email);
    const emailChange = (newValue) => setEmail(newValue);

    const [newDescription, setDescription] = useState(user?.description);
    const descriptionChange = (newValue) => setDescription(newValue);

    const [avatar, setAvatar] = useState(null);
    const handleAvatarChange = (value) => {
        setAvatar(value);
    };

    const isEmailWasUpdated = () => newEmail?.trim() !== user?.email;

    const createData = () => {
        const data = {
            firstName: newFirstName.trim(),
            lastName: newLastName.trim(),
            email: newEmail.trim(),
            description: newDescription.trim(),
        };

        const newData = {};
        for (const key in data) {
            if (data[key] !== user[key] && data[key].length) {
                newData[key] = data[key];
            }
        }
        return newData;
    };

    const handleEditUser = async (event) => {
        event.preventDefault();
        const updatedData: EditUserDataType = createData();

        if (avatar !== null) {
            try {
                await dispatch(uploadAvatar(avatar));
            } catch (error) {
                console.log(error);
            }
        }

        try {
            if (Object.keys(updatedData).length) {
                await dispatch(editUser(updatedData));
            }
        } catch (error) {
            console.log(error);
        }

        if (isEmailWasUpdated() === true && newEmail.trim().length) {
            dispatch(logoutUser());
        }

        setFirstName(user.firstName);
        setEmail(user.email);
        setDescription(user.description);
        setLastName(user.description);
        setAvatar(null);
    };

    if (user === null) {
        return null;
    }

    return (
        <form
            className='edit-form'
            onSubmit={handleEditUser}
        >
            <Input
                type='text'
                label='Имя'
                placeholder='Введите имя'
                name='firstName'
                value={newFirstName}
                onChange={firstNameChange}
            />
            <Input
                type='text'
                label='Фамилия'
                placeholder='Введите фамилию'
                name='lastName'
                value={newLastName}
                onChange={lastNameChange}
            />
            <Input
                type='email'
                label='Email'
                placeholder='Введите email'
                name='email'
                value={newEmail}
                onChange={emailChange}
            />
            <UploadImageButton
                image={avatar}
                label='Фото профиля'
                buttonText='Нажмите для загрузки'
                onChange={handleAvatarChange}
            />
            <TextField
                name='description'
                label='Описание профиля'
                placeholder='Расскажите о себе'
                value={newDescription}
                onChange={descriptionChange}
            />
            <Button
                label='Отправить'
                primary
            />
        </form>
    );
}
