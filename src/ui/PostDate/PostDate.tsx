import getFormatDate from '../../utils/getFormatDate';
import './PostDate.scss';

type PostDateProps = {
date: Date,
}

export default function PostDate(props: PostDateProps) {
    const dateString = getFormatDate(props.date);

    return <p className='post-date'>{dateString}</p>;
}
