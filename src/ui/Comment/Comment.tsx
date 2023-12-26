import {GET_FILE} from '../../constants/user';
import {deleteComment} from '../../redux/postsReducer';
import {useAppDispatch} from '../../redux/store';
import isAuthorOfPost from '../../utils/isAuthorOfPost';
import Avatar from '../Avatar';
import {ReactComponent as DeleteIcon} from '../icons/cross.svg';
import './Comment.scss';

type CommentProps = {
  commentId: number,
  postId: number,
  avatarUrl: number,
  firstName: string,
  lastName: string,
  text: string,
  userId: number,
};

export default function Comment(props: CommentProps) {
    const avatarUrl = `${process.env.REACT_APP_BACKEND_URL}${GET_FILE}${props.avatarUrl}`;

    const dispatch = useAppDispatch();

    const deleteCommentHandler = () => {
        dispatch(
            deleteComment({commentId: props.commentId,
                postId: props.postId}),
        );
    };

    const isAuthor = isAuthorOfPost(props.commentId, props.userId);

    return (
        <div className="comment">
            <div className="comment__content">
                <div className="comment__content_avatar">
                    <Avatar
                        imgUrl={avatarUrl}
                        size="50px"
                    />
                </div>

                <div className="comment__content_text">
                    <h3>{`${props.firstName} ${props.lastName}`}</h3>
                    <p>{props.text}</p>
                </div>
            </div>
            {isAuthor && (
                <button
                    className="comment_btn"
                    onClick={deleteCommentHandler}
                    aria-label="delete comment"
                >
                    <DeleteIcon />
                </button>
            )}
        </div>
    );
}
