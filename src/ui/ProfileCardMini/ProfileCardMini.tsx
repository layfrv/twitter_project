import {useMemo} from 'react';
import {useMediaQuery} from 'react-responsive';
import {useHistory} from 'react-router-dom';
import {RoutePaths} from '../../constants/routes';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {subscribeUser, unsubscribeUser} from '../../redux/userReducer';
import {selectUserId} from '../../redux/usersReducer';
import {UserType} from '../../types/User';
import createNickname from '../../utils/createNickname';
import getFileUrl from '../../utils/getFileUrl';
import isSubscribedOnUser from '../../utils/isSubscribedOnUser';
import Button from '../Button';
import ProfileCardHeader from '../ProfileHeader';
import {ReactComponent as IconIsSubscribed} from '../icons/isSubscribed.svg';
import {ReactComponent as IconNotSubscribed} from '../icons/notSubscribe.svg';
import noneAvatar from '../images/none-avatar.png';
import './ProfileCardMini.scss';

type ProfileCardMini = {
user: UserType;
type: 'thisUser' | 'anotherUser';
buttonHandler?: () => void;
};

const ProfileCardMini = (props: ProfileCardMini) => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const userSubscriptions = useAppSelector((state) => state.user.subscriptions);

    const isDesktop = useMediaQuery({
        query: '(min-width: 1050px)',
    });

    const avatarUrl = useMemo(
        () => (props.user.avatarId ? getFileUrl(props.user.avatarId) : noneAvatar),
        [props.user],
    );

    const isSubscribed = useMemo(
        () => props.user !== null && isSubscribedOnUser(props.user.id, userSubscriptions),
        [props.user],
    );

    const selectUserOnClick = () => {
        dispatch(selectUserId(props.user.id));
        const newUrl = RoutePaths.ROUTE_USER_ID.replace(
            ':id',
            props.user.id.toString(),
        );
        history.push(newUrl);
    };

    const subscribeHandler = () => {
        dispatch(subscribeUser(props.user.id));
    };

    const unsubscribeHandler = () => {
        dispatch(unsubscribeUser(props.user.id));
    };

    const createdNickname = props.user.nickname
        ? `@${props.user.nickname}`
        : createNickname(props.user.email);

    return (
        <>
            <div className='profile-card-mini'>
                <div
                    className='profile-card-mini__header'
                    onClick={selectUserOnClick}
                    onKeyDown={selectUserOnClick}
                    role='link'
                    tabIndex={0}
                >
                    <ProfileCardHeader
                        avatarUrl={avatarUrl}
                        firstName={props.user.firstName}
                        lastName={props.user.lastName}
                        nickName={createdNickname}
                    />
                </div>

                <div className='profile-card-mini__body'>
                    <div className='profile-card-mini__body_buttons'>
                        {props.type === 'thisUser' && (
                            <>
                                {props.buttonHandler && (
                                    <Button
                                        label='Мои подписки'
                                        secondary
                                        onClick={props.buttonHandler}
                                    />
                                )}
                            </>
                        )}

                        {props.type === 'anotherUser' && isSubscribed && (isDesktop ? (
                            <Button
                                primary
                                label='Отписаться'
                                onClick={unsubscribeHandler}
                            />
                        ) : (
                            <button onClick={unsubscribeHandler}>
                                <IconIsSubscribed />
                            </button>
                        ))}
                        {props.type === 'anotherUser' && !isSubscribed && (isDesktop ? (
                            <Button
                                secondary
                                label='Подписаться'
                                onClick={subscribeHandler}
                            />
                        ) : (
                            <button onClick={subscribeHandler}>
                                <IconNotSubscribed />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileCardMini;
