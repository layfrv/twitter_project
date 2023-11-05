import {useMemo} from 'react';
import {useMediaQuery} from 'react-responsive';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {subscribeUser, unsubscribeUser} from '../../redux/userReducer';
import {UserType} from '../../types/User';
import Button from '../../ui/Button';
import DropdownMenu from '../../ui/DropDownMenu/DropdownMenu';
import noneAvatar from '../../ui/images/none-avatar.png';
import createNickname from '../../utils/createNickname';
import getFileUrl from '../../utils/getFileUrl';
import isSubscribedOnUser from '../../utils/isSubscribedOnUser';
import ProfileCardHeader from '../ProfileHeader';
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
    const userId = useAppSelector((state) => state.user.user.id);

    const isDesktop = useMediaQuery({
        query: '(min-width: 1050px)',
    });

    const avatarUrl = useMemo(
        () => (props.user.avatarId ? getFileUrl(props.user.avatarId) : noneAvatar),
        [props.user],
    );

    const isSubscribed = isSubscribedOnUser(userId, props?.user?.subscriptions);

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
        <div className="profile-card">
            <div className="profile-card__header">
                <ProfileCardHeader
                    userId={props.user.id}
                    avatarUrl={avatarUrl}
                    firstName={props.user.firstName}
                    lastName={props.user.lastName}
                    nickName={createdNickname}
                />
                <div className="profile-card__header_menu">
                    {props.dropdownMenuItems && (
                        <DropdownMenu items={props.dropdownMenuItems} />
                    )}
                </div>
            </div>

            <div className="profile-card__body">
                <p className="profile-card__body_text">{props.user.description}</p>
                <div className="profile-card__body_buttons">
                    {props.type === 'thisUser' && (
                        <>
                            {props.secondaryButtonHandler && (
                                <Button
                                    label="Мои подписки"
                                    secondary
                                    onClick={props.secondaryButtonHandler}
                                />
                            )}
                            {props.primaryButtonHandler && (
                                <Button
                                    label="Создать пост"
                                    primary
                                    onClick={props.primaryButtonHandler}
                                />
                            )}
                        </>
                    )}

                    {props.type === 'anotherUser' && isSubscribed && (
                        <Button
                            primary
                            label="Отписаться"
                            onClick={unsubscribeHandler}
                        />
                    )}
                    {props.type === 'anotherUser' && !isSubscribed && (
                        <Button
                            secondary
                            label="Подписаться"
                            onClick={subscribeHandler}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
