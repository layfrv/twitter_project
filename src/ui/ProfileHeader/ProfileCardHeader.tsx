import Avatar from '../../ui/Avatar';
import './ProfileCardHeader.scss';

type ProfileCardHeaderType = {
avatarUrl: string;
firstName: string;
lastName: string;
nickName: string;
};

export default function ProfileCardHeader(props: ProfileCardHeaderType) {
    return (
        <div className='profile-card-header'>
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
