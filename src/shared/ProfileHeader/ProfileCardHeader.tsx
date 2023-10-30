import {useHistory} from 'react-router-dom';
import {RoutePaths} from '../../constants/routes';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {selectUserId} from '../../redux/usersReducer';
import Avatar from '../../ui/Avatar';
import './ProfileCardHeader.scss';

type ProfileCardHeaderType = {
avatarUrl: string;
firstName: string;
lastName: string;
nickName: string;
userId: number;
};

export default function ProfileCardHeader(props: ProfileCardHeaderType) {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const userId = useAppSelector((state) => state.user.user.id);
    const selectUserAndRedirect = () => {
        if (userId === props.userId) {
            history.push(RoutePaths.ROUTE_PROFILE);
        } else {
            dispatch(selectUserId(props.userId));
            const newUrl = RoutePaths.ROUTE_USER_ID.replace(':id', props.userId.toString());
            history.push(newUrl);
        }
    };

    return (
        <div
            className='profile-card-header'
            onClick={selectUserAndRedirect}
            onKeyDown={selectUserAndRedirect}
            role="link"
            tabIndex={0}
        >

            <div className='profile-card-header_avatar'>
                <Avatar
                    imgUrl={props.avatarUrl}
                    size='50px'
                />
            </div>

            <div className='profile-card-header__name'>
                <h3>{`${props.firstName} ${props.lastName}`}</h3>
                <p>{props.nickName}</p>
            </div>

        </div>
    );
}
