import './Tag.scss';

type TagProps = {
text: string;
};

export default function Tag(props: TagProps) {
    return (
        <div className='tag'>
            <p className='tag__text'>{props.text}</p>
        </div>
    );
}
