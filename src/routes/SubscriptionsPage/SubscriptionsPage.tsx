import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {getUsers} from '../../redux/usersReducer';
import Layout from '../../shared/Layout';
import {UserType} from '../../types/User';
import Loader from '../../ui/Loader';
import ProfileCardMini from '../../ui/ProfileCardMini';
import SearchInput from '../../ui/SearchInput';
import './SubscriptionsPage.scss';

export default function SubscriptionsPage() {
    const dispatch = useAppDispatch();
    const users = useAppSelector((state) => state.users.users);
    const usersStatus = useAppSelector((state) => state.users.usersStatus);
    const profileId = useAppSelector((state) => state.user.user.id);

    useEffect(() => {
        dispatch(getUsers());
    }, []);

    const [searchInputValue, setSearchInputValue] = useState('');

    const [filteredUsers, setFilteredUsers] = useState(users);

    useEffect(() => {
        if (searchInputValue !== '') {
            const filtered = users.filter((user) => (
                user.lastName.toLocaleLowerCase().includes(searchInputValue.toLowerCase())
            || user.firstName.toLocaleLowerCase().includes(searchInputValue.toLowerCase())
            ));
            setFilteredUsers(filtered);
        } else {
            const filtered = users.filter((user: UserType) => user.id !== profileId);
            setFilteredUsers(filtered);
        }
    }, [searchInputValue, users]);

    return (
        <Layout>
            <div className='subs-page'>
                <div className='subs-page__header'>
                    <h1>Подписки</h1>
                    <SearchInput
                        placeholder='Поиск пользователей'
                        name='search-users'
                        onChange={setSearchInputValue}
                        value={searchInputValue}
                    />
                </div>

                <div className='subs-page__content'>
                    {usersStatus === 'loading' && <Loader />}
                    {usersStatus === 'error' && (
                        <h2>Ошибка при загрузке пользователей</h2>
                    )}
                    {usersStatus === 'succeeded' && filteredUsers.map((user) => (
                        <ProfileCardMini
                            type='anotherUser'
                            user={user}
                            key={user.id}
                        />
                    ))}
                </div>
            </div>
        </Layout>
    );
}
