import {useState} from 'react';
import {addComment} from '../../redux/postsReducer';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {CommentType} from '../../types/Post';
import Button from '../../ui/Button';
import Comment from '../../ui/Comment';
import TextField from '../../ui/TextField';
import './CommentsList.scss';

type CommentsListProps = {
  postId: number,
};

export default function CommentsList(props: CommentsListProps) {
    const dispatch = useAppDispatch();
    const comments = useAppSelector((state) => state.posts.comments);
    const isLoadingComments = useAppSelector(
        (state) => state.posts.isLoadingComments,
    );
    const [newCommentValue, setNewCommentValue] = useState('');

    const addCommentHandler = async () => {
        await dispatch(
            addComment({
                text: newCommentValue.trim(),
                id: props.postId,
                postId: props.postId,
            }),
        );
        setNewCommentValue('');
    };

    return (
        <div className='comments-list'>
            <h3>Комментарии</h3>
            {comments.length === 0 && <p>Нет комментариев</p>}
            {!isLoadingComments && comments.map((comment: CommentType) => comment.user === undefined ? (
                // eslint-disable-next-line react/jsx-key
                <p>Ошибка при загрузке</p>
            ) : (
                <Comment
                    userId={comment.user.id}
                    key={comment.id}
                    postId={props.postId}
                    commentId={comment.id}
                    firstName={comment.user.firstName}
                    lastName={comment.user.lastName}
                    text={comment.text}
                    avatarUrl={comment.user.avatarId}
                />
            ))}
            <div className='comments-list__add-comment'>
                <TextField
                    value={newCommentValue}
                    label='Ваш комментарий'
                    placeholder='Напишите комментарий'
                    name='new_comment'
                    onChange={setNewCommentValue}
                />
                <Button
                    label="Отправить комментарий"
                    primary
                    onClick={addCommentHandler}
                />
            </div>
        </div>
    );
}
