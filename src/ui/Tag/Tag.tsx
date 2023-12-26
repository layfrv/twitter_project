import './Tag.scss';

type TagProps = {
text: string,
key?: number,
primary?: boolean,
secondary?: boolean,
isActiveTag?: boolean,
};

export default function Tag(props: TagProps) {
    return (
        <div className={props.isActiveTag || props.primary ? 'tag tag__primary' : 'tag tag__secondary'}>
            <p className={props.primary ? 'tag__primary_text' : 'tag__secondary_text'}>{props.text}</p>
        </div>
    );
}
