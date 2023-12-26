import {ReactComponent as LikeCountIconFill} from '../icons/favorite-fill.svg';
import {ReactComponent as LikeCountIconOutline} from '../icons/favorite-outline.svg';
import './LikeCount.scss';

type LikeCountProps = {
count: number,
isLiked: boolean,
onClickHandler: () => void,
};

export default function LikeCount(props: LikeCountProps) {
    return (
        <div className='likeCount-container'>
            <button
                className='likeCount__button'
                onClick={props.onClickHandler}
            >
                {props.isLiked ? <LikeCountIconFill /> : <LikeCountIconOutline />}
            </button>
            <p className='likeCount__text'>{props.count}</p>
        </div>
    );
}
