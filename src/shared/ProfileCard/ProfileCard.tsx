import {useMemo} from 'react';
import {useMediaQuery} from 'react-responsive';
import {useHistory} from 'react-router-dom';
import {RoutePaths} from '../../constants/routes';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {subscribeUser, unsubscribeUser} from '../../redux/userReducer';
import {selectUserId} from '../../redux/usersReducer';
import {UserType} from '../../types/User';
import Button from '../../ui/Button';
import DropdownMenu from '../../ui/DropDownMenu/DropdownMenu';
import ProfileCardHeader from '../../ui/ProfileHeader';
import {ReactComponent as IconIsSubscribed} from '../../ui/icons/isSubscribed.svg';
import {ReactComponent as IconNotSubscribed} from '../../ui/icons/notSubscribe.svg';
import noneAvatar from '../../ui/images/none-avatar.png';
import createNickname from '../../utils/createNickname';
import getFileUrl from '../../utils/getFileUrl';
import isSubscribedOnUser from '../../utils/isSubscribedOnUser';
import './ProfileCard.scss';

type DropdownMenuType = {
name: string;
func: () => void;
};

type profileCard = {
user: UserType;
type: 'thisUser' | 'anotherUser';
dropdownMenuItems?: DropdownMenuType[];
primaryButtonHandler?: () => void;
secondaryButtonHandler?: () => void;
};

const ProfileCard = (props: profileCard) => {
    const dispatch = useAppDispatch();
    const thisUser = useAppSelector((state) => state.user.user);

    const isDesktop = useMediaQuery({
        query: '(min-width: 1050px)',
    });

    const avatarUrl = useMemo(
        () => (props.user.avatarId ? getFileUrl(props.user.avatarId) : noneAvatar),
        [props.user],
    );

    const isSubscribed = isSubscribedOnUser(props?.user?.id, props?.user?.subscriptions);

    const history = useHistory();

    const selectUserOnClick = () => {
        if (props.user.id !== thisUser.id) {
            dispatch(selectUserId(props.user.id));
            const newUrl = RoutePaths.ROUTE_USER_ID.replace(
                ':id',
                props.user.id.toString(),
            );
            history.push(newUrl);
        }
    };

    const subscribeHandler = () => {
        dispatch(subscribeUser(props.user.id));
    };

    const unsubscribeHandler = () => {
        dispatch(unsubscribeUser(props.user.id));
    };

    const createdNickname = props.user.nickname
        ? props.user.nickname
        : createNickname(props.user.email);

    return (
        <>
            <div className='profile-card'>
                <div
                    onKeyDown={selectUserOnClick}
                    className='profile-card__header'
                    onClick={selectUserOnClick}
                    role="link"
                    tabIndex={0}
                >
                    <ProfileCardHeader
                        avatarUrl={avatarUrl}
                        firstName={props.user.firstName}
                        lastName={props.user.lastName}
                        nickName={createdNickname}
                    />
                    <div className='profile-card__header_menu'>
                        {props.dropdownMenuItems && (
                            <DropdownMenu items={props.dropdownMenuItems} />
                        )}
                    </div>
                </div>

                <div className='profile-card__body'>
                    <p className='profile-card__body_text'>{props.user.description}</p>
                    <div className='profile-card__body_buttons'>
                        {props.type === 'thisUser' && (
                            <>
                                {props.secondaryButtonHandler && (
                                    <Button
                                        label='Мои подписки'
                                        secondary
                                        onClick={props.secondaryButtonHandler}
                                    />
                                )}
                                {props.primaryButtonHandler && (
                                    <Button
                                        label='Создать пост'
                                        primary
                                        onClick={props.primaryButtonHandler}
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

export default ProfileCard;
