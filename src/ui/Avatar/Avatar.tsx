import './Avatar.scss';

type AvatarProps = {
imgUrl: string;
size: string;
};

export default function Avatar(props: AvatarProps) {
    return (
        <div className='avatar'>
            <img
                src={props.imgUrl}
                alt='user-avatar'
                style={{width: props.size, height: props.size}}
            />
        </div>
    );
}
